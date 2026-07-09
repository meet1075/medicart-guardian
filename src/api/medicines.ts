import { createServerFn } from "@tanstack/react-start";
import { db } from "@/lib/db";
import { successResponse, errorResponse, type ApiResponse } from "@/lib/api";
import { getUserSession } from "@/api/auth.server";
import { z } from "zod";

export const getMedicinesFn = createServerFn({ method: "GET" })
  .handler(async (): Promise<ApiResponse> => {
    try {
      const medicines = await db.medicine.findMany({
        orderBy: { name: "asc" },
      });
      return successResponse("Medicines fetched successfully", medicines);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch medicines", (error as Error).message);
    }
  });

export const getMedicineByIdFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const medicine = await db.medicine.findUnique({
        where: { id: data.id },
      });
      if (!medicine) return errorResponse("Medicine not found", undefined, 404);
      return successResponse("Medicine fetched successfully", medicine);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to fetch medicine", (error as Error).message);
    }
  });

const MedicineSchema = z.object({
  name: z.string().min(1, "Name is required"),
  salt: z.string(),
  brand: z.string(),
  manufacturer: z.string(),
  category: z.string(),
  healthConcern: z.array(z.string()).default([]),
  price: z.number().min(0),
  mrp: z.number().min(0),
  packSize: z.string(),
  dosageForm: z.string(),
  prescriptionRequired: z.boolean().default(false),
  uses: z.string(),
  howToUse: z.string(),
  sideEffects: z.string(),
  safety: z.string(),
  accent: z.string(),
  substitutes: z.array(z.string()).default([]),
});

export const createMedicineFn = createServerFn({ method: "POST" })
  .validator(MedicineSchema)
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const medicine = await db.medicine.create({
        data,
      });
      return successResponse("Medicine created successfully", medicine, 201);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to create medicine", (error as Error).message);
    }
  });

export const updateMedicineFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string(), data: MedicineSchema }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      const medicine = await db.medicine.update({
        where: { id: data.id },
        data: data.data,
      });
      return successResponse("Medicine updated successfully", medicine);
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to update medicine", (error as Error).message);
    }
  });

export const deleteMedicineFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string() }))
  .handler(async ({ data }): Promise<ApiResponse> => {
    try {
      const session = await getUserSession();
      if (!session || session.role !== "ADMIN") return errorResponse("Forbidden", undefined, 403);

      await db.medicine.delete({
        where: { id: data.id },
      });
      return successResponse("Medicine deleted successfully", { id: data.id });
    } catch (error) {
      console.error(error);
      return errorResponse("Failed to delete medicine", (error as Error).message);
    }
  });
