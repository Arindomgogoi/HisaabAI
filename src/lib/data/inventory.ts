import { prisma } from "@/lib/prisma";
import type { ProductCategory, SizeUnit } from "@/generated/prisma";

interface InventoryFilters {
  search?: string;
  category?: ProductCategory;
  stockStatus?: "all" | "low" | "out";
}

export async function getProducts(shopId: string, filters?: InventoryFilters) {
  const where: Record<string, unknown> = {
    shopId,
    isActive: true,
  };

  if (filters?.search) {
    where.name = { contains: filters.search, mode: "insensitive" };
  }

  if (filters?.category) {
    where.category = filters.category;
  }

  const products = await prisma.product.findMany({
    where,
    orderBy: [{ category: "asc" }, { name: "asc" }, { size: "asc" }],
  });

  let filtered = products;

  if (filters?.stockStatus === "low") {
    filtered = products.filter(
      (p) => p.shopBottles > 0 && p.shopBottles <= p.reorderLevel
    );
  } else if (filters?.stockStatus === "out") {
    filtered = products.filter((p) => p.shopBottles === 0);
  }

  return filtered.map((p) => ({
    ...p,
    mrp: Number(p.mrp),
    costPrice: Number(p.costPrice),
    totalBottles:
      p.shopBottles + p.warehouseCases * p.bpc + p.warehouseBottles,
    stockStatus:
      p.shopBottles === 0
        ? ("out_of_stock" as const)
        : p.shopBottles <= p.reorderLevel
          ? ("low_stock" as const)
          : ("in_stock" as const),
  }));
}

export async function getProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return null;
  return {
    ...product,
    mrp: Number(product.mrp),
    costPrice: Number(product.costPrice),
  };
}

export async function getTransferHistory(shopId: string, limit: number = 20) {
  const transfers = await prisma.stockTransfer.findMany({
    where: { shopId },
    orderBy: { transferDate: "desc" },
    take: limit,
    include: { product: { select: { name: true, size: true } } },
  });

  return transfers;
}

export async function getProductsForTransfer(shopId: string) {
  return prisma.product.findMany({
    where: { shopId, isActive: true, warehouseCases: { gt: 0 } },
    orderBy: [{ name: "asc" }, { size: "asc" }],
    select: {
      id: true,
      name: true,
      size: true,
      bpc: true,
      warehouseCases: true,
      shopBottles: true,
    },
  });
}
