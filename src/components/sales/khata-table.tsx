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
import { Badge } from "@/components/ui/badge";
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
import { IndianRupee, Loader2 } from "lucide-react";
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
}

export function KhataTable({ customers }: { customers: KhataCustomer[] }) {
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

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Balance</TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              Limit
            </TableHead>
            <TableHead className="hidden md:table-cell">Last Sale</TableHead>
            <TableHead className="text-right hidden sm:table-cell">
              Sales
            </TableHead>
            <TableHead className="w-[120px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No khata customers found
              </TableCell>
            </TableRow>
          )}
          {customers.map((c) => {
            const utilization =
              c.creditLimit > 0 ? (c.creditBalance / c.creditLimit) * 100 : 0;
            return (
              <TableRow key={c.id}>
                <TableCell>
                  <div>
                    <p className="font-medium text-sm">{c.name}</p>
                    {c.phone && (
                      <p className="text-xs text-muted-foreground">
                        {c.phone}
                      </p>
                    )}
                  </div>
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
                  {utilization > 80 && (
                    <Badge
                      variant="destructive"
                      className="text-[9px] ml-1 px-1"
                    >
                      {Math.round(utilization)}%
                    </Badge>
                  )}
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
                          <DialogTitle>
                            Record Payment — {c.name}
                          </DialogTitle>
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
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
