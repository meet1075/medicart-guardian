import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { useStore } from "@/lib/store";
import { useOrders } from "@/hooks/use-orders";
import { useState } from "react";
import { MapPin } from "lucide-react";

export const Route = createFileRoute("/track")({
  head: () => ({
    meta: [
      { title: "Track your order — Obat Medicare" },
      { name: "description", content: "Track the status of your MediCart order." },
    ],
  }),
  component: TrackPage,
});

function TrackPage() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [q, setQ] = useState("");

  return (
    <PublicLayout>
      <div className="container-page py-10">
        <div className="mx-auto max-w-xl text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-soft text-primary">
            <MapPin size={26} />
          </div>
          <h1 className="mt-4 text-2xl font-bold md:text-3xl">Track your order</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your order number to see live status.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (q.trim()) navigate({ to: "/order/$id", params: { id: q.trim() } });
            }}
            className="mt-6 flex items-center rounded-xl border border-border bg-surface focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
          >
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Order number (e.g. MC...)"
              className="flex-1 bg-transparent px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              className="m-1 rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
            >
              Track
            </button>
          </form>
        </div>

        {orders.length > 0 && (
          <div className="mx-auto mt-12 max-w-2xl">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
              Your recent orders
            </h2>
            <div className="mt-3 space-y-2">
              {orders.slice(0, 5).map((o) => (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => navigate({ to: "/order/$id", params: { id: o.id } })}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-surface p-4 text-left hover:border-primary"
                >
                  <div>
                    <div className="font-mono text-sm font-bold">{o.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(o.createdAt).toLocaleString()} · {o.items.length} items
                    </div>
                  </div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-primary">
                    {o.status.replace("_", " ")}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}
