import { prisma } from "@/lib/prisma";
import { subDays, startOfDay, format } from "date-fns";

export async function getBusinessDataForAI(shopId: string) {
  const thirtyDaysAgo = subDays(new Date(), 30);
  const sevenDaysAgo = subDays(new Date(), 7);
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  const [
    todaySales,
    yesterdaySales,
    weekSales,
    allProducts,
    categorySalesItems,
    khataCustomers,
    topProductItems,
  ] = await Promise.all([
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
    prisma.sale.findMany({
      where: { shopId, saleDate: { gte: sevenDaysAgo } },
      select: { saleDate: true, totalAmount: true },
    }),
    prisma.product.findMany({
      where: { shopId, isActive: true },
      select: {
        id: true,
        name: true,
        size: true,
        category: true,
        shopBottles: true,
        reorderLevel: true,
        mrp: true,
        costPrice: true,
      },
    }),
    prisma.saleItem.findMany({
      where: { sale: { shopId, saleDate: { gte: thirtyDaysAgo } } },
      select: {
        quantity: true,
        totalPrice: true,
        product: { select: { category: true } },
      },
    }),
    prisma.customer.findMany({
      where: { shopId, creditBalance: { gt: 0 } },
      select: { name: true, creditBalance: true, creditLimit: true },
    }),
    prisma.saleItem.findMany({
      where: { sale: { shopId, saleDate: { gte: thirtyDaysAgo } } },
      select: {
        quantity: true,
        totalPrice: true,
        productId: true,
        product: { select: { name: true, size: true, category: true } },
      },
    }),
  ]);

  // Build daily revenue trend (last 7 days)
  const dailyRevenue = new Map<string, number>();
  for (let i = 6; i >= 0; i--) {
    const date = format(subDays(new Date(), i), "EEE dd MMM");
    dailyRevenue.set(date, 0);
  }
  for (const sale of weekSales) {
    const key = format(sale.saleDate, "EEE dd MMM");
    if (dailyRevenue.has(key)) {
      dailyRevenue.set(key, (dailyRevenue.get(key) ?? 0) + Number(sale.totalAmount));
    }
  }

  // Category totals
  const catMap = new Map<string, { revenue: number; qty: number }>();
  for (const item of categorySalesItems) {
    const cat = item.product.category;
    const cur = catMap.get(cat) ?? { revenue: 0, qty: 0 };
    catMap.set(cat, {
      revenue: cur.revenue + Number(item.totalPrice),
      qty: cur.qty + item.quantity,
    });
  }

  // Top products by revenue
  const productMap = new Map<string, { name: string; size: string; category: string; revenue: number; qty: number }>();
  for (const item of topProductItems) {
    const cur = productMap.get(item.productId) ?? {
      name: item.product.name,
      size: item.product.size,
      category: item.product.category,
      revenue: 0,
      qty: 0,
    };
    productMap.set(item.productId, {
      ...cur,
      revenue: cur.revenue + Number(item.totalPrice),
      qty: cur.qty + item.quantity,
    });
  }
  const topProducts = Array.from(productMap.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  // Low stock
  const lowStock = allProducts
    .filter((p) => p.shopBottles <= p.reorderLevel)
    .map((p) => ({
      name: p.name,
      size: p.size,
      category: p.category,
      currentBottles: p.shopBottles,
      reorderAt: p.reorderLevel,
    }))
    .slice(0, 10);

  // Total 30-day revenue
  const thirtyDayRevenue = Array.from(catMap.values()).reduce(
    (sum, v) => sum + v.revenue,
    0
  );

  return {
    period: "Last 30 days",
    todayRevenue: Number(todaySales._sum.totalAmount ?? 0),
    todayTransactions: todaySales._count,
    yesterdayRevenue: Number(yesterdaySales._sum.totalAmount ?? 0),
    yesterdayTransactions: yesterdaySales._count,
    thirtyDayTotalRevenue: Math.round(thirtyDayRevenue),
    weeklyRevenueTrend: Array.from(dailyRevenue.entries()).map(([day, revenue]) => ({
      day,
      revenue: Math.round(revenue),
    })),
    topSellingProducts: topProducts.map((p) => ({
      ...p,
      revenue: Math.round(p.revenue),
    })),
    lowStockAlerts: lowStock,
    totalLowStockItems: lowStock.length,
    categorySales: Array.from(catMap.entries())
      .map(([category, data]) => ({
        category,
        revenue: Math.round(data.revenue),
        unitsSold: data.qty,
      }))
      .sort((a, b) => b.revenue - a.revenue),
    khataOutstanding: khataCustomers
      .map((c) => ({
        name: c.name,
        balance: Math.round(Number(c.creditBalance)),
        limit: Math.round(Number(c.creditLimit)),
        utilizationPct: Math.round(
          (Number(c.creditBalance) / Number(c.creditLimit)) * 100
        ),
      }))
      .sort((a, b) => b.balance - a.balance)
      .slice(0, 5),
    totalKhataOutstanding: Math.round(
      khataCustomers.reduce((s, c) => s + Number(c.creditBalance), 0)
    ),
    totalProducts: allProducts.length,
    currency: "INR (₹)",
  };
}
