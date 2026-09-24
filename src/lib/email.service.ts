import nodemailer from "nodemailer";

export interface OrderEmailItem {
  name: string;
  qty: number;
  price: number;
  salt?: string | null;
  dosageForm?: string | null;
}

export interface OrderEmailData {
  id: string;
  total: number;
  subtotal: number;
  delivery: number;
  paymentMethod: string;
  status: string;
  prescriptionStatus?: string | null;
  rejectReason?: string | null;
  courierName?: string | null;
  awbCode?: string | null;
  trackingUrl?: string | null;
  address?: {
    fullName: string;
    phone: string;
    line1?: string | null;
    line2?: string | null;
    street?: string | null;
    city: string;
    state: string;
    pincode: string;
    type?: string | null;
  } | null;
  user?: {
    name?: string | null;
    email?: string | null;
  } | null;
  items?: OrderEmailItem[];
}

function getTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    console.warn("[EmailService] SMTP credentials not configured (SMTP_USER / SMTP_PASS).");
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "465", 10),
    secure: process.env.SMTP_SECURE === "false" ? false : true,
    auth: { user, pass },
  });
}

const FROM_EMAIL = `"Obat Medicare" <${process.env.SMTP_USER || "obatmedicareonline@gmail.com"}>`;
const ADMIN_NOTIFICATION_EMAIL = process.env.CONTACT_EMAIL || "obatmedicareonline@gmail.com";

// Shared email wrapper template
function renderEmailWrapper(title: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f7f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f7f6; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 620px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0f766e; padding: 24px 32px; text-align: left;">
              <h1 style="margin: 0; color: #ffffff; font-size: 22px; font-weight: 700; letter-spacing: 0.5px;">OBAT MEDICARE</h1>
              <p style="margin: 4px 0 0 0; color: #ccfbf1; font-size: 13px;">Healthcare & Online Pharmacy Services</p>
            </td>
          </tr>
          <!-- Body Content -->
          <tr>
            <td style="padding: 28px 32px;">
              ${contentHtml}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 32px; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 18px;">
              <p style="margin: 0;">Obat Medicare • Safe, verified medications delivered to your doorstep.</p>
              <p style="margin: 4px 0 0 0;">Need assistance? Reach us at <a href="mailto:obatmedicareonline@gmail.com" style="color: #0f766e; text-decoration: none; font-weight: 600;">obatmedicareonline@gmail.com</a></p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * EMAIL 1: Admin Notification when an order is placed and confirmed (Payment Received / COD)
 */
export async function sendAdminNewOrderAlert(order: OrderEmailData): Promise<boolean> {
  const transporter = getTransporter();
  if (!transporter) return false;

  const orderShortId = order.id.slice(-8).toUpperCase();
  const customerName = order.address?.fullName || order.user?.name || "Customer";
  const customerPhone = order.address?.phone || "Not provided";
  const customerEmail = order.user?.email || "Not provided";
  const paymentMode = order.paymentMethod.toUpperCase();
  const formattedTotal = `₹${order.total.toFixed(2)}`;

  const itemsHtml = (order.items && order.items.length > 0)
    ? order.items
        .map(
          (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #1e293b; font-weight: 600;">
          ${item.name}
          ${item.dosageForm ? `<span style="display: block; font-size: 11px; font-weight: normal; color: #64748b;">${item.dosageForm}</span>` : ""}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: center;">${item.qty}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f766e; font-weight: 600; text-align: right;">₹${(item.qty * item.price).toFixed(2)}</td>
      </tr>
    `
        )
        .join("")
    : `<tr><td colspan="4" style="padding: 12px; text-align: center; color: #64748b;">No items recorded</td></tr>`;

  const addressText = order.address
    ? [
        order.address.line1 || order.address.street,
        order.address.line2,
        order.address.city,
        order.address.state ? `${order.address.state} - ${order.address.pincode}` : order.address.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : "No shipping address provided";

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #dcfce7; color: #15803d; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
        New Order Confirmed
      </span>
      <h2 style="margin: 10px 0 4px 0; font-size: 18px; color: #0f172a;">New Order #${orderShortId} Received</h2>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Total Amount: <strong style="color: #0f766e; font-size: 16px;">${formattedTotal}</strong> via <strong>${paymentMode}</strong></p>
    </div>

    <!-- Customer Information -->
    <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 24px;">
      <h3 style="margin: 0 0 10px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Customer & Delivery Details</h3>
      <table style="width: 100%; font-size: 13px; line-height: 20px; color: #334155;">
        <tr>
          <td style="width: 30%; color: #64748b;">Customer:</td>
          <td><strong>${customerName}</strong></td>
        </tr>
        <tr>
          <td style="color: #64748b;">Phone:</td>
          <td><a href="tel:${customerPhone}" style="color: #0f766e; text-decoration: none;">${customerPhone}</a></td>
        </tr>
        <tr>
          <td style="color: #64748b;">Email:</td>
          <td>${customerEmail}</td>
        </tr>
        <tr>
          <td style="color: #64748b; vertical-align: top;">Delivery Address:</td>
          <td style="vertical-align: top;">${addressText}</td>
        </tr>
      </table>
    </div>

    <!-- Items Table -->
    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Ordered Medicines</h3>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="padding: 8px 12px; text-align: left; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Item</th>
          <th style="padding: 8px 12px; text-align: center; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Qty</th>
          <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Rate</th>
          <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Subtotal</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Financial Breakdown -->
    <div style="margin-left: auto; max-width: 260px; font-size: 13px; line-height: 22px; color: #334155; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between;">
        <span>Subtotal:</span>
        <strong>₹${order.subtotal.toFixed(2)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Delivery:</span>
        <span>${order.delivery === 0 ? "FREE" : `₹${order.delivery.toFixed(2)}`}</span>
      </div>
      <div style="display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 6px; margin-top: 4px; font-size: 15px; color: #0f172a;">
        <strong>Total Amount:</strong>
        <strong style="color: #0f766e;">${formattedTotal}</strong>
      </div>
    </div>

    <!-- Prescription Notice -->
    <div style="background-color: #eff6ff; border-left: 4px solid #3b82f6; padding: 12px 16px; border-radius: 0 6px 6px 0; font-size: 13px; color: #1e40af;">
      <strong>Prescription Verification:</strong>
      <p style="margin: 4px 0 0 0;">Customer has submitted prescription documents. Please review and verify in the Pharmacist Admin Dashboard.</p>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: ADMIN_NOTIFICATION_EMAIL,
      subject: `🚨 New Order Received: #${orderShortId} - ${formattedTotal} (${paymentMode})`,
      html: renderEmailWrapper(`New Order #${orderShortId}`, contentHtml),
    });
    console.log(`[EmailService] Admin new order alert sent for #${orderShortId}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Failed to send admin new order alert for #${orderShortId}:`, error);
    return false;
  }
}

