import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { Cross, Lock } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/")({
  head: () => ({
    meta: [{ title: "Admin sign in — MediCart" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const { adminEmail, adminLogin } = useStore();
  const navigate = useNavigate();
  const [email, setEmail] = useState("pharmacist@medicart.demo");
  const [password, setPassword] = useState("demo-password");

  useEffect(() => {
    if (adminEmail) navigate({ to: "/admin/dashboard", replace: true });
  }, [adminEmail, navigate]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@") || password.length < 6) {
      toast.error("Enter a valid email and password (6+ chars)");
      return;
    }
    adminLogin(email);
    navigate({ to: "/admin/dashboard" });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-muted px-4">
      <div className="w-full max-w-md">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Cross size={22} strokeWidth={2.5} />
          </div>
          <h1 className="mt-3 text-2xl font-bold">MediCart Admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Staff sign-in for pharmacists and operators
          </p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4 rounded-xl border border-border bg-surface p-6">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <button
            type="submit"
            className="mt-2 w-full rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Sign in
          </button>
          <div className="flex items-start gap-2 rounded-lg bg-surface-muted p-3 text-xs text-muted-foreground">
            <Lock size={14} className="mt-0.5 flex-none" />
            <div>
              Demo sign-in — any email/password (6+ chars) works. In production this would be linked to
              a real staff auth system with role-based access.
            </div>
          </div>
          <div className="text-center text-xs">
            <Link to="/" className="text-muted-foreground hover:text-primary">
              ← Back to MediCart
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
