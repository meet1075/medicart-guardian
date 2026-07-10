import { createFileRoute } from "@tanstack/react-router";
import { useUsers } from "@/hooks/use-users";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Shield, ShieldAlert, UserIcon } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/admin/dashboard/users")({
  component: UsersPage,
});

function UsersPage() {
  const { users, isLoading, updateUserRole } = useUsers();
  const { user: currentUser } = useAuth();
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q) return users;
    const search = q.toLowerCase();
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(search) ||
        u.email.toLowerCase().includes(search) ||
        u.id.toLowerCase().includes(search)
    );
  }, [users, q]);

  async function handleRoleChange(userId: string, currentRole: string) {
    if (userId === currentUser?.id) {
      toast.error("You cannot change your own role.");
      return;
    }
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    
    // Add a confirmation for removing admin role
    if (newRole === "USER") {
      if (!confirm("Are you sure you want to revoke Admin access for this user?")) {
        return;
      }
    }

    try {
      await updateUserRole({ id: userId, role: newRole });
      toast.success(`User role updated to ${newRole}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    }
  }

  return (
    <div className="flex h-full flex-col pb-6">
      <div className="shrink-0 pb-4">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="mt-1 text-sm text-muted-foreground">{filtered.length} total users</p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, or ID..."
            className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-xl border border-border bg-surface overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-surface-muted text-left text-xs uppercase tracking-wider text-muted-foreground z-10 border-b border-border shadow-sm">
            <tr>
              <th className="px-4 py-3">User Details</th>
              <th className="px-4 py-3">User ID</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground animate-pulse">
                  Loading users...
                </td>
              </tr>
            )}
            {!isLoading && filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="p-10 text-center text-sm text-muted-foreground">
                  No users match this filter.
                </td>
              </tr>
            )}
            {filtered.map((u) => {
              const isSelf = u.id === currentUser?.id;
              
              return (
                <tr key={u.id} className="transition-colors hover:bg-surface-muted/60">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-foreground flex items-center gap-2">
                      {u.name}
                      {isSelf && (
                        <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                    {u.id}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground text-xs">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                        <Shield size={14} /> Admin
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                        <UserIcon size={14} /> User
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleRoleChange(u.id, u.role)}
                      disabled={isSelf}
                      className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
                        isSelf 
                          ? "opacity-50 cursor-not-allowed bg-surface-muted text-muted-foreground" 
                          : u.role === "ADMIN"
                            ? "border border-destructive text-destructive hover:bg-destructive/10"
                            : "bg-primary text-primary-foreground hover:bg-primary/90"
                      }`}
                    >
                      {u.role === "ADMIN" ? (
                        <>
                          <ShieldAlert size={14} /> Revoke Admin
                        </>
                      ) : (
                        <>
                          <Shield size={14} /> Make Admin
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
