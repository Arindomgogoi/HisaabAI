"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { shopSchema } from "@/lib/validators";

export async function updateShop(formData: FormData) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const raw = Object.fromEntries(formData);
  const parsed = shopSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await prisma.shop.update({
      where: { id: shopId },
      data: parsed.data,
    });
    revalidatePath("/settings");
    return { success: true };
  } catch {
    return { error: "Failed to save settings" };
  }
}
