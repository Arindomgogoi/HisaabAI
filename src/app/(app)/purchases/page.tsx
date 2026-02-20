import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPurchases } from "@/lib/data/purchases";
import { PurchaseTable } from "@/components/purchases/purchase-table";

export default async function PurchasesPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const purchases = await getPurchases(shopId);

  return <PurchaseTable purchases={purchases} />;
}
