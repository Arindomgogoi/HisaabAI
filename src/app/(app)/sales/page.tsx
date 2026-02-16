import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSales } from "@/lib/data/sales";
import { SalesTable } from "@/components/sales/sales-table";
import { Button } from "@/components/ui/button";
import { ShoppingCart, BookOpen } from "lucide-react";
import Link from "next/link";
import type { PaymentMode } from "@/generated/prisma";

interface Props {
  searchParams: Promise<{
    search?: string;
    payment?: string;
  }>;
}

export default async function SalesPage({ searchParams }: Props) {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const params = await searchParams;

  const sales = await getSales(shopId, {
    search: params.search,
    paymentMode: params.payment as PaymentMode | undefined,
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold">Sales Register</h1>
          <p className="text-muted-foreground mt-1">
            {sales.length} sales &middot; Total:{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(totalRevenue)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/sales/khata">
            <Button variant="outline" size="sm">
              <BookOpen className="w-4 h-4 mr-2" />
              Khata Book
            </Button>
          </Link>
          <Link href="/sales/pos">
            <Button
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-white"
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              New Sale (POS)
            </Button>
          </Link>
        </div>
      </div>

      <SalesTable sales={sales} />
    </div>
  );
}
