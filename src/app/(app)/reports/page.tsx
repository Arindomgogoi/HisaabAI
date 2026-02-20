import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { subDays, startOfDay, endOfDay } from "date-fns";
import {
  getReportSummary,
  getDailyBreakdown,
  getProductReport,
  getPaymentModeSplit,
} from "@/lib/data/reports";
import { ReportsView } from "@/components/reports/reports-view";

export default async function ReportsPage({
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
    ? startOfDay(new Date(params.from))
    : startOfDay(subDays(new Date(), 29));

  const [summary, dailyBreakdown, productReport, paymentSplit] = await Promise.all([
    getReportSummary(shopId, from, to),
    getDailyBreakdown(shopId, from, to),
    getProductReport(shopId, from, to),
    getPaymentModeSplit(shopId, from, to),
  ]);

  return (
    <ReportsView
      summary={summary}
      dailyBreakdown={dailyBreakdown}
      productReport={productReport}
      paymentSplit={paymentSplit}
      fromDate={from.toISOString().split("T")[0]}
      toDate={to.toISOString().split("T")[0]}
    />
  );
}
