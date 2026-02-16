"use client";

import { useReducer, useCallback } from "react";
import type { SizeUnit, ProductCategory } from "@/generated/prisma";

export interface CartProduct {
  id: string;
  name: string;
  brand: string;
  category: ProductCategory;
  size: SizeUnit;
  mrp: number;
  shopBottles: number;
}

export interface CartItem {
  product: CartProduct;
  quantity: number;
  unitPrice: number;
}

interface CartState {
  items: CartItem[];
  discount: number;
}

type CartAction =
  | { type: "ADD_ITEM"; product: CartProduct }
  | { type: "REMOVE_ITEM"; productId: string }
  | { type: "UPDATE_QUANTITY"; productId: string; quantity: number }
  | { type: "SET_DISCOUNT"; discount: number }
  | { type: "CLEAR_CART" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (i) => i.product.id === action.product.id
      );
      if (existing) {
        const newQty = existing.quantity + 1;
        if (newQty > existing.product.shopBottles) return state;
        return {
          ...state,
          items: state.items.map((i) =>
            i.product.id === action.product.id
              ? { ...i, quantity: newQty }
              : i
          ),
        };
      }
      return {
        ...state,
        items: [
          ...state.items,
          { product: action.product, quantity: 1, unitPrice: action.product.mrp },
        ],
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((i) => i.product.id !== action.productId),
      };
    case "UPDATE_QUANTITY": {
      if (action.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (i) => i.product.id !== action.productId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((i) =>
          i.product.id === action.productId
            ? { ...i, quantity: Math.min(action.quantity, i.product.shopBottles) }
            : i
        ),
      };
    }
    case "SET_DISCOUNT":
      return { ...state, discount: action.discount };
    case "CLEAR_CART":
      return { items: [], discount: 0 };
    default:
      return state;
  }
}

export function useCart() {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    discount: 0,
  });

  const addItem = useCallback(
    (product: CartProduct) => dispatch({ type: "ADD_ITEM", product }),
    []
  );

  const removeItem = useCallback(
    (productId: string) => dispatch({ type: "REMOVE_ITEM", productId }),
    []
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", productId, quantity }),
    []
  );

  const setDiscount = useCallback(
    (discount: number) => dispatch({ type: "SET_DISCOUNT", discount }),
    []
  );

  const clearCart = useCallback(() => dispatch({ type: "CLEAR_CART" }), []);

  const subtotal = state.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const total = subtotal - state.discount;
  const itemCount = state.items.reduce((sum, item) => sum + item.quantity, 0);

  return {
    items: state.items,
    discount: state.discount,
    subtotal,
    total,
    itemCount,
    addItem,
    removeItem,
    updateQuantity,
    setDiscount,
    clearCart,
  };
}
