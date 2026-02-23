import { prisma } from "@/lib/prisma";

export async function getExpenses(shopId: string) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const expenses = await prisma.expense.findMany({
    where: { shopId },
    orderBy: { date: "desc" },
    take: 100,
  });

  const monthTotal = expenses
    .filter((e) => e.date >= startOfMonth)
    .reduce((sum, e) => sum + Number(e.amount), 0);

  const categoryTotals = expenses
    .filter((e) => e.date >= startOfMonth)
    .reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] ?? 0) + Number(e.amount);
      return acc;
    }, {});

  return {
    expenses: expenses.map((e) => ({
      id: e.id,
      date: e.date,
      category: e.category,
      description: e.description,
      amount: Number(e.amount),
      paymentMode: e.paymentMode,
    })),
    monthTotal,
    categoryTotals,
  };
}
