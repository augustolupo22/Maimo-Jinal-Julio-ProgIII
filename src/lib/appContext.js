"use client";

import { createContext, useContext, useState, useCallback } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [activeUser, setActiveUser] = useState(null);

  const addToCart = useCallback((item) => {
    const customizationsKey = item.customizations
      ? JSON.stringify(item.customizations)
      : "";

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (c) =>
          c.productId === item.productId &&
          c.customizationsKey === customizationsKey
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        const newQuantity = updated[existingIndex].quantity + (item.quantity || 1);
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQuantity,
          subtotal: updated[existingIndex].price * newQuantity,
        };
        return updated;
      }

      const quantity = item.quantity || 1;
      return [
        ...prev,
        {
          productId: item.productId,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity,
          customizations: item.customizations || {},
          subtotal: item.price * quantity,
          customizationsKey,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((productId, customizationsKey = "") => {
    setCart((prev) =>
      prev.filter(
        (c) =>
          !(c.productId === productId && c.customizationsKey === customizationsKey)
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (productId, customizationsKey = "", quantity) => {
      if (quantity < 1) {
        removeFromCart(productId, customizationsKey);
        return;
      }

      setCart((prev) =>
        prev.map((c) => {
          if (c.productId === productId && c.customizationsKey === customizationsKey) {
            return {
              ...c,
              quantity,
              subtotal: c.price * quantity,
            };
          }
          return c;
        })
      );
    },
    [removeFromCart]
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const toggleFavorite = useCallback((product) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f._id === product._id || f === product._id);
      if (exists) {
        return prev.filter((f) => (f._id || f) !== product._id);
      }
      return [...prev, product];
    });
  }, []);

  const isFavorite = useCallback(
    (productId) => {
      return favorites.some((f) => (f._id || f) === productId);
    },
    [favorites]
  );

  const login = useCallback((user) => {
    setActiveUser(user);
  }, []);

  const logout = useCallback(() => {
    setActiveUser(null);
    setFavorites([]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        cart,
        favorites,
        activeUser,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        toggleFavorite,
        isFavorite,
        login,
        logout,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export { AppContext };
