import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatINR, formatDateTime } from "@/lib/formatters";
import { PAYMENT_MODE_LABELS, PAYMENT_MODE_COLORS } from "@/lib/constants";
import type { PaymentMode } from "@/generated/prisma";
import { cn } from "@/lib/utils";

interface RecentSale {
  id: string;
  invoiceNumber: string;
  saleDate: Date;
  totalAmount: number;
  paymentMode: PaymentMode;
  itemCount: number;
  customerName: string | null;
}

export function RecentSales({ sales }: { sales: RecentSale[] }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading">Recent Sales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {sales.map((sale) => (
            <div
              key={sale.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium">{sale.invoiceNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDateTime(sale.saleDate)} &middot; {sale.itemCount} items
                  {sale.customerName && ` &middot; ${sale.customerName}`}
                </p>
              </div>
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-semibold">{formatINR(sale.totalAmount)}</p>
                <Badge
                  variant="secondary"
                  className={cn("text-[10px] mt-0.5", PAYMENT_MODE_COLORS[sale.paymentMode])}
                >
                  {PAYMENT_MODE_LABELS[sale.paymentMode]}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
