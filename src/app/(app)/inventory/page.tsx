import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getProducts } from "@/lib/data/inventory";
import { ProductTable } from "@/components/inventory/product-table";
import { ProductFilters } from "@/components/inventory/product-filters";
import { Button } from "@/components/ui/button";
import { Plus, ArrowLeftRight, PackagePlus, ClipboardList } from "lucide-react";
import Link from "next/link";
import type { ProductCategory } from "@/generated/prisma";

interface Props {
  searchParams: Promise<{
    search?: string;
    category?: string;
    stock?: string;
  }>;
}

export default async function InventoryPage({ searchParams }: Props) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const params = await searchParams;

  const products = await getProducts(shopId, {
    search: params.search,
    category: params.category as ProductCategory | undefined,
    stockStatus: (params.stock as "all" | "low" | "out") ?? "all",
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Inventory</h1>
          <p className="text-muted-foreground mt-1">
            {products.length} products &middot; Manage stock and transfers
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/inventory/count">
            <Button variant="outline" size="sm">
              <ClipboardList className="w-4 h-4 mr-2" />
              Daily Count
            </Button>
          </Link>
          <Link href="/inventory/receive">
            <Button variant="outline" size="sm">
              <PackagePlus className="w-4 h-4 mr-2" />
              Receive Stock
            </Button>
          </Link>
          <Link href="/inventory/transfer">
            <Button variant="outline" size="sm">
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              Transfer Stock
            </Button>
          </Link>
          <Link href="/inventory/new">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <ProductFilters />
      <ProductTable products={products} />
    </div>
  );
}
