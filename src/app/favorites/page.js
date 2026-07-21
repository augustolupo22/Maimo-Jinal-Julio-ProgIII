"use client";

import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/lib/appContext";

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

export default function FavoritesPage() {
  const { favorites, toggleFavorite, toggleFavoriteWithUser, activeUser } = useApp();

  if (!favorites || favorites.length === 0) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-3xl font-semibold text-slate-950">Favoritos</h1>
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-600">No tienes productos favoritos.</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Explorar catalogo
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-semibold text-slate-950">Favoritos</h1>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((product) => (
            <article
              key={product._id}
              className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[4/3] bg-slate-100">
                {product.image ? (
                  <Image
                    alt={product.name}
                    className="object-cover"
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    src={getProductImageSrc(product.image)}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-sm text-slate-500">
                    Sin imagen
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <Link
                    href={`/product/${product._id}`}
                    className="text-lg font-semibold text-slate-950 hover:text-emerald-700"
                  >
                    {product.name}
                  </Link>
                  <p className="shrink-0 text-base font-semibold text-emerald-700">
                    ${product.price}
                  </p>
                </div>
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={() => {
                      if (activeUser?._id) {
                        toggleFavoriteWithUser(product, activeUser._id);
                      } else {
                        toggleFavorite(product);
                      }
                    }}
                    className="text-sm font-medium text-red-600 hover:text-red-800"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
