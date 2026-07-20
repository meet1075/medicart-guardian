import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

// Derive base URL: prefer BETTER_AUTH_URL only if it's a real deployment URL
// (not localhost), otherwise let better-auth derive it from the incoming request.
// This prevents the OAuth state_mismatch when BETTER_AUTH_URL is set to localhost.
const getBaseUrl = () => {
  const url = process.env.BETTER_AUTH_URL;
  if (url && !url.includes("localhost")) return url;
  return undefined; // better-auth derives from request origin
};

export const auth = betterAuth({
    database: prismaAdapter(db, {
        provider: "postgresql",
    }),
    emailAndPassword: {
        enabled: true,
    },
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
