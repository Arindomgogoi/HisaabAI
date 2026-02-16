"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { navItems } from "./nav-items";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { SheetClose } from "@/components/ui/sheet";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-sidebar-primary">
          <Sparkles className="w-4 h-4 text-sidebar-primary-foreground" />
        </div>
        <span className="font-heading text-lg font-bold tracking-tight">
          HisaabAI
        </span>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          if ("disabled" in item && item.disabled) {
            return (
              <div
                key={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm opacity-50 cursor-not-allowed"
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{item.label}</span>
                {"badge" in item && item.badge && (
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0 bg-sidebar-accent text-sidebar-accent-foreground"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
            );
          }

          return (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground font-medium"
                    : "hover:bg-sidebar-accent text-sidebar-foreground"
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            </SheetClose>
          );
        })}
      </nav>
    </div>
  );
}
