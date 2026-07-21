"use client";

import { useState } from "react";
import { statusOptions } from "@/lib/orderStatus";

export default function AdminOrderStatusForm({ orderId, currentStatus }) {
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setMessage("Estado actualizado correctamente");
      } else {
        setMessage("Error al actualizar el estado");
      }
    } catch {
      setMessage("Error de conexion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex items-end gap-3">
      <div>
        <label className="mb-1 block text-sm font-medium text-slate-700">
          Estado
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm focus:border-emerald-500 focus:outline-none"
        >
          {statusOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-emerald-600 px-6 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>
      {message && (
        <span className="text-sm text-slate-600">{message}</span>
      )}
    </form>
  );
}
