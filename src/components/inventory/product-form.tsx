"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { CATEGORY_LABELS, SIZE_LABELS, BPC_MAP } from "@/lib/constants";
import { createProduct, updateProduct } from "@/app/(app)/inventory/actions";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import type { ProductCategory, SizeUnit } from "@/generated/prisma";

interface ProductData {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  size: SizeUnit;
  mrp: number;
  costPrice: number;
  bpc: number;
  gstRate: number;
  reorderLevel: number;
}

interface ProductFormProps {
  product?: ProductData;
  mode: "create" | "edit";
}

export function ProductForm({ product, mode }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [size, setSize] = useState<SizeUnit | "">(product?.size ?? "");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const result =
      mode === "create"
        ? await createProduct(formData)
        : await updateProduct(product!.id, formData);

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success(
        mode === "create" ? "Product created successfully" : "Product updated successfully"
      );
      router.push("/inventory");
    }
  }

  const suggestedBpc = size ? BPC_MAP[size] : undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Link href="/inventory">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <CardTitle className="font-heading">
            {mode === "create" ? "Add New Product" : `Edit: ${product?.name}`}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                placeholder="e.g. Royal Stag"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                name="brand"
                defaultValue={product?.brand}
                placeholder="e.g. Pernod Ricard"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select name="category" defaultValue={product?.category} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Size</Label>
              <Select
                name="size"
                defaultValue={product?.size}
                required
                onValueChange={(v) => setSize(v as SizeUnit)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(SIZE_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="mrp">MRP (₹)</Label>
              <Input
                id="mrp"
                name="mrp"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.mrp}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="costPrice">Cost Price (₹)</Label>
              <Input
                id="costPrice"
                name="costPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.costPrice}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bpc">
                BPC {suggestedBpc ? `(default: ${suggestedBpc})` : ""}
              </Label>
              <Input
                id="bpc"
                name="bpc"
                type="number"
                min="1"
                defaultValue={product?.bpc ?? suggestedBpc}
                key={size}
                placeholder="Bottles per case"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>GST Rate</Label>
              <Select name="gstRate" defaultValue={String(product?.gstRate ?? 18)} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select GST rate" />
                </SelectTrigger>
                <SelectContent>
                  {[0, 5, 12, 18, 28].map((rate) => (
                    <SelectItem key={rate} value={String(rate)}>
                      {rate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reorderLevel">Reorder Level (bottles)</Label>
              <Input
                id="reorderLevel"
                name="reorderLevel"
                type="number"
                min="0"
                defaultValue={product?.reorderLevel ?? 10}
                placeholder="10"
              />
              <p className="text-xs text-muted-foreground">
                Low stock alert when shop bottles fall below this
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="submit"
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Save className="w-4 h-4 mr-2" />
              {mode === "create" ? "Add Product" : "Save Changes"}
            </Button>
            <Link href="/inventory">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
