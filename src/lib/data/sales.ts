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

export async function getCustomersWithDetails(shopId: string) {
  const customers = await prisma.customer.findMany({
    where: { shopId },
    orderBy: { name: "asc" },
    include: {
      sales: {
        orderBy: { saleDate: "desc" },
        take: 1,
        select: { saleDate: true, totalAmount: true },
      },
      _count: { select: { sales: true } },
    },
  });

  return customers.map((c) => ({
    id: c.id,
    name: c.name,
    phone: c.phone,
    address: c.address,
    creditLimit: Number(c.creditLimit),
    creditBalance: Number(c.creditBalance),
    totalSales: c._count.sales,
    lastSale: c.sales[0]
      ? {
          date: c.sales[0].saleDate,
          amount: Number(c.sales[0].totalAmount),
        }
      : null,
  }));
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
