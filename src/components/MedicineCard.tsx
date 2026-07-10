import { Link } from "@tanstack/react-router";
import type { Medicine } from "@/lib/types";
import { MedicineVisual } from "./MedicineVisual";
import { FileText, ShieldCheck } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

export function MedicineCard({ medicine }: { medicine: Medicine }) {
  const { addToCart } = useStore();
  const off = Math.max(0, Math.round(((medicine.mrp - medicine.price) / medicine.mrp) * 100));

  return (
    <div className="group flex flex-col rounded-xl border border-border bg-card p-3 transition-all hover:border-primary/40 hover:shadow-md">
      <Link to="/product/$id" params={{ id: medicine.id }} className="block">
        <MedicineVisual medicine={medicine} />
      </Link>

      <div className="mt-3 flex-1">
        {medicine.prescriptionRequired ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-warning-foreground">
            <FileText size={11} /> Rx Required
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-success">
            <ShieldCheck size={11} /> OTC
          </span>
        )}

        <Link to="/product/$id" params={{ id: medicine.id }} className="mt-2 block">
          <h3 className="line-clamp-2 text-sm font-semibold text-foreground group-hover:text-primary">
            {medicine.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{medicine.salt}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{medicine.packSize}</p>
        </Link>
      </div>

      <div className="mt-3 flex items-end justify-between gap-2">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-base font-bold text-foreground">₹{medicine.price}</span>
            {off > 0 && (
              <span className="text-xs text-muted-foreground line-through">₹{medicine.mrp}</span>
            )}
          </div>
          {off > 0 && (
            <div className="text-[10px] font-semibold text-success">{off}% off</div>
          )}
        </div>
        <button
          type="button"
          disabled={!medicine.inStock}
          onClick={() => {
            if (!medicine.inStock) return;
            addToCart(medicine.id);
            toast.success(`${medicine.name} added to cart`);
          }}
          className={`rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors ${
            medicine.inStock 
              ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground" 
              : "border-border text-muted-foreground opacity-50 cursor-not-allowed"
          }`}
        >
          {medicine.inStock ? "Add" : "Out of stock"}
        </button>
      </div>
    </div>
  );
}
