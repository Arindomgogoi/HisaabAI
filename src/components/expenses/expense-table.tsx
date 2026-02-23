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
import { formatINR, formatDate } from "@/lib/formatters";
import { deleteExpense } from "@/app/(app)/expenses/actions";
import { Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Expense {
  id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
  paymentMode: string;
}

const CATEGORY_STYLES: Record<string, string> = {
  Rent: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Salary:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Electricity:
    "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
  Transport:
    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Maintenance:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Miscellaneous:
    "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400",
};

const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  upi: "UPI",
  bank: "Bank",
};

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(id: string) {
    setDeletingId(id);
    const result = await deleteExpense(id);
    setDeletingId(null);
    if (result.error) toast.error(result.error);
    else toast.success("Expense deleted");
  }

  return (
    <div className="rounded-lg border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="hidden sm:table-cell">Payment</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-10"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-8 text-muted-foreground"
              >
                No expenses recorded yet
              </TableCell>
            </TableRow>
          )}
          {expenses.map((e) => (
            <TableRow key={e.id}>
              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                {formatDate(e.date)}
              </TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-block text-xs font-semibold px-2 py-0.5 rounded-full",
                    CATEGORY_STYLES[e.category] ?? CATEGORY_STYLES.Miscellaneous
                  )}
                >
                  {e.category}
                </span>
              </TableCell>
              <TableCell className="text-sm">{e.description}</TableCell>
              <TableCell className="hidden sm:table-cell text-xs text-muted-foreground">
                {PAYMENT_LABELS[e.paymentMode] ?? e.paymentMode}
              </TableCell>
              <TableCell className="text-right font-semibold text-sm">
                {formatINR(e.amount)}
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-red-600"
                  onClick={() => handleDelete(e.id)}
                  disabled={deletingId === e.id}
                >
                  {deletingId === e.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="w-3.5 h-3.5" />
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
