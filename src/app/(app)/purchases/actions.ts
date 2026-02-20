"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { purchaseSchema, supplierSchema } from "@/lib/validators";

export async function createPurchase(data: {
  invoiceNumber: string;
  purchaseDate: string;
  supplierId: string;
  paymentStatus: string;
  items: Array<{ productId: string; cases: number; costPerCase: number }>;
}) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const parsed = purchaseSchema.safeParse(data);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { invoiceNumber, purchaseDate, supplierId, paymentStatus, items } =
    parsed.data;

  // Verify supplier belongs to shop
  const supplier = await prisma.supplier.findFirst({
    where: { id: supplierId, shopId },
  });
  if (!supplier) return { error: "Supplier not found" };

  // Fetch gstRate for each product and calculate input tax
  const productIds = items.map((i) => i.productId);
  const products = await prisma.product.findMany({
    where: { id: { in: productIds } },
    select: { id: true, gstRate: true },
  });
  const gstRateMap = new Map(products.map((p) => [p.id, p.gstRate]));

  let totalCgst = 0;
  let totalSgst = 0;
  const itemsWithGst = items.map((item) => {
    const gstRate = gstRateMap.get(item.productId) ?? 18;
    const taxAmount = item.cases * item.costPerCase * (gstRate / 100);
    totalCgst += taxAmount / 2;
    totalSgst += taxAmount / 2;
    return { ...item, gstRate };
  });
  totalCgst = Math.round(totalCgst * 100) / 100;
  totalSgst = Math.round(totalSgst * 100) / 100;

  // Calculate total
  const totalAmount = items.reduce(
    (sum, item) => sum + item.cases * item.costPerCase,
    0
  );

  try {
    // Transaction: create purchase + items + update warehouse stock
    await prisma.$transaction([
      prisma.purchase.create({
        data: {
          invoiceNumber,
          purchaseDate: new Date(purchaseDate),
          totalAmount,
          cgst: totalCgst,
          sgst: totalSgst,
          paymentStatus,
          supplierId,
          shopId,
          items: {
            create: itemsWithGst.map((item) => ({
              productId: item.productId,
              cases: item.cases,
              costPerCase: item.costPerCase,
              totalCost: item.cases * item.costPerCase,
              gstRate: item.gstRate,
            })),
          },
        },
      }),
      ...items.map((item) =>
        prisma.product.update({
          where: { id: item.productId },
          data: { warehouseCases: { increment: item.cases } },
        })
      ),
    ]);

    revalidatePath("/purchases");
    revalidatePath("/inventory");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (e: unknown) {
    const err = e as { code?: string };
    if (err.code === "P2002") {
      return { error: "Invoice number already exists" };
    }
    return { error: "Failed to save purchase" };
  }
}

export async function createSupplier(formData: FormData) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const raw = Object.fromEntries(formData);
  const parsed = supplierSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const { name, phone, contactName, gstNumber } = parsed.data;

  try {
    const supplier = await prisma.supplier.create({
      data: { name, phone, contactName, gstNumber, shopId },
    });
    revalidatePath("/purchases");
    return { success: true, supplier: { id: supplier.id, name: supplier.name, phone: supplier.phone } };
  } catch {
    return { error: "Failed to create supplier" };
  }
}
