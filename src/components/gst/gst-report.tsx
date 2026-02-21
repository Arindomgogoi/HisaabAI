"use client";

import { useRouter } from "next/navigation";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { TrendingDown, TrendingUp, Wallet, ShoppingBag, Info, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  complianceSummary: {
    totalSales: number;
    totalPurchases: number;
    grossProfit: number;
    saleCount: number;
    purchaseCount: number;
    licenseNumber: string | null;
  };
  monthlyBreakdown: Array<{
    month: string;
    sales: number;
    purchases: number;
    grossProfit: number;
  }>;
  shopGstin: string | null;
  licenseNumber: string | null;
  fromDate: string;
  toDate: string;
}

export function GSTReport({
  complianceSummary,
  monthlyBreakdown,
  shopGstin,
  licenseNumber,
  fromDate,
  toDate,
}: Props) {
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  function applyRange(from: string, to: string) {
    router.push(`/gst?from=${from}&to=${to}`);
  }

  const presets = [
    {
      label: "This month",
      from: startOfMonth(new Date()).toISOString().split("T")[0],
      to: today,
    },
    {
      label: "Last month",
      from: startOfMonth(subMonths(new Date(), 1)).toISOString().split("T")[0],
      to: endOfMonth(subMonths(new Date(), 1)).toISOString().split("T")[0],
    },
    {
      label: "Last 3 months",
      from: startOfMonth(subMonths(new Date(), 2)).toISOString().split("T")[0],
      to: today,
    },
  ];

  const marginPct =
    complianceSummary.totalSales > 0
      ? ((complianceSummary.grossProfit / complianceSummary.totalSales) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Tax &amp; Compliance</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {format(new Date(fromDate), "dd MMM yyyy")} —{" "}
            {format(new Date(toDate), "dd MMM yyyy")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {licenseNumber && (
            <Badge variant="outline" className="font-mono text-xs">
              License: {licenseNumber}
            </Badge>
          )}
          {shopGstin && (
            <Badge variant="outline" className="font-mono text-xs">
              GSTIN: {shopGstin}
            </Badge>
          )}
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm">
        <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
        <p className="text-amber-800 dark:text-amber-200">
          Alcoholic beverages are outside India&apos;s GST scope — governed by State Excise Duty &amp; VAT instead.
          This page shows your business compliance summary for excise audit records.
        </p>
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
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-xs text-muted-foreground">Total Sales</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(complianceSummary.totalSales)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {complianceSummary.saleCount} invoices
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <ShoppingBag className="w-3.5 h-3.5 text-orange-500" />
              <p className="text-xs text-muted-foreground">Total Purchases</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(complianceSummary.totalPurchases)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {complianceSummary.purchaseCount} orders
            </p>
          </CardContent>
        </Card>
        <Card className={complianceSummary.grossProfit >= 0 ? "border-green-200 bg-green-50/50 dark:bg-green-950/20" : "border-red-200 bg-red-50/50 dark:bg-red-950/20"}>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Gross Profit</p>
            </div>
            <p className={`text-xl font-bold ${complianceSummary.grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
              {formatCurrency(complianceSummary.grossProfit)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {marginPct}% margin
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Excise Tax</p>
            </div>
            <p className="text-xl font-bold text-muted-foreground">N/A</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Built into MRP by state
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      {monthlyBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Monthly Business Summary
              <span className="text-xs font-normal text-muted-foreground ml-1">(for excise audit records)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Sales</TableHead>
                  <TableHead className="text-right">Purchases</TableHead>
                  <TableHead className="text-right">Gross Profit</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">Margin</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyBreakdown.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">
                      {format(new Date(row.month + "-01"), "MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.sales)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.purchases)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${row.grossProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {formatCurrency(row.grossProfit)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground hidden sm:table-cell">
                      {row.sales > 0 ? ((row.grossProfit / row.sales) * 100).toFixed(1) : "0.0"}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {monthlyBreakdown.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">No data in this period</p>
            <p className="text-muted-foreground text-sm mt-1">
              Sales and purchases in this period will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
