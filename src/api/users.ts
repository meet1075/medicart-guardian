import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { successResponse, errorResponse, type ApiResponse } from "@/lib/api";
import { getUserSession } from "@/api/auth.server";
import { z } from "zod";

export const getUsersFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
      return successResponse("Users fetched successfully", users);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch users", (error as Error).message);
    }
  });

export const updateUserRoleFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), role: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      // Prevent admin from removing their own admin role to avoid lockout
      if (session.id === data.id && data.role !== "ADMIN") {
        return errorResponse("Cannot revoke your own admin access", undefined, 400);
      }

      const user = await db.user.update({
        where: { id: data.id },
        data: { role: data.role },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });
      return successResponse("User role updated successfully", user);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to update user role", (error as Error).message);
    }
  });
