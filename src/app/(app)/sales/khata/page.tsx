import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCustomersWithDetails } from "@/lib/data/sales";
import { KhataTable } from "@/components/sales/khata-table";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function KhataPage() {
  const session = await auth();
  const shopId = (session?.user as Record<string, unknown>)?.shopId as string;
  if (!shopId) redirect("/login");

  const customers = await getCustomersWithDetails(shopId);

  const totalOutstanding = customers.reduce(
    (sum, c) => sum + c.creditBalance,
    0
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/sales">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-heading font-bold">Khata Book</h1>
          <p className="text-muted-foreground mt-1">
            {customers.length} customers &middot; Outstanding:{" "}
            {new Intl.NumberFormat("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            }).format(totalOutstanding)}
          </p>
        </div>
      </div>

      <KhataTable customers={customers} />
    </div>
  );
}
