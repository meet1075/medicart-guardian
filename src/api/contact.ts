import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import nodemailer from "nodemailer";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().optional(),
  company: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export const sendContactEmailFn = createServerFn({ method: "POST" })
  .validator((data: z.infer<typeof contactSchema>) => contactSchema.parse(data))
  .handler(async ({ data }) => {
    try {
      if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP credentials not found. Simulating email sending for development.");
        console.log("Simulated email to:", data.email, "and", process.env.CONTACT_EMAIL || "obatmedicare@gmail.com");
        return { success: true };
      }

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "465", 10),
        secure: process.env.SMTP_SECURE === "false" ? false : true,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // 1. Send the inquiry to the business email (obatmedicare@gmail.com)
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: process.env.CONTACT_EMAIL || "obatmedicare@gmail.com",
        subject: `New Contact Form Inquiry from ${data.name}`,
        html: `
          <h3>New Inquiry from Website Contact Form</h3>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
          <p><strong>Company/Hospital:</strong> ${data.company || "Not provided"}</p>
          <p><strong>Message:</strong></p>
          <p style="white-space: pre-wrap;">${data.message}</p>
        `,
      });

      // 2. Send the auto-responder to the user
      await transporter.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: data.email,
        subject: "We have received your message - Obat Medicare",
        html: `
          <p>Dear ${data.name},</p>
          <p>Thank you for reaching out to Obat Medicare. We have successfully received your message.</p>
          <p>Our team will review your inquiry and get back to you as soon as possible.</p>
          <br/>
          <p>Best Regards,</p>
          <p><strong>Obat Medicare Team</strong></p>
          <p>Email: obatmedicare@gmail.com</p>
          <p>Phone: +91-9650506996</p>
        `,
      });

      return { success: true };
    } catch (error) {
      console.error("Email send error:", error);
      throw new Error("Failed to send email. Please try again later.");
    }
  });
