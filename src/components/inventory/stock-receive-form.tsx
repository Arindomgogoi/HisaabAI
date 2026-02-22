"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SIZE_SHORT } from "@/lib/constants";
import { receiveStock } from "@/app/(app)/inventory/actions";
import { toast } from "sonner";
import { Camera, Loader2, PackagePlus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { SizeUnit } from "@/generated/prisma";

interface Product {
  id: string;
  name: string;
  brand: string;
  size: SizeUnit;
  warehouseCases: number;
  shopBottles: number;
}

interface Props {
  products: Product[];
}

function normalizeName(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function matchProducts(
  ocrItems: { productName: string; cases: number }[],
  products: Product[]
): Record<string, number> {
  const result: Record<string, number> = {};
  for (const item of ocrItems) {
    const ocrNorm = normalizeName(item.productName);
    let best: Product | null = null;
    let bestScore = 0;
    for (const p of products) {
      const pNorm = normalizeName(p.name);
      const sizeLabel = SIZE_SHORT[p.size].toLowerCase().replace(/[^a-z0-9]/g, "");
      const combined = pNorm + " " + sizeLabel;
      // Exact match
      if (pNorm === ocrNorm) { best = p; bestScore = 100; break; }
      // OCR name contained in product name or vice versa
      if (combined.includes(ocrNorm) || ocrNorm.includes(pNorm)) {
        const score = pNorm.length;
        if (score > bestScore) { best = p; bestScore = score; }
      }
      // Token overlap
      const ocrTokens = ocrNorm.split(" ");
      const pTokens = pNorm.split(" ");
      const overlap = ocrTokens.filter((t) => pTokens.includes(t)).length;
      const overlapScore = overlap / Math.max(ocrTokens.length, pTokens.length);
      if (overlapScore >= 0.6 && overlapScore * 90 > bestScore) {
        best = p;
        bestScore = overlapScore * 90;
      }
    }
    if (best && bestScore > 0) {
      result[best.id] = item.cases;
    }
  }
  return result;
}

export function StockReceiveForm({ products }: Props) {
  const router = useRouter();
  const [entries, setEntries] = useState<Record<string, string>>({});
  const [ocrMatches, setOcrMatches] = useState<Set<string>>(new Set());
  const [ocrLoading, setOcrLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleChange(productId: string, value: string) {
    setEntries((prev) => ({ ...prev, [productId]: value }));
  }

  async function handleOcr(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setOcrLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch("/api/stock-ocr", { method: "POST", body: formData });
      if (!res.ok) throw new Error("OCR failed");
      const items: { productName: string; cases: number }[] = await res.json();
      if (!items.length) {
        toast.info("Could not extract items from image. Please enter manually.");
        return;
      }
      const matched = matchProducts(items, products);
      setEntries((prev) => {
        const next = { ...prev };
        for (const [id, cases] of Object.entries(matched)) {
          next[id] = String(cases);
        }
        return next;
      });
      setOcrMatches(new Set(Object.keys(matched)));
      toast.success(`Auto-filled ${Object.keys(matched).length} products from challan`);
    } catch {
      toast.error("Failed to scan challan. Please enter manually.");
    } finally {
      setOcrLoading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleSubmit() {
    const validEntries = Object.entries(entries)
      .map(([productId, v]) => ({ productId, cases: parseInt(v) || 0 }))
      .filter((e) => e.cases > 0);
    if (!validEntries.length) {
      toast.error("Enter cases for at least one product");
      return;
    }
    setSubmitting(true);
    const result = await receiveStock(validEntries);
    setSubmitting(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Stock updated for ${result.count} product${result.count === 1 ? "" : "s"}`);
      router.push("/inventory");
    }
  }

  return (
    <div className="space-y-4">
      {/* Header actions */}
      <div className="flex items-center justify-between gap-2">
        <Link href="/inventory">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={handleOcr}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={ocrLoading}
          >
            {ocrLoading ? (
              <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
            ) : (
              <Camera className="w-4 h-4 mr-1.5" />
            )}
            {ocrLoading ? "Scanning..." : "Scan Challan"}
          </Button>
        </div>
      </div>

      {/* Product list */}
      <div className="rounded-lg border divide-y">
        {products.map((p) => {
          const isMatched = ocrMatches.has(p.id);
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 px-4 py-3 ${isMatched ? "bg-amber-50 dark:bg-amber-950/20" : ""}`}
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {p.name}{" "}
                  <span className="text-muted-foreground font-normal">
                    {SIZE_SHORT[p.size]}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Warehouse: {p.warehouseCases} cs &middot; Shop: {p.shopBottles} btl
                </p>
              </div>
              {isMatched && (
                <Badge variant="secondary" className="text-xs shrink-0">OCR</Badge>
              )}
              <Input
                type="number"
                min="0"
                placeholder="0"
                value={entries[p.id] ?? ""}
                onChange={(e) => handleChange(p.id, e.target.value)}
                className="w-20 h-8 text-sm text-center shrink-0"
              />
              <span className="text-xs text-muted-foreground shrink-0">cs</span>
            </div>
          );
        })}
        {products.length === 0 && (
          <p className="text-center py-8 text-muted-foreground text-sm">
            No products found. Add products in Inventory first.
          </p>
        )}
      </div>

      {/* Submit */}
      <Button
        className="w-full bg-amber-500 hover:bg-amber-600 text-white h-11"
        onClick={handleSubmit}
        disabled={submitting || products.length === 0}
      >
        {submitting ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <PackagePlus className="w-4 h-4 mr-2" />
        )}
        Update Warehouse Stock
      </Button>
    </div>
  );
}
