import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { getSaleDetail } from "@/lib/data/sales";
import { ThermalReceipt } from "@/components/sales/thermal-receipt";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ReceiptPage({ params }: Props) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const { id } = await params;
  const sale = await getSaleDetail(id);

  if (!sale) notFound();

  return (
    <Suspense>
      <ThermalReceipt sale={sale} />
    </Suspense>
  );
}
