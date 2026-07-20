// @ts-nocheck
import { createAPIFileRoute } from "@tanstack/react-start";
import { db } from "@/lib/db";

export const APIRoute = createAPIFileRoute("/api/webhooks/shiprocket")({
  POST: async ({ request }) => {
    try {
      // For production, you should verify the Shiprocket Webhook Signature header:
      // const signature = request.headers.get("x-shiprocket-signature");
      // Verify signature against your webhook secret before proceeding.

      const payload = await request.json();

      // Ensure this payload has an AWB and a status
      if (payload.awb && payload.current_status) {
        await db.order.updateMany({
          where: { awbCode: payload.awb },
          data: {
            shipmentStatus: payload.current_status,
            lastShipmentSync: new Date(),
          },
        });
        
        console.log(`[Webhook] Updated AWB ${payload.awb} to status ${payload.current_status}`);
      }

      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
      console.error("[Webhook Error] Failed to process Shiprocket webhook:", error);
      return new Response(JSON.stringify({ success: false, error: "Processing failed" }), { status: 500 });
    }
  },
});
