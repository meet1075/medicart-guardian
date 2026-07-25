import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { successResponse, errorResponse, type ApiResponse } from "@/lib/api";
import { getUserSession } from "@/api/auth.server";
import { z } from "zod";
import Razorpay from "razorpay";
import crypto from "crypto";
import { tryCreateShiprocketShipment } from "./shiprocket.api";

const VALID_ORDER_STATUSES = [
  "payment_pending",
  "under_review",
  "action_needed",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
] as const;
type OrderStatus = (typeof VALID_ORDER_STATUSES)[number];

export const getOrdersFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session) return errorResponse("Unauthorized", "Please log in", 401);

      const whereClause = session.role === "ADMIN" ? {} : { userId: session.id };

      const orders = await db.order.findMany({
        where: whereClause,
        include: {
          items: true,
          prescriptionFiles: true,
          itemVerifications: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return successResponse("Orders fetched successfully", orders);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch orders", (error as Error).message);
    }
  });

export const getOrderByIdFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session) return errorResponse("Unauthorized", "Please log in", 401);

      const order = await db.order.findUnique({
        where: { id: data.id },
        include: {
          items: true,
          prescriptionFiles: true,
          itemVerifications: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });
      if (!order) return errorResponse("Order not found", undefined, 404);
      
      // Ensure user owns the order, unless ADMIN
      if (session.role !== "ADMIN" && order.userId !== session.id) {
        return errorResponse("Unauthorized", undefined, 403);
      }

      return successResponse("Order fetched successfully", order);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch order", (error as Error).message);
    }
  });

const CreateOrderSchema = z.object({
  items: z.array(z.object({
    medicineId: z.string(),
    name: z.string(),
    salt: z.string().optional(),
    dosageForm: z.string().optional(),
    qty: z.number(),
    price: z.number(),
    prescriptionRequired: z.boolean().default(false),
  })),
  subtotal: z.number(),
  delivery: z.number(),
  total: z.number(),
  hasRx: z.boolean(),
  paymentMethod: z.string(),
  address: z.object({
    fullName: z.string(),
    phone: z.string(),
    line1: z.string(),
    line2: z.string().optional(),
    city: z.string(),
    state: z.string(),
    pincode: z.string(),
    type: z.string(),
    deliverySlot: z.string(),
  }),
  prescriptionFiles: z.array(z.object({
    name: z.string(),
    mimeType: z.string(),
    dataUrl: z.string(),
    aiExtractionResult: z.any().optional(),
  })).optional(),
  itemVerifications: z.array(z.object({
    medicineId: z.string(),
    aiStatus: z.string(),
    pharmacistApproved: z.boolean().default(false),
  })).optional(),
});

export const createOrderFn = createServerFn({ method: "POST" })
  .validator(CreateOrderSchema)
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session) return errorResponse("Unauthorized", "Please log in to place an order", 401);

      // --- Server-side price verification ---
      // Re-fetch prices from DB to prevent client-side price manipulation
      const medicineIds = data.items.map(i => i.medicineId);
      const dbMedicines = await db.medicine.findMany({
        where: { id: { in: medicineIds } },
        select: { id: true, mrp: true, prescriptionRequired: true, inStock: true },
      });
      const priceMap = new Map(dbMedicines.map(m => [m.id, m]));

      // Validate each item's price and availability
      for (const item of data.items) {
        const dbMed = priceMap.get(item.medicineId);
        if (!dbMed) return errorResponse("Invalid medicine in cart", undefined, 400);
        if (!dbMed.inStock) return errorResponse(`${item.name} is out of stock`, undefined, 400);
        // Allow ±1 rupee tolerance for rounding differences
        if (Math.abs(dbMed.mrp - item.price) > 1) {
          return errorResponse(`Price mismatch for ${item.name}. Please refresh your cart.`, undefined, 400);
        }
      }

      // Re-compute totals server-side
      const DELIVERY_FEE = 40;
      const serverSubtotal = data.items.reduce((sum, item) => {
        const dbMed = priceMap.get(item.medicineId)!;
        return sum + dbMed.mrp * item.qty;
      }, 0);
      const serverDelivery = data.delivery; // delivery slot logic unchanged
      const serverTotal = serverSubtotal + serverDelivery;

      // Reject if client total is more than ₹5 off from server-computed total
      if (Math.abs(serverTotal - data.total) > 5) {
        return errorResponse("Order total mismatch. Please refresh your cart.", undefined, 400);
      }
      // --- End price verification ---

      let rzpOrderId: string | undefined = undefined;
      let initialStatus: OrderStatus = data.hasRx ? "under_review" : "processing";
      const isOnline = data.paymentMethod !== "cod";

      if (isOnline) {
        initialStatus = "payment_pending";
        try {
          const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID!,
            key_secret: process.env.RAZORPAY_KEY_SECRET!,
          });
          const rzpOrder = await rzp.orders.create({
            amount: Math.round(serverTotal * 100), // use server-computed total
            currency: "INR",
          });
          rzpOrderId = rzpOrder.id;
        } catch (e) {
          console.error("Razorpay order creation failed", e);
          return errorResponse("Payment initiation failed", "Could not contact payment gateway", 500);
        }
      }

      const order = await db.order.create({
        data: {
          user: { connect: { id: session.id } },
          subtotal: serverSubtotal,
          delivery: serverDelivery,
          total: serverTotal,
          hasRx: data.hasRx,
          paymentMethod: data.paymentMethod,
          status: initialStatus,
          prescriptionStatus: data.hasRx ? "pending" : null,
          razorpayOrderId: rzpOrderId,
          address: {
            create: {
              ...data.address,
              user: { connect: { id: session.id } },
            }
          },
          items: {
            create: data.items.map(item => ({
              medicineId: item.medicineId,
              name: item.name,
              salt: item.salt,
              dosageForm: item.dosageForm,
              qty: item.qty,
              price: priceMap.get(item.medicineId)!.mrp, // use server price
              prescriptionRequired: item.prescriptionRequired,
            }))
          },
          prescriptionFiles: data.prescriptionFiles ? {
            create: data.prescriptionFiles.map(file => ({
              name: file.name,
              mimeType: file.mimeType,
              dataUrl: file.dataUrl,
              aiExtractionResult: file.aiExtractionResult ?? null,
            }))
          } : undefined,
          itemVerifications: data.itemVerifications ? {
            create: data.itemVerifications.map(iv => ({
              medicineId: iv.medicineId,
              aiStatus: iv.aiStatus,
              pharmacistApproved: iv.pharmacistApproved,
            }))
          } : undefined,
        },
        include: {
          items: true,
          prescriptionFiles: true,
          itemVerifications: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        }
      });

      if (initialStatus === "processing") {
        tryCreateShiprocketShipment(order.id).catch(console.error);
      }

      return successResponse("Order created successfully", order, 201);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to create order", (error as Error).message);
    }
  });

