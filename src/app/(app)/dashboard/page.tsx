import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import {
  getTodaySummary,
  getSalesTrend,
  getLowStockProducts,
  getRecentSales,
  getCategorySales,
  getProductCount,
} from "@/lib/data/dashboard";
import { SummaryCards } from "@/components/dashboard/summary-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Button } from "@/components/ui/button";
import { Package, ShoppingCart, Settings } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const shopId = (session.user as Record<string, unknown>).shopId as string;
  if (!shopId) redirect("/login");

  const [summary, trend, lowStock, recentSales, categorySales, productCount] =
    await Promise.all([
      getTodaySummary(shopId),
      getSalesTrend(shopId, 7),
      getLowStockProducts(shopId),
      getRecentSales(shopId, 10),
      getCategorySales(shopId),
      getProductCount(shopId),
    ]);

  // Show onboarding for brand-new shops
  if (productCount === 0 && recentSales.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-heading font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-0.5">
            Welcome to HisaabAI — let&apos;s get your shop set up
          </p>
        </div>
        <div className="rounded-xl border border-dashed p-10 text-center max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-900/30 mx-auto">
            <Package className="w-8 h-8 text-amber-600" />
          </div>
          <div>
            <h2 className="text-xl font-heading font-bold">
              Your shop is ready!
            </h2>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Complete these 3 steps to start tracking sales and inventory.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-amber-600 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                  Step 1
                </span>
              </div>
              <p className="text-sm font-medium">Add your products</p>
              <p className="text-xs text-muted-foreground">
                Add the products you sell with prices and stock levels.
              </p>
              <Link href="/inventory/new">
                <Button size="sm" className="w-full mt-2 bg-amber-500 hover:bg-amber-600 text-white">
                  <Package className="w-3.5 h-3.5 mr-1.5" />
                  Add Product
                </Button>
              </Link>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-blue-600 bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-full">
                  Step 2
                </span>
              </div>
              <p className="text-sm font-medium">Set up your shop</p>
              <p className="text-xs text-muted-foreground">
                Add your GSTIN, address, and shop name for invoices.
              </p>
              <Link href="/settings">
                <Button size="sm" variant="outline" className="w-full mt-2">
                  <Settings className="w-3.5 h-3.5 mr-1.5" />
                  Shop Settings
                </Button>
              </Link>
            </div>
            <div className="rounded-lg border bg-card p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-violet-600 bg-violet-100 dark:bg-violet-900/30 px-2 py-0.5 rounded-full">
                  Step 3
                </span>
              </div>
              <p className="text-sm font-medium">Make your first sale</p>
              <p className="text-xs text-muted-foreground">
                Use the POS to ring up a sale and generate an invoice.
              </p>
              <Link href="/sales/pos">
                <Button size="sm" variant="outline" className="w-full mt-2">
                  <ShoppingCart className="w-3.5 h-3.5 mr-1.5" />
                  Open POS
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
        itemsChange={summary.itemsChange}
        todayTransactions={summary.todayTransactions}
        transactionsChange={summary.transactionsChange}
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