/**
 * EMAIL 1B: Customer Order Confirmation when order is placed
 * Informs customer: "Order received! Our pharmacist will review your prescription soon."
 */
export async function sendCustomerOrderConfirmationEmail(order: OrderEmailData): Promise<boolean> {
  const customerEmail = order.user?.email;
  if (!customerEmail) {
    console.warn(`[EmailService] Cannot send customer order confirmation: Order #${order.id} has no customer email.`);
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) return false;

  const orderShortId = order.id.slice(-8).toUpperCase();
  const customerName = order.address?.fullName || order.user?.name || "Valued Customer";
  const formattedTotal = `₹${order.total.toFixed(2)}`;
  const paymentMode = order.paymentMethod.toUpperCase();

  const itemsHtml = (order.items && order.items.length > 0)
    ? order.items
        .map(
          (item) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #1e293b; font-weight: 600;">
          ${item.name}
          ${item.dosageForm ? `<span style="display: block; font-size: 11px; font-weight: normal; color: #64748b;">${item.dosageForm}</span>` : ""}
        </td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: center;">${item.qty}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #334155; text-align: right;">₹${item.price.toFixed(2)}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; color: #0f766e; font-weight: 600; text-align: right;">₹${(item.qty * item.price).toFixed(2)}</td>
      </tr>
    `
        )
        .join("")
    : `<tr><td colspan="4" style="padding: 12px; text-align: center; color: #64748b;">No items recorded</td></tr>`;

  const addressText = order.address
    ? [
        order.address.line1 || order.address.street,
        order.address.line2,
        order.address.city,
        order.address.state ? `${order.address.state} - ${order.address.pincode}` : order.address.pincode,
      ]
        .filter(Boolean)
        .join(", ")
    : "No shipping address provided";

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #dcfce7; color: #15803d; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
        Order Placed Successfully
      </span>
      <h2 style="margin: 10px 0 4px 0; font-size: 18px; color: #0f172a;">Thank You for Your Order, ${customerName}!</h2>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Order <strong>#${orderShortId}</strong> has been received via <strong>${paymentMode}</strong>.</p>
    </div>

    <!-- Pharmacist Review Notice Box -->
    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-left: 4px solid #16a34a; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <h3 style="margin: 0 0 6px 0; font-size: 14px; font-weight: 700; color: #166534;">Next Step: Prescription Review</h3>
      <p style="margin: 0; font-size: 13px; line-height: 20px; color: #15803d;">
        Our pharmacist will review your uploaded doctor's prescription shortly. You will receive an email update as soon as it is verified and your package is being packed for delivery.
      </p>
    </div>

    <!-- Items Table -->
    <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #475569;">Order Summary</h3>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="border-collapse: collapse; margin-bottom: 20px;">
      <thead>
        <tr style="background-color: #f1f5f9;">
          <th style="padding: 8px 12px; text-align: left; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Medicine</th>
          <th style="padding: 8px 12px; text-align: center; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Qty</th>
          <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Rate</th>
          <th style="padding: 8px 12px; text-align: right; font-size: 12px; color: #475569; font-weight: 700; border-bottom: 2px solid #cbd5e1;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <!-- Financial Breakdown -->
    <div style="margin-left: auto; max-width: 260px; font-size: 13px; line-height: 22px; color: #334155; margin-bottom: 24px;">
      <div style="display: flex; justify-content: space-between;">
        <span>Subtotal:</span>
        <strong>₹${order.subtotal.toFixed(2)}</strong>
      </div>
      <div style="display: flex; justify-content: space-between;">
        <span>Delivery:</span>
        <span>${order.delivery === 0 ? "FREE" : `₹${order.delivery.toFixed(2)}`}</span>
      </div>
      <div style="display: flex; justify-content: space-between; border-top: 1px solid #cbd5e1; padding-top: 6px; margin-top: 4px; font-size: 15px; color: #0f172a;">
        <strong>Total Amount:</strong>
        <strong style="color: #0f766e;">${formattedTotal}</strong>
      </div>
    </div>

    <!-- Delivery Address -->
    <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 14px 16px; margin-bottom: 20px;">
      <div style="font-size: 12px; text-transform: uppercase; font-weight: 700; color: #64748b; margin-bottom: 4px;">Delivering To:</div>
      <div style="font-size: 13px; color: #1e293b; font-weight: 600;">${customerName}</div>
      <div style="font-size: 13px; color: #475569; line-height: 18px;">${addressText}</div>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Order Placed Successfully: #${orderShortId} - Obat Medicare`,
      html: renderEmailWrapper(`Order Placed #${orderShortId}`, contentHtml),
    });
    console.log(`[EmailService] Customer order confirmation sent for #${orderShortId}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Failed to send customer order confirmation for #${orderShortId}:`, error);
    return false;
  }
}

