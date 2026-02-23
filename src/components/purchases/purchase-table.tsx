"use client";

import { useState } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { Plus, Truck, TrendingUp, Loader2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { markPurchasePaid } from "@/app/(app)/purchases/actions";
import { toast } from "sonner";

interface Purchase {
  id: string;
  invoiceNumber: string;
  purchaseDate: Date;
  totalAmount: number;
  paymentStatus: string;
  supplierName: string;
  itemCount: number;
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PurchaseTable({ purchases: initialPurchases }: { purchases: Purchase[] }) {
  const [purchases, setPurchases] = useState(initialPurchases);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const totalSpend = purchases.reduce((s, p) => s + p.totalAmount, 0);
  const pendingCount = purchases.filter((p) => p.paymentStatus === "pending").length;
  const pendingAmount = purchases
    .filter((p) => p.paymentStatus === "pending")
    .reduce((s, p) => s + p.totalAmount, 0);

  async function handleMarkPaid(id: string) {
    setMarkingId(id);
    const result = await markPurchasePaid(id);
    setMarkingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      setPurchases((prev) =>
        prev.map((p) => (p.id === id ? { ...p, paymentStatus: "paid" } : p))
      );
      toast.success("Marked as paid");
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Purchases</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {purchases.length} purchase{purchases.length !== 1 ? "s" : ""}{" "}
            recorded
          </p>
        </div>
        <Link href="/purchases/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New Purchase
          </Button>
        </Link>
      </div>

      {/* Stats */}
      {purchases.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Total Purchases</p>
              <p className="text-xl font-bold mt-0.5">{purchases.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 pb-3">
              <p className="text-xs text-muted-foreground">Total Spend</p>
              <p className="text-xl font-bold mt-0.5">
                {formatCurrency(totalSpend)}
              </p>
            </CardContent>
          </Card>
          {pendingCount > 0 && (
            <Card className="border-amber-200 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="pt-4 pb-3">
                <p className="text-xs text-muted-foreground">Pending Payment</p>
                <p className="text-xl font-bold mt-0.5 text-amber-600">
                  {formatCurrency(pendingAmount)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pendingCount} invoice{pendingCount !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Table or empty state */}
      {purchases.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">
              No purchases yet
            </h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-6">
              Record your first stock purchase to automatically update warehouse
              inventory.
            </p>
            <Link href="/purchases/new">
              <Button className="bg-amber-500 hover:bg-amber-600 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Record First Purchase
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              Purchase History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead className="text-center">Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {purchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell className="font-medium font-mono text-sm">
                      {purchase.invoiceNumber}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {format(new Date(purchase.purchaseDate), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell>{purchase.supplierName}</TableCell>
                    <TableCell className="text-center text-sm">
                      {purchase.itemCount}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(purchase.totalAmount)}
                    </TableCell>
                    <TableCell>
                      {purchase.paymentStatus === "paid" ? (
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                          Paid
                        </Badge>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">
                            Pending
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 text-xs px-2 text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                            onClick={() => handleMarkPaid(purchase.id)}
                            disabled={markingId === purchase.id}
                          >
                            {markingId === purchase.id ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            Mark Paid
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
