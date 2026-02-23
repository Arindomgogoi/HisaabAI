"use client";

import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductSearch } from "./product-search";
import { Cart } from "./cart";
import { CartSummary } from "./cart-summary";
import { useCart, type CartProduct } from "@/hooks/use-cart";
import { useVoiceInput } from "@/hooks/use-voice-input";
import { ShoppingBag, ShoppingCart, Mic, MicOff } from "lucide-react";
import { toast } from "sonner";

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

  const handleVoiceResult = useCallback(
    async (transcript: string) => {
      if (!transcript.trim()) return;
      try {
        const productNames = products.map((p) => p.name);
        const res = await fetch("/api/voice-parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transcript, productNames }),
        });
        const parsed = await res.json() as { productName: string; quantity: number }[];
        if (!Array.isArray(parsed) || parsed.length === 0) {
          toast.error("Could not understand — try again");
          return;
        }
        let added = 0;
        for (const item of parsed) {
          const product = products.find(
            (p) => p.name.toLowerCase() === item.productName.toLowerCase()
          );
          if (product) {
            for (let i = 0; i < (item.quantity ?? 1); i++) {
              addItem(product);
            }
            added++;
          }
        }
        if (added > 0) {
          toast.success(`Added ${added} item${added !== 1 ? "s" : ""} from voice`);
        } else {
          toast.error("No matching products found");
        }
      } catch {
        toast.error("Failed to parse voice input");
      }
    },
    [products, addItem]
  );

  const { isListening, supported, startListening, stopListening } =
    useVoiceInput(handleVoiceResult);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 h-[calc(100vh-140px)]">
      {/* Product Search - Left Side */}
      <Card className="lg:col-span-3 flex flex-col overflow-hidden">
        <CardHeader className="pb-3 shrink-0">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            Products ({products.length})
            {supported && (
              <Button
                type="button"
                variant={isListening ? "default" : "outline"}
                size="sm"
                className={
                  isListening
                    ? "ml-auto bg-red-500 hover:bg-red-600 text-white animate-pulse"
                    : "ml-auto"
                }
                onClick={isListening ? stopListening : startListening}
                title="Voice order"
              >
                {isListening ? (
                  <MicOff className="w-3.5 h-3.5 mr-1.5" />
                ) : (
                  <Mic className="w-3.5 h-3.5 mr-1.5" />
                )}
                {isListening ? "Listening..." : "Voice"}
              </Button>
            )}
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
