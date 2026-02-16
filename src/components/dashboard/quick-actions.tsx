import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Package, ArrowLeftRight } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Link href="/sales/pos">
        <Button className="bg-amber-500 hover:bg-amber-600 text-white">
          <ShoppingCart className="w-4 h-4 mr-2" />
          New Sale
        </Button>
      </Link>
      <Link href="/inventory/new">
        <Button variant="outline">
          <Package className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </Link>
      <Link href="/inventory/transfer">
        <Button variant="outline">
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          Stock Transfer
        </Button>
      </Link>
    </div>
  );
}
