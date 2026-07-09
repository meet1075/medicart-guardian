import { createFileRoute } from "@tanstack/react-router";
import { useMedicines } from "@/hooks/use-medicines";
import { useState } from "react";
import { Plus, Edit2, Trash2, Search, X } from "lucide-react";
import { toast } from "sonner";
import type { Medicine } from "@prisma/client";

export const Route = createFileRoute("/admin/dashboard/medicines")({
  component: MedicinesAdminPage,
});

function MedicinesAdminPage() {
  const { medicines, isLoading, deleteMedicine, createMedicine, updateMedicine, isCreating, isUpdating } = useMedicines();
  const [q, setQ] = useState("");
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const filteredMedicines = medicines.filter(
    (m) =>
      m.name.toLowerCase().includes(q.toLowerCase()) ||
      m.salt.toLowerCase().includes(q.toLowerCase()) ||
      m.id.toLowerCase().includes(q.toLowerCase())
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
    return <div className="p-10 text-center text-muted-foreground animate-pulse">Loading medicines...</div>;
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
                <th className="px-4 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Price</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold">Stock</th>
                <th className="px-4 py-3 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredMedicines.map((m) => (
                <tr key={m.id} className="hover:bg-surface-muted/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold">{m.name}</div>
                    <div className="text-xs text-muted-foreground">{m.salt}</div>
                    {m.prescriptionRequired && (
                      <span className="mt-1 inline-block rounded border border-warning/30 bg-warning/10 px-1 text-[10px] font-bold text-warning-foreground">
                        Rx Required
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-semibold">₹{m.price.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className="rounded-full bg-primary-soft/50 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      {m.category}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${m.inStock ? "bg-success" : "bg-destructive"}`} />
                      <span>{m.inStock ? m.stockQty : "Out of stock"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(m)} className="rounded p-1.5 text-muted-foreground hover:bg-surface-muted hover:text-foreground">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(m.id)} className="rounded p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
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

function MedicineEditorModal({ medicine, onClose, onSubmit, isSaving }: { medicine: Medicine | null, onClose: () => void, onSubmit: (data: any) => void, isSaving: boolean }) {
  const [formData, setFormData] = useState({
    name: medicine?.name || "",
    salt: medicine?.salt || "",
    brand: medicine?.brand || "",
    manufacturer: medicine?.manufacturer || "",
    category: medicine?.category || "otc",
    price: medicine?.price || 0,
    mrp: medicine?.mrp || 0,
    packSize: medicine?.packSize || "",
    dosageForm: medicine?.dosageForm || "",
    prescriptionRequired: medicine?.prescriptionRequired || false,
    uses: medicine?.uses || "",
    howToUse: medicine?.howToUse || "",
    sideEffects: medicine?.sideEffects || "",
    safety: medicine?.safety || "",
    accent: medicine?.accent || "emerald",
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : type === "number" ? parseFloat(value) || 0 : value,
    }));
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(formData);
  }

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
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Name</label>
              <input required name="name" value={formData.name} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Salt / Active Ingredients</label>
              <input required name="salt" value={formData.salt} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Brand</label>
              <input required name="brand" value={formData.brand} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Manufacturer</label>
              <input required name="manufacturer" value={formData.manufacturer} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Category</label>
              <select name="category" value={formData.category} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary">
                <option value="rx">Rx</option>
                <option value="otc">OTC</option>
                <option value="dermatology">Dermatology</option>
                <option value="supplements">Supplements</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Dosage Form</label>
              <input required name="dosageForm" value={formData.dosageForm} onChange={handleChange} placeholder="e.g. Tablet, Syrup" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Price (₹)</label>
              <input required type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">MRP (₹)</label>
              <input required type="number" step="0.01" name="mrp" value={formData.mrp} onChange={handleChange} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Pack Size</label>
              <input required name="packSize" value={formData.packSize} onChange={handleChange} placeholder="e.g. 10 Tablets" className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="flex items-center gap-2 pt-6">
              <input type="checkbox" id="rxReq" name="prescriptionRequired" checked={formData.prescriptionRequired} onChange={handleChange} className="accent-primary" />
              <label htmlFor="rxReq" className="text-sm font-semibold">Prescription Required</label>
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Uses</label>
              <textarea required name="uses" value={formData.uses} onChange={handleChange} rows={2} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">How to use</label>
              <textarea required name="howToUse" value={formData.howToUse} onChange={handleChange} rows={2} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Side effects</label>
              <textarea required name="sideEffects" value={formData.sideEffects} onChange={handleChange} rows={2} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-xs font-semibold text-muted-foreground">Safety / Warnings</label>
              <textarea required name="safety" value={formData.safety} onChange={handleChange} rows={2} className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
          </form>
        </div>
        <div className="flex items-center justify-end gap-3 border-t border-border px-6 py-4">
          <button type="button" onClick={onClose} className="rounded-md border border-border px-4 py-2 text-sm font-semibold hover:bg-surface-muted">
            Cancel
          </button>
          <button type="submit" form="medicine-form" disabled={isSaving} className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50">
            {isSaving ? "Saving..." : "Save Medicine"}
          </button>
        </div>
      </div>
    </div>
  );
}
