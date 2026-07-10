import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { successResponse, errorResponse, type ApiResponse } from "@/lib/api";
import { getUserSession } from "@/api/auth.server";
import { z } from "zod";

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

      const order = await db.order.create({
        data: {
          user: { connect: { id: session.id } },
          subtotal: data.subtotal,
          delivery: data.delivery,
          total: data.total,
          hasRx: data.hasRx,
          paymentMethod: data.paymentMethod,
          status: data.hasRx ? "under_review" : "processing",
          prescriptionStatus: data.hasRx ? "pending" : null,
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
              price: item.price,
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
      return successResponse("Order created successfully", order, 201);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to create order", (error as Error).message);
    }
  });

export const updateOrderStatusFn = createServerFn({ method: "POST" })
  .validator(z.object({
    orderId: z.string(),
    status: z.string(),
    prescriptionStatus: z.string().optional(),
    reviewer: z.string().optional(),
    rejectReason: z.string().optional(),
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
