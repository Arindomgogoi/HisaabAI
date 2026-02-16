"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SIZE_SHORT, CATEGORY_LABELS } from "@/lib/constants";
import { formatINR } from "@/lib/formatters";
import { Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CartProduct } from "@/hooks/use-cart";
import type { ProductCategory } from "@/generated/prisma";

interface ProductSearchProps {
  products: CartProduct[];
  onAddItem: (product: CartProduct) => void;
}

const CATEGORIES: (ProductCategory | "ALL")[] = [
  "ALL",
  "WHISKY",
  "RUM",
  "VODKA",
  "GIN",
  "BRANDY",
  "WINE",
  "BEER",
];

export function ProductSearch({ products, onAddItem }: ProductSearchProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ProductCategory | "ALL">("ALL");

  const filtered = useMemo(() => {
    let result = products;
    if (category !== "ALL") {
      result = result.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, search, category]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-2.5 py-1 text-xs rounded-full whitespace-nowrap transition-colors",
              category === cat
                ? "bg-amber-500 text-white"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {cat === "ALL" ? "All" : CATEGORY_LABELS[cat]}
          </button>
        ))}
      </div>

      <div className="space-y-1 max-h-[calc(100vh-340px)] overflow-y-auto">
        {filtered.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-8">
            No products found
          </p>
        )}
        {filtered.map((p) => (
          <button
            key={p.id}
            onClick={() => onAddItem(p)}
            className="w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group"
          >
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">
                {p.brand} &middot; {SIZE_SHORT[p.size]} &middot;{" "}
                {p.shopBottles} in stock
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0 ml-2">
              <span className="text-sm font-semibold">{formatINR(p.mrp)}</span>
              <div className="w-6 h-6 rounded-full bg-amber-500/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-3.5 h-3.5 text-amber-600" />
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
