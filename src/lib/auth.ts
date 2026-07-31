import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { phoneNumber } from "better-auth/plugins";
import { db } from "./db";

// Derive base URL: Let better-auth derive it from the incoming request's Host header
// so that it matches exactly whichever domain the user is currently visiting 
// (e.g. -self vs main vs localhost).
const getBaseUrl = () => {
  return undefined; 
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
