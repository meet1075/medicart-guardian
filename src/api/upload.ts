import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod";
import { getUserSession } from "@/api/auth.server";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase env vars not set");
  return createClient(url, key);
}

export const uploadMedicineImageFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      // base64-encoded file content
      fileBase64: z.string(),
      // original file name for extension detection
      fileName: z.string(),
      medicineId: z.string(),
    })
  )
  .handler(async ({ data }) => {
    const session = await getUserSession();
    if (!session || session.role !== "ADMIN") {
      throw new Error("Forbidden");
    }

    const supabase = getSupabase();
    const bucket = "obat_medicine_images";

    // Decode base64 → Buffer
    const base64Data = data.fileBase64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const rawExt = data.fileName.split(".").pop()?.toLowerCase() ?? "jpg";
    const allowedExts = ["jpg", "jpeg", "png", "webp"];
    const ext = allowedExts.includes(rawExt) ? rawExt : "jpg";
    const path = `${data.medicineId}.${ext}`;

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
        upsert: true,
      });

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return { publicUrl: urlData.publicUrl };
  });

export async function uploadPrescriptionToSupabase({
  fileBase64,
  fileName,
  mimeType,
}: {
  fileBase64: string;
  fileName: string;
  mimeType: string;
}): Promise<string> {
  // If already a URL (e.g. from past prescription or already uploaded), return as is
  if (fileBase64.startsWith("http://") || fileBase64.startsWith("https://")) {
    return fileBase64;
  }

  try {
    const supabase = getSupabase();
    const bucket = "prescriptions";

    // Decode base64 → Buffer
    const base64Data = fileBase64.replace(/^data:[^;]+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const rawExt = fileName.split(".").pop()?.toLowerCase() ?? (mimeType.includes("pdf") ? "pdf" : "jpg");
    const uniqueId = crypto.randomUUID();
    const path = `${uniqueId}.${rawExt}`;

    const contentType = mimeType || (rawExt === "pdf" ? "application/pdf" : `image/${rawExt}`);

    const { error } = await supabase.storage
      .from(bucket)
      .upload(path, buffer, {
        contentType,
        upsert: true,
      });

    if (error) {
      console.error("[uploadPrescriptionToSupabase] Supabase upload failed:", error.message);
      return fileBase64;
    }

    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(path);

    return urlData.publicUrl;
  } catch (err) {
    console.error("[uploadPrescriptionToSupabase] Error uploading to Supabase:", err);
    return fileBase64;
  }
}
