"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatINR } from "@/lib/formatters";
import { SIZE_SHORT, CATEGORY_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import Link from "next/link";
import type { ProductCategory, SizeUnit } from "@/generated/prisma";

interface ProductRow {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  size: SizeUnit;
  mrp: number;
  costPrice: number;
  bpc: number;
  warehouseCases: number;
  shopBottles: number;
  reorderLevel: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
}

const stockBadgeConfig = {
  in_stock: { label: "In Stock", className: "bg-emerald-100 text-emerald-800" },
  low_stock: { label: "Low", className: "bg-amber-100 text-amber-800" },
  out_of_stock: { label: "Out", className: "bg-red-100 text-red-800" },
};

export function ProductTable({ products }: { products: ProductRow[] }) {
  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead className="hidden sm:table-cell">Category</TableHead>
            <TableHead>Size</TableHead>
            <TableHead className="text-right">MRP</TableHead>
            <TableHead className="text-right hidden md:table-cell">
              Warehouse
            </TableHead>
            <TableHead className="text-right">Shop</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[80px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                No products found
              </TableCell>
            </TableRow>
          )}
          {products.map((p) => {
            const badge = stockBadgeConfig[p.stockStatus];
            return (
              <TableRow key={p.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.brand}</p>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <span className="text-xs">{CATEGORY_LABELS[p.category]}</span>
                </TableCell>
                <TableCell>
                  <span className="text-xs">{SIZE_SHORT[p.size]}</span>
                </TableCell>
                <TableCell className="text-right font-medium text-sm">
                  {formatINR(p.mrp)}
                </TableCell>
                <TableCell className="text-right hidden md:table-cell text-sm">
                  {p.warehouseCases} cs
                </TableCell>
                <TableCell className="text-right text-sm">
                  {p.shopBottles}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn("text-[10px]", badge.className)}
                  >
                    {badge.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Link href={`/inventory/${p.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Pencil className="w-3.5 h-3.5" />
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
