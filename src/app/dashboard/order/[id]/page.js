import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import AdminOrderStatusForm from "./AdminOrderStatusForm";

export const dynamic = "force-dynamic";

const statusColors = {
  Active: "bg-blue-100 text-blue-800",
  Closed: "bg-slate-100 text-slate-800",
  Shipped: "bg-emerald-100 text-emerald-800",
  Canceled: "bg-red-100 text-red-800",
};

export default async function AdminOrderDetailPage({ params }) {
  const { id } = await params;
  const order = await getOrderById(id);

  if (!order) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-100 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <Link
          className="text-sm font-medium text-emerald-700 hover:text-emerald-900"
          href="/dashboard/orders"
        >
          Volver a ordenes
        </Link>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-slate-950">
              Orden #{order.orderNumber}
            </h1>
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                statusColors[order.status] || "bg-slate-100 text-slate-800"
              }`}
            >
              {order.status}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {new Date(order.createdAt).toLocaleDateString("es-AR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <h2 className="text-sm uppercase tracking-wide text-slate-500">
                Cliente
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                {order.userId?.name || "Sin usuario"}
              </p>
              <p className="text-sm text-slate-700">
                {order.userId?.email || "-"}
              </p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wide text-slate-500">
                Direccion de envio
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                {order.shippingAddress || "No especificada"}
              </p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wide text-slate-500">
                Telefono de contacto
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                {order.contactPhone || "-"}
              </p>
            </div>
            <div>
              <h2 className="text-sm uppercase tracking-wide text-slate-500">
                Email de contacto
              </h2>
              <p className="mt-1 text-sm text-slate-700">
                {order.contactEmail || "-"}
              </p>
            </div>
          </div>

          {order.notes && (
            <div className="mt-4">
              <h2 className="text-sm uppercase tracking-wide text-slate-500">
                Notas
              </h2>
              <p className="mt-1 text-sm text-slate-700">{order.notes}</p>
            </div>
          )}
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">Productos</h2>
          <div className="mt-4 space-y-3">
            {order.items.map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0"
              >
                <div>
                  <p className="font-medium text-slate-950">{item.name}</p>
                  {Object.keys(item.customizations || {}).length > 0 && (
                    <p className="mt-1 text-xs text-slate-500">
                      {Object.entries(item.customizations)
                        .map(([key, val]) => `${key}: ${val}`)
                        .join(" | ")}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-500">
                    ${item.price} x {item.quantity}
                  </p>
                  <p className="font-semibold text-slate-950">
                    ${item.subtotal}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-slate-200 pt-4">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-slate-950">
                Total
              </span>
              <span className="text-lg font-bold text-slate-950">
                ${order.total}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-950">
            Cambiar estado
          </h2>
          <AdminOrderStatusForm
            orderId={order._id}
            currentStatus={order.status}
          />
        </div>
      </div>
    </main>
  );
}
