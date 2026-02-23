import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getExpenses } from "@/lib/data/expenses";
import { ExpenseTable } from "@/components/expenses/expense-table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { formatINR } from "@/lib/formatters";

const CATEGORY_ORDER = [
  "Rent",
  "Salary",
  "Electricity",
  "Transport",
  "Maintenance",
  "Miscellaneous",
];

export default async function ExpensesPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const { expenses, monthTotal, categoryTotals } = await getExpenses(shopId);

  const categoriesWithData = CATEGORY_ORDER.filter(
    (cat) => (categoryTotals[cat] ?? 0) > 0
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Expenses</h1>
          <p className="text-muted-foreground mt-1">
            This month:{" "}
            <span className="font-semibold text-foreground">
              {formatINR(monthTotal)}
            </span>
          </p>
        </div>
        <Link href="/expenses/new">
          <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </Link>
      </div>

      {/* Category breakdown */}
      {categoriesWithData.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {categoriesWithData.map((cat) => (
            <div
              key={cat}
              className="rounded-lg border bg-card p-3 text-center space-y-0.5"
            >
              <p className="text-xs text-muted-foreground">{cat}</p>
              <p className="font-semibold text-sm">
                {formatINR(categoryTotals[cat] ?? 0)}
              </p>
            </div>
          ))}
        </div>
      )}

      <ExpenseTable expenses={expenses} />
    </div>
  );
}
