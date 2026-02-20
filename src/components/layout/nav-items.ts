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
    disabled: true,
    badge: "Soon",
  },
  {
    label: "GST & Tax",
    href: "/gst",
    icon: FileText,
    disabled: true,
    badge: "Soon",
  },
  {
    label: "AI Insights",
    href: "/insights",
    icon: Brain,
  },
  {
    label: "Reports",
    href: "/reports",
    icon: BarChart3,
    disabled: true,
    badge: "Soon",
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    disabled: true,
  },
] as const;
