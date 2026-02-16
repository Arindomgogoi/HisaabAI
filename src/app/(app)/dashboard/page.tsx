import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTodaySummary,
  getSalesTrend,
  getLowStockProducts,
  getRecentSales,
  getCategorySales,
} from "@/lib/data/dashboard";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { QuickActions } from "@/components/dashboard/quick-actions";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const shopId = (session.user as Record<string, unknown>).shopId as string;
  if (!shopId) redirect("/login");

  const [summary, trend, lowStock, recentSales, categorySales] =
    await Promise.all([
      getTodaySummary(shopId),
      getSalesTrend(shopId, 7),
      getLowStockProducts(shopId),
      getRecentSales(shopId, 10),
      getCategorySales(shopId),
    ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Overview of your business performance
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Summary Cards */}
      <SummaryCards
        todayRevenue={summary.todayRevenue}
        revenueChange={summary.revenueChange}
        todayItemsSold={summary.todayItemsSold}
        todayTransactions={summary.todayTransactions}
        avgMargin={summary.avgMargin}
      />

      {/* AI Insight */}
      <AIInsightCard />

      {/* Charts + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart trendData={trend} categoryData={categorySales} />
        </div>
        <LowStockAlerts items={lowStock} />
      </div>

      {/* Recent Sales */}
      <RecentSales sales={recentSales} />
    </div>
  );
}
