import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { db } from "@/lib/db";
import { getUserSession } from "@/api/auth.server";
import { errorResponse, successResponse, type ApiResponse } from "@/lib/api";
import { createShiprocketOrder, generateAWB, schedulePickup, cancelShipment } from "./shiprocket.service";

/**
 * Internal utility to attempt creating a Shiprocket shipment.
 * Does NOT throw errors, gracefully updates the DB.
 */
export async function tryCreateShiprocketShipment(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
        address: true,
        user: true,
      },
    });

    if (!order || order.isShipmentCreated) return;

    // Only create shipment if order is ready to be processed
    if (order.status !== "processing") return;

    const shiprocketData = await createShiprocketOrder(order);

    // Auto-generate AWB immediately after order creation
    let awbCode = "";
    let courierName = "";
    let trackingUrl = "";

    try {
      const awbResponse = await generateAWB(String(shiprocketData.shipment_id));
      const awbData = awbResponse?.response?.data;
      if (awbData?.awb_code) {
        awbCode = awbData.awb_code;
        courierName = awbData.courier_name || "";
        trackingUrl = `https://shiprocket.co/tracking/${awbCode}`;
      }
    } catch (awbErr) {
      console.warn("AWB auto-generation failed, will need manual generation:", awbErr);
    }

    await db.order.update({
      where: { id: orderId },
      data: {
        isShipmentCreated: true,
        shiprocketOrderId: String(shiprocketData.order_id),
        shipmentId: String(shiprocketData.shipment_id),
        shipmentStatus: "Processing",
        shipmentError: null,
        ...(awbCode && { awbCode, courierName, trackingUrl }),
      },
    });
  } catch (error: any) {
    console.error("Failed to sync order to Shiprocket:", error);
    await db.order.update({
      where: { id: orderId },
      data: {
        isShipmentCreated: false,
        shipmentError: error.message || "Failed to create shipment",
      },
    });
  }
}

// Below are exposed Server Functions for the Admin UI

export const retryShipmentCreationFn = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      await tryCreateShiprocketShipment(data.orderId);

      const order = await db.order.findUnique({ where: { id: data.orderId } });
      if (order?.isShipmentCreated) {
        return successResponse("Shipment created successfully", order);
      } else {
        return errorResponse("Failed to create shipment", order?.shipmentError || "Unknown error");
      }
    } catch (error) {
      console.error(error);
      return errorResponse("Error", (error as Error).message);
    }
  });

export const generateShipmentAwbFn = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string(), shipmentId: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const response = await generateAWB(data.shipmentId);

      const awbResponse = response.response?.data;
      if (!awbResponse) throw new Error("Invalid response from Shiprocket");

      const order = await db.order.update({
        where: { id: data.orderId },
        data: {
          awbCode: awbResponse.awb_code,
          courierName: awbResponse.courier_name,
        },
      });

      return successResponse("AWB generated successfully", order);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to generate AWB", (error as Error).message);
    }
  });

export const scheduleShipmentPickupFn = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string(), shipmentId: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const response = await schedulePickup(data.shipmentId);

      const order = await db.order.update({
        where: { id: data.orderId },
        data: {
          pickupStatus: "Scheduled",
        },
      });

      return successResponse("Pickup scheduled successfully", order);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to schedule pickup", (error as Error).message);
    }
  });

export const cancelShiprocketShipmentFn = createServerFn({ method: "POST" })
  .validator(z.object({ orderId: z.string(), awbCode: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      await cancelShipment([data.awbCode]);

      const order = await db.order.update({
        where: { id: data.orderId },
        data: {
          shipmentStatus: "Cancelled",
        },
      });

      return successResponse("Shipment cancelled", order);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to cancel shipment", (error as Error).message);
    }
  });
