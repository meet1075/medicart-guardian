import crypto from "crypto";
import { db } from "@/lib/db";
import {
  sendAdminNewOrderAlert,
  sendCustomerOrderConfirmationEmail,
} from "@/lib/email.service";

export async function handleRazorpayWebhook(request: Request): Promise<Response> {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-razorpay-signature");
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // If a webhook secret is configured, verify signature authenticity
    if (secret) {
      if (!signature) {
        console.warn("[Razorpay Webhook] Rejected: Missing x-razorpay-signature header");
        return new Response(JSON.stringify({ error: "Missing signature" }), { status: 400 });
      }

      const hmac = crypto.createHmac("sha256", secret);
      hmac.update(rawBody);
      const digest = hmac.digest("hex");

      if (digest !== signature) {
        console.warn("[Razorpay Webhook] Rejected: Invalid signature");
        return new Response(JSON.stringify({ error: "Invalid signature" }), { status: 400 });
      }
    } else {
      console.info("[Razorpay Webhook] Notice: RAZORPAY_WEBHOOK_SECRET not set in .env; processing payload without secret verification");
    }

    const payload = JSON.parse(rawBody);
    const event = payload.event;
    console.log(`[Razorpay Webhook] Received event: ${event}`);

    // We process payment.captured or order.paid events
    if (event === "payment.captured" || event === "order.paid") {
      const paymentEntity = payload.payload?.payment?.entity;
      const orderEntity = payload.payload?.order?.entity;

      const rzpOrderId = paymentEntity?.order_id || orderEntity?.id;
      const rzpPaymentId = paymentEntity?.id;

      if (!rzpOrderId) {
        console.warn("[Razorpay Webhook] No razorpay order_id in event payload");
        return new Response(JSON.stringify({ received: true, note: "No order_id found" }), { status: 200 });
      }

      const existingOrder = await db.order.findFirst({
        where: { razorpayOrderId: rzpOrderId },
        include: {
          items: true,
          address: true,
          user: { select: { id: true, name: true, email: true } },
        },
      });

      if (!existingOrder) {
        console.warn(`[Razorpay Webhook] Order with razorpayOrderId ${rzpOrderId} not found in database.`);
        return new Response(JSON.stringify({ received: true, note: "Order not found" }), { status: 200 });
      }

      // Atomic transition: updates if current status is "payment_pending" or recovered from "payment_cancelled"
      const transitionResult = await db.order.updateMany({
        where: {
          id: existingOrder.id,
          status: { in: ["payment_pending", "payment_cancelled"] },
        },
        data: {
          razorpayPaymentId: rzpPaymentId || existingOrder.razorpayPaymentId,
          status: "under_review",
        },
      });

      if (transitionResult.count > 0) {
        const updatedOrder = await db.order.findUnique({
          where: { id: existingOrder.id },
          include: {
            items: true,
            address: true,
            user: { select: { id: true, name: true, email: true } },
          },
        });

        if (updatedOrder) {
          console.log(`[Razorpay Webhook] Order #${updatedOrder.id} atomically marked as under_review via webhook.`);
          // Send Email to Admin and Customer
          sendAdminNewOrderAlert(updatedOrder).catch((err) => {
            console.error("[EmailService] Failed to send admin order alert from webhook:", err);
          });
          sendCustomerOrderConfirmationEmail(updatedOrder).catch((err) => {
            console.error("[EmailService] Failed to send customer order confirmation from webhook:", err);
          });
        }
      } else {
        console.log(`[Razorpay Webhook] Order #${existingOrder.id} was already processed (status: "${existingOrder.status}"). Skipping duplicate alert.`);
      }
    }

    // Process payment.failed events to auto-mark order as payment_cancelled
    if (event === "payment.failed") {
      const paymentEntity = payload.payload?.payment?.entity;
      const rzpOrderId = paymentEntity?.order_id;
      const errorDesc = paymentEntity?.error_description || "Payment failed or cancelled by customer";

      if (rzpOrderId) {
        const cancelResult = await db.order.updateMany({
          where: {
            razorpayOrderId: rzpOrderId,
            status: "payment_pending",
          },
          data: {
            status: "payment_cancelled",
            rejectReason: errorDesc,
          },
        });

        if (cancelResult.count > 0) {
          console.log(`[Razorpay Webhook] Order with razorpayOrderId ${rzpOrderId} marked as payment_cancelled.`);
        }
      }
    }

    return new Response(JSON.stringify({ status: "ok" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[Razorpay Webhook] Error processing webhook:", error);
    return new Response(JSON.stringify({ error: "Webhook processing error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
