import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { db } from "./db";

// Derive base URL: prefer BETTER_AUTH_URL only if it's a real deployment URL
// (not localhost), otherwise let better-auth derive it from the incoming request.
// This prevents the OAuth state_mismatch when BETTER_AUTH_URL is set to localhost.
const getBaseUrl = () => {
  // If we are on Vercel, trust the VERCEL_URL (which maps to the exact preview/production domain)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  const url = process.env.BETTER_AUTH_URL;
  if (url && !url.includes("localhost")) return url;
  return undefined; // better-auth derives from request origin
};

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    plugins: [
        phoneNumber({
            sendOTP: async ({ phoneNumber, code }, request) => {
                // If Twilio credentials are provided, send a real SMS
                if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
                    const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${process.env.TWILIO_ACCOUNT_SID?.replace(/"/g, '')}/Messages.json`;
                    
                    // Normalize phone number: add +91 (India) prefix if not already in E.164 format
                    const normalizedPhone = phoneNumber.startsWith("+") 
                        ? phoneNumber 
                        : `+91${phoneNumber}`;

                    const params = new URLSearchParams();
                    params.append("To", normalizedPhone);
                    params.append("From", process.env.TWILIO_PHONE_NUMBER?.replace(/"/g, '') || "");
                    params.append("Body", `Your Medicart OTP is: ${code}`);

                    const res = await fetch(twilioUrl, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Authorization": "Basic " + btoa(`${process.env.TWILIO_ACCOUNT_SID?.replace(/"/g, '')}:${process.env.TWILIO_AUTH_TOKEN?.replace(/"/g, '')}`)
                        },
                        body: params.toString()
                    });

                    if (!res.ok) {
                        const errorText = await res.text();
                        console.error("Failed to send real SMS via Twilio:", errorText);
                        throw new Error("Failed to send SMS via Twilio. Please check credentials.");
                    }
                } else {
                    // Fallback to mock for development
                    console.log(`\n\n======================================================`);
                    console.log(`🚀 MOCK SMS: OTP for ${phoneNumber} is [ ${code} ]`);
                    console.log(`======================================================\n\n`);
                }
            },
            signUpOnVerification: {
                getTempEmail: (phoneNumber) => `${phoneNumber}@medicart.local`,
                getTempName: (phoneNumber) => `User ${phoneNumber}`,
            }
        }),
    ],
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: getBaseUrl(),
    // Allow requests from any Vercel preview/production deployment
    trustedOrigins: [
        "https://medicart-guardian.vercel.app",
        "https://medicart-guardian-self.vercel.app",
        "http://localhost:8080",
        "http://localhost:3000",
    ],
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: false,
                defaultValue: "USER",
                input: false, // users can't set their own role
            },
        },
    },
});
