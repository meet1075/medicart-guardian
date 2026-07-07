import { ShieldCheck, PackageCheck, Truck, Lock } from "lucide-react";

const ITEMS = [
  { icon: ShieldCheck, title: "Licensed Pharmacy", desc: "Regulated & compliant" },
  { icon: PackageCheck, title: "100% Genuine", desc: "Sourced from verified brands" },
  { icon: Truck, title: "Fast Delivery", desc: "In as little as 24 hours" },
  { icon: Lock, title: "Secure Payment", desc: "Encrypted & PCI-compliant" },
];

export function TrustStrip() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {ITEMS.map(({ icon: Icon, title, desc }) => (
        <div key={title} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4">
          <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-primary-soft text-primary">
            <Icon size={20} />
          </div>
          <div>
            <div className="text-sm font-semibold text-foreground">{title}</div>
            <div className="text-xs text-muted-foreground">{desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
