"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useApp } from "@/lib/appContext";

export default function CheckoutPage() {
  const { cart, activeUser, clearCart } = useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: activeUser?.name || "",
    email: activeUser?.email || "",
    phone: "",
    address: "",
    notes: "",
    cardNumber: "",
    cardName: "",
    cardExpiry: "",
    cardCvv: "",
  });

  const [errors, setErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState("card");

  const total = cart.reduce((sum, item) => sum + item.subtotal, 0);

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "El nombre es requerido";
    if (!form.email.trim()) newErrors.email = "El email es requerido";
    if (!form.phone.trim()) newErrors.phone = "El telefono es requerido";
    if (!form.address.trim()) newErrors.address = "La direccion es requerida";

    if (paymentMethod === "card") {
      const cleanNumber = form.cardNumber.replace(/\s/g, "");
      if (!cleanNumber || cleanNumber.length < 13) {
        newErrors.cardNumber = "Numero de tarjeta invalido";
      }
      if (!form.cardName.trim()) {
        newErrors.cardName = "El titular es requerido";
      }
      if (!/^\d{2}\/\d{2}$/.test(form.cardExpiry)) {
        newErrors.cardExpiry = "Formato MM/AA";
      }
      if (!/^\d{3,4}$/.test(form.cardCvv)) {
        newErrors.cardCvv = "CVV invalido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) return;
    if (!activeUser) {
      setError("Debes iniciar sesion para completar la compra");
      return;
    }
    if (cart.length === 0) {
      setError("El carrito esta vacio");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: activeUser._id,
          items: cart.map((item) => ({
            productId: item.productId,
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity,
            customizations: item.customizations,
            subtotal: item.subtotal,
          })),
          total,
          shippingAddress: form.address,
          contactPhone: form.phone,
          contactEmail: form.email,
          notes: form.notes,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Error al crear la orden");
      }

      const order = await res.json();
      setOrderId(order._id);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success && orderId) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-2xl text-center">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-12">
            <h1 className="text-2xl font-semibold text-emerald-800">
              Orden creada correctamente
            </h1>
            <p className="mt-4 text-emerald-700">
              Tu orden ha sido procesada. Puedes ver los detalles en tu panel
              de usuario.
            </p>
            <div className="mt-8 flex justify-center gap-3">
              <Link
                href={`/user/order/${orderId}`}
                className="rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700"
              >
                Ver mi orden
              </Link>
              <Link
                href="/"
                className="rounded-lg border border-emerald-200 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 hover:bg-emerald-50"
              >
                Volver al catalogo
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (cart.length === 0 && !success) {
    return (
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>
          <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-white p-12">
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
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-semibold text-slate-950">Checkout</h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-5">
          <form onSubmit={handleSubmit} className="lg:col-span-3 space-y-6">
            {error && (
              <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Nombre completo
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-sm ${
                  errors.name ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Tu nombre"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-sm ${
                  errors.email ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="tu@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Telefono
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={`w-full rounded-lg border px-4 py-3 text-sm ${
                  errors.phone ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Tu telefono"
              />
              {errors.phone && (
                <p className="mt-1 text-xs text-red-600">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Direccion de envio
              </label>
              <textarea
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                rows={3}
                className={`w-full rounded-lg border px-4 py-3 text-sm ${
                  errors.address ? "border-red-300" : "border-slate-200"
                }`}
                placeholder="Direccion completa"
              />
              {errors.address && (
                <p className="mt-1 text-xs text-red-600">{errors.address}</p>
              )}
            </div>

            <div className="border-t border-slate-200 pt-6">
              <h3 className="text-lg font-semibold text-slate-950 mb-4">
                Metodo de pago
              </h3>
              <div className="flex gap-3 mb-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    paymentMethod === "card"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Tarjeta de credito/debito
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cash")}
                  className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                    paymentMethod === "cash"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                      : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  Pago en efectivo
                </button>
              </div>

              {paymentMethod === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Numero de tarjeta
                    </label>
                    <input
                      type="text"
                      value={form.cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                        const formatted = val.replace(/(\d{4})(?=\d)/g, "$1 ");
                        setForm({ ...form, cardNumber: formatted });
                      }}
                      placeholder="1234 5678 9012 3456"
                      className={`w-full rounded-lg border px-4 py-3 text-sm ${
                        errors.cardNumber ? "border-red-300" : "border-slate-200"
                      }`}
                    />
                    {errors.cardNumber && (
                      <p className="mt-1 text-xs text-red-600">{errors.cardNumber}</p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Titular de la tarjeta
                    </label>
                    <input
                      type="text"
                      value={form.cardName}
                      onChange={(e) => setForm({ ...form, cardName: e.target.value })}
                      placeholder="Nombre del titular"
                      className={`w-full rounded-lg border px-4 py-3 text-sm ${
                        errors.cardName ? "border-red-300" : "border-slate-200"
                      }`}
                    />
                    {errors.cardName && (
                      <p className="mt-1 text-xs text-red-600">{errors.cardName}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        value={form.cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
                          setForm({ ...form, cardExpiry: val });
                        }}
                        placeholder="MM/AA"
                        className={`w-full rounded-lg border px-4 py-3 text-sm ${
                          errors.cardExpiry ? "border-red-300" : "border-slate-200"
                        }`}
                      />
                      {errors.cardExpiry && (
                        <p className="mt-1 text-xs text-red-600">{errors.cardExpiry}</p>
                      )}
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-slate-700">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={form.cardCvv}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 4);
                          setForm({ ...form, cardCvv: val });
                        }}
                        placeholder="123"
                        className={`w-full rounded-lg border px-4 py-3 text-sm ${
                          errors.cardCvv ? "border-red-300" : "border-slate-200"
                        }`}
                      />
                      {errors.cardCvv && (
                        <p className="mt-1 text-xs text-red-600">{errors.cardCvv}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-slate-400">
                    * Simulacion de pago. No se procesaran cargos reales.
                  </p>
                </div>
              )}

              {paymentMethod === "cash" && (
                <p className="text-sm text-slate-500">
                  Abonaras en efectivo al momento de la entrega.
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Notas (opcional)
              </label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                rows={2}
                className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm"
                placeholder="Instrucciones adicionales"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !activeUser}
              className="w-full rounded-lg bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Procesando..." : "Confirmar compra"}
            </button>
          </form>

          <div className="lg:col-span-2">
            <div className="sticky top-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">
                Resumen de compra
              </h2>
              <div className="mt-4 space-y-3">
                {cart.map((item) => (
                  <div
                    key={`${item.productId}-${item.customizationsKey}`}
                    className="flex justify-between text-sm"
                  >
                    <span className="text-slate-600">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-medium text-slate-950">
                      ${item.subtotal}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-slate-200 pt-4">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500">Total</span>
                  <span className="text-xl font-bold text-slate-950">
                    ${total}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
