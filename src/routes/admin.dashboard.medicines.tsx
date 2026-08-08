/* eslint-disable @typescript-eslint/no-explicit-any */
import { createFileRoute } from "@tanstack/react-router";
import { useMedicines } from "@/hooks/use-medicines";
import { useState, useRef } from "react";
import { Plus, Edit2, Trash2, Search, X, Upload, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import type { Medicine } from "@prisma/client";
import { uploadMedicineImageFn } from "@/api/upload";

export const Route = createFileRoute("/admin/dashboard/medicines")({
  component: MedicinesAdminPage,
});

function MedicinesAdminPage() {
  const {
    medicines,
    isLoading,
    deleteMedicine,
    createMedicine,
    updateMedicine,
    isCreating,
    isUpdating,
  } = useMedicines();
  const [q, setQ] = useState("");
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.salt.toLowerCase().includes(q.toLowerCase()) ||
      m.id.toLowerCase().includes(q.toLowerCase()),
  );

  async function handleDelete(id: string) {
    if (confirm("Are you sure you want to delete this medicine?")) {
      try {
        await deleteMedicine(id);
        toast.success("Medicine deleted successfully");
      } catch (e) {
        toast.error("Failed to delete medicine");
      }
    }
  }

  function handleEdit(m: Medicine) {
    setEditingMedicine(m);
    setIsAdding(false);
  }

  function handleAddNew() {
    setEditingMedicine(null);
    setIsAdding(true);
  }

  function closeEditor() {
    setEditingMedicine(null);
    setIsAdding(false);
  }

  async function handleSubmit(data: any) {
    try {
      if (isAdding) {
        await createMedicine(data);
        toast.success("Medicine created successfully");
      } else if (editingMedicine) {
        await updateMedicine({ id: editingMedicine.id, data });
        toast.success("Medicine updated successfully");
      }
      closeEditor();
    } catch (e: any) {
      toast.error(e.message || "Failed to save medicine");
    }
  }

  if (isLoading) {
    return (
      <div className="p-10 text-center text-muted-foreground animate-pulse">
        Loading medicines...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medicines</h1>
          <p className="text-sm text-muted-foreground">Manage your product catalog.</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      <div className="flex items-center gap-3 rounded-lg border border-border bg-surface px-4 py-2 focus-within:border-primary">
        <Search size={18} className="text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by name, salt, or ID..."
          className="flex-1 bg-transparent text-sm outline-none"
        />
      </div>

      <div className="rounded-xl border border-border bg-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-border bg-surface-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Image</th>
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">MRP</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMedicines.map((m) => (
                <tr key={m.id} className="hover:bg-surface-muted/60">
                  <td className="px-4 py-3">
                    {(m as any).imageUrl ? (
                      <img
                        src={(m as any).imageUrl}
                        alt={m.name}
                        className="h-10 w-10 rounded-lg object-cover border border-border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-surface-muted flex items-center justify-center border border-border">
                        <ImageIcon size={16} className="text-muted-foreground" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.salt}</div>
                    {m.prescriptionRequired && (
                      <span className="mt-1 inline-block rounded border border-warning/30 bg-warning/10 px-1 text-[10px] font-bold text-warning-foreground">
                        Rx Required
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">₹{m.mrp.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className={`h-2 w-2 rounded-full ${m.inStock ? "bg-success" : "bg-destructive"}`}
                      />
                      <span>{m.inStock ? "In Stock" : "Out of stock"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(m)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(m.id)}
                        className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMedicines.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No medicines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(isAdding || editingMedicine) && (
        <MedicineEditorModal
          medicine={editingMedicine}
          onClose={closeEditor}
          onSubmit={handleSubmit}
          isSaving={isCreating || isUpdating}
        />
      )}
    </div>
  );
}

function MedicineEditorModal({
  medicine,
  onClose,
  onSubmit,
  isSaving,
}: {
  medicine: Medicine | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSaving: boolean;
}) {
  const [formData, setFormData] = useState({
    name: medicine?.name || "",
    salt: medicine?.salt || "",
    brand: medicine?.brand || "",
    mrp: medicine?.mrp || 0,
    packSize: medicine?.packSize || "",
    dosageForm: medicine?.dosageForm || "",
    category: (medicine as any)?.category || "general",
    prescriptionRequired: medicine?.prescriptionRequired ?? true,
    inStock: medicine?.inStock ?? true,
    imageUrl: (medicine as any)?.imageUrl || null as string | null,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(
    (medicine as any)?.imageUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : type === "number"
            ? parseFloat(value) || 0
            : value,
    }));
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5 MB");
      return;
    }
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: null }));
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();

    let finalImageUrl = formData.imageUrl;

    // If a new file was selected, upload it first
    if (imageFile) {
      setIsUploading(true);
      try {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(imageFile);
        });

        // We need a stable ID: use existing medicine ID or a temp one
        const tempId = medicine?.id ?? `new-${Date.now()}`;
        const result = await uploadMedicineImageFn({
          data: {
            fileBase64: base64,
            fileName: imageFile.name,
            medicineId: tempId,
          },
        });
        finalImageUrl = result.publicUrl;
        toast.success("Image uploaded!");
      } catch (err: any) {
        toast.error(err.message || "Image upload failed");
        setIsUploading(false);
        return;
      }
      setIsUploading(false);
    }

    onSubmit({ ...formData, imageUrl: finalImageUrl });
  }

  const busy = isSaving || isUploading;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-bold">{medicine ? "Edit Medicine" : "Add New Medicine"}</h2>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-surface-muted">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6">
          <form id="medicine-form" onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
            {/* Image Upload */}
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Medicine Image (optional)
              </label>
              <div className="flex items-start gap-4">
                {/* Preview */}
                <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-border bg-surface-muted">
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute right-1 top-1 rounded-full bg-destructive p-0.5 text-white shadow"
                      >
                        <X size={12} />
                      </button>
                    </>
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted-foreground">
                      <ImageIcon size={24} />
                      <span className="text-[10px]">No image</span>
                    </div>
                  )}
                </div>

                {/* Upload button */}
                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm font-semibold hover:bg-surface-muted"
                  >
                    <Upload size={14} />
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </button>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WebP · max 5 MB
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Name</label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Salt */}
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Salt / Active Ingredients
              </label>
              <input
                required
                name="salt"
                value={formData.salt}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Brand */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Brand</label>
              <input
                required
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Dosage Form */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Dosage Form
              </label>
              <input
                required
                name="dosageForm"
                value={formData.dosageForm}
                onChange={handleChange}
                placeholder="e.g. Tablet, Syrup"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Category */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Category
              </label>
              <select
                name="category"
                value={(formData as any).category || "general"}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              >
                <option value="general">General Medicine</option>
                <option value="dermatology">Dermatology</option>
                <option value="cardiac">Cardiac-Diabetic</option>
                <option value="ortho">Orthopaedics</option>
                <option value="gastro">Gastroenterology</option>
                <option value="gynae">Gynaecology</option>
              </select>
            </div>

            {/* MRP */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                MRP (₹)
              </label>
              <input
                required
                type="number"
                step="0.01"
                name="mrp"
                value={formData.mrp}
                onChange={handleChange}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Pack Size */}
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">
                Pack Size
              </label>
              <input
                required
                name="packSize"
                value={formData.packSize}
                onChange={handleChange}
                placeholder="e.g. 10 Tablets"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>

            {/* Checkboxes */}
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="rxReq"
                name="prescriptionRequired"
                checked={formData.prescriptionRequired}
                onChange={handleChange}
                className="accent-primary"
              />
              <label htmlFor="rxReq" className="text-sm font-semibold">
                Prescription Required
              </label>
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input
                type="checkbox"
                id="inStock"
                name="inStock"
                checked={formData.inStock}
                onChange={handleChange}
                className="accent-primary"
              />
              <label htmlFor="inStock" className="text-sm font-semibold">
                In Stock
              </label>
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-muted"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="medicine-form"
            disabled={busy}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isUploading ? "Uploading image..." : isSaving ? "Saving..." : "Save Medicine"}
          </button>
        </div>
      </div>
    </div>
  );
}
