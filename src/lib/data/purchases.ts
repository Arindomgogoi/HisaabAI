import { prisma } from "@/lib/prisma";

export async function getPurchases(shopId: string) {
  const purchases = await prisma.purchase.findMany({
    where: { shopId },
    orderBy: { purchaseDate: "desc" },
    include: {
      supplier: { select: { name: true } },
      _count: { select: { items: true } },
    },
  });

  return purchases.map((p) => ({
    id: p.id,
    invoiceNumber: p.invoiceNumber,
    purchaseDate: p.purchaseDate,
    totalAmount: Number(p.totalAmount),
    paymentStatus: p.paymentStatus,
    supplierName: p.supplier.name,
    itemCount: p._count.items,
  }));
}

export async function getSuppliers(shopId: string) {
  return prisma.supplier.findMany({
    where: { shopId },
    orderBy: { name: "asc" },
    select: { id: true, name: true, phone: true },
  });
}

export async function getProductsForPurchase(shopId: string) {
  const products = await prisma.product.findMany({
    where: { shopId, isActive: true },
    orderBy: [{ name: "asc" }, { size: "asc" }],
    select: {
      id: true,
      name: true,
      size: true,
      category: true,
      costPrice: true,
      bpc: true,
      warehouseCases: true,
    },
  });

  return products.map((p) => ({
    ...p,
    costPrice: Number(p.costPrice),
  }));
}
