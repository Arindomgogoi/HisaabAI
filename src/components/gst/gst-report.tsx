"use client";

import { useRouter } from "next/navigation";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { FileText, TrendingDown, TrendingUp, Receipt, AlertCircle } from "lucide-react";
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
  summary: {
    outputCGST: number;
    outputSGST: number;
    inputCGST: number;
    inputSGST: number;
    netCGST: number;
    netSGST: number;
    netPayable: number;
    taxableValue: number;
  };
  monthlyBreakdown: Array<{
    month: string;
    taxableSales: number;
    outputCGST: number;
    outputSGST: number;
    inputCGST: number;
    inputSGST: number;
    netPayable: number;
  }>;
  hsnSummary: Array<{
    hsnCode: string;
    gstRate: number;
    qty: number;
    taxableValue: number;
    cgst: number;
    sgst: number;
  }>;
  shopGstin: string | null;
  fromDate: string;
  toDate: string;
}

export function GSTReport({
  summary,
  monthlyBreakdown,
  hsnSummary,
  shopGstin,
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">GST &amp; Tax</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {format(new Date(fromDate), "dd MMM yyyy")} —{" "}
            {format(new Date(toDate), "dd MMM yyyy")}
          </p>
        </div>
        {shopGstin ? (
          <Badge variant="outline" className="font-mono text-xs">
            GSTIN: {shopGstin}
          </Badge>
        ) : (
          <div className="flex items-center gap-1.5 text-amber-600 text-xs">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Add GSTIN in Settings</span>
          </div>
        )}
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
              <TrendingUp className="w-3.5 h-3.5 text-red-500" />
              <p className="text-xs text-muted-foreground">Output Tax</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(summary.outputCGST + summary.outputSGST)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              CGST {formatCurrency(summary.outputCGST)} + SGST {formatCurrency(summary.outputSGST)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-green-500" />
              <p className="text-xs text-muted-foreground">Input Tax Credit</p>
            </div>
            <p className="text-xl font-bold">{formatCurrency(summary.inputCGST + summary.inputSGST)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              CGST {formatCurrency(summary.inputCGST)} + SGST {formatCurrency(summary.inputSGST)}
            </p>
          </CardContent>
        </Card>
        <Card className={summary.netPayable > 0 ? "border-red-200 bg-red-50/50 dark:bg-red-950/20" : "border-green-200 bg-green-50/50 dark:bg-green-950/20"}>
          <CardContent className="pt-4 pb-3">
            <div className="flex items-center gap-2 mb-1">
              <Receipt className="w-3.5 h-3.5 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">Net Payable</p>
            </div>
            <p className={`text-xl font-bold ${summary.netPayable > 0 ? "text-red-600" : "text-green-600"}`}>
              {formatCurrency(summary.netPayable)}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {summary.netPayable > 0 ? "Tax owed" : "Credit carry-forward"}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-3">
            <p className="text-xs text-muted-foreground">Taxable Sales Value</p>
            <p className="text-xl font-bold mt-0.5">{formatCurrency(summary.taxableValue)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Breakdown */}
      {monthlyBreakdown.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Monthly GST Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Month</TableHead>
                  <TableHead className="text-right">Taxable Sales</TableHead>
                  <TableHead className="text-right">Output CGST</TableHead>
                  <TableHead className="text-right">Output SGST</TableHead>
                  <TableHead className="text-right hidden sm:table-cell">ITC</TableHead>
                  <TableHead className="text-right">Net Payable</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {monthlyBreakdown.map((row) => (
                  <TableRow key={row.month}>
                    <TableCell className="font-medium">
                      {format(new Date(row.month + "-01"), "MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.taxableSales)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.outputCGST)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.outputSGST)}
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground hidden sm:table-cell">
                      {formatCurrency(row.inputCGST + row.inputSGST)}
                    </TableCell>
                    <TableCell className={`text-right font-semibold ${row.netPayable > 0 ? "text-red-600" : "text-green-600"}`}>
                      {formatCurrency(row.netPayable)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* HSN Summary */}
      {hsnSummary.length > 0 && (
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              HSN-wise Summary
              <span className="text-xs font-normal text-muted-foreground ml-1">(for GSTR-1 filing)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 mt-3">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>GST Rate</TableHead>
                  <TableHead className="text-center">Qty</TableHead>
                  <TableHead className="text-right">Taxable Value</TableHead>
                  <TableHead className="text-right">CGST</TableHead>
                  <TableHead className="text-right">SGST</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hsnSummary.map((row) => (
                  <TableRow key={row.hsnCode}>
                    <TableCell className="font-mono text-sm">{row.hsnCode}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {row.gstRate}%
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {row.qty}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.taxableValue)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.cgst)}
                    </TableCell>
                    <TableCell className="text-right text-sm">
                      {formatCurrency(row.sgst)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Empty state */}
      {monthlyBreakdown.length === 0 && hsnSummary.length === 0 && (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="font-semibold">No tax data in this period</p>
            <p className="text-muted-foreground text-sm mt-1">
              Sales and purchases in this period will appear here
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
