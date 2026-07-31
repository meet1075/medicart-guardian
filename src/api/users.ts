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
  .validator(z.object({ id: z.string(), role: z.enum(["ADMIN", "USER"]) }))
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

export const updateProfileFn = createServerFn({ method: "POST" })
  .validator(z.object({ name: z.string().min(2), email: z.string().email() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session) return errorResponse("Unauthorized", undefined, 401);

      const user = await db.user.update({
        where: { id: session.id },
        data: { name: data.name, email: data.email },
      });
      return successResponse("Profile updated successfully", user);
    } catch (error: any) {
      console.error(error);
      if (error.code === "P2002") {
        return errorResponse("This email is already in use by another account.");
      }
      return errorResponse("Failed to update profile", error.message);
    }
  });

export const getPastPrescriptionsFn = createServerFn({ method: "POST" })
  .validator(z.object({ medicineIds: z.array(z.string()) }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session) return errorResponse("Unauthorized", undefined, 401);

      if (!data.medicineIds.length) {
        return successResponse("No medicines", []);
      }

      const pastFiles = await db.prescriptionFile.findMany({
        where: { 
          order: { 
            userId: session.id,
            items: {
              some: {
                medicineId: { in: data.medicineIds }
              }
            }
          } 
        },
        orderBy: { order: { createdAt: "desc" } },
        take: 30, // fetch recent ones
      });

      // Filter duplicates in memory to give a clean gallery
      const uniqueFiles = [];
      const seen = new Set<string>();
      for (const file of pastFiles) {
        if (!seen.has(file.dataUrl)) {
          seen.add(file.dataUrl);
          uniqueFiles.push(file);
        }
        if (uniqueFiles.length >= 8) break; // keep the UI clean with up to 8 past files
      }

      return successResponse("Past prescriptions fetched", uniqueFiles);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch past prescriptions", (error as Error).message);
    }
  });