/**
 * EMAIL 2A: Customer Notification when Prescription is Approved
 */
export async function sendCustomerRxApprovedEmail(order: OrderEmailData): Promise<boolean> {
  const customerEmail = order.user?.email;
  if (!customerEmail) {
    console.warn(`[EmailService] Cannot send Rx approval email: Order #${order.id} has no customer email.`);
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) return false;

  const orderShortId = order.id.slice(-8).toUpperCase();
  const customerName = order.address?.fullName || order.user?.name || "Valued Customer";

  const itemsListHtml = (order.items && order.items.length > 0)
    ? `<ul style="margin: 8px 0; padding-left: 20px; font-size: 14px; color: #334155;">
        ${order.items.map((i) => `<li style="margin-bottom: 4px;"><strong>${i.name}</strong> (Qty: ${i.qty})</li>`).join("")}
       </ul>`
    : "";

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #dcfce7; color: #15803d; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
        Prescription Verified
      </span>
      <h2 style="margin: 10px 0 4px 0; font-size: 18px; color: #0f172a;">Prescription Approved for Order #${orderShortId}</h2>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Dear ${customerName},</p>
    </div>

    <p style="font-size: 14px; line-height: 22px; color: #334155;">
      Great news! Our pharmacist has reviewed and verified your uploaded doctor's prescription.
    </p>

    <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 16px; margin: 20px 0;">
      <h3 style="margin: 0 0 8px 0; font-size: 13px; text-transform: uppercase; color: #166534; letter-spacing: 0.5px;">Approved Medications</h3>
      ${itemsListHtml}
      <p style="margin: 8px 0 0 0; font-size: 13px; color: #15803d;">
        Your order is now being safely packed and scheduled for delivery.
      </p>
    </div>

    <p style="font-size: 14px; line-height: 22px; color: #334155;">
      You will receive another update with courier and tracking information once your package is dispatched.
    </p>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `✅ Prescription Approved: Your Obat Medicare Order #${orderShortId} is being prepared`,
      html: renderEmailWrapper(`Prescription Approved - Order #${orderShortId}`, contentHtml),
    });
    console.log(`[EmailService] Customer Rx approval email sent for #${orderShortId}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Failed to send customer Rx approval email for #${orderShortId}:`, error);
    return false;
  }
}

