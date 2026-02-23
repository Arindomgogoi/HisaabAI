import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/data/inventory";
import { StockCountForm } from "@/components/inventory/stock-count-form";

export default async function StockCountPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const products = await getProducts(shopId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Daily Stock Count</h1>
        <p className="text-muted-foreground mt-1">
          Set actual physical stock — corrects warehouse cases and shop bottles
        </p>
      </div>
      <StockCountForm products={products} />
    </div>
  );
}
