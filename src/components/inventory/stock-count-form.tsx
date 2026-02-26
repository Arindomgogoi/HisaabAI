"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SIZE_SHORT, BPC_MAP } from "@/lib/constants";
import { stockCount } from "@/app/(app)/inventory/actions";
import type { SmartBalanceSummary } from "@/app/(app)/inventory/actions";
import { toast } from "sonner";
import {
  ClipboardCheck,
  Loader2,
  ArrowLeft,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Package,
} from "lucide-react";
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
  const [submitting, setSubmitting] = useState(false);
  const [summary, setSummary] = useState<SmartBalanceSummary[] | null>(null);

  const originals = Object.fromEntries(
    products.map((p) => [p.id, { wh: p.warehouseCases, shop: p.shopBottles }])
  );
  const [counts, setCounts] = useState<Record<string, { wh: string; shop: string }>>(
    Object.fromEntries(
      products.map((p) => [
        p.id,
        { wh: String(p.warehouseCases), shop: String(p.shopBottles) },
      ])
    )
  );

  function handleChange(productId: string, field: "wh" | "shop", value: string) {
    setCounts((prev) => ({
      ...prev,
      [productId]: { ...prev[productId], [field]: value },
    }));
  }

  // Live preview: how many bottles will be expected if cases change
  function getExpectedPreview(productId: string, size: SizeUnit): string | null {
    const orig = originals[productId];
    const currentWh = parseInt(counts[productId]?.wh ?? "");
    if (isNaN(currentWh)) return null;
    const casesOpened = Math.max(0, orig.wh - currentWh);
    if (casesOpened === 0) return null;
    const bpc = BPC_MAP[size];
    return `+${casesOpened * bpc} btl from ${casesOpened} case${casesOpened > 1 ? "s" : ""}`;
  }

  async function handleSubmit() {
    const changed = products
      .map((p) => {
        const wh = parseInt(counts[p.id]?.wh ?? "");
        const shop = parseInt(counts[p.id]?.shop ?? "");
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
      setSummary(result.summary ?? null);
    }
  }

  // ── Smart Balance Summary (shown after submit) ──────────────
  if (summary) {
    const totalAutoSales = summary.reduce((s, r) => s + r.autoSalesCount, 0);
    const anomalies = summary.filter((r) => r.hasAnomaly);
    const withSales = summary.filter((r) => r.autoSalesCount > 0);

    return (
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Smart Balance Report</h2>
          <Link href="/inventory">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Inventory
            </Button>
          </Link>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{totalAutoSales}</p>
            <p className="text-xs text-muted-foreground mt-1">Unrecorded bottles sold</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{summary.length}</p>
            <p className="text-xs text-muted-foreground mt-1">Products updated</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className={`text-2xl font-bold ${anomalies.length > 0 ? "text-red-600" : "text-green-600"}`}>
              {anomalies.length}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Anomalies flagged</p>
          </div>
        </div>

        {/* Unrecorded sales alert */}
        {totalAutoSales > 0 && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3 flex gap-2">
            <TrendingDown className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              <span className="font-semibold">{totalAutoSales} bottles</span> across {withSales.length} product{withSales.length > 1 ? "s" : ""} were sold but not recorded in POS. Check cash sales.
            </p>
          </div>
        )}

        {/* Detail table */}
        <div className="rounded-lg border overflow-hidden">
          <div className="grid grid-cols-7 gap-2 px-3 py-2 text-xs font-medium text-muted-foreground bg-muted/40 border-b">
            <div className="col-span-2">Product</div>
            <div className="text-center">Cases</div>
            <div className="text-center">Opened</div>
            <div className="text-center">+Bottles</div>
            <div className="text-center">Expected</div>
            <div className="text-center">Auto Sales</div>
          </div>
          <div className="divide-y">
            {summary.map((row) => (
              <div
                key={row.productId}
                className={`grid grid-cols-7 gap-2 px-3 py-2.5 text-sm items-center ${
                  row.hasAnomaly
                    ? "bg-red-50 dark:bg-red-950/20"
                    : row.autoSalesCount > 0
                    ? "bg-amber-50 dark:bg-amber-950/20"
                    : ""
                }`}
              >
                <div className="col-span-2 min-w-0">
                  <p className="font-medium text-xs truncate">{row.productName}</p>
                  <p className="text-xs text-muted-foreground">{SIZE_SHORT[row.size as SizeUnit]}</p>
                </div>
                <div className="text-center text-xs">
                  {row.prevCases !== null ? (
                    <span>
                      {row.prevCases}→<span className="font-medium">{row.currentCases}</span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">—→{row.currentCases}</span>
                  )}
                </div>
                <div className="text-center text-xs font-medium">
                  {row.casesOpened > 0 ? (
                    <span className="text-blue-600">{row.casesOpened}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </div>
                <div className="text-center text-xs">
                  {row.bottlesFromCases > 0 ? (
                    <span className="text-blue-600">+{row.bottlesFromCases}</span>
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </div>
                <div className="text-center text-xs">
                  {row.prevBottles !== null ? row.expectedBottles : <span className="text-muted-foreground">—</span>}
                </div>
                <div className="text-center">
                  {row.hasAnomaly ? (
                    <span className="inline-flex items-center gap-1 text-xs text-red-600 font-medium">
                      <AlertTriangle className="w-3 h-3" />
                      +{row.currentBottles - row.expectedBottles}
                    </span>
                  ) : row.autoSalesCount > 0 ? (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-semibold">
                      <Package className="w-3 h-3" />
                      {row.autoSalesCount}
                    </span>
                  ) : (
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mx-auto" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Auto Sales = bottles expected but missing from physical count
          {anomalies.length > 0 && " · Red rows = bottles appearing without case opening"}
        </p>

        <Button
          variant="outline"
          className="w-full"
          onClick={() => setSummary(null)}
        >
          Do Another Count
        </Button>
      </div>
    );
  }

  // ── Main count form ──────────────────────────────────────────
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
          Edit only what changed · Smart balance auto-calculated
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
        {products.map((p) => {
          const preview = getExpectedPreview(p.id, p.size);
          return (
            <div key={p.id} className="flex items-center gap-3 px-4 py-2.5">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">
                  {p.name}{" "}
                  <span className="text-muted-foreground font-normal">{SIZE_SHORT[p.size]}</span>
                </p>
                {preview && (
                  <p className="text-xs text-blue-600 mt-0.5">{preview}</p>
                )}
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
          <ClipboardCheck className="w-4 h-4 mr-2" />
        )}
        Save Stock Count
      </Button>
    </div>
  );
}
