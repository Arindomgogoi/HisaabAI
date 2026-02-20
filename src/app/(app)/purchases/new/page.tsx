import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSuppliers, getProductsForPurchase } from "@/lib/data/purchases";
import { PurchaseForm } from "@/components/purchases/purchase-form";

export default async function NewPurchasePage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const [suppliers, products] = await Promise.all([
    getSuppliers(shopId),
    getProductsForPurchase(shopId),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <PurchaseForm suppliers={suppliers} products={products} />
    </div>
  );
}
