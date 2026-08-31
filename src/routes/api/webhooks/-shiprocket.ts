// @ts-nocheck
import { createAPIFileRoute } from "@tanstack/react-start";
import { db } from "@/lib/db";

// Map Shiprocket statuses to your internal order statuses
function mapShiprocketStatus(srStatus: string): string | null {
  const s = srStatus.toLowerCase();
  if (s.includes("delivered")) return "delivered";
  if (s.includes("out for delivery")) return "shipped";
  if (s.includes("picked up") || s.includes("in transit") || s.includes("shipped")) return "shipped";
  return null; // Don't change status for other intermediate states
}

export const APIRoute = createAPIFileRoute("/api/webhooks/shiprocket")({
  POST: async ({ request }) => {
    try {
      const payload = await request.json();
      console.log("[Shiprocket Webhook] Received:", JSON.stringify(payload).slice(0, 500));

      const awb = payload.awb || payload.awb_code;
      const currentStatus = payload.current_status || payload.status;
      const etd = payload.etd || payload.estimated_delivery_date || null; // estimated delivery date

      if (!awb || !currentStatus) {
        return new Response(JSON.stringify({ success: false, error: "Missing awb or status" }), { status: 400 });
      }

      const internalStatus = mapShiprocketStatus(currentStatus);

      await db.order.updateMany({
        where: { awbCode: awb },
        data: {
          shipmentStatus: currentStatus,
          lastShipmentSync: new Date(),
          ...(internalStatus && { status: internalStatus }),
          ...(etd && { estimatedDelivery: new Date(etd) }),
        },
      });

      console.log(`[Webhook] AWB ${awb} → shipmentStatus: "${currentStatus}"${internalStatus ? `, orderStatus: "${internalStatus}"` : ""}${etd ? `, ETD: ${etd}` : ""}`);

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("[Webhook Error] Failed to process Shiprocket webhook:", error);
      return new Response(JSON.stringify({ success: false, error: "Processing failed" }), { status: 500 });
    }
  },
});
