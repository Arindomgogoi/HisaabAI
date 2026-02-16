import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";
import { SIZE_SHORT, CATEGORY_LABELS } from "@/lib/constants";
import type { SizeUnit, ProductCategory } from "@/generated/prisma";

interface LowStockItem {
  id: string;
  name: string;
  size: SizeUnit;
  category: ProductCategory;
  shopBottles: number;
  reorderLevel: number;
}

export function LowStockAlerts({ items }: { items: LowStockItem[] }) {
  if (items.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Low Stock Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All products are well stocked!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-heading flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          Low Stock Alerts
          <Badge variant="secondary" className="ml-auto text-xs">
            {items.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b last:border-0"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {item.name}
                  <span className="text-muted-foreground ml-1 text-xs">
                    {SIZE_SHORT[item.size]}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {CATEGORY_LABELS[item.category]}
                </p>
              </div>
              <Badge
                variant={item.shopBottles === 0 ? "destructive" : "secondary"}
                className="shrink-0 ml-2"
              >
                {item.shopBottles === 0
                  ? "Out of stock"
                  : `${item.shopBottles} left`}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
