import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProductsForPOS, getCustomers } from "@/lib/data/sales";
import { POSInterface } from "@/components/sales/pos-interface";

export default async function POSPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const [products, customers] = await Promise.all([
    getProductsForPOS(shopId),
    getCustomers(shopId),
  ]);

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-2xl font-heading font-bold">Point of Sale</h1>
        <p className="text-muted-foreground mt-1">
          Search products, add to cart, and generate bills
        </p>
      </div>
      <POSInterface products={products} customers={customers} />
    </div>
  );
}
