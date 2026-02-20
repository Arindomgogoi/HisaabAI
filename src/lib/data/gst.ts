import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export async function getGSTSummary(shopId: string, from: Date, to: Date) {
  const [salesResult, purchasesResult] = await Promise.all([
    prisma.sale.aggregate({
      where: { shopId, saleDate: { gte: from, lte: to } },
      _sum: { cgst: true, sgst: true, totalAmount: true },
    }),
    prisma.purchase.aggregate({
      where: { shopId, purchaseDate: { gte: from, lte: to } },
      _sum: { cgst: true, sgst: true },
    }),
  ]);

  const outputCGST = Number(salesResult._sum.cgst ?? 0);
  const outputSGST = Number(salesResult._sum.sgst ?? 0);
  const inputCGST = Number(purchasesResult._sum.cgst ?? 0);
  const inputSGST = Number(purchasesResult._sum.sgst ?? 0);
  const totalSales = Number(salesResult._sum.totalAmount ?? 0);
  const taxableValue = outputCGST > 0
    ? totalSales - outputCGST - outputSGST
    : totalSales;

  return {
    outputCGST,
    outputSGST,
    inputCGST,
    inputSGST,
    netCGST: outputCGST - inputCGST,
    netSGST: outputSGST - inputSGST,
    netPayable: (outputCGST + outputSGST) - (inputCGST + inputSGST),
    taxableValue,
  };
}

export async function getMonthlyGSTBreakdown(shopId: string, from: Date, to: Date) {
  const [sales, purchases] = await Promise.all([
    prisma.sale.findMany({
      where: { shopId, saleDate: { gte: from, lte: to } },
      select: { saleDate: true, cgst: true, sgst: true, totalAmount: true },
    }),
    prisma.purchase.findMany({
      where: { shopId, purchaseDate: { gte: from, lte: to } },
      select: { purchaseDate: true, cgst: true, sgst: true },
    }),
  ]);

  const monthMap = new Map<
    string,
    { taxableSales: number; outputCGST: number; outputSGST: number; inputCGST: number; inputSGST: number }
  >();

  for (const sale of sales) {
    const month = format(new Date(sale.saleDate), "yyyy-MM");
    const cgst = Number(sale.cgst);
    const sgst = Number(sale.sgst);
    const total = Number(sale.totalAmount);
    const existing = monthMap.get(month) ?? { taxableSales: 0, outputCGST: 0, outputSGST: 0, inputCGST: 0, inputSGST: 0 };
    existing.outputCGST += cgst;
    existing.outputSGST += sgst;
    existing.taxableSales += cgst > 0 ? total - cgst - sgst : total;
    monthMap.set(month, existing);
  }

  for (const purchase of purchases) {
    const month = format(new Date(purchase.purchaseDate), "yyyy-MM");
    const existing = monthMap.get(month) ?? { taxableSales: 0, outputCGST: 0, outputSGST: 0, inputCGST: 0, inputSGST: 0 };
    existing.inputCGST += Number(purchase.cgst);
    existing.inputSGST += Number(purchase.sgst);
    monthMap.set(month, existing);
  }

  return Array.from(monthMap.entries())
    .map(([month, data]) => ({
      month,
      ...data,
      netPayable: (data.outputCGST + data.outputSGST) - (data.inputCGST + data.inputSGST),
    }))
    .sort((a, b) => b.month.localeCompare(a.month));
}

export async function getHSNSummary(shopId: string, from: Date, to: Date) {
  const items = await prisma.saleItem.findMany({
    where: { sale: { shopId, saleDate: { gte: from, lte: to } } },
    select: {
      quantity: true,
      totalPrice: true,
      gstRate: true,
      product: { select: { hsnCode: true } },
    },
  });

  const map = new Map<string, { qty: number; taxableValue: number; cgst: number; sgst: number; gstRate: number }>();

  for (const item of items) {
    const hsn = item.product.hsnCode;
    const gstRate = item.gstRate;
    const lineTotal = Number(item.totalPrice);
    const taxableValue = lineTotal / (1 + gstRate / 100);
    const taxAmount = lineTotal - taxableValue;
    const existing = map.get(hsn) ?? { qty: 0, taxableValue: 0, cgst: 0, sgst: 0, gstRate };
    existing.qty += item.quantity;
    existing.taxableValue += taxableValue;
    existing.cgst += taxAmount / 2;
    existing.sgst += taxAmount / 2;
    map.set(hsn, existing);
  }

  return Array.from(map.entries()).map(([hsnCode, data]) => ({
    hsnCode,
    gstRate: data.gstRate,
    qty: data.qty,
    taxableValue: Math.round(data.taxableValue * 100) / 100,
    cgst: Math.round(data.cgst * 100) / 100,
    sgst: Math.round(data.sgst * 100) / 100,
  }));
}
