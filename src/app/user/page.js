"use client";

import { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { useApp } from "@/lib/appContext";

const statusColors = {
  Active: "bg-blue-100 text-blue-800",
  Closed: "bg-slate-100 text-slate-800",
  Shipped: "bg-emerald-100 text-emerald-800",
  Canceled: "bg-red-100 text-red-800",
};

export default function UserPage() {
  const { activeUser, logout } = useApp();
  const [orders, setOrders] = useState([]);
  const [loading, startTransition] = useTransition();

  useEffect(() => {
    if (activeUser?._id) {
      startTransition(async () => {
        const res = await fetch(`/api/users/${activeUser._id}/orders`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      });
    }
  }, [activeUser, startTransition]);

  if (!activeUser) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold text-slate-950">Mi cuenta</h1>
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12">
            <p className="text-slate-600">
              Inicia sesion para ver tu informacion y ordenes.
            </p>
            <p className="mt-4 text-sm text-slate-500">
              Usa el navbar para registrarte o iniciar sesion.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-semibold text-slate-950">Mi cuenta</h1>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cerrar sesion
          </button>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm uppercase tracking-wide text-slate-500">
              Nombre
            </h2>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {activeUser.name}
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-sm uppercase tracking-wide text-slate-500">
              Email
            </h2>
            <p className="mt-2 text-lg font-semibold text-slate-950">
              {activeUser.email}
            </p>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="text-xl font-semibold text-slate-950">Mis ordenes</h2>

          {loading ? (
            <p className="mt-4 text-slate-500">Cargando ordenes...</p>
          ) : orders.length === 0 ? (
            <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
              <p className="text-slate-600">Aun no tienes ordenes.</p>
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-medium text-emerald-700 hover:text-emerald-900"
              >
                Explorar catalogo
              </Link>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {orders.map((order) => (
                <Link
                  key={order._id}
                  href={`/user/order/${order._id}`}
                  className="block rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:border-emerald-200 hover:bg-emerald-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-950">
                        Orden #{order.orderNumber}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {new Date(order.createdAt).toLocaleDateString("es-AR")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          statusColors[order.status] || "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {order.status}
                      </span>
                      <p className="font-semibold text-slate-950">
                        ${order.total}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
