"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/lib/appContext";

const publicLinks = [
  { href: "/", label: "Home" },
  { href: "/categories", label: "Categorias" },
];

export default function Navbar() {
  const { cart, favorites, activeUser, login, logout } = useApp();
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);

    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: authForm.email }),
        });

        if (res.ok) {
          const user = await res.json();
          login(user);
          setShowAuth(false);
          setAuthForm({ name: "", email: "", password: "" });
        } else {
          setAuthError("Usuario no encontrado");
        }
      } else {
        if (!authForm.name.trim()) {
          setAuthError("El nombre es requerido");
          setAuthLoading(false);
          return;
        }
        const res = await fetch("/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(authForm),
        });

        if (res.ok) {
          const user = await res.json();
          login(user);
          setShowAuth(false);
          setAuthForm({ name: "", email: "", password: "" });
        } else {
          const data = await res.json();
          setAuthError(data.message || "Error al registrarse");
        }
      }
    } catch {
      setAuthError("Error de conexion");
    } finally {
      setAuthLoading(false);
    }
  };

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-4 text-slate-900 sm:flex-row sm:items-center sm:justify-between">
        <Link className="text-lg font-semibold" href="/">
          Ecommerce TP
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
              href={link.href}
            >
              {link.label}
            </Link>
          ))}

          <Link
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            href="/cart"
          >
            Carrito
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {cart.length}
              </span>
            )}
          </Link>

          <Link
            className="relative rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
            href="/favorites"
          >
            Favoritos
            {favorites.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {favorites.length}
              </span>
            )}
          </Link>

          {activeUser ? (
            <>
              <Link
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                href="/user"
              >
                {activeUser.name}
              </Link>
              <Link
                className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                href="/dashboard"
              >
                Dashboard
              </Link>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
            >
              Iniciar sesion
            </button>
          )}
        </div>
      </nav>

      {showAuth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-950">
                {isLogin ? "Iniciar sesion" : "Registrarse"}
              </h2>
              <button
                onClick={() => {
                  setShowAuth(false);
                  setAuthError("");
                }}
                className="text-slate-400 hover:text-slate-600"
              >
                Cerrar
              </button>
            </div>

            <form onSubmit={handleAuth} className="mt-6 space-y-4">
              {authError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {authError}
                </div>
              )}

              {!isLogin && (
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={authForm.name}
                    onChange={(e) =>
                      setAuthForm({ ...authForm, name: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </label>
                <input
                  type="email"
                  value={authForm.email}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, email: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Contraseña
                </label>
                <input
                  type="password"
                  value={authForm.password}
                  onChange={(e) =>
                    setAuthForm({ ...authForm, password: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                {authLoading
                  ? "Procesando..."
                  : isLogin
                    ? "Iniciar sesion"
                    : "Registrarse"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setAuthError("");
                }}
                className="text-sm text-emerald-700 hover:text-emerald-900"
              >
                {isLogin
                  ? "No tenes cuenta? Registrate"
                  : "Ya tenes cuenta? Inicia sesion"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