/**
 * EMAIL 2B: Customer Notification when Prescription is Rejected
 */
export async function sendCustomerRxRejectedEmail(order: OrderEmailData, reason?: string): Promise<boolean> {
  const customerEmail = order.user?.email;
  if (!customerEmail) {
    console.warn(`[EmailService] Cannot send Rx rejection email: Order #${order.id} has no customer email.`);
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) return false;

  const orderShortId = order.id.slice(-8).toUpperCase();
  const customerName = order.address?.fullName || order.user?.name || "Valued Customer";
  const rejectionReason = reason || order.rejectReason || "The uploaded document did not meet pharmacy verification standards.";

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #fee2e2; color: #b91c1c; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
        Prescription Verification Issue
      </span>
      <h2 style="margin: 10px 0 4px 0; font-size: 18px; color: #0f172a;">Prescription Update for Order #${orderShortId}</h2>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Dear ${customerName},</p>
    </div>

    <p style="font-size: 14px; line-height: 22px; color: #334155;">
      Our pharmacist reviewed your uploaded prescription for Order #${orderShortId}. Unfortunately, we could not approve the prescription for the following reason:
    </p>

    <!-- Prominent Rejection Reason Box -->
    <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-left: 4px solid #ef4444; border-radius: 6px; padding: 16px; margin: 20px 0;">
      <h4 style="margin: 0 0 6px 0; font-size: 13px; text-transform: uppercase; color: #991b1b; letter-spacing: 0.5px;">Reason for Rejection:</h4>
      <p style="margin: 0; font-size: 14px; color: #7f1d1d; font-weight: 600; line-height: 20px;">
        “${rejectionReason}”
      </p>
    </div>

    <div style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; padding: 16px; margin-bottom: 20px;">
      <h4 style="margin: 0 0 8px 0; font-size: 13px; color: #334155;">What to do next:</h4>
      <ol style="margin: 0; padding-left: 20px; font-size: 13px; line-height: 20px; color: #475569;">
        <li style="margin-bottom: 4px;">Reply directly to this email with a clear, valid doctor's prescription containing the doctor's registration number and signature.</li>
        <li>Or contact our pharmacy support at <a href="mailto:obatmedicareonline@gmail.com" style="color: #0f766e; text-decoration: none; font-weight: 600;">obatmedicareonline@gmail.com</a>.</li>
      </ol>
    </div>

    <p style="font-size: 13px; line-height: 20px; color: #64748b;">
      If payment was made online, your payment remains secure with us while we resolve your prescription, or it can be refunded if a valid prescription cannot be provided.
    </p>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `Action Required: Prescription issue with your Obat Medicare Order #${orderShortId}`,
      html: renderEmailWrapper(`Prescription Verification Issue - Order #${orderShortId}`, contentHtml),
    });
    console.log(`[EmailService] Customer Rx rejection email sent for #${orderShortId}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Failed to send customer Rx rejection email for #${orderShortId}:`, error);
    return false;
  }
}

