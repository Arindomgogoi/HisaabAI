import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCustomersWithDetails } from "@/lib/data/sales";
import { KhataTable } from "@/components/sales/khata-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft, AlertTriangle, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default async function KhataPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  const shopName = (session?.user as Record<string, unknown>)?.shopName as string ?? "Our Shop";
  if (!shopId) redirect("/login");

  const customers = await getCustomersWithDetails(shopId);

  const totalOutstanding = customers.reduce((sum, c) => sum + c.creditBalance, 0);
  const highRiskCount = customers.filter((c) => c.riskTier === "High Risk" && c.creditBalance > 0).length;
  const riskyCount = customers.filter((c) => c.riskTier === "Risky" && c.creditBalance > 0).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/sales">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">Khata Book</h1>
          <p className="text-muted-foreground mt-1">
            {customers.length} customers &middot; Outstanding:{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(totalOutstanding)}
          </p>
        </div>
      </div>

      {/* Risk summary banner */}
      {(highRiskCount > 0 || riskyCount > 0) && (
        <div className="flex flex-wrap gap-3">
          {highRiskCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-sm">
              <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
              <span className="font-semibold text-red-700 dark:text-red-400">
                {highRiskCount} High Risk
              </span>
              <span className="text-red-600/70 dark:text-red-400/70 text-xs">
                — collect urgently
              </span>
            </div>
          )}
          {riskyCount > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-sm">
              <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
              <span className="font-semibold text-orange-700 dark:text-orange-400">
                {riskyCount} Risky
              </span>
              <span className="text-orange-600/70 dark:text-orange-400/70 text-xs">
                — follow up soon
              </span>
            </div>
          )}
        </div>
      )}

      <KhataTable customers={customers} shopName={shopName} />
    </div>
  );
}
