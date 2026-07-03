"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useApp } from "@/lib/appContext";

function getProductImageSrc(image) {
  if (!image) return "";
  if (image.startsWith("/")) return image;
  return `/images/products/${image}`;
}

export default function ProductDetail({ product, relatedProducts }) {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedAttributes, setSelectedAttributes] = useState({});
  const [addedMessage, setAddedMessage] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      productId: product._id,
      name: product.name,
      image: product.image,
      price: product.price,
      quantity,
      customizations: selectedAttributes,
    });
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  const handleToggleFavorite = () => {
    toggleFavorite({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  return (
    <div className="mt-8">
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-lg bg-slate-100">
          {product.image ? (
            <Image
              alt={product.name}
              className="object-cover"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              src={getProductImageSrc(product.image)}
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-500">
              Sin imagen
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <h1 className="text-3xl font-semibold text-slate-950">
            {product.name}
          </h1>

          <p className="mt-2 text-2xl font-bold text-emerald-700">
            ${product.price}
          </p>

          <p className="mt-4 text-sm text-slate-500">
            Stock disponible: {product.stock}
          </p>

          {product.categories?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {product.categories.map((category) =>
                typeof category === "string" ? (
                  <span
                    key={category}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700"
                  >
                    {category}
                  </span>
                ) : (
                  <Link
                    key={category._id}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-800"
                    href={`/category/${category._id}`}
                  >
                    {category.name}
                  </Link>
                )
              )}
            </div>
          )}

          <p className="mt-6 text-slate-600">
            {product.description || "Sin descripcion"}
          </p>

          {product.attributes?.length > 0 && (
            <div className="mt-6 space-y-4">
              {product.attributes.map((attr) => (
                <div key={attr.name}>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    {attr.name}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {attr.options.map((option) => (
                      <button
                        key={option}
                        onClick={() =>
                          setSelectedAttributes((prev) => ({
                            ...prev,
                            [attr.name]: option,
                          }))
                        }
                        className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                          selectedAttributes[attr.name] === option
                            ? "border-emerald-500 bg-emerald-50 text-emerald-800"
                            : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6">
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Cantidad
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                -
              </button>
              <span className="w-12 text-center text-lg font-medium">
                {quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity((q) => Math.min(product.stock, q + 1))
                }
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`rounded-lg border px-6 py-3 text-sm font-semibold transition-colors ${
                isFavorite(product._id)
                  ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {isFavorite(product._id)
                ? "En favoritos"
                : "Agregar a favoritos"}
            </button>
          </div>

          {addedMessage && (
            <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
              Agregado al carrito correctamente
            </div>
          )}
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-semibold text-slate-950">
            Productos relacionados
          </h2>
          <div className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((rp) => (
              <Link
                key={rp._id}
                className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                href={`/product/${rp._id}`}
              >
                <div className="relative aspect-[4/3] bg-slate-100">
                  {rp.image ? (
                    <Image
                      alt={rp.name}
                      className="object-cover"
                      fill
                      sizes="25vw"
                      src={getProductImageSrc(rp.image)}
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-slate-500">
                      Sin imagen
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-slate-950">
                    {rp.name}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-emerald-700">
                    ${rp.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
