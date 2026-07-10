import { getRequest } from "@tanstack/react-start/server";
import { auth } from "@/lib/auth";
import type { User } from "@prisma/client";

export async function getUserSession() {
  const request = getRequest();
  if (!request) return null;
  
  try {
    const sessionData = await auth.api.getSession({ headers: request.headers });
    if (!sessionData?.user) return null;
    return sessionData.user as unknown as User;
  } catch (error) {
    console.error("Error getting user session via Better Auth:", error);
    return null;
  }
}
