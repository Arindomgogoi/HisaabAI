"use client";

import { useState } from "react";
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
import { Separator } from "@/components/ui/separator";
import { formatINR, formatINRCompact } from "@/lib/formatters";
import { PAYMENT_MODE_LABELS } from "@/lib/constants";
import { createSale } from "@/app/(app)/sales/actions";
import { Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import type { CartItem } from "@/hooks/use-cart";
import type { PaymentMode } from "@/generated/prisma";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  creditLimit: unknown;
  creditBalance: unknown;
}

interface CartSummaryProps {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  itemCount: number;
  onSetDiscount: (discount: number) => void;
  onClearCart: () => void;
  customers: Customer[];
}

export function CartSummary({
  items,
  subtotal,
  discount,
  total,
  itemCount,
  onSetDiscount,
  onClearCart,
  customers,
}: CartSummaryProps) {
  const router = useRouter();
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("CASH");
  const [customerId, setCustomerId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleBill() {
    if (items.length === 0) return;
    setLoading(true);

    const result = await createSale({
      items: items.map((i) => ({
        productId: i.product.id,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      paymentMode,
      customerId: paymentMode === "CREDIT" ? customerId : undefined,
      discount,
    });

    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else {
      toast.success(`Bill generated: ${result.invoiceNumber}`);
      onClearCart();
      setLoading(false);
      router.push(`/sales/${result.saleId}?print=1`);
    }
  }

  return (
    <div className="space-y-4 pt-3 border-t">
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            Subtotal ({itemCount} items)
          </span>
          <span className="font-medium">{formatINR(subtotal)}</span>
        </div>

        <div className="flex items-center gap-2">
          <Label className="text-sm text-muted-foreground shrink-0">
            Discount
          </Label>
          <Input
            type="number"
            min="0"
            max={subtotal}
            value={discount || ""}
            onChange={(e) => onSetDiscount(parseFloat(e.target.value) || 0)}
            placeholder="0"
            className="h-8 text-sm"
          />
        </div>

        <Separator />

        <div className="flex justify-between text-base">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">{formatINR(total)}</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-sm">Payment Mode</Label>
        <Select
          value={paymentMode}
          onValueChange={(v) => {
            setPaymentMode(v as PaymentMode);
            if (v !== "CREDIT") setCustomerId("");
          }}
        >
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(PAYMENT_MODE_LABELS).map(([key, label]) => (
              <SelectItem key={key} value={key}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {paymentMode === "CREDIT" && (
        <div className="space-y-2">
          <Label className="text-sm">Customer (Khata)</Label>
          <Select value={customerId} onValueChange={setCustomerId}>
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Select customer..." />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                  {c.phone ? ` (${c.phone})` : ""} — Balance:{" "}
                  {formatINRCompact(Number(c.creditBalance))}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Button
        className="w-full bg-amber-500 hover:bg-amber-600 text-white h-11"
        onClick={handleBill}
        disabled={
          items.length === 0 ||
          loading ||
          (paymentMode === "CREDIT" && !customerId)
        }
      >
        {loading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Receipt className="w-4 h-4 mr-2" />
        )}
        Generate Bill — {formatINR(total)}
      </Button>
    </div>
  );
}
