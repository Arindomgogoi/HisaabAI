import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startOfMonth, endOfDay } from "date-fns";
import { getComplianceSummary, getMonthlyComplianceBreakdown } from "@/lib/data/gst";
import { getShop } from "@/lib/data/settings";
import { GSTReport } from "@/components/gst/gst-report";

export default async function GSTPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const params = await searchParams;
  const to = params.to ? endOfDay(new Date(params.to)) : endOfDay(new Date());
  const from = params.from
    ? new Date(params.from)
    : startOfMonth(new Date());

  const [complianceSummary, monthlyBreakdown, shop] = await Promise.all([
    getComplianceSummary(shopId, from, to),
    getMonthlyComplianceBreakdown(shopId, from, to),
    getShop(shopId),
  ]);

  return (
    <GSTReport
      complianceSummary={complianceSummary}
      monthlyBreakdown={monthlyBreakdown}
      shopGstin={shop?.gstNumber ?? null}
      licenseNumber={shop?.licenseNumber ?? null}
      fromDate={from.toISOString().split("T")[0]}
      toDate={to.toISOString().split("T")[0]}
    />
  );
}
