import type { ProductModel, SaleModel, SaleItemModel, CustomerModel } from "@/generated/prisma";
import type { PaymentMode, ProductCategory, SizeUnit } from "@/generated/prisma";

/** Product with computed total stock */
export type ProductWithStock = ProductModel & {
  totalBottles: number;
  stockStatus: "in_stock" | "low_stock" | "out_of_stock";
};

/** Sale with items and optional customer */
export type SaleWithItems = SaleModel & {
  items: (SaleItemModel & { product: ProductModel })[];
  customer: CustomerModel | null;
};

/** Dashboard summary card data */
export interface DashboardSummary {
  todayRevenue: number;
  yesterdayRevenue: number;
  todayItemsSold: number;
  todayTransactions: number;
  avgMargin: number;
}

/** Chart data point for sales trends */
export interface SalesTrendPoint {
  date: string;
  revenue: number;
  items: number;
  transactions: number;
}

/** Low stock alert item */
export interface LowStockAlert {
  id: string;
  name: string;
  size: SizeUnit;
  category: ProductCategory;
  shopBottles: number;
  reorderLevel: number;
  daysOfStock: number | null;
}

/** Cart item for POS */
export interface CartItem {
  productId: string;
  name: string;
  size: SizeUnit;
  category: ProductCategory;
  mrp: number;
  quantity: number;
  maxQuantity: number;
}

/** Recent sale for dashboard */
export interface RecentSale {
  id: string;
  invoiceNumber: string;
  saleDate: Date;
  totalAmount: number;
  paymentMode: PaymentMode;
  itemCount: number;
  customerName: string | null;
}

/** Khata customer with outstanding */
export interface KhataCustomer {
  id: string;
  name: string;
  phone: string | null;
  creditLimit: number;
  creditBalance: number;
  lastSaleDate: Date | null;
  utilizationPercent: number;
}
