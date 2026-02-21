import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Truck,
  FileText,
  Brain,
  BarChart3,
  Settings,
} from "lucide-react";

export const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Inventory", href: "/inventory", icon: Package },
  { label: "Sales & POS", href: "/sales", icon: ShoppingCart },
  {
    label: "Purchases",
    href: "/purchases",
    icon: Truck,
  },
  { label: "Tax & Compliance", href: "/gst", icon: FileText },
  {
    label: "AI Insights",
    href: "/insights",
    icon: Brain,
  },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Settings", href: "/settings", icon: Settings },
] as const;
