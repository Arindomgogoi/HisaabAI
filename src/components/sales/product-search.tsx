"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
  const inputRef = useRef<HTMLInputElement>(null);

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

  // Press "/" to focus search, Escape to clear
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "/") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setSearch("");
      inputRef.current?.blur();
    }
    if (e.key === "Enter" && filtered.length > 0) {
      onAddItem(filtered[0]);
    }
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          ref={inputRef}
          placeholder='Search products… (press "/" to focus)'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleKeyDown}
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
        {filtered.map((p, i) => (
          <button
            key={p.id}
            onClick={() => onAddItem(p)}
            className={cn(
              "w-full flex items-center justify-between p-2.5 rounded-lg hover:bg-muted/50 transition-colors text-left group",
              i === 0 && search ? "ring-1 ring-amber-300 bg-amber-50/50 dark:bg-amber-950/10" : ""
            )}
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

      {products.length > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          Press <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">/</kbd> to search &middot;{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Enter</kbd> to add top result &middot;{" "}
          <kbd className="px-1 py-0.5 rounded bg-muted font-mono text-[10px]">Esc</kbd> to clear
        </p>
      )}
    </div>
  );
}
