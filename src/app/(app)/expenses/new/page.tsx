import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function NewExpensePage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/expenses">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">Add Expense</h1>
          <p className="text-muted-foreground mt-1">
            Record a business expense
          </p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-5">
        <ExpenseForm />
      </div>
    </div>
  );
}
