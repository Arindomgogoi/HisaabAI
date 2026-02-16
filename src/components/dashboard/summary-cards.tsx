import { Card, CardContent } from "@/components/ui/card";
import { formatINR, formatPercentChange, formatNumber } from "@/lib/formatters";
import { IndianRupee, ShoppingBag, TrendingUp, Receipt } from "lucide-react";
import { cn } from "@/lib/utils";

interface SummaryCardsProps {
  todayRevenue: number;
  revenueChange: number;
  todayItemsSold: number;
  todayTransactions: number;
  avgMargin: number;
}

export function SummaryCards({
  todayRevenue,
  revenueChange,
  todayItemsSold,
  todayTransactions,
  avgMargin,
}: SummaryCardsProps) {
  const cards = [
    {
      label: "Today's Revenue",
      value: formatINR(todayRevenue),
      change: revenueChange,
      icon: IndianRupee,
      color: "text-emerald-600",
      bg: "bg-emerald-50 dark:bg-emerald-950/30",
    },
    {
      label: "Items Sold",
      value: formatNumber(todayItemsSold),
      change: null,
      icon: ShoppingBag,
      color: "text-blue-600",
      bg: "bg-blue-50 dark:bg-blue-950/30",
    },
    {
      label: "Avg Margin",
      value: `${avgMargin.toFixed(1)}%`,
      change: null,
      icon: TrendingUp,
      color: "text-amber-600",
      bg: "bg-amber-50 dark:bg-amber-950/30",
    },
    {
      label: "Transactions",
      value: formatNumber(todayTransactions),
      change: null,
      icon: Receipt,
      color: "text-violet-600",
      bg: "bg-violet-50 dark:bg-violet-950/30",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs md:text-sm text-muted-foreground font-medium">
                {card.label}
              </p>
              <div className={cn("p-2 rounded-lg", card.bg)}>
                <card.icon className={cn("w-4 h-4", card.color)} />
              </div>
            </div>
            <p className="text-xl md:text-2xl font-heading font-bold mt-2">
              {card.value}
            </p>
            {card.change !== null && (
              <p
                className={cn(
                  "text-xs mt-1 font-medium",
                  card.change >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {formatPercentChange(card.change)} vs yesterday
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
