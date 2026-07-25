import { createServerFn } from "@tanstack/react-start";
import { getUserSession } from "@/api/auth.server";

/**
 * Server function that checks whether the current request belongs to an admin.
 * Safe to import in client-bundled route files because createServerFn becomes
 * an RPC bridge — the actual server-only import stays on the server side.
 */
export const checkIsAdminFn = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await getUserSession();
    return { isAdmin: !!(session && (session as any).role === "ADMIN") };
  }
);
