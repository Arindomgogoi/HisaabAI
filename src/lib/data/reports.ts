import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function getReportSummary(shopId: string, from: Date, to: Date) {
  const result = await prisma.sale.aggregate({
    where: { shopId, saleDate: { gte: from, lte: to } },
    _sum: { totalAmount: true, discount: true },
    _count: true,
    _avg: { totalAmount: true },
  });

  return {
    totalRevenue: Number(result._sum.totalAmount ?? 0),
    totalDiscount: Number(result._sum.discount ?? 0),
    transactions: result._count,
    avgOrderValue: Number(result._avg.totalAmount ?? 0),
  };
}

export async function getDailyBreakdown(shopId: string, from: Date, to: Date) {
  const sales = await prisma.sale.findMany({
    where: { shopId, saleDate: { gte: from, lte: to } },
    select: {
      saleDate: true,
      totalAmount: true,
      paymentMode: true,
    },
    orderBy: { saleDate: "asc" },
  });

  const map = new Map<
    string,
    { revenue: number; transactions: number; cash: number; upi: number; credit: number }
  >();

  for (const sale of sales) {
    const day = format(new Date(sale.saleDate), "yyyy-MM-dd");
    const existing = map.get(day) ?? {
      revenue: 0,
      transactions: 0,
      cash: 0,
      upi: 0,
      credit: 0,
    };
    const amount = Number(sale.totalAmount);
    existing.revenue += amount;
    existing.transactions += 1;
    if (sale.paymentMode === "CASH") existing.cash += amount;
    else if (sale.paymentMode === "UPI") existing.upi += amount;
    else if (sale.paymentMode === "CREDIT") existing.credit += amount;
    map.set(day, existing);
  }

  return Array.from(map.entries())
    .map(([date, data]) => ({ date, ...data }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getProductReport(shopId: string, from: Date, to: Date) {
  const items = await prisma.saleItem.findMany({
    where: { sale: { shopId, saleDate: { gte: from, lte: to } } },
    select: {
      quantity: true,
      totalPrice: true,
      product: { select: { name: true, size: true, brand: true } },
    },
  });

  const map = new Map<string, { name: string; qty: number; revenue: number }>();
  for (const item of items) {
    const key = `${item.product.name}|${item.product.size}`;
    const label = `${item.product.name} (${SIZE_LABEL[item.product.size] ?? item.product.size})`;
    const existing = map.get(key) ?? { name: label, qty: 0, revenue: 0 };
    existing.qty += item.quantity;
    existing.revenue += Number(item.totalPrice);
    map.set(key, existing);
  }

  return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
}

export async function getPaymentModeSplit(shopId: string, from: Date, to: Date) {
  const modes = ["CASH", "UPI", "CREDIT"] as const;
  const results = await Promise.all(
    modes.map((mode) =>
      prisma.sale.aggregate({
        where: { shopId, paymentMode: mode, saleDate: { gte: from, lte: to } },
        _sum: { totalAmount: true },
        _count: true,
      })
    )
  );

  return {
    cash: { amount: Number(results[0]._sum.totalAmount ?? 0), count: results[0]._count },
    upi: { amount: Number(results[1]._sum.totalAmount ?? 0), count: results[1]._count },
    credit: { amount: Number(results[2]._sum.totalAmount ?? 0), count: results[2]._count },
  };
}

const SIZE_LABEL: Record<string, string> = {
  ML_750: "750ml",
  ML_375: "375ml",
  ML_180: "180ml",
  CAN_500: "500ml Can",
  BOTTLE_650: "650ml",
};
