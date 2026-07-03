import Link from "next/link";
import ProductDashboardContainer from "@/containers/ProductDashboardContainer";

export const dynamic = "force-dynamic";

export default function DashboardProductsPage() {
  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <Link
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
          href="/dashboard"
        >
          Volver al dashboard
        </Link>

        <section className="mt-6 mb-8">
          <h1 className="text-3xl font-semibold text-slate-950">
            Productos y categorias
          </h1>
          <p className="mt-2 text-slate-600">
            Crear, editar y eliminar productos y categorias del ecommerce.
          </p>
        </section>

        <ProductDashboardContainer />
      </div>
    </main>
  );
}
