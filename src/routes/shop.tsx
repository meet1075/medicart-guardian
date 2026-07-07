import { createFileRoute } from "@tanstack/react-router";
import { PublicLayout } from "@/components/PublicLayout";
import { MedicineCard } from "@/components/MedicineCard";
import { CATEGORIES, HEALTH_CONCERNS, MEDICINES } from "@/lib/medicines";
import { useMemo, useState } from "react";
import { z } from "zod";

const searchSchema = z.object({
  q: z.string().optional(),
  category: z.string().optional(),
  concern: z.string().optional(),
});

export const Route = createFileRoute("/shop")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Shop medicines — MediCart" },
      {
        name: "description",
        content:
          "Browse prescription and OTC medicines, vitamins, skincare, baby care, and health devices — verified by our pharmacist.",
      },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  const { q, category, concern } = Route.useSearch();
  const [rxFilter, setRxFilter] = useState<"all" | "rx" | "otc">("all");
  const [maxPrice, setMaxPrice] = useState<number>(3000);
  const [sortBy, setSortBy] = useState<"popular" | "price-asc" | "price-desc" | "discount">("popular");
  const [query, setQuery] = useState(q ?? "");

  const results = useMemo(() => {
    let list = [...MEDICINES];
    if (category) list = list.filter((m) => m.category === category);
    if (concern) list = list.filter((m) => m.healthConcern.includes(concern as never));
    if (rxFilter !== "all") list = list.filter((m) => (rxFilter === "rx" ? m.prescriptionRequired : !m.prescriptionRequired));
    if (query) {
      const nq = query.toLowerCase();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(nq) ||
          m.salt.toLowerCase().includes(nq) ||
          m.brand.toLowerCase().includes(nq),
      );
    }
    list = list.filter((m) => m.price <= maxPrice);
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        list.sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
        break;
    }
    return list;
  }, [category, concern, rxFilter, query, maxPrice, sortBy]);

  const activeCategory = CATEGORIES.find((c) => c.id === category);
  const activeConcern = HEALTH_CONCERNS.find((c) => c.id === concern);

  return (
    <PublicLayout>
      <div className="container-page py-6">
        <div className="text-xs text-muted-foreground">
          Home <span className="mx-1">/</span> Shop
          {activeCategory && (
            <>
              <span className="mx-1">/</span> {activeCategory.label}
            </>
          )}
        </div>
        <h1 className="mt-2 text-2xl font-bold text-foreground md:text-3xl">
          {activeCategory?.label ?? activeConcern?.label ?? "All medicines"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {results.length} products {query && `matching "${query}"`}
        </p>
      </div>

      <div className="container-page grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="space-y-5 rounded-xl border border-border bg-surface p-5 lg:sticky lg:top-24 lg:self-start">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Search</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g. Dolo"
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Prescription</div>
            <div className="mt-2 flex flex-col gap-2 text-sm">
              {(["all", "rx", "otc"] as const).map((k) => (
                <label key={k} className="flex items-center gap-2">
                  <input type="radio" checked={rxFilter === k} onChange={() => setRxFilter(k)} className="accent-primary" />
                  {k === "all" ? "All" : k === "rx" ? "Prescription only" : "OTC only"}
                </label>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Max price</div>
              <div className="text-xs font-semibold text-foreground">₹{maxPrice}</div>
            </div>
            <input
              type="range"
              min={30}
              max={3000}
              step={20}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </div>

          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sort by</div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="mt-2 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            >
              <option value="popular">Popularity</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="discount">Best discount</option>
            </select>
          </div>
        </aside>

        <div>
          {results.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface p-12 text-center">
              <p className="text-sm text-muted-foreground">No medicines match your filters.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4">
              {results.map((m) => (
                <MedicineCard key={m.id} medicine={m} />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="pb-16" />
    </PublicLayout>
  );
}
