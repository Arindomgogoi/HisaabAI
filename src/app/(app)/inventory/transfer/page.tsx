import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProductsForTransfer, getTransferHistory } from "@/lib/data/inventory";
import { TransferForm } from "@/components/inventory/transfer-form";
import { TransferHistory } from "@/components/inventory/transfer-history";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TransferPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const [products, transfers] = await Promise.all([
    getProductsForTransfer(shopId),
    getTransferHistory(shopId),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/inventory">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">Stock Transfer</h1>
          <p className="text-muted-foreground mt-1">
            Move cases from warehouse to shop
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TransferForm products={products} />
        <TransferHistory transfers={transfers} />
      </div>
    </div>
  );
}
