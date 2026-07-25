import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { useServerFn } from "@tanstack/react-start";
import { identifyMedicineImageFn, updateMedicineFn } from "@/api/medicines";
import { uploadMedicineImageFn } from "@/api/upload";
import { useMedicines } from "@/hooks/use-medicines";
import { Upload, Image as ImageIcon, CheckCircle, Loader2, AlertCircle, X, Search } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/dashboard/bulk-images")({
  component: BulkImagesPage,
});

interface UploadItem {
  id: string;
  file: File;
  dataUrl: string;
  status: "pending" | "analyzing" | "mapped" | "uploading" | "success" | "error";
  aiGuess?: { name: string | null; brand: string | null; salt: string | null };
  selectedMedicineId?: string;
  error?: string;
}

function BulkImagesPage() {
  const { medicines, isLoading: loadingMeds } = useMedicines();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const uploadFn = useServerFn(uploadMedicineImageFn);
  const updateMedFn = useServerFn(updateMedicineFn);
  
  const medicinesMissingImages = medicines.filter(m => !m.imageUrl);

  // Handle file drop/selection
  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) return;
    
    const newItems: UploadItem[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (!file.type.startsWith("image/")) continue;
      
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });

      newItems.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        dataUrl,
        status: "mapped",
      });
    }
    
    setItems(prev => [...prev, ...newItems]);
  };

  // AI auto-mapping disabled per user request

  const handleUploadAll = async () => {
    const toUpload = items.filter(i => i.status === "mapped" && i.selectedMedicineId);
    if (toUpload.length === 0) {
      toast.error("No mapped images to upload");
      return;
    }

    setIsProcessing(true);
    let successCount = 0;

    for (const item of toUpload) {
      setItems(prev => prev.map(x => x.id === item.id ? { ...x, status: "uploading" } : x));
      try {
        const uploadRes = await uploadFn({
          data: {
            fileBase64: item.dataUrl,
            fileName: item.file.name,
            medicineId: item.selectedMedicineId!,
          }
        });
        
        if (uploadRes.publicUrl) {
           const medicineToUpdate = medicines.find(m => m.id === item.selectedMedicineId)!;
           await updateMedFn({
             data: {
               id: item.selectedMedicineId!,
               data: {
                 name: medicineToUpdate.name,
                 salt: medicineToUpdate.salt,
                 brand: medicineToUpdate.brand,
                 mrp: medicineToUpdate.mrp,
                 packSize: medicineToUpdate.packSize,
                 dosageForm: medicineToUpdate.dosageForm,
                 prescriptionRequired: medicineToUpdate.prescriptionRequired,
                 inStock: medicineToUpdate.inStock,
                 imageUrl: uploadRes.publicUrl,
               }
             }
           });
           setItems(prev => prev.map(x => x.id === item.id ? { ...x, status: "success" } : x));
           successCount++;
        } else {
           throw new Error("Upload failed");
        }
      } catch (err: any) {
        setItems(prev => prev.map(x => x.id === item.id ? { ...x, status: "error", error: err.message } : x));
      }
    }
    
    setIsProcessing(false);
    toast.success(`Successfully uploaded ${successCount} images. Please refresh the page to see updates.`);
  };

  const pendingCount = items.filter(i => i.status === "pending" || i.status === "analyzing").length;
  const readyCount = items.filter(i => i.status === "mapped" && i.selectedMedicineId).length;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Bulk Image Uploader</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Drop your WhatsApp images here and quickly map them to the {medicinesMissingImages.length} medicines missing images.
        </p>
      </div>

      <label 
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-border bg-surface p-12 text-center transition-colors hover:border-primary hover:bg-primary-soft/30 cursor-pointer"
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
          <Upload size={24} />
        </div>
        <div className="text-base font-semibold text-foreground">Drag images here or click to upload</div>
        <div className="text-sm text-muted-foreground">JPG, PNG up to 10MB each. Upload up to 100 at a time.</div>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleFiles(e.target.files)}
          className="hidden"
        />
      </label>

      {items.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-lg font-semibold">
              Uploaded Images ({items.length})
            </h2>
            <div className="flex items-center gap-4">
              {pendingCount > 0 && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 size={16} className="animate-spin" />
                  AI processing {pendingCount} image(s)...
                </div>
              )}
              <button
                onClick={handleUploadAll}
                disabled={isProcessing || readyCount === 0}
                className="rounded bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {isProcessing ? "Uploading..." : `Save ${readyCount} Mapped Images`}
              </button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map(item => (
              <div key={item.id} className="flex flex-col gap-3 rounded-lg border bg-card p-3 shadow-sm">
                <div className="relative h-40 w-full overflow-hidden rounded-md border bg-muted">
                  <img src={item.dataUrl} alt="upload" className="h-full w-full object-cover" />
                  
                  {item.status !== "uploading" && item.status !== "success" && (
                    <button
                      onClick={() => setItems(prev => prev.filter(x => x.id !== item.id))}
                      className="absolute right-2 top-2 rounded-full bg-background/80 p-1.5 text-muted-foreground backdrop-blur-sm transition-colors hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <X size={14} />
                    </button>
                  )}

                  {item.status === "analyzing" && (
                     <div className="absolute inset-0 bg-background/50 flex flex-col items-center justify-center backdrop-blur-sm">
                       <Loader2 className="animate-spin text-primary" />
                       <span className="text-xs font-semibold mt-2">AI Reading Box...</span>
                     </div>
                  )}
                  {item.status === "success" && (
                     <div className="absolute inset-0 bg-success/20 flex flex-col items-center justify-center backdrop-blur-sm text-success">
                       <CheckCircle size={32} />
                       <span className="text-xs font-semibold mt-2">Saved!</span>
                     </div>
                  )}
                </div>

                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground truncate" title={item.file.name}>
                    {item.file.name}
                  </p>
                  
                  {item.status === "error" && item.error && (
                    <div className="mt-2 text-xs font-semibold text-destructive">
                      Error: {item.error}
                    </div>
                  )}

                  {item.aiGuess?.name && (
                    <div className="mt-2 text-[10px] uppercase tracking-wider font-semibold text-primary">
                      AI Saw: {item.aiGuess.name} {item.aiGuess.brand ? `(${item.aiGuess.brand})` : ''}
                    </div>
                  )}

                  <select
                    value={item.selectedMedicineId || ""}
                    onChange={(e) => setItems(prev => prev.map(x => x.id === item.id ? { ...x, selectedMedicineId: e.target.value } : x))}
                    disabled={item.status === "success" || item.status === "uploading"}
                    className="mt-2 w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
                  >
                    <option value="">-- Map to Medicine --</option>
                    {medicines.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.imageUrl ? "(Has Image)" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
