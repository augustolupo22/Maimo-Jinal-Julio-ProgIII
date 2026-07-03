"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/lib/appContext";

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useApp();

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  if (cart.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-semibold text-slate-950">Carrito</h1>
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-600">Tu carrito esta vacio.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Ir al catalogo
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-slate-950">Carrito</h1>

        <div className="mt-8 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.productId}-${item.customizationsKey}`}
              className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {item.image ? (
                  <Image
                    alt={item.name}
                    className="object-cover"
                    fill
                    sizes="80px"
                    src={getProductImageSrc(item.image)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs text-slate-500">
                    Sin imagen
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <Link
                    href={`/product/${item.productId}`}
                    className="font-semibold text-slate-950 hover:text-emerald-700"
                  >
                    {item.name}
                  </Link>
                  {Object.keys(item.customizations).length > 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      {Object.entries(item.customizations)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(" | ")}
                    </p>
                  )}
                </div>
                <p className="text-sm text-slate-500">
                  ${item.price} c/u
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.customizationsKey,
                      item.quantity - 1
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-medium">
                  {item.quantity}
                </span>
                <button
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.customizationsKey,
                      item.quantity + 1
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col items-end justify-between">
                <p className="font-semibold text-slate-950">
                  ${item.subtotal}
                </p>
                <button
                  onClick={() =>
                    removeFromCart(item.productId, item.customizationsKey)
                  }
                  className="text-xs text-red-600 hover:text-red-800"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-col items-end gap-4">
          <div className="text-right">
            <p className="text-sm text-slate-500">Total</p>
            <p className="text-2xl font-bold text-slate-950">${total}</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Vaciar carrito
            </button>
            <Link
              href="/"
              className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Seguir comprando
            </Link>
            <Link
              href="/checkout"
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Finalizar compra
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
