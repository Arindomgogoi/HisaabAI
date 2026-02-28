import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  Brain,
  BarChart3,
  Receipt,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Sales & POS", href: "/sales", icon: ShoppingCart },
  { label: "Purchases", href: "/purchases", icon: Truck },
  { label: "Expenses", href: "/expenses", icon: Receipt },
  { label: "Excise & Compliance", href: "/gst", icon: FileText },
  { label: "AI Insights", href: "/insights", icon: Brain },
  { label: "Reports", href: "/reports", icon: BarChart3 },
] as const;
