import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckoutFrame } from "@/components/CheckoutFrame";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { FileText, ShieldCheck, Trash2, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import type { PrescriptionFile } from "@/lib/types";
import { getPastPrescriptionsFn } from "@/api/users";
import { useServerFn } from "@tanstack/react-start";

const PRESCRIPTION_KEY = "medicart.pending-prescription.v1";

export const Route = createFileRoute("/checkout/prescription")({
  head: () => ({
    meta: [{ title: "Upload prescription — MediCart" }, { name: "robots", content: "noindex" }],
  }),
  component: PrescriptionStep,
});

function PrescriptionStep() {
  const { cartHasRx, cart } = useStore();
  const navigate = useNavigate();
  const [files, setFiles] = useState<PrescriptionFile[]>([]);
  
  const getPastPrescriptions = useServerFn(getPastPrescriptionsFn);
  const [pastFiles, setPastFiles] = useState<any[]>([]);
  const [loadingPast, setLoadingPast] = useState(true);

  useEffect(() => {
    const rxMedicineIds = cart.filter(c => c.prescriptionRequired).map(c => c.medicineId);
    if (rxMedicineIds.length === 0) {
      setLoadingPast(false);
      return;
    }
    
    getPastPrescriptions({ data: { medicineIds: rxMedicineIds } })
      .then((res) => {
        if (res.status === "success") setPastFiles(res.data);
      })
      .finally(() => setLoadingPast(false));
  }, [cart]);

  useEffect(() => {
    // Skip this step for OTC-only carts
    if (cart.length === 0) {
      navigate({ to: "/cart", replace: true });
      return;
    }
    if (!cartHasRx) {
      navigate({ to: "/checkout/address", replace: true });
    }
  }, [cartHasRx, cart.length, navigate]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PRESCRIPTION_KEY);
      if (raw) setFiles(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(PRESCRIPTION_KEY, JSON.stringify(files));
    } catch { /* ignore */ }
  }, [files]);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    for (const f of Array.from(fileList)) {
      if (f.size > 8 * 1024 * 1024) {
        toast.error(`${f.name} is too large (max 8 MB)`);
        continue;
      }
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = () => reject(r.error);
        r.readAsDataURL(f);
      });

      const id = crypto.randomUUID();
      const entry: PrescriptionFile = {
        id,
        name: f.name,
        mimeType: f.type || "image/jpeg",
        dataUrl,
        extracting: false,
      };
      setFiles((prev) => [...prev, entry]);
    }
  }

  function handleUsePastPrescription(pastFile: any) {
    if (files.some((f) => f.id === pastFile.id)) {
      toast.error("You have already attached this prescription");
      return;
    }
    
    const entry: PrescriptionFile = {
      id: pastFile.id,
      name: pastFile.name,
      mimeType: pastFile.mimeType,
      dataUrl: pastFile.dataUrl,
      extracting: false,
      extraction: pastFile.aiExtractionResult || undefined,
    };

    setFiles((prev) => [...prev, entry]);
    toast.success("Attached past prescription");
  }

  const canContinue = files.length > 0 && files.every((f) => !f.extracting);

  return (
    <CheckoutFrame current="prescription">
      <section className="rounded-xl border border-border bg-surface p-6">
        <h2 className="text-lg font-semibold text-foreground">Upload your prescription</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Add clear photos or PDFs of your doctor's prescription. Multiple files welcome (e.g. multi-page Rx).
        </p>

        <label className="mt-5 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background p-10 text-center transition-colors hover:border-primary hover:bg-primary-soft/30">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-soft text-primary">
            <Upload size={20} />
          </div>
          <div className="text-sm font-semibold text-foreground">Drag files here or click to upload</div>
          <div className="text-xs text-muted-foreground">JPG, PNG, or PDF · up to 8 MB each</div>
          <input
            type="file"
            multiple
            accept="image/*,application/pdf"
            onChange={(e) => handleFiles(e.target.files)}
            className="hidden"
          />
        </label>

        {files.length > 0 && (
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {files.map((f) => (
              <div key={f.id} className="flex gap-3 rounded-lg border border-border bg-background p-3">
                <div className="h-20 w-20 flex-none overflow-hidden rounded-md border border-border bg-surface-muted">
                  {f.mimeType.startsWith("image/") ? (
                    <img src={f.dataUrl} alt={f.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                      <FileText size={24} />
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium">{f.name}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Uploaded</div>
                  <button
                    type="button"
                    onClick={() => setFiles((p) => p.filter((x) => x.id !== f.id))}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={12} /> Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pastFiles.length > 0 && (
          <div className="mt-8 border-t border-border pt-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">Choose from past prescriptions</h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {pastFiles.map((f) => (
                <div key={f.id} className="flex flex-col gap-2 rounded-lg border border-border bg-background p-3 hover:border-primary/50 transition-colors">
                  <div className="h-24 w-full flex-none overflow-hidden rounded-md border border-border bg-surface-muted">
                    {f.mimeType.startsWith("image/") ? (
                      <img src={f.dataUrl} alt={f.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                        <FileText size={24} />
                      </div>
                    )}
                  </div>
                  <div className="truncate text-xs font-medium mt-1">{f.name}</div>
                  <button
                    type="button"
                    onClick={() => handleUsePastPrescription(f)}
                    disabled={files.some((x) => x.id === f.id)}
                    className="mt-auto w-full rounded bg-primary-soft py-1.5 text-xs font-semibold text-primary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-primary/20 transition-colors"
                  >
                    {files.some((x) => x.id === f.id) ? "Attached" : "Use this"}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}


        <div className="mt-6 rounded-lg border border-border bg-primary-soft/40 p-4 text-sm text-foreground/80">
          <div className="flex items-start gap-2">
            <ShieldCheck size={18} className="mt-0.5 flex-none text-primary" />
            <div>
              <div className="font-semibold text-foreground">Why we ask for this</div>
              Our licensed pharmacist will verify this prescription against your order before it ships.
              This usually takes a few hours. Your prescription is stored securely and only used for
              dispensing your medicines.
            </div>
          </div>
        </div>
      </section>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => navigate({ to: "/checkout/address" })}
          className="rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primary/90"
        >
          Continue to Address
        </button>
      </div>
    </CheckoutFrame>
  );
}
