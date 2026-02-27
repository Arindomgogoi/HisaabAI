"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { formatINR, formatDate } from "@/lib/formatters";
import { recordPayment } from "@/app/(app)/sales/actions";
import { cn } from "@/lib/utils";
import { IndianRupee, Loader2, MessageCircle } from "lucide-react";
import { toast } from "sonner";

interface KhataCustomer {
  id: string;
  name: string;
  phone: string | null;
  address: string | null;
  creditLimit: number;
  creditBalance: number;
  totalSales: number;
  lastSale: { date: Date; amount: number } | null;
  trustScore: number;
  riskTier: "Safe" | "Moderate" | "Risky" | "High Risk";
  collectionPriority: number;
}

const TIER_STYLES: Record<string, string> = {
  "Safe": "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  "Moderate": "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  "Risky": "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  "High Risk": "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

export function KhataTable({
  customers,
  shopName,
}: {
  customers: KhataCustomer[];
  shopName: string;
}) {
  const [paymentCustomerId, setPaymentCustomerId] = useState<string | null>(
    null
  );
  const [paymentAmount, setPaymentAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function handlePayment() {
    if (!paymentCustomerId || !paymentAmount) return;
    setLoading(true);

    const amount = parseFloat(paymentAmount);
    const result = await recordPayment(paymentCustomerId, amount);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(
        `Payment of ${formatINR(amount)} recorded. New balance: ${formatINR(result.newBalance!)}`
      );
      setPaymentCustomerId(null);
      setPaymentAmount("");
    }
    setLoading(false);
  }

  function buildWhatsAppUrl(phone: string, name: string, balance: number) {
    const cleanPhone = phone.replace(/\D/g, "");
    const fullPhone = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    const message = `Namaste ${name} ji,\n\n${shopName} mein aapka \u20b9${Math.round(balance).toLocaleString("en-IN")} outstanding balance hai.\n\nKripya jald se jald payment karein.\n\nShukriya \uD83D\uDE4F`;
    return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="hidden sm:table-cell">Trust</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              Limit
            </TableHead>
            <TableHead className="hidden md:table-cell">Last Sale</TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              Sales
            </TableHead>
            <TableHead className="w-[140px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center py-8 text-muted-foreground"
              >
                No khata customers found
              </TableCell>
            </TableRow>
          )}
          {customers.map((c) => (
            <TableRow key={c.id}>
              <TableCell>
                <div>
                  <p className="font-medium text-sm">{c.name}</p>
                  {c.phone && (
                    <p className="text-xs text-muted-foreground">{c.phone}</p>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full",
                    TIER_STYLES[c.riskTier]
                  )}
                >
                  {c.trustScore}
                  <span className="font-normal opacity-75">{c.riskTier}</span>
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span
                  className={cn(
                    "font-semibold text-sm",
                    c.creditBalance > 0 ? "text-red-600" : "text-green-600"
                  )}
                >
                  {formatINR(c.creditBalance)}
                </span>
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell text-sm text-muted-foreground">
                {formatINR(c.creditLimit)}
              </TableCell>
              <TableCell className="hidden md:table-cell text-xs text-muted-foreground">
                {c.lastSale
                  ? `${formatDate(c.lastSale.date)} — ${formatINR(c.lastSale.amount)}`
                  : "—"}
              </TableCell>
              <TableCell className="text-right hidden sm:table-cell text-sm text-muted-foreground">
                {c.totalSales}
              </TableCell>
              <TableCell>
                {c.creditBalance > 0 && (
                  <div className="flex items-center gap-1">
                    {/* WhatsApp reminder */}
                    {c.phone ? (
                      <a
                        href={buildWhatsAppUrl(c.phone, c.name, c.creditBalance)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs text-green-600 border-green-200 hover:bg-green-50 hover:text-green-700"
                        >
                          <MessageCircle className="w-3 h-3" />
                        </Button>
                      </a>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs opacity-40"
                        disabled
                        title="No phone number"
                      >
                        <MessageCircle className="w-3 h-3" />
                      </Button>
                    )}

                    {/* Pay dialog */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-7 text-xs"
                          onClick={() => {
                            setPaymentCustomerId(c.id);
                            setPaymentAmount("");
                          }}
                        >
                          <IndianRupee className="w-3 h-3 mr-1" />
                          Pay
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-sm">
                        <DialogHeader>
                          <DialogTitle>Record Payment — {c.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3 py-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">
                              Outstanding
                            </span>
                            <span className="font-semibold text-red-600">
                              {formatINR(c.creditBalance)}
                            </span>
                          </div>
                          <Input
                            type="number"
                            min="1"
                            max={c.creditBalance}
                            placeholder="Enter payment amount"
                            value={paymentAmount}
                            onChange={(e) => setPaymentAmount(e.target.value)}
                          />
                          <Button
                            variant="link"
                            size="sm"
                            className="text-xs p-0 h-auto"
                            onClick={() =>
                              setPaymentAmount(c.creditBalance.toString())
                            }
                          >
                            Pay full balance
                          </Button>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline" size="sm">
                              Cancel
                            </Button>
                          </DialogClose>
                          <Button
                            size="sm"
                            onClick={handlePayment}
                            disabled={
                              loading ||
                              !paymentAmount ||
                              parseFloat(paymentAmount) <= 0
                            }
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                          >
                            {loading && (
                              <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                            )}
                            Record Payment
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
