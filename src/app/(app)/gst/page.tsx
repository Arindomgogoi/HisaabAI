import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { startOfMonth, endOfDay } from "date-fns";
import { getGSTSummary, getMonthlyGSTBreakdown, getHSNSummary } from "@/lib/data/gst";
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

  const [summary, monthlyBreakdown, hsnSummary, shop] = await Promise.all([
    getGSTSummary(shopId, from, to),
    getMonthlyGSTBreakdown(shopId, from, to),
    getHSNSummary(shopId, from, to),
    getShop(shopId),
  ]);

  return (
    <GSTReport
      summary={summary}
      monthlyBreakdown={monthlyBreakdown}
      hsnSummary={hsnSummary}
      shopGstin={shop?.gstNumber ?? null}
      fromDate={from.toISOString().split("T")[0]}
      toDate={to.toISOString().split("T")[0]}
    />
  );
}
