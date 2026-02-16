"use client";

import { Button } from "@/components/ui/button";
import { SIZE_SHORT } from "@/lib/constants";
import { formatINR } from "@/lib/formatters";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import type { CartItem } from "@/hooks/use-cart";

interface CartProps {
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem }: CartProps) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <ShoppingCart className="w-10 h-10 mb-3 opacity-50" />
        <p className="text-sm">Cart is empty</p>
        <p className="text-xs mt-1">Search and add products to start billing</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[calc(100vh-480px)] overflow-y-auto">
      {items.map((item) => (
        <div
          key={item.product.id}
          className="flex items-center gap-3 p-2.5 rounded-lg border bg-card"
        >
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{item.product.name}</p>
            <p className="text-xs text-muted-foreground">
              {SIZE_SHORT[item.product.size]} &middot;{" "}
              {formatINR(item.unitPrice)} each
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity - 1)
              }
            >
              <Minus className="w-3 h-3" />
            </Button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={() =>
                onUpdateQuantity(item.product.id, item.quantity + 1)
              }
              disabled={item.quantity >= item.product.shopBottles}
            >
              <Plus className="w-3 h-3" />
            </Button>
          </div>

          <div className="text-right shrink-0 w-20">
            <p className="text-sm font-semibold">
              {formatINR(item.quantity * item.unitPrice)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-muted-foreground hover:text-red-600"
            onClick={() => onRemoveItem(item.product.id)}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