/**
 * EMAIL 3: Customer Notification when Order is Dispatched / Shipment Scheduled
 */
export async function sendCustomerTrackingEmail(order: OrderEmailData): Promise<boolean> {
  const customerEmail = order.user?.email;
  if (!customerEmail) {
    console.warn(`[EmailService] Cannot send tracking email: Order #${order.id} has no customer email.`);
    return false;
  }

  const transporter = getTransporter();
  if (!transporter) return false;

  const orderShortId = order.id.slice(-8).toUpperCase();
  const customerName = order.address?.fullName || order.user?.name || "Valued Customer";
  const courier = order.courierName || "Shiprocket Express";
  const awb = order.awbCode || "Assigned by courier";
  const trackingUrl = order.trackingUrl || (order.awbCode ? `https://shiprocket.co/tracking/${order.awbCode}` : "");

  const contentHtml = `
    <div style="margin-bottom: 20px;">
      <span style="display: inline-block; padding: 4px 10px; background-color: #e0f2fe; color: #0369a1; border-radius: 6px; font-size: 12px; font-weight: 700; text-transform: uppercase;">
        Order Dispatched
      </span>
      <h2 style="margin: 10px 0 4px 0; font-size: 18px; color: #0f172a;">Your Order #${orderShortId} is on the way!</h2>
      <p style="margin: 0; font-size: 14px; color: #64748b;">Dear ${customerName},</p>
    </div>

    <p style="font-size: 14px; line-height: 22px; color: #334155;">
      Your medicines have been carefully inspected, packed, and handed over to our courier partner.
    </p>

    <!-- Shipment Details Box -->
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin: 20px 0;">
      <h3 style="margin: 0 0 12px 0; font-size: 13px; text-transform: uppercase; color: #475569; letter-spacing: 0.5px;">Shipping Details</h3>
      <table style="width: 100%; font-size: 14px; line-height: 24px; color: #1e293b;">
        <tr>
          <td style="width: 35%; color: #64748b;">Courier Partner:</td>
          <td><strong>${courier}</strong></td>
        </tr>
        <tr>
          <td style="color: #64748b;">AWB / Tracking Number:</td>
          <td><code style="background-color: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-size: 13px; color: #0f172a; font-weight: 600;">${awb}</code></td>
        </tr>
        <tr>
          <td style="color: #64748b;">Delivery Pincode:</td>
          <td>${order.address?.pincode || "Your address"}</td>
        </tr>
      </table>
    </div>

    <!-- Direct Shiprocket Tracking Button -->
    ${trackingUrl ? `
    <div style="text-align: center; margin: 26px 0 20px 0;">
      <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #0f766e; color: #ffffff; font-weight: 700; font-size: 15px; padding: 14px 32px; border-radius: 8px; text-decoration: none; letter-spacing: 0.3px; box-shadow: 0 4px 10px rgba(15, 118, 110, 0.25);">
        Track Your Package &rarr;
      </a>
      <p style="margin: 12px 0 0 0; font-size: 12px; color: #64748b;">
        Or open directly: <a href="${trackingUrl}" target="_blank" rel="noopener noreferrer" style="color: #0f766e; text-decoration: underline; word-break: break-all;">${trackingUrl}</a>
      </p>
    </div>
    ` : ""}

    <p style="font-size: 13px; line-height: 20px; color: #64748b; margin-top: 20px;">
      Our delivery partner will send regular SMS and WhatsApp updates regarding your package's transit and out-for-delivery status.
    </p>
  `;

  try {
    const info = await transporter.sendMail({
      from: FROM_EMAIL,
      to: customerEmail,
      subject: `📦 Your Obat Medicare Order #${orderShortId} has been dispatched!`,
      html: renderEmailWrapper(`Order Dispatched - #${orderShortId}`, contentHtml),
    });
    console.log(`[EmailService] Customer tracking email sent for #${orderShortId}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Failed to send customer tracking email for #${orderShortId}:`, error);
    return false;
  }
}
