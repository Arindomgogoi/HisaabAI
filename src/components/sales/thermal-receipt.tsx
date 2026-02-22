"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { SIZE_SHORT, PAYMENT_MODE_LABELS } from "@/lib/constants";
import { formatINR, formatDateTime } from "@/lib/formatters";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { SizeUnit, PaymentMode } from "@/generated/prisma";

interface ReceiptItem {
  id: string;
  productName: string;
  productSize: SizeUnit;
  productBrand: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface ReceiptData {
  id: string;
  invoiceNumber: string;
  saleDate: Date;
  subtotal: number;
  discount: number;
  totalAmount: number;
  cgst: number;
  sgst: number;
  paymentMode: PaymentMode;
  customer: { name: string; phone: string | null } | null;
  shop: {
    name: string;
    address: string | null;
    phone: string | null;
    licenseNumber: string | null;
  };
  items: ReceiptItem[];
}

function padRow(label: string, value: string, width = 32) {
  const gap = width - label.length - value.length;
  return label + " ".repeat(Math.max(1, gap)) + value;
}

export function ThermalReceipt({ sale }: { sale: ReceiptData }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("print") === "1") {
      const t = setTimeout(() => window.print(), 500);
      return () => clearTimeout(t);
    }
  }, [searchParams]);

  const D = "-".repeat(32);

  return (
    <>
      {/* Toolbar — hidden on print */}
      <div className="max-w-xs mx-auto pt-4 pb-2 print:hidden flex items-center justify-between gap-2 px-2">
        <Link href={`/sales/${sale.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" />
            Invoice
          </Button>
        </Link>
        <Button
          size="sm"
          className="bg-amber-500 hover:bg-amber-600 text-white"
          onClick={() => window.print()}
        >
          <Printer className="w-4 h-4 mr-1.5" />
          Print Receipt
        </Button>
      </div>

      {/* Receipt — 80mm column, monospace, black on white */}
      <div
        className="mx-auto bg-white text-black print:mt-0"
        style={{
          width: 302,
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 12,
          lineHeight: 1.45,
          padding: "8px 6px",
        }}
      >
        {/* Shop header */}
        <div style={{ textAlign: "center", fontWeight: "bold", fontSize: 13, textTransform: "uppercase" }}>
          {sale.shop.name}
        </div>
        {sale.shop.address && (
          <div style={{ textAlign: "center", fontSize: 11 }}>{sale.shop.address}</div>
        )}
        {sale.shop.phone && (
          <div style={{ textAlign: "center", fontSize: 11 }}>Ph: {sale.shop.phone}</div>
        )}
        {sale.shop.licenseNumber && (
          <div style={{ textAlign: "center", fontSize: 10 }}>Lic: {sale.shop.licenseNumber}</div>
        )}

        <div>{D}</div>

        {/* Invoice meta */}
        <div style={{ whiteSpace: "pre" }}>{padRow("Inv:", sale.invoiceNumber)}</div>
        <div style={{ whiteSpace: "pre" }}>{padRow("Date:", formatDateTime(sale.saleDate))}</div>
        <div style={{ whiteSpace: "pre" }}>{padRow("Pay:", PAYMENT_MODE_LABELS[sale.paymentMode])}</div>
        {sale.customer && (
          <div style={{ whiteSpace: "pre" }}>{padRow("Cust:", sale.customer.name)}</div>
        )}

        <div>{D}</div>

        {/* Items header */}
        <div style={{ whiteSpace: "pre", fontWeight: "bold" }}>
          {"Item               Qty    Amt"}
        </div>
        <div>{D}</div>

        {/* Items */}
        {sale.items.map((item) => {
          const label = `${item.productName} ${SIZE_SHORT[item.productSize]}`;
          const name = (label.length > 19 ? label.slice(0, 18) + "\u2026" : label).padEnd(19);
          const qty = String(item.quantity).padStart(3);
          const amt = formatINR(item.totalPrice).padStart(7);
          return (
            <div key={item.id} style={{ marginBottom: 2 }}>
              <div style={{ whiteSpace: "pre" }}>{`${name} ${qty}  ${amt}`}</div>
              <div style={{ fontSize: 10, paddingLeft: 4, color: "#555" }}>
                {item.productBrand} @ {formatINR(item.unitPrice)}/pc
              </div>
            </div>
          );
        })}

        <div>{D}</div>

        {/* Totals */}
        <div style={{ whiteSpace: "pre" }}>{padRow("Subtotal", formatINR(sale.subtotal))}</div>
        {sale.cgst > 0 && (
          <div style={{ whiteSpace: "pre", fontSize: 11 }}>{padRow("  CGST", formatINR(sale.cgst))}</div>
        )}
        {sale.sgst > 0 && (
          <div style={{ whiteSpace: "pre", fontSize: 11 }}>{padRow("  SGST", formatINR(sale.sgst))}</div>
        )}
        {sale.discount > 0 && (
          <div style={{ whiteSpace: "pre" }}>{padRow("Discount", `-${formatINR(sale.discount)}`)}</div>
        )}

        <div>{D}</div>
        <div style={{ whiteSpace: "pre", fontWeight: "bold", fontSize: 14 }}>
          {padRow("TOTAL", formatINR(sale.totalAmount))}
        </div>
        <div>{D}</div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 8, fontSize: 10 }}>
          Thank you! Visit again.
        </div>
        <div style={{ textAlign: "center", fontSize: 10, marginTop: 2 }}>
          Powered by HisaabAI
        </div>
      </div>

      {/* 80mm thermal paper page size */}
      <style>{`
        @media print {
          @page { size: 80mm auto; margin: 3mm 2mm; }
        }
      `}</style>
    </>
  );
}
