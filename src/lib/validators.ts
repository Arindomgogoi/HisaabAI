import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  brand: z.string().min(1, "Brand is required"),
  category: z.enum([
    "WHISKY",
    "RUM",
    "VODKA",
    "GIN",
    "BRANDY",
    "WINE",
    "BEER",
  ]),
  size: z.enum(["ML_750", "ML_375", "ML_180", "CAN_500", "BOTTLE_650"]),
  mrp: z.coerce.number().positive("MRP must be positive"),
  costPrice: z.coerce.number().positive("Cost price must be positive"),
  bpc: z.coerce.number().int().positive("BPC must be positive"),
  reorderLevel: z.coerce.number().int().min(0).default(10),
});

export const stockTransferSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  cases: z.coerce
    .number()
    .int()
    .positive("Must transfer at least 1 case"),
});

export const saleItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive("Quantity must be at least 1"),
  unitPrice: z.coerce.number().positive(),
});

export const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, "At least one item required"),
  paymentMode: z.enum(["CASH", "UPI", "CREDIT"]),
  customerId: z.string().optional(),
  discount: z.coerce.number().min(0).default(0),
});

export const customerSchema = z.object({
  name: z.string().min(1, "Customer name is required"),
  phone: z.string().optional(),
  address: z.string().optional(),
  creditLimit: z.coerce.number().min(0).default(5000),
});

export const loginSchema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  shopName: z.string().min(1, "Shop name is required"),
  state: z.string().default("Maharashtra"),
});

export const supplierSchema = z.object({
  name: z.string().min(1, "Supplier name is required"),
  phone: z.string().optional(),
  contactName: z.string().optional(),
  gstNumber: z.string().optional(),
});

export const purchaseItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  cases: z.coerce.number().int().positive("Cases must be at least 1"),
  costPerCase: z.coerce.number().positive("Cost per case must be positive"),
  gstRate: z.coerce.number().min(0).max(28).default(18),
});

export const purchaseSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  purchaseDate: z.string().min(1, "Purchase date is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  paymentStatus: z.enum(["paid", "pending"]).default("paid"),
  items: z.array(purchaseItemSchema).min(1, "At least one item required"),
});

export const shopSchema = z.object({
  name: z.string().min(1, "Shop name is required"),
  ownerName: z.string().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  licenseNumber: z.string().optional(),
  gstNumber: z.string().optional(),
});

export type ShopFormValues = z.infer<typeof shopSchema>;
export type SupplierFormValues = z.infer<typeof supplierSchema>;
export type PurchaseFormValues = z.infer<typeof purchaseSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type StockTransferFormValues = z.infer<typeof stockTransferSchema>;
export type CreateSaleFormValues = z.infer<typeof createSaleSchema>;
export type CustomerFormValues = z.infer<typeof customerSchema>;
export const expenseSchema = z.object({
  date: z.string().min(1, "Date is required"),
  category: z.enum([
    "Rent",
    "Salary",
    "Electricity",
    "Transport",
    "Maintenance",
    "Miscellaneous",
  ]),
  description: z.string().min(1, "Description is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  paymentMode: z.enum(["cash", "upi", "bank"]).default("cash"),
});

export type ExpenseFormValues = z.infer<typeof expenseSchema>;

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
