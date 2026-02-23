"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SIZE_SHORT } from "@/lib/constants";
import { stockCount } from "@/app/(app)/inventory/actions";
import { toast } from "sonner";
import { ClipboardCheck, Loader2, ArrowLeft } from "lucide-react";
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

export function StockCountForm({ products }: Props) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  // Pre-fill with current values; track changes against originals
  const originals = Object.fromEntries(
    products.map((p) => [p.id, { wh: p.warehouseCases, shop: p.shopBottles }])
  );
  const [counts, setCounts] = useState<Record<string, { wh: string; shop: string }>>(
    Object.fromEntries(
      products.map((p) => [p.id, { wh: String(p.warehouseCases), shop: String(p.shopBottles) }])
    )
  );

  function handleChange(productId: string, field: "wh" | "shop", value: string) {
    setCounts((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  }

  async function handleSubmit() {
    // Only send entries that changed
    const changed = products
      .map((p) => {
        const wh = parseInt(counts[p.id]?.wh ?? "") ?? originals[p.id].wh;
        const shop = parseInt(counts[p.id]?.shop ?? "") ?? originals[p.id].shop;
        const whVal = isNaN(wh) ? originals[p.id].wh : wh;
        const shopVal = isNaN(shop) ? originals[p.id].shop : shop;
        return { productId: p.id, warehouseCases: whVal, shopBottles: shopVal };
      })
      .filter((e) => {
        const orig = originals[e.productId];
        return e.warehouseCases !== orig.wh || e.shopBottles !== orig.shop;
      });

    if (!changed.length) {
      toast.info("No changes to save");
      return;
    }

    setSubmitting(true);
    const result = await stockCount(changed);
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
      {/* Back */}
      <div className="flex items-center justify-between">
        <Link href="/inventory">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Back
          </Button>
        </Link>
        <p className="text-xs text-muted-foreground">
          Edit only what changed · unchanged rows are skipped
        </p>
      </div>

      {/* Column headers */}
      <div className="flex items-center gap-3 px-4 py-1.5 text-xs font-medium text-muted-foreground border rounded-t-lg bg-muted/40">
        <div className="flex-1">Product</div>
        <div className="w-24 text-center">Warehouse cs</div>
        <div className="w-24 text-center">Shop btl</div>
      </div>

      {/* Product rows */}
      <div className="rounded-b-lg border border-t-0 divide-y">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">
                {p.name}{" "}
                <span className="text-muted-foreground font-normal">{SIZE_SHORT[p.size]}</span>
              </p>
            </div>
            <Input
              type="number"
              min="0"
              value={counts[p.id]?.wh ?? ""}
              onChange={(e) => handleChange(p.id, "wh", e.target.value)}
              className="w-24 h-8 text-sm text-center shrink-0"
            />
            <Input
              type="number"
              min="0"
              value={counts[p.id]?.shop ?? ""}
              onChange={(e) => handleChange(p.id, "shop", e.target.value)}
              className="w-24 h-8 text-sm text-center shrink-0"
            />
          </div>
        ))}
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
          <ClipboardCheck className="w-4 h-4 mr-2" />
        )}
        Save Stock Count
      </Button>
    </div>
  );
}
