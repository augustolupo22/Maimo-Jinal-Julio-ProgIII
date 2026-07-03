import Link from "next/link";
import { getOrders } from "@/lib/orders";
import OrderStatusDropdown from "./OrderStatusDropdown";

export const dynamic = "force-dynamic";

const statusColors = {
  Active: "bg-blue-100 text-blue-800",
  Closed: "bg-slate-100 text-slate-800",
  Shipped: "bg-emerald-100 text-emerald-800",
  Canceled: "bg-red-100 text-red-800",
};

export default async function DashboardOrdersPage() {
  const orders = await getOrders();

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
            Gestion de ordenes
          </h1>
          <p className="mt-2 text-slate-600">
            Administrar todas las ordenes del ecommerce.
          </p>
        </section>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-12 text-center">
            <p className="text-slate-600">No hay ordenes aun.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-medium text-slate-700">
                    # Orden
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700">
                    Fecha
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700">
                    Cliente
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700">
                    Total
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700">
                    Estado
                  </th>
                  <th className="px-4 py-3 font-medium text-slate-700">
                    Accion
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-950">
                      #{order.orderNumber}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {new Date(order.createdAt).toLocaleDateString("es-AR")}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {order.userId?.name || "Sin usuario"}
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-950">
                      ${order.total}
                    </td>
                    <td className="px-4 py-3">
                      <OrderStatusDropdown
                        orderId={order._id}
                        currentStatus={order.status}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/dashboard/order/${order._id}`}
                        className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
