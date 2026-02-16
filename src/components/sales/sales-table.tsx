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
import { formatINR, formatDateTime } from "@/lib/formatters";
import { PAYMENT_MODE_LABELS, PAYMENT_MODE_COLORS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Eye } from "lucide-react";
import Link from "next/link";
import type { PaymentMode } from "@/generated/prisma";

interface SaleRow {
  id: string;
  invoiceNumber: string;
  saleDate: Date;
  totalAmount: number;
  paymentMode: PaymentMode;
  itemCount: number;
  customerName: string | null;
}

export function SalesTable({ sales }: { sales: SaleRow[] }) {
  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead className="hidden sm:table-cell">Items</TableHead>
            <TableHead className="hidden md:table-cell">Customer</TableHead>
            <TableHead className="w-[60px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No sales found
              </TableCell>
            </TableRow>
          )}
          {sales.map((s) => (
            <TableRow key={s.id}>
              <TableCell className="font-medium text-sm">
                {s.invoiceNumber}
              </TableCell>
              <TableCell className="text-xs text-muted-foreground">
                {formatDateTime(s.saleDate)}
              </TableCell>
              <TableCell className="text-right font-semibold text-sm">
                {formatINR(s.totalAmount)}
              </TableCell>
              <TableCell>
                <Badge
                  variant="secondary"
                  className={cn(
                    "text-[10px]",
                    PAYMENT_MODE_COLORS[s.paymentMode]
                  )}
                >
                  {PAYMENT_MODE_LABELS[s.paymentMode]}
                </Badge>
              </TableCell>
              <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                {s.itemCount}
              </TableCell>
              <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                {s.customerName ?? "—"}
              </TableCell>
              <TableCell>
                <Link href={`/sales/${s.id}`}>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
