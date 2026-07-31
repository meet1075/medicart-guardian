import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { ShoppingCart, Search, MapPin, Menu, X } from "lucide-react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { useMedicines } from "@/hooks/use-medicines";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const NAV_LINKS = [
  { to: "/about", label: "About" },
  { to: "/shop", label: "Shop" },
  { to: "/track", label: "Track Order" },
  { to: "/contact", label: "Contact" },
] as const;

export function PublicHeader() {
  const { cartCount } = useStore();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [q, setQ] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout, isLoading: authLoading } = useAuth();
  const { medicines } = useMedicines();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredMedicines = q.trim()
    ? medicines
        .filter(
          (m) =>
            m.name.toLowerCase().includes(q.toLowerCase()) ||
            m.salt.toLowerCase().includes(q.toLowerCase()) ||
            m.brand.toLowerCase().includes(q.toLowerCase())
        )
        .sort((a, b) => {
          const qLower = q.toLowerCase();
          const aStarts = a.name.toLowerCase().startsWith(qLower) ? 1 : 0;
          const bStarts = b.name.toLowerCase().startsWith(qLower) ? 1 : 0;
          if (aStarts !== bStarts) return bStarts - aStarts;

          const aIncludes = a.name.toLowerCase().includes(qLower) ? 1 : 0;
          const bIncludes = b.name.toLowerCase().includes(qLower) ? 1 : 0;
          return bIncludes - aIncludes;
        })
        .slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      {/* ── Top bar ── */}
      <div className="container-page flex flex-col gap-3 py-3 lg:flex-row lg:items-center lg:gap-6 lg:py-4">
        {/* Logo + mobile controls */}
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center">
            <img src="/logo.svg" alt="Obat Medicare" width={160} height={40} className="h-10 w-auto object-contain" />
          </Link>

          <div className="flex items-center gap-3 lg:hidden">
            <Link
              to="/track"
              aria-label="Track order"
              className="text-muted-foreground hover:text-foreground"
            >
              <MapPin size={20} />
            </Link>
            <Link
              to="/cart"
              className="relative text-muted-foreground hover:text-foreground"
              aria-label="Cart"
            >
              <ShoppingCart size={22} />
              {cartCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen((v) => !v)}
              className="text-muted-foreground hover:text-foreground"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div ref={searchContainerRef} className="relative flex flex-1 max-w-lg">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsFocused(false);
              navigate({ to: "/shop", search: { q } });
            }}
            className="flex w-full flex-1 items-center rounded-lg border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          >
            <Search size={18} className="ml-3 text-muted-foreground" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search medicine, salt, or brand"
              className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="mr-1 rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Search
            </button>
          </form>

          {/* Search Dropdown */}
          {isFocused && q.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-2 z-50 overflow-hidden rounded-lg border border-border bg-background shadow-xl">
              {filteredMedicines.length > 0 ? (
                <ul className="py-2">
                  {filteredMedicines.map((med) => (
                    <li key={med.id}>
                      <Link
                        to="/product/$id"
                        params={{ id: med.id }}
                        onClick={() => {
                          setIsFocused(false);
                          setQ("");
                        }}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-surface-muted transition-colors"
                      >
                        <Search size={16} className="text-muted-foreground shrink-0" />
                        <div className="flex flex-col overflow-hidden">
                          <span className="text-sm font-medium text-foreground truncate">{med.name}</span>
                          <span className="text-xs text-muted-foreground truncate">{med.salt}</span>
                        </div>
                      </Link>
                    </li>
                  ))}
                  <li className="border-t border-border mt-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsFocused(false);
                        navigate({ to: "/shop", search: { q } });
                      }}
                      className="w-full text-center px-4 py-2 text-sm font-medium text-primary hover:underline"
                    >
                      See all results for "{q}"
                    </button>
                  </li>
                </ul>
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">
                  No products found for "{q}"
                </div>
              )}
            </div>
          )}
        </div>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.to || pathname.startsWith(link.to + "/");
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary-soft text-primary"
                    : "text-foreground/70 hover:bg-surface-muted hover:text-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
          <Link
            to="/cart"
            className="relative ml-1 flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-foreground/70 hover:border-primary hover:text-primary"
          >
            <ShoppingCart size={16} />
            Cart
            {cartCount > 0 && (
              <span className="ml-1 rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                {cartCount}
              </span>
            )}
          </Link>

          {authLoading ? (
            <div className="ml-3 h-8 w-8 rounded-full bg-surface-muted animate-pulse" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="ml-3 outline-none">
                <Avatar className="h-8 w-8 cursor-pointer border border-primary/20 hover:border-primary/50">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </div>
                <DropdownMenuSeparator />
                {user.role === "ADMIN" && (
                  <DropdownMenuItem onClick={() => navigate({ to: "/admin" })}>
                    Admin Dashboard
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate({ to: "/track" })}>
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                  onClick={async () => {
                    await logout();
                    toast.success("Logged out");
                  }}
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="ml-3 flex items-center gap-2">
              <Link
                to="/login"
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-foreground/70 hover:bg-surface-muted hover:text-foreground"
              >
                Log in
              </Link>
              <Link
                to="/login"
                className="whitespace-nowrap rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div className="border-t border-border bg-surface lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.to || pathname.startsWith(link.to + "/");
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary-soft text-primary"
                      : "text-foreground/70 hover:bg-surface-muted"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              to="/cart"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium text-foreground/70 hover:bg-surface-muted"
            >
              <ShoppingCart size={16} /> Cart
              {cartCount > 0 && (
                <span className="rounded-full bg-primary px-1.5 text-[11px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
            {user?.role === "ADMIN" && (
              <Link
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-medium text-foreground/70 hover:bg-surface-muted"
              >
                Staff / Admin
              </Link>
            )}
            
            {!authLoading && !user && (
              <div className="mt-2 grid grid-cols-2 gap-2 border-t border-border pt-4">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-medium text-background"
                >
                  Sign up
                </Link>
              </div>
            )}
            
            {user && (
              <div className="mt-2 border-t border-border pt-4 px-4 text-sm">
                <div className="font-semibold">{user.name}</div>
                <div className="text-xs text-muted-foreground">{user.email}</div>
                <button
                  type="button"
                  className="mt-3 w-full rounded-md border border-destructive/20 bg-destructive/10 py-2 text-xs font-semibold text-destructive"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                >
                  Log out
                </button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
