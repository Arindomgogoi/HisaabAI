import { ProductCategory, SizeUnit, PaymentMode } from "@/generated/prisma";

/** Bottles Per Case by size */
export const BPC_MAP: Record<SizeUnit, number> = {
  ML_750: 12,
  ML_375: 24,
  ML_180: 48,
  CAN_500: 24,
  BOTTLE_650: 12,
};

/** Human-readable size labels */
export const SIZE_LABELS: Record<SizeUnit, string> = {
  ML_750: "750ml",
  ML_375: "375ml (Half)",
  ML_180: "180ml (Qtr)",
  CAN_500: "500ml Can",
  BOTTLE_650: "650ml Bottle",
};

/** Short size labels for compact display */
export const SIZE_SHORT: Record<SizeUnit, string> = {
  ML_750: "750ml",
  ML_375: "375ml",
  ML_180: "180ml",
  CAN_500: "500ml",
  BOTTLE_650: "650ml",
};

/** Human-readable category labels */
export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  WHISKY: "Whisky",
  RUM: "Rum",
  VODKA: "Vodka",
  GIN: "Gin",
  BRANDY: "Brandy",
  WINE: "Wine",
  BEER: "Beer",
};

/** HSN codes by category (for record-keeping, not tax calculation) */
export const HSN_CODES: Record<string, string> = {
  SPIRITS: "2208",
  WINE: "2204",
  BEER: "2203",
};

/** Get HSN code for a product category */
export function getHSNCode(category: ProductCategory): string {
  if (category === "WINE") return HSN_CODES.WINE;
  if (category === "BEER") return HSN_CODES.BEER;
  return HSN_CODES.SPIRITS;
}

/** Human-readable payment mode labels */
export const PAYMENT_MODE_LABELS: Record<PaymentMode, string> = {
  CASH: "Cash",
  UPI: "UPI",
  CREDIT: "Khata (Credit)",
};

/** Payment mode colors for badges */
export const PAYMENT_MODE_COLORS: Record<PaymentMode, string> = {
  CASH: "bg-green-100 text-green-800",
  UPI: "bg-blue-100 text-blue-800",
  CREDIT: "bg-amber-100 text-amber-800",
};

/** Category emoji icons for quick visual */
export const CATEGORY_ICONS: Record<ProductCategory, string> = {
  WHISKY: "🥃",
  RUM: "🍹",
  VODKA: "🍸",
  GIN: "🌿",
  BRANDY: "🍷",
  WINE: "🍷",
  BEER: "🍺",
};

/** Application navigation items */
export const NAV_ITEMS = [
  { label: "Dashboard", href: "/dashboard", icon: "LayoutDashboard" },
  { label: "Inventory", href: "/inventory", icon: "Package" },
  { label: "Sales & POS", href: "/sales", icon: "ShoppingCart" },
  {
    label: "Purchases",
    href: "/purchases",
    icon: "Truck",
    disabled: true,
    badge: "Soon",
  },
  {
    label: "GST & Tax",
    href: "/gst",
    icon: "FileText",
    disabled: true,
    badge: "Soon",
  },
  {
    label: "Insights",
    href: "/insights",
    icon: "Brain",
    disabled: true,
    badge: "Soon",
  },
  {
    label: "Reports",
    href: "/reports",
    icon: "BarChart3",
    disabled: true,
    badge: "Soon",
  },
  { label: "Settings", href: "/settings", icon: "Settings", disabled: true },
] as const;
