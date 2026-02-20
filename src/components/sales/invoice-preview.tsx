"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SIZE_SHORT, PAYMENT_MODE_LABELS } from "@/lib/constants";
import { formatINR, formatDate, formatDateTime } from "@/lib/formatters";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { SizeUnit, PaymentMode } from "@/generated/prisma";

interface InvoiceItem {
  id: string;
  productName: string;
  productSize: SizeUnit;
  productBrand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface InvoiceData {
  id: string;
  invoiceNumber: string;
  saleDate: Date;
  subtotal: number;
  discount: number;
  totalAmount: number;
  paymentMode: PaymentMode;
  customer: { name: string; phone: string | null } | null;
  shop: {
    name: string;
    address: string | null;
    phone: string | null;
    licenseNumber: string | null;
  };
  items: InvoiceItem[];
}

export function InvoicePreview({ sale }: { sale: InvoiceData }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("print") === "1") {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <Link href="/sales">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sales
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 mr-2" />
          Print Invoice
        </Button>
      </div>

      <Card className="print:shadow-none print:border-none">
        <CardContent className="p-6 print:p-4">
          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-xl font-bold">{sale.shop.name}</h1>
            {sale.shop.address && (
              <p className="text-sm text-muted-foreground">
                {sale.shop.address}
              </p>
            )}
            {sale.shop.phone && (
              <p className="text-sm text-muted-foreground">
                Ph: {sale.shop.phone}
              </p>
            )}
            {sale.shop.licenseNumber && (
              <p className="text-xs text-muted-foreground">
                License: {sale.shop.licenseNumber}
              </p>
            )}
          </div>

          <Separator className="my-4" />

          {/* Invoice Info */}
          <div className="flex justify-between text-sm mb-4">
            <div>
              <p className="font-medium">{sale.invoiceNumber}</p>
              <p className="text-muted-foreground">
                {formatDateTime(sale.saleDate)}
              </p>
            </div>
            <div className="text-right">
              <p className="font-medium">
                {PAYMENT_MODE_LABELS[sale.paymentMode]}
              </p>
              {sale.customer && (
                <p className="text-muted-foreground">
                  {sale.customer.name}
                  {sale.customer.phone && ` (${sale.customer.phone})`}
                </p>
              )}
            </div>
          </div>

          <Separator className="my-4" />

          {/* Items */}
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2 font-medium">Item</th>
                <th className="text-center py-2 font-medium">Qty</th>
                <th className="text-right py-2 font-medium">Rate</th>
                <th className="text-right py-2 font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {sale.items.map((item) => (
                <tr key={item.id} className="border-b border-dashed">
                  <td className="py-2">
                    <p>{item.productName}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.productBrand} &middot;{" "}
                      {SIZE_SHORT[item.productSize]}
                    </p>
                  </td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">
                    {formatINR(item.unitPrice)}
                  </td>
                  <td className="text-right py-2 font-medium">
                    {formatINR(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Separator className="my-4" />

          {/* Totals */}
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatINR(sale.subtotal)}</span>
            </div>
            {sale.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Discount</span>
                <span className="text-red-600">
                  -{formatINR(sale.discount)}
                </span>
              </div>
            )}
            <Separator className="my-2" />
            <div className="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{formatINR(sale.totalAmount)}</span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-8 text-xs text-muted-foreground">
            <p>Thank you for your purchase!</p>
            <p className="mt-1">
              Generated by HisaabAI &middot; {formatDate(new Date())}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
