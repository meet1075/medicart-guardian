import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";
import { toast } from "sonner";
import { HeartPulse, Mail, Lock, User } from "lucide-react";
import { z } from "zod";

const searchSchema = z.object({
  redirect: z.string().optional().catch("/"),
});

export const Route = createFileRoute("/register")({
  validateSearch: searchSchema,
  component: RegisterPage,
});

function RegisterPage() {
  const { register, isRegistering, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const redirectUrl = redirect || "/";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await register({ name, email, password });
      toast.success("Account created successfully!");
      navigate({ to: redirectUrl });
    } catch (error: any) {
      toast.error(error.message || "Failed to register");
    }
  }

  return (
    <PublicLayout>
      <div className="container-page flex min-h-[70vh] items-center justify-center py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 shadow-xl">
          <div className="flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <HeartPulse size={24} />
            </div>
          </div>
          <h1 className="mt-6 text-center text-2xl font-bold text-foreground">Create an account</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Join MediCart for faster checkout and easy order tracking.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Full Name
              </label>
              <div className="relative mt-2">
                <User size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="John Doe"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email Address
              </label>
              <div className="relative mt-2">
                <Mail size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="you@example.com"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <label>Password</label>
              </div>
              <div className="relative mt-2">
                <Lock size={16} className="absolute left-3 top-3 text-muted-foreground" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-input bg-background py-2.5 pl-10 pr-3 text-sm outline-none focus:border-primary"
                  placeholder="At least 6 characters"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isRegistering}
              className="mt-2 w-full rounded-md bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isRegistering ? "Creating account..." : "Sign up"}
            </button>
          </form>

          <div className="relative mt-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-surface px-2 text-muted-foreground uppercase tracking-wider font-semibold">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={async () => {
              try {
                await loginWithGoogle(redirectUrl);
              } catch (error: any) {
                toast.error(error.message || "Failed to sign up with Google");
              }
            }}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-md border border-border bg-background py-2.5 text-sm font-semibold hover:bg-surface-muted transition-colors"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google
          </button>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" search={{ redirect: redirectUrl }} className="font-semibold text-primary hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
}
