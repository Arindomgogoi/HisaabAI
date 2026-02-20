"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { generateInvoiceNumber } from "@/lib/data/sales";
import type { PaymentMode } from "@/generated/prisma";

interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

interface CreateSaleInput {
  items: SaleItem[];
  paymentMode: PaymentMode;
  customerId?: string;
  discount?: number;
}

export async function createSale(input: CreateSaleInput) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  if (!input.items.length) return { error: "At least one item is required" };

  const discount = input.discount ?? 0;
  const subtotal = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const totalAmount = subtotal - discount;

  if (totalAmount <= 0) return { error: "Total must be positive" };

  // Validate credit customer
  if (input.paymentMode === "CREDIT") {
    if (!input.customerId) return { error: "Customer required for credit sales" };
    const customer = await prisma.customer.findUnique({
      where: { id: input.customerId },
    });
    if (!customer) return { error: "Customer not found" };
    const newBalance = Number(customer.creditBalance) + totalAmount;
    if (newBalance > Number(customer.creditLimit)) {
      return {
        error: `Credit limit exceeded. Available: ₹${(Number(customer.creditLimit) - Number(customer.creditBalance)).toFixed(0)}`,
      };
    }
  }

  // Validate stock availability and collect GST rates
  const productGstRates = new Map<string, number>();
  for (const item of input.items) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId },
      select: { name: true, shopBottles: true, shopId: true, gstRate: true },
    });
    if (!product) return { error: `Product not found` };
    if (product.shopId !== shopId) return { error: "Unauthorized" };
    if (product.shopBottles < item.quantity) {
      return { error: `Not enough stock for ${product.name}. Available: ${product.shopBottles}` };
    }
    productGstRates.set(item.productId, product.gstRate);
  }

  // Calculate GST — MRP is tax-inclusive, back-calculate tax
  let totalCgst = 0;
  let totalSgst = 0;
  const itemsWithGst = input.items.map((item) => {
    const gstRate = productGstRates.get(item.productId) ?? 18;
    const lineTotal = item.quantity * item.unitPrice;
    const taxableValue = lineTotal / (1 + gstRate / 100);
    const taxAmount = lineTotal - taxableValue;
    totalCgst += taxAmount / 2;
    totalSgst += taxAmount / 2;
    return { ...item, gstRate };
  });
  totalCgst = Math.round(totalCgst * 100) / 100;
  totalSgst = Math.round(totalSgst * 100) / 100;

  const invoiceNumber = generateInvoiceNumber();

  try {
    // Transaction: create sale, create items, decrement stock, update credit
    const operations = [];

    // Create the sale
    operations.push(
      prisma.sale.create({
        data: {
          invoiceNumber,
          subtotal,
          discount,
          totalAmount,
          cgst: totalCgst,
          sgst: totalSgst,
          paymentMode: input.paymentMode,
          customerId: input.customerId || null,
          shopId,
          items: {
            create: itemsWithGst.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              totalPrice: item.quantity * item.unitPrice,
              gstRate: item.gstRate,
            })),
          },
        },
      })
    );

    // Decrement stock for each item
    for (const item of input.items) {
      operations.push(
        prisma.product.update({
          where: { id: item.productId },
          data: { shopBottles: { decrement: item.quantity } },
        })
      );
    }

    // Update credit balance if credit sale
    if (input.paymentMode === "CREDIT" && input.customerId) {
      operations.push(
        prisma.customer.update({
          where: { id: input.customerId },
          data: { creditBalance: { increment: totalAmount } },
        })
      );
    }

    const [sale] = await prisma.$transaction(operations);

    revalidatePath("/sales");
    revalidatePath("/sales/pos");
    revalidatePath("/dashboard");
    revalidatePath("/inventory");

    return {
      success: true,
      saleId: (sale as { id: string }).id,
      invoiceNumber,
      totalAmount,
    };
  } catch {
    return { error: "Failed to create sale" };
  }
}

export async function recordPayment(customerId: string, amount: number) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  if (amount <= 0) return { error: "Amount must be positive" };

  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  });

  if (!customer) return { error: "Customer not found" };
  if (customer.shopId !== shopId) return { error: "Unauthorized" };

  const currentBalance = Number(customer.creditBalance);
  if (amount > currentBalance) {
    return { error: `Payment exceeds balance of ₹${currentBalance.toFixed(0)}` };
  }

  await prisma.customer.update({
    where: { id: customerId },
    data: { creditBalance: { decrement: amount } },
  });

  revalidatePath("/sales/khata");
  revalidatePath("/dashboard");

  return { success: true, newBalance: currentBalance - amount };
}

export async function createCustomer(formData: FormData) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) return { error: "Not authenticated" };

  const name = formData.get("name") as string;
  const phone = (formData.get("phone") as string) || null;
  const address = (formData.get("address") as string) || null;
  const creditLimit = parseFloat(formData.get("creditLimit") as string) || 5000;

  if (!name) return { error: "Customer name is required" };

  try {
    const customer = await prisma.customer.create({
      data: { name, phone, address, creditLimit, shopId },
    });

    revalidatePath("/sales/khata");
    return { success: true, customerId: customer.id };
  } catch {
    return { error: "Failed to create customer" };
  }
}
