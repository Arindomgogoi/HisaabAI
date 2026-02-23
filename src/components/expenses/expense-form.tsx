"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createExpense } from "@/app/(app)/expenses/actions";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Rent",
  "Salary",
  "Electricity",
  "Transport",
  "Maintenance",
  "Miscellaneous",
] as const;

const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank", label: "Bank Transfer" },
];

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

export function ExpenseForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [date, setDate] = useState(todayString());
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("cash");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    setLoading(true);
    const result = await createExpense({
      date,
      category,
      description,
      amount: parseFloat(amount),
      paymentMode,
    });
    setLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Expense recorded");
      router.push("/expenses");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="date">Date</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label>Category</Label>
          <Select value={category} onValueChange={setCategory} required>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          placeholder="e.g. Monthly rent for April"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Amount (₹)</Label>
          <Input
            id="amount"
            type="number"
            min="1"
            step="0.01"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label>Payment Mode</Label>
          <Select value={paymentMode} onValueChange={setPaymentMode}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAYMENT_MODES.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/expenses")}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading || !category || !description || !amount}
          className="bg-amber-500 hover:bg-amber-600 text-white"
        >
          {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Expense
        </Button>
      </div>
    </form>
  );
}
