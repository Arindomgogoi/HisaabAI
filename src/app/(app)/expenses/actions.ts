"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { expenseSchema } from "@/lib/validators";
import { revalidatePath } from "next/cache";

export async function createExpense(data: {
  date: string;
  category: string;
  description: string;
  amount: number;
  paymentMode: string;
}) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const parsed = expenseSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await prisma.expense.create({
      data: {
        date: new Date(parsed.data.date),
        category: parsed.data.category,
        description: parsed.data.description,
        amount: parsed.data.amount,
        paymentMode: parsed.data.paymentMode,
        shopId,
      },
    });

    revalidatePath("/expenses");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { error: "Failed to save expense" };
  }
}

export async function deleteExpense(id: string) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  try {
    await prisma.expense.deleteMany({ where: { id, shopId } });
    revalidatePath("/expenses");
    return { success: true };
  } catch {
    return { error: "Failed to delete expense" };
  }
}
