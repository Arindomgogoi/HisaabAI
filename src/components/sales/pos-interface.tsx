"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductSearch } from "./product-search";
import { Cart } from "./cart";
import { CartSummary } from "./cart-summary";
import { useCart, type CartProduct } from "@/hooks/use-cart";
import { ShoppingBag, ShoppingCart } from "lucide-react";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  creditLimit: unknown;
  creditBalance: unknown;
}

interface POSInterfaceProps {
  products: CartProduct[];
  customers: Customer[];
}

export function POSInterface({ products, customers }: POSInterfaceProps) {
  const {
    items,
    discount,
    subtotal,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    setDiscount,
    clearCart,
  } = useCart();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-140px)]">
      {/* Product Search - Left Side */}
      <Card className="lg:col-span-3 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 shrink-0">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Products ({products.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
          <ProductSearch products={products} onAddItem={addItem} />
        </CardContent>
      </Card>

      {/* Cart - Right Side */}
      <Card className="lg:col-span-2 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 shrink-0">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Cart
            {itemCount > 0 && (
              <span className="ml-auto text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                {itemCount}
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto">
            <Cart
              items={items}
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
            />
          </div>
          {items.length > 0 && (
            <CartSummary
              items={items}
              subtotal={subtotal}
              discount={discount}
              total={total}
              itemCount={itemCount}
              onSetDiscount={setDiscount}
              onClearCart={clearCart}
              customers={customers}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
