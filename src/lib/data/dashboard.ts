import { prisma } from "@/lib/prisma";
import { startOfDay, subDays, format } from "date-fns";

export async function getTodaySummary(shopId: string) {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  const [todaySales, yesterdaySales] = await Promise.all([
    prisma.sale.aggregate({
      where: { shopId, saleDate: { gte: today } },
      _sum: { totalAmount: true },
      _count: true,
    }),
    prisma.sale.aggregate({
      where: { shopId, saleDate: { gte: yesterday, lt: today } },
      _sum: { totalAmount: true },
      _count: true,
    }),
  ]);

  const [todayItems, yesterdayItems] = await Promise.all([
    prisma.saleItem.aggregate({
      where: { sale: { shopId, saleDate: { gte: today } } },
      _sum: { quantity: true },
    }),
    prisma.saleItem.aggregate({
      where: { sale: { shopId, saleDate: { gte: yesterday, lt: today } } },
      _sum: { quantity: true },
    }),
  ]);

  // Calculate avg margin from today's sales
  const todaySaleItems = await prisma.saleItem.findMany({
    where: { sale: { shopId, saleDate: { gte: today } } },
    include: { product: { select: { costPrice: true } } },
  });

  let totalRevenue = 0;
  let totalCost = 0;
  for (const item of todaySaleItems) {
    totalRevenue += Number(item.totalPrice);
    totalCost += Number(item.product.costPrice) * item.quantity;
  }
  const avgMargin =
    totalRevenue > 0 ? ((totalRevenue - totalCost) / totalRevenue) * 100 : 0;

  const todayRevenue = Number(todaySales._sum.totalAmount ?? 0);
  const yesterdayRevenue = Number(yesterdaySales._sum.totalAmount ?? 0);
  const revenueChange =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : 0;

  const todayItemsSold = todayItems._sum.quantity ?? 0;
  const yesterdayItemsSold = yesterdayItems._sum.quantity ?? 0;
  const itemsChange =
    yesterdayItemsSold > 0
      ? ((todayItemsSold - yesterdayItemsSold) / yesterdayItemsSold) * 100
      : 0;

  const todayTransactions = todaySales._count;
  const transactionsChange =
    yesterdaySales._count > 0
      ? ((todayTransactions - yesterdaySales._count) / yesterdaySales._count) * 100
      : 0;

  return {
    todayRevenue,
    yesterdayRevenue,
    revenueChange,
    todayItemsSold,
    itemsChange,
    todayTransactions,
    transactionsChange,
    avgMargin,
  };
}

export async function getSalesTrend(shopId: string, days: number = 7) {
  const startDate = subDays(startOfDay(new Date()), days - 1);

  const sales = await prisma.sale.findMany({
    where: { shopId, saleDate: { gte: startDate } },
    select: { saleDate: true, totalAmount: true },
  });

  const salesItems = await prisma.saleItem.findMany({
    where: { sale: { shopId, saleDate: { gte: startDate } } },
    select: { quantity: true, sale: { select: { saleDate: true } } },
  });

  // Group by date
  const dateMap = new Map<string, { revenue: number; items: number; transactions: number }>();
  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), days - 1 - i), "yyyy-MM-dd");
    dateMap.set(date, { revenue: 0, items: 0, transactions: 0 });
  }

  for (const sale of sales) {
    const key = format(sale.saleDate, "yyyy-MM-dd");
    const entry = dateMap.get(key);
    if (entry) {
      entry.revenue += Number(sale.totalAmount);
      entry.transactions += 1;
    }
  }

  for (const item of salesItems) {
    const key = format(item.sale.saleDate, "yyyy-MM-dd");
    const entry = dateMap.get(key);
    if (entry) {
      entry.items += item.quantity;
    }
  }

  return Array.from(dateMap.entries()).map(([date, data]) => ({
    date: format(new Date(date), "dd MMM"),
    ...data,
  }));
}

export async function getLowStockProducts(shopId: string) {
  const products = await prisma.product.findMany({
    where: {
      shopId,
      isActive: true,
      shopBottles: { lte: prisma.product.fields.reorderLevel },
    },
    orderBy: { shopBottles: "asc" },
    take: 10,
  });

  // Filter in memory since Prisma doesn't support column comparison in where
  const allProducts = await prisma.product.findMany({
    where: { shopId, isActive: true },
    orderBy: { shopBottles: "asc" },
  });

  return allProducts
    .filter((p) => p.shopBottles <= p.reorderLevel)
    .slice(0, 10)
    .map((p) => ({
      id: p.id,
      name: p.name,
      size: p.size,
      category: p.category,
      shopBottles: p.shopBottles,
      reorderLevel: p.reorderLevel,
    }));
}

export async function getRecentSales(shopId: string, limit: number = 10) {
  const sales = await prisma.sale.findMany({
    where: { shopId },
    orderBy: { saleDate: "desc" },
    take: limit,
    include: {
      customer: { select: { name: true } },
      _count: { select: { items: true } },
    },
  });

  return sales.map((s) => ({
    id: s.id,
    invoiceNumber: s.invoiceNumber,
    saleDate: s.saleDate,
    totalAmount: Number(s.totalAmount),
    paymentMode: s.paymentMode,
    itemCount: s._count.items,
    customerName: s.customer?.name ?? null,
  }));
}

export async function getProductCount(shopId: string) {
  return prisma.product.count({ where: { shopId, isActive: true } });
}

export async function getCategorySales(shopId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);

  const items = await prisma.saleItem.findMany({
    where: { sale: { shopId, saleDate: { gte: thirtyDaysAgo } } },
    include: { product: { select: { category: true } } },
  });

  const categoryMap = new Map<string, number>();
  for (const item of items) {
    const cat = item.product.category;
    categoryMap.set(cat, (categoryMap.get(cat) ?? 0) + Number(item.totalPrice));
  }

  return Array.from(categoryMap.entries())
    .map(([category, revenue]) => ({ category, revenue }))
    .sort((a, b) => b.revenue - a.revenue);
}
