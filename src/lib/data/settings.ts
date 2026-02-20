import { prisma } from "@/lib/prisma";

export async function getShop(shopId: string) {
  return prisma.shop.findUnique({ where: { id: shopId } });
}
