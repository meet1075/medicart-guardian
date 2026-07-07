import { Cross, ShieldCheck, Truck, Lock } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function PublicFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-surface-muted">
      <div className="container-page grid gap-8 py-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cross size={16} strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold">MediCart</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            A licensed online pharmacy delivering genuine, pharmacist-verified medicines.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Shop</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/shop" className="hover:text-primary">All medicines</Link></li>
            <li><Link to="/shop" search={{ category: "prescription" }} className="hover:text-primary">Prescription</Link></li>
            <li><Link to="/shop" search={{ category: "vitamins" }} className="hover:text-primary">Vitamins</Link></li>
            <li><Link to="/shop" search={{ category: "devices" }} className="hover:text-primary">Devices</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Support</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/track" className="hover:text-primary">Track your order</Link></li>
            <li>Help & FAQs</li>
            <li>Contact pharmacist</li>
            <li>Return policy</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Trust</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><ShieldCheck size={16} className="text-primary" /> Licensed pharmacy</li>
            <li className="flex items-center gap-2"><Truck size={16} className="text-primary" /> Fast delivery</li>
            <li className="flex items-center gap-2"><Lock size={16} className="text-primary" /> Secure payment</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} MediCart. For demonstration purposes only — always consult a doctor.
      </div>
    </footer>
  );
}
