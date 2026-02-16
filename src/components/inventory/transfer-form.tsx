"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { transferStock } from "@/app/(app)/inventory/actions";
import { SIZE_SHORT } from "@/lib/constants";
import { ArrowRight, Loader2, Package } from "lucide-react";
import { toast } from "sonner";
import type { SizeUnit } from "@/generated/prisma";

interface TransferProduct {
  id: string;
  name: string;
  size: SizeUnit;
  bpc: number;
  warehouseCases: number;
  shopBottles: number;
}

export function TransferForm({ products }: { products: TransferProduct[] }) {
  const [selectedId, setSelectedId] = useState("");
  const [cases, setCases] = useState("");
  const [loading, setLoading] = useState(false);

  const selected = products.find((p) => p.id === selectedId);
  const casesNum = parseInt(cases) || 0;
  const bottlesPreview = selected ? casesNum * selected.bpc : 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedId || !cases) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("productId", selectedId);
    formData.set("cases", cases);

    const result = await transferStock(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `Transferred ${cases} cases = ${result.bottlesGenerated} bottles to shop`
      );
      setSelectedId("");
      setCases("");
    }
    setLoading(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading flex items-center gap-2">
          <Package className="w-5 h-5" />
          Transfer Stock: Warehouse to Shop
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Select Product</Label>
            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a product..." />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name} ({SIZE_SHORT[p.size]}) — {p.warehouseCases} cases
                    available
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && (
            <>
              <div className="grid grid-cols-2 gap-4 p-3 rounded-lg bg-muted/50 text-sm">
                <div>
                  <p className="text-muted-foreground">Warehouse</p>
                  <p className="font-semibold">{selected.warehouseCases} cases</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Shop</p>
                  <p className="font-semibold">{selected.shopBottles} bottles</p>
                </div>
                <div>
                  <p className="text-muted-foreground">BPC</p>
                  <p className="font-semibold">{selected.bpc} bottles/case</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Cases to Transfer</Label>
                <Input
                  type="number"
                  min="1"
                  max={selected.warehouseCases}
                  value={cases}
                  onChange={(e) => setCases(e.target.value)}
                  placeholder="Enter number of cases"
                />
              </div>

              {casesNum > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50">
                  <div className="text-sm">
                    <span className="font-medium">{casesNum} cases</span>
                    <ArrowRight className="inline w-4 h-4 mx-2" />
                    <span className="font-bold text-amber-600">
                      {bottlesPreview} bottles
                    </span>
                  </div>
                </div>
              )}
            </>
          )}

          <Button
            type="submit"
            disabled={!selectedId || casesNum < 1 || loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-white"
          >
            {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Transfer to Shop
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
