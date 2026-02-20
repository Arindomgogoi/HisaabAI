"use client";

import { useRouter } from "next/navigation";
import { format, subDays, startOfMonth } from "date-fns";
import { BarChart3, TrendingUp, ShoppingBag, Banknote, Smartphone, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function formatCurrency(n: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
}

interface Props {
  summary: {
    totalRevenue: number;
    totalDiscount: number;
    transactions: number;
    avgOrderValue: number;
  };
  dailyBreakdown: Array<{
    date: string;
    revenue: number;
    transactions: number;
    cash: number;
    upi: number;
    credit: number;
  }>;
  productReport: Array<{ name: string; qty: number; revenue: number }>;
  paymentSplit: {
    cash: { amount: number; count: number };
    upi: { amount: number; count: number };
    credit: { amount: number; count: number };
  };
  fromDate: string;
  toDate: string;
}

export function ReportsView({
  summary,
  dailyBreakdown,
  productReport,
  paymentSplit,
  fromDate,
  toDate,
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  function applyRange(from: string, to: string) {
    router.push(`/reports?from=${from}&to=${to}`);
  }

  const presets = [
    { label: "Today", from: today, to: today },
    {
      label: "Last 7 days",
      from: subDays(new Date(), 6).toISOString().split("T")[0],
      to: today,
    },
    {
      label: "Last 30 days",
      from: subDays(new Date(), 29).toISOString().split("T")[0],
      to: today,
    },
    {
      label: "This month",
      from: startOfMonth(new Date()).toISOString().split("T")[0],
      to: today,
    },
  ];

  const topPaymentMode =
    paymentSplit.cash.amount >= paymentSplit.upi.amount &&
    paymentSplit.cash.amount >= paymentSplit.credit.amount
      ? "Cash"
      : paymentSplit.upi.amount >= paymentSplit.credit.amount
      ? "UPI"
      : "Credit";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Reports</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {format(new Date(fromDate), "dd MMM yyyy")} —{" "}
            {format(new Date(toDate), "dd MMM yyyy")}
          </p>
        </div>
        <BarChart3 className="w-6 h-6 text-muted-foreground hidden sm:block" />
      </div>

      {/* Date Range Picker */}
      <Card>
        <CardContent className="pt-4 pb-3">
          <div className="flex flex-wrap gap-2 mb-3">
            {presets.map((p) => (
              <Button
                key={p.label}
                variant="outline"
                size="sm"
                onClick={() => applyRange(p.from, p.to)}
                className={
                  fromDate === p.from && toDate === p.to
                    ? "border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-950/20"
                    : ""
                }
              >
                {p.label}
              </Button>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-1">
              <Label className="text-xs">From</Label>
              <Input
                type="date"
                className="h-8 text-sm w-36"
                defaultValue={fromDate}
                onBlur={(e) => applyRange(e.target.value, toDate)}
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">To</Label>
              <Input
                type="date"
                className="h-8 text-sm w-36"
                defaultValue={toDate}
                onBlur={(e) => applyRange(fromDate, e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-bold mt-0.5">{formatCurrency(summary.totalRevenue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Transactions</p>
            <p className="text-xl font-bold mt-0.5">{summary.transactions}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Avg Order Value</p>
            <p className="text-xl font-bold mt-0.5">{formatCurrency(summary.avgOrderValue)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Top Payment Mode</p>
            <p className="text-xl font-bold mt-0.5">{topPaymentMode}</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Mode Split */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
              <Banknote className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cash</p>
              <p className="font-bold">{formatCurrency(paymentSplit.cash.amount)}</p>
              <p className="text-xs text-muted-foreground">{paymentSplit.cash.count} txns</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
              <Smartphone className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">UPI</p>
              <p className="font-bold">{formatCurrency(paymentSplit.upi.amount)}</p>
              <p className="text-xs text-muted-foreground">{paymentSplit.upi.count} txns</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
              <CreditCard className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Credit (Khata)</p>
              <p className="font-bold">{formatCurrency(paymentSplit.credit.amount)}</p>
              <p className="text-xs text-muted-foreground">{paymentSplit.credit.count} txns</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown Table */}
      {dailyBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
              Daily Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-center">Txns</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Cash</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">UPI</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Credit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {dailyBreakdown.map((row) => (
                  <TableRow key={row.date}>
                    <TableCell className="text-sm">
                      {format(new Date(row.date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(row.revenue)}
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {row.transactions}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground hidden sm:table-cell">
                      {row.cash > 0 ? formatCurrency(row.cash) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground hidden sm:table-cell">
                      {row.upi > 0 ? formatCurrency(row.upi) : "—"}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground hidden sm:table-cell">
                      {row.credit > 0 ? formatCurrency(row.credit) : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Product Report */}
      {productReport.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-muted-foreground" />
              Top Products
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Qty Sold</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productReport.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell className="text-sm">{row.name}</TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {row.qty}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(row.revenue)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {summary.transactions === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <BarChart3 className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">No sales in this period</p>
            <p className="text-muted-foreground text-sm mt-1">
              Try selecting a different date range
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
