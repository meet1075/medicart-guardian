import { Link, useNavigate } from "@tanstack/react-router";
import { ShoppingCart, User, Search, Cross, MapPin } from "lucide-react";
import { useStore } from "@/lib/store";
import { useState } from "react";

export function PublicHeader() {
  const { cartCount } = useStore();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="container-page flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:gap-6 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Cross size={20} strokeWidth={2.5} />
            </div>
            <div className="leading-tight">
              <div className="text-lg font-bold text-foreground">MediCart</div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Licensed Pharmacy
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-4 lg:hidden">
            <Link to="/track" aria-label="Track order" className="text-muted-foreground hover:text-foreground">
              <MapPin size={20} />
            </Link>
            <Link to="/cart" className="relative text-muted-foreground hover:text-foreground" aria-label="Cart">
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/shop", search: { q } });
          }}
          className="flex flex-1 items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
        >
          <Search size={18} className="ml-3 text-muted-foreground" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search medicine, salt, or brand — e.g. Dolo, Paracetamol"
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="mr-1 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Search
          </button>
        </form>

        <nav className="hidden items-center gap-5 text-sm font-medium text-foreground/80 lg:flex">
          <Link to="/shop" className="hover:text-primary">Shop</Link>
          <Link to="/track" className="hover:text-primary">Track Order</Link>
          <Link to="/admin" className="hover:text-primary">Staff</Link>
          <Link to="/cart" className="relative flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 hover:border-primary hover:text-primary">
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:border-primary hover:text-primary"
            aria-label="Account"
          >
            <User size={18} />
          </button>
        </nav>
      </div>
    </header>
  );
}
