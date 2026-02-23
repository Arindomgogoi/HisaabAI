import { prisma } from "@/lib/prisma";
import type { PaymentMode } from "@/generated/prisma";

interface SalesFilters {
  search?: string;
  paymentMode?: PaymentMode;
  dateFrom?: Date;
  dateTo?: Date;
}

export async function getSales(shopId: string, filters?: SalesFilters) {
  const where: Record<string, unknown> = { shopId };

  if (filters?.paymentMode) {
    where.paymentMode = filters.paymentMode;
  }

  if (filters?.dateFrom || filters?.dateTo) {
    const dateFilter: Record<string, Date> = {};
    if (filters.dateFrom) dateFilter.gte = filters.dateFrom;
    if (filters.dateTo) dateFilter.lte = filters.dateTo;
    where.saleDate = dateFilter;
  }

  if (filters?.search) {
    where.invoiceNumber = { contains: filters.search, mode: "insensitive" };
  }

  const sales = await prisma.sale.findMany({
    where,
    orderBy: { saleDate: "desc" },
    take: 100,
    include: {
      customer: { select: { name: true } },
      items: { select: { id: true } },
    },
  });

  return sales.map((s) => ({
    id: s.id,
    invoiceNumber: s.invoiceNumber,
    saleDate: s.saleDate,
    totalAmount: Number(s.totalAmount),
    discount: Number(s.discount),
    paymentMode: s.paymentMode,
    itemCount: s.items.length,
    customerName: s.customer?.name ?? null,
  }));
}

export async function getSaleDetail(id: string) {
  const sale = await prisma.sale.findUnique({
    where: { id },
    include: {
      customer: { select: { name: true, phone: true } },
      shop: { select: { name: true, address: true, phone: true, licenseNumber: true } },
      items: {
        include: {
          product: { select: { name: true, size: true, brand: true } },
        },
      },
    },
  });

  if (!sale) return null;

  return {
    id: sale.id,
    invoiceNumber: sale.invoiceNumber,
    saleDate: sale.saleDate,
    subtotal: Number(sale.subtotal),
    discount: Number(sale.discount),
    totalAmount: Number(sale.totalAmount),
    cgst: Number(sale.cgst),
    sgst: Number(sale.sgst),
    paymentMode: sale.paymentMode,
    customer: sale.customer,
    shop: sale.shop,
    items: sale.items.map((i) => ({
      id: i.id,
      productName: i.product.name,
      productSize: i.product.size,
      productBrand: i.product.brand,
      quantity: i.quantity,
      unitPrice: Number(i.unitPrice),
      totalPrice: Number(i.totalPrice),
    })),
  };
}

export async function getProductsForPOS(shopId: string) {
  const products = await prisma.product.findMany({
    where: { shopId, isActive: true, shopBottles: { gt: 0 } },
    orderBy: [{ category: "asc" }, { name: "asc" }, { size: "asc" }],
    select: {
      id: true,
      name: true,
      brand: true,
      category: true,
      size: true,
      mrp: true,
      shopBottles: true,
    },
  });

  return products.map((p) => ({
    ...p,
    mrp: Number(p.mrp),
  }));
}

export async function getCustomers(shopId: string) {
  return prisma.customer.findMany({
    where: { shopId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      phone: true,
      creditLimit: true,
      creditBalance: true,
    },
  });
}

type RiskTier = "Safe" | "Moderate" | "Risky" | "High Risk";

function computeTrustScore(
  creditBalance: number,
  creditLimit: number,
  totalSales: number,
  lastSaleDate: Date | null
): { score: number; tier: RiskTier } {
  let score = 100;

  const utilization = creditLimit > 0 ? (creditBalance / creditLimit) * 100 : 0;

  // Penalize high utilization
  if (utilization >= 90) score -= 40;
  else if (utilization >= 70) score -= 25;
  else if (utilization >= 50) score -= 15;
  else if (utilization >= 30) score -= 5;

  // Penalize large absolute outstanding
  if (creditBalance > 10000) score -= 15;
  else if (creditBalance > 5000) score -= 10;
  else if (creditBalance > 2000) score -= 5;

  // Reward loyal customers
  if (totalSales > 20) score += 10;
  else if (totalSales > 10) score += 5;
  else if (totalSales > 5) score += 2;

  // Penalize inactive customers with outstanding balance
  if (creditBalance > 0 && lastSaleDate) {
    const daysSince = Math.floor(
      (Date.now() - lastSaleDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince > 60) score -= 15;
    else if (daysSince > 30) score -= 8;
  } else if (creditBalance > 0 && !lastSaleDate) {
    score -= 15;
  }

  const finalScore = Math.max(0, Math.min(100, score));

  let tier: RiskTier;
  if (finalScore >= 80) tier = "Safe";
  else if (finalScore >= 60) tier = "Moderate";
  else if (finalScore >= 40) tier = "Risky";
  else tier = "High Risk";

  return { score: finalScore, tier };
}

export async function getCustomersWithDetails(shopId: string) {
  const customers = await prisma.customer.findMany({
    where: { shopId },
    include: {
      sales: {
        orderBy: { saleDate: "desc" },
        take: 1,
        select: { saleDate: true, totalAmount: true },
      },
      _count: { select: { sales: true } },
    },
  });

  return customers
    .map((c) => {
      const creditBalance = Number(c.creditBalance);
      const creditLimit = Number(c.creditLimit);
      const totalSales = c._count.sales;
      const lastSaleDate = c.sales[0]?.saleDate ?? null;
      const { score: trustScore, tier: riskTier } = computeTrustScore(
        creditBalance,
        creditLimit,
        totalSales,
        lastSaleDate
      );
      const collectionPriority = creditBalance * (100 - trustScore);

      return {
        id: c.id,
        name: c.name,
        phone: c.phone,
        address: c.address,
        creditLimit,
        creditBalance,
        totalSales,
        lastSale: c.sales[0]
          ? {
              date: c.sales[0].saleDate,
              amount: Number(c.sales[0].totalAmount),
            }
          : null,
        trustScore,
        riskTier,
        collectionPriority,
      };
    })
    .sort((a, b) => b.collectionPriority - a.collectionPriority);
}

export function generateInvoiceNumber(): string {
  const now = new Date();
  const yy = now.getFullYear().toString().slice(-2);
  const mm = (now.getMonth() + 1).toString().padStart(2, "0");
  const dd = now.getDate().toString().padStart(2, "0");
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `INV-${yy}${mm}${dd}-${rand}`;
}
