import { Pill, Droplet, Stethoscope, Sparkles, Baby, Activity } from "lucide-react";
import type { Medicine } from "@/lib/types";

const ICONS: Record<string, typeof Pill> = {
  prescription: Pill,
  otc: Pill,
  skincare: Sparkles,
  vitamins: Droplet,
  babycare: Baby,
  devices: Activity,
};

const DEFAULT_ACCENT = "#2563eb";

export function MedicineVisual({
  medicine,
  size = "md",
}: {
  medicine: Medicine;
  size?: "sm" | "md" | "lg";
}) {
  const Icon = Pill;
  const dim = size === "lg" ? "h-40" : size === "sm" ? "h-20" : "h-32";
  const iconSize = size === "lg" ? 56 : size === "sm" ? 28 : 40;

  return (
    <div
      className={`${dim} w-full rounded-lg flex items-center justify-center relative overflow-hidden`}
      style={{
        background: `linear-gradient(135deg, ${DEFAULT_ACCENT}15, ${DEFAULT_ACCENT}05)`,
      }}
      aria-hidden
    >
      <div
        className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20"
        style={{ background: DEFAULT_ACCENT }}
      />
      <div
        className="absolute -left-4 -bottom-4 h-16 w-16 rounded-full opacity-10"
        style={{ background: DEFAULT_ACCENT }}
      />
      <Icon size={iconSize} style={{ color: DEFAULT_ACCENT }} strokeWidth={1.5} />
      {size !== "sm" && (
        <div className="absolute bottom-2 left-3 text-[10px] font-medium uppercase tracking-wider text-foreground/50">
          {medicine.dosageForm}
        </div>
      )}
    </div>
  );
}

export function CategoryVisual({ id, size = 40 }: { id: string; size?: number }) {
  const Icon = ICONS[id] ?? Pill;
  return <Icon size={size} strokeWidth={1.5} className="text-primary" />;
}
