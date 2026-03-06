import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Produto } from "../types/Produto";

export interface CartItem {
  produto: Produto;
  quantidade: number;
}

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
  addToCart: (produto: Produto) => void;
  removeFromCart: (produtoId: number) => void;
  updateQuantity: (produtoId: number, quantidade: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const savedCart = localStorage.getItem("maidcafe_cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("maidcafe_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (produto: Produto) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.produto.id === produto.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.produto.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prevCart, { produto, quantidade: 1 }];
    });
  };

  const removeFromCart = (produtoId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.produto.id !== produtoId));
  };

  const updateQuantity = (produtoId: number, quantidade: number) => {
    setCart((prevCart) => {
      if (quantidade <= 0) {
        return prevCart.filter((item) => item.produto.id !== produtoId);
      }
      return prevCart.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      );
    });
  };

  const clearCart = () => setCart([]);

  const cartTotal = cart.reduce((total, item) => total + Number(item.produto.preco) * item.quantidade, 0);
  const cartCount = cart.reduce((count, item) => count + item.quantidade, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
