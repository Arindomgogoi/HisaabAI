"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { productSchema, stockTransferSchema } from "@/lib/validators";
import { BPC_MAP } from "@/lib/constants";
import { getHSNCode } from "@/lib/constants";
import type { SizeUnit } from "@/generated/prisma";

export async function createProduct(formData: FormData) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const raw = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    await prisma.product.create({
      data: {
        name: data.name,
        brand: data.brand,
        category: data.category,
        size: data.size as SizeUnit,
        hsnCode: getHSNCode(data.category),
        mrp: data.mrp,
        costPrice: data.costPrice,
        bpc: data.bpc || BPC_MAP[data.size as SizeUnit],
        gstRate: data.gstRate,
        reorderLevel: data.reorderLevel,
        shopId,
      },
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch (e: unknown) {
    const error = e as { code?: string };
    if (error.code === "P2002") {
      return { error: "Product with this name and size already exists" };
    }
    return { error: "Failed to create product" };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const raw = Object.fromEntries(formData);
  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const data = parsed.data;

  try {
    await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        brand: data.brand,
        category: data.category,
        size: data.size as SizeUnit,
        hsnCode: getHSNCode(data.category),
        mrp: data.mrp,
        costPrice: data.costPrice,
        bpc: data.bpc || BPC_MAP[data.size as SizeUnit],
        gstRate: data.gstRate,
        reorderLevel: data.reorderLevel,
      },
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch {
    return { error: "Failed to update product" };
  }
}

export async function deleteProduct(id: string) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  try {
    await prisma.product.update({
      where: { id },
      data: { isActive: false },
    });

    revalidatePath("/inventory");
    return { success: true };
  } catch {
    return { error: "Failed to delete product" };
  }
}

export async function transferStock(formData: FormData) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const raw = Object.fromEntries(formData);
  const parsed = stockTransferSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { productId, cases } = parsed.data;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) return { error: "Product not found" };
  if (product.shopId !== shopId) return { error: "Unauthorized" };
  if (cases > product.warehouseCases) {
    return { error: `Only ${product.warehouseCases} cases available in warehouse` };
  }

  const bottlesGenerated = cases * product.bpc;

  // Transaction: decrement warehouse, increment shop, create transfer record
  await prisma.$transaction([
    prisma.product.update({
      where: { id: productId },
      data: {
        warehouseCases: { decrement: cases },
        shopBottles: { increment: bottlesGenerated },
      },
    }),
    prisma.stockTransfer.create({
      data: {
        productId,
        casesTransferred: cases,
        bottlesGenerated,
        shopId,
      },
    }),
  ]);

  revalidatePath("/inventory");
  revalidatePath("/inventory/transfer");
  revalidatePath("/dashboard");
  return { success: true, bottlesGenerated };
}

export async function receiveStock(
  entries: { productId: string; cases: number }[]
) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const validEntries = entries.filter((e) => e.cases > 0);
  if (validEntries.length === 0) return { error: "No stock quantities entered" };

  try {
    await prisma.$transaction(
      validEntries.map((entry) =>
        prisma.product.update({
          where: { id: entry.productId, shopId },
          data: { warehouseCases: { increment: entry.cases } },
        })
      )
    );
    revalidatePath("/inventory");
    revalidatePath("/inventory/receive");
    revalidatePath("/dashboard");
    return { success: true, count: validEntries.length };
  } catch {
    return { error: "Failed to update stock" };
  }
}