export const updateOrderStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({
    orderId: z.string(),
    status: z.enum(VALID_ORDER_STATUSES),
    prescriptionStatus: z.enum(["pending", "verified", "rejected"]).optional(),
    reviewer: z.string().optional(),
    rejectReason: z.string().max(500).optional(),
  }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const order = await db.order.update({
        where: { id: data.orderId },
        data: {
          status: data.status,
          prescriptionStatus: data.prescriptionStatus,
          reviewedBy: data.reviewer,
          reviewedAt: data.reviewer ? new Date() : undefined,
          rejectReason: data.rejectReason,
        },
        include: {
          items: true,
          prescriptionFiles: true,
          itemVerifications: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        }
      });

      if (data.status === "processing") {
        tryCreateShiprocketShipment(order.id).catch(console.error);
      }

      return successResponse("Order updated successfully", order);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to update order status", (error as Error).message);
    }
  });

export const toggleItemVerificationFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), approved: z.boolean() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const v = await db.itemVerification.update({
        where: { id: data.id },
        data: { pharmacistApproved: data.approved }
      });
      return successResponse("Item verification toggled", v);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to toggle item verification", (error as Error).message);
    }
  });

export const verifyPaymentFn = createServerFn({ method: "POST" })
  .validator(z.object({
    orderId: z.string(),
    razorpayPaymentId: z.string(),
    razorpayOrderId: z.string(),
    razorpaySignature: z.string(),
  }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session) return errorResponse("Unauthorized", "Please log in", 401);

      // IDOR check: ensure the order belongs to this user
      const existingOrder = await db.order.findUnique({
        where: { id: data.orderId },
        select: { userId: true, razorpayOrderId: true },
      });
      if (!existingOrder) return errorResponse("Order not found", undefined, 404);
      if (existingOrder.userId !== session.id) {
        return errorResponse("Forbidden", undefined, 403);
      }
      // Ensure the Razorpay order ID matches what we generated server-side
      if (existingOrder.razorpayOrderId !== data.razorpayOrderId) {
        return errorResponse("Payment verification failed", "Order ID mismatch", 400);
      }

      const secret = process.env.RAZORPAY_KEY_SECRET!;
      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(`${data.razorpayOrderId}|${data.razorpayPaymentId}`);
      const generatedSignature = hmac.digest("hex");

      if (generatedSignature !== data.razorpaySignature) {
        return errorResponse("Payment verification failed", "Invalid signature", 400);
      }

      const order = await db.order.update({
        where: { id: data.orderId },
        data: {
          razorpayPaymentId: data.razorpayPaymentId,
          razorpaySignature: data.razorpaySignature,
          status: "processing",
        },
        include: {
          items: true,
          prescriptionFiles: true,
          itemVerifications: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        }
      });

      // Maintain prescription state if needed
      if (order.hasRx && order.prescriptionStatus === "pending") {
        await db.order.update({
          where: { id: data.orderId },
          data: { status: "under_review" }
        });
      }

      if (!order.hasRx || order.prescriptionStatus === "verified") {
        tryCreateShiprocketShipment(order.id).catch(console.error);
      }

      return successResponse("Payment verified successfully", order);
    } catch (error) {
      console.error(error);
      return errorResponse("Payment verification error", (error as Error).message);
    }
  });
