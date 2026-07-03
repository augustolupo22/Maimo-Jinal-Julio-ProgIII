import Link from "next/link";
import { getDashboardMetrics } from "@/lib/orders";
import ProductDashboardContainer from "@/containers/ProductDashboardContainer";

export const dynamic = "force-dynamic";

const statusColors = {
  Active: "bg-blue-100 text-blue-800",
  Closed: "bg-slate-100 text-slate-800",
  Shipped: "bg-emerald-100 text-emerald-800",
  Canceled: "bg-red-100 text-red-800",
};

export default async function DashboardPage() {
  const metrics = await getDashboardMetrics();

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-lg bg-slate-900 px-8 py-10 text-white shadow-xl">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">
            Administracion
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-semibold">
            Dashboard de ecommerce
          </h1>
          <p className="mt-4 max-w-2xl text-base text-slate-300">
            Resumen general, metricas y acceso rapido a la administracion.
          </p>
        </section>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Total ordenes
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {metrics.totalOrders}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Ingresos totales
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-700">
              ${metrics.totalRevenue}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Usuarios registrados
            </p>
            <p className="mt-2 text-3xl font-bold text-slate-950">
              {metrics.totalUsers}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-wide text-slate-500">
              Stock bajo
            </p>
            <p className="mt-2 text-3xl font-bold text-amber-600">
              {metrics.lowStockProducts.length}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">
                Ultimas ordenes
              </h2>
              <Link
                href="/dashboard/orders"
                className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                Ver todas
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {metrics.recentOrders.length === 0 ? (
                <p className="text-sm text-slate-500">No hay ordenes aun.</p>
              ) : (
                metrics.recentOrders.map((order) => (
                  <Link
                    key={order._id}
                    href={`/dashboard/order/${order._id}`}
                    className="flex items-center justify-between rounded-lg border border-slate-100 p-3 hover:bg-slate-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-950">
                        #{order.orderNumber}
                      </p>
                      <p className="text-xs text-slate-500">
                        {order.userId?.name || "Sin usuario"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          statusColors[order.status] || "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <span className="text-sm font-semibold text-slate-950">
                        ${order.total}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-950">
              Ultimos usuarios
            </h2>
            <div className="mt-4 space-y-3">
              {metrics.recentUsers.length === 0 ? (
                <p className="text-sm text-slate-500">No hay usuarios aun.</p>
              ) : (
                metrics.recentUsers.map((user) => (
                  <div
                    key={user._id}
                    className="rounded-lg border border-slate-100 p-3"
                  >
                    <p className="text-sm font-medium text-slate-950">
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                    <p className="text-xs text-slate-400">
                      {new Date(user.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {metrics.lowStockProducts.length > 0 && (
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h2 className="text-lg font-semibold text-amber-800">
              Alertas de stock bajo
            </h2>
            <div className="mt-4 space-y-2">
              {metrics.lowStockProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-amber-900">{product.name}</span>
                  <span className="font-medium text-amber-700">
                    Stock: {product.stock}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/dashboard/products"
            className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Administrar productos
          </Link>
          <Link
            href="/dashboard/orders"
            className="rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Administrar ordenes
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">
            Gestion de productos y categorias
          </h2>
          <div className="mt-4">
            <ProductDashboardContainer />
          </div>
        </section>
      </div>
    </main>
  );
}
