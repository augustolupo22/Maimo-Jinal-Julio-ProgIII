import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductById, getProductsByCategory } from "@/lib/products";
import ProductDetail from "./ProductDetail";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  let relatedProducts = [];
  if (product.categories?.length > 0) {
    const firstCategoryId =
      typeof product.categories[0] === "string"
        ? product.categories[0]
        : product.categories[0]._id;
    const allRelated = await getProductsByCategory(firstCategoryId);
    relatedProducts = allRelated
      .filter((p) => p._id !== product._id)
      .slice(0, 4);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
          href="/"
        >
          Volver al catalogo
        </Link>

        <ProductDetail product={product} relatedProducts={relatedProducts} />
      </div>
    </main>
  );
}
