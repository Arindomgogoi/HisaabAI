import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/data/inventory";
import { StockReceiveForm } from "@/components/inventory/stock-receive-form";

export default async function ReceiveStockPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const products = await getProducts(shopId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold">Receive Stock</h1>
        <p className="text-muted-foreground mt-1">
          Enter cases received today to update warehouse stock
        </p>
      </div>
      <StockReceiveForm products={products} />
    </div>
  );
}
