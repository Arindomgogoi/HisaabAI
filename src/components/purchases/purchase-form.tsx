"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Package, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createPurchase, createSupplier } from "@/app/(app)/purchases/actions";
import { cn } from "@/lib/utils";

interface Supplier {
  id: string;
  name: string;
  phone: string | null;
}

interface Product {
  id: string;
  name: string;
  size: string;
  category: string;
  costPrice: number;
  gstRate: number;
  bpc: number;
  warehouseCases: number;
}

interface LineItem {
  productId: string;
  cases: number;
  costPerCase: number;
}

const SIZE_LABEL: Record<string, string> = {
  ML_750: "750ml",
  ML_375: "375ml",
  ML_180: "180ml",
  CAN_500: "500ml Can",
  BOTTLE_650: "650ml",
};

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PurchaseForm({
  suppliers: initialSuppliers,
  products,
}: {
  suppliers: Supplier[];
  products: Product[];
}) {
  const router = useRouter();
  const [suppliers, setSuppliers] = useState(initialSuppliers);

  const today = new Date().toISOString().split("T")[0];
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(today);
  const [supplierId, setSupplierId] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "pending">(
    "paid"
  );
  const [items, setItems] = useState<LineItem[]>([
    { productId: "", cases: 1, costPerCase: 0 },
  ]);
  const [submitting, setSubmitting] = useState(false);

  // Quick-add supplier
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [newSupplierName, setNewSupplierName] = useState("");
  const [addingSupplier, setAddingSupplier] = useState(false);

  const totalAmount = items.reduce(
    (sum, item) => sum + item.cases * item.costPerCase,
    0
  );

  function addItem() {
    setItems((prev) => [...prev, { productId: "", cases: 1, costPerCase: 0 }]);
  }

  function removeItem(idx: number) {
    setItems((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateItem(idx: number, field: keyof LineItem, value: string | number) {
    setItems((prev) =>
      prev.map((item, i) => {
        if (i !== idx) return item;
        const updated = { ...item, [field]: value };
        // Auto-fill cost price when product is selected
        if (field === "productId") {
          const product = products.find((p) => p.id === value);
          if (product) updated.costPerCase = product.costPrice;
        }
        return updated;
      })
    );
  }

  async function handleAddSupplier() {
    if (!newSupplierName.trim()) return;
    setAddingSupplier(true);
    const fd = new FormData();
    fd.set("name", newSupplierName.trim());
    const result = await createSupplier(fd);
    setAddingSupplier(false);
    if (result.error) {
      toast.error(result.error);
    } else if (result.supplier) {
      setSuppliers((prev) => [...prev, result.supplier!]);
      setSupplierId(result.supplier.id);
      setNewSupplierName("");
      setShowAddSupplier(false);
      toast.success("Supplier added");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!supplierId) {
      toast.error("Please select a supplier");
      return;
    }
    const validItems = items.filter(
      (i) => i.productId && i.cases > 0 && i.costPerCase > 0
    );
    if (validItems.length === 0) {
      toast.error("Add at least one item");
      return;
    }

    setSubmitting(true);
    const result = await createPurchase({
      invoiceNumber,
      purchaseDate,
      supplierId,
      paymentStatus,
      items: validItems,
    });
    setSubmitting(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Purchase saved — warehouse stock updated");
      router.push("/purchases");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/purchases">
          <Button variant="ghost" size="icon" className="h-8 w-8" type="button">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">New Purchase</h1>
          <p className="text-muted-foreground mt-0.5 text-sm">
            Record stock received from supplier
          </p>
        </div>
      </div>

      {/* Purchase Details */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Purchase Details</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              placeholder="e.g. INV-2024-001"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="purchaseDate">Purchase Date</Label>
            <Input
              id="purchaseDate"
              type="date"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="supplier">Supplier</Label>
            <div className="flex gap-2">
              <select
                id="supplier"
                value={supplierId}
                onChange={(e) => setSupplierId(e.target.value)}
                className="flex-1 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select supplier...</option>
                {suppliers.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                    {s.phone ? ` — ${s.phone}` : ""}
                  </option>
                ))}
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowAddSupplier(!showAddSupplier)}
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                New
              </Button>
            </div>
            {showAddSupplier && (
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Supplier name"
                  value={newSupplierName}
                  onChange={(e) => setNewSupplierName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddSupplier()}
                />
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddSupplier}
                  disabled={addingSupplier}
                  className="bg-amber-500 hover:bg-amber-600 text-white shrink-0"
                >
                  {addingSupplier ? "Adding..." : "Add"}
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <Label>Payment Status</Label>
            <div className="flex gap-2">
              {(["paid", "pending"] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => setPaymentStatus(status)}
                  className={cn(
                    "flex-1 h-9 rounded-md border text-sm font-medium transition-colors capitalize",
                    paymentStatus === status
                      ? status === "paid"
                        ? "bg-green-500 border-green-500 text-white"
                        : "bg-amber-500 border-amber-500 text-white"
                      : "border-input bg-background hover:bg-accent"
                  )}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Items */}
      <Card>
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
          <CardTitle className="text-base">Items</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addItem}
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Column headers */}
          <div className="hidden sm:grid grid-cols-[1fr_80px_120px_100px_36px] gap-2 text-xs font-medium text-muted-foreground px-1">
            <span>Product</span>
            <span>Cases</span>
            <span>Cost / Case (₹)</span>
            <span>Total</span>
            <span />
          </div>

          {items.map((item, idx) => {
            const product = products.find((p) => p.id === item.productId);
            const lineTotal = item.cases * item.costPerCase;
            return (
              <div
                key={idx}
                className="grid grid-cols-1 sm:grid-cols-[1fr_80px_120px_100px_36px] gap-2 items-start sm:items-center p-3 sm:p-0 rounded-lg sm:rounded-none border sm:border-0 bg-muted/30 sm:bg-transparent"
              >
                {/* Product select */}
                <div className="space-y-1 sm:space-y-0">
                  <Label className="sm:hidden text-xs">Product</Label>
                  <select
                    value={item.productId}
                    onChange={(e) =>
                      updateItem(idx, "productId", e.target.value)
                    }
                    className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    required
                  >
                    <option value="">Select product...</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — {SIZE_LABEL[p.size] ?? p.size}
                      </option>
                    ))}
                  </select>
                  {product && (
                    <p className="text-xs text-muted-foreground mt-1 sm:mt-0.5">
                      {product.warehouseCases} cases in warehouse · {product.bpc} bottles/case · GST {product.gstRate}%
                    </p>
                  )}
                </div>

                {/* Cases */}
                <div className="space-y-1 sm:space-y-0">
                  <Label className="sm:hidden text-xs">Cases</Label>
                  <Input
                    type="number"
                    min={1}
                    value={item.cases}
                    onChange={(e) =>
                      updateItem(idx, "cases", Number(e.target.value))
                    }
                    className="h-9"
                    required
                  />
                </div>

                {/* Cost per case */}
                <div className="space-y-1 sm:space-y-0">
                  <Label className="sm:hidden text-xs">Cost / Case (₹)</Label>
                  <Input
                    type="number"
                    min={0.01}
                    step={0.01}
                    value={item.costPerCase || ""}
                    onChange={(e) =>
                      updateItem(idx, "costPerCase", Number(e.target.value))
                    }
                    placeholder="0"
                    className="h-9"
                    required
                  />
                </div>

                {/* Line total */}
                <div className="flex items-center">
                  <span className="text-sm font-medium">
                    {lineTotal > 0 ? formatCurrency(lineTotal) : "—"}
                  </span>
                </div>

                {/* Remove */}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-destructive"
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            );
          })}

          {/* Total row */}
          <div className="flex items-center justify-between pt-3 border-t">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Package className="w-4 h-4" />
              {items.filter((i) => i.productId).length} product(s) ·{" "}
              {items.reduce((s, i) => s + i.cases, 0)} cases total
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Grand Total</p>
              <p className="text-xl font-bold">{formatCurrency(totalAmount)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Link href="/purchases">
          <Button type="button" variant="outline">
            Cancel
          </Button>
        </Link>
        <Button
          type="submit"
          disabled={submitting}
          className="bg-amber-500 hover:bg-amber-600 text-white min-w-[140px]"
        >
          {submitting ? (
            "Saving..."
          ) : (
            <>
              <Badge
                variant="secondary"
                className="mr-2 bg-white/20 text-white text-xs"
              >
                {formatCurrency(totalAmount)}
              </Badge>
              Save Purchase
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
