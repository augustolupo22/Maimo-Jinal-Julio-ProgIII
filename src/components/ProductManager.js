"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "@/app/actions/products";

const initialForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  image: "",
  categories: [],
  attributes: [],
};

export default function ProductManager({
  initialCategories = [],
  initialProducts = [],
}) {
  const router = useRouter();
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [message, setMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isRefreshing, startRefreshTransition] = useTransition();

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId("");
  }, []);

  const refreshProducts = useCallback(() => {
    startRefreshTransition(() => {
      router.refresh();
    });
  }, [router]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleCategoryChange(event) {
    const { checked, value } = event.target;

    setForm((current) => {
      const categories = checked
        ? [...current.categories, value]
        : current.categories.filter((categoryId) => categoryId !== value);

      return { ...current, categories };
    });
  }

  function addAttribute() {
    setForm((current) => ({
      ...current,
      attributes: [...current.attributes, { name: "", options: [""] }],
    }));
  }

  function removeAttribute(index) {
    setForm((current) => ({
      ...current,
      attributes: current.attributes.filter((_, i) => i !== index),
    }));
  }

  function handleAttributeNameChange(index, value) {
    setForm((current) => {
      const attrs = [...current.attributes];
      attrs[index] = { ...attrs[index], name: value };
      return { ...current, attributes: attrs };
    });
  }

  function addOption(attrIndex) {
    setForm((current) => {
      const attrs = [...current.attributes];
      attrs[attrIndex] = { ...attrs[attrIndex], options: [...attrs[attrIndex].options, ""] };
      return { ...current, attributes: attrs };
    });
  }

  function removeOption(attrIndex, optIndex) {
    setForm((current) => {
      const attrs = [...current.attributes];
      attrs[attrIndex] = {
        ...attrs[attrIndex],
        options: attrs[attrIndex].options.filter((_, i) => i !== optIndex),
      };
      return { ...current, attributes: attrs };
    });
  }

  function handleOptionChange(attrIndex, optIndex, value) {
    setForm((current) => {
      const attrs = [...current.attributes];
      const options = [...attrs[attrIndex].options];
      options[optIndex] = value;
      attrs[attrIndex] = { ...attrs[attrIndex], options };
      return { ...current, attributes: attrs };
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);

    const formData = new FormData(event.currentTarget);
    formData.set("attributes", JSON.stringify(form.attributes));
    const action = editingId ? updateProduct.bind(null, editingId) : createProduct;

    try {
      const result = await action(null, formData);
      setMessage(result.message);

      if (result.ok) {
        resetForm();
        refreshProducts();
      }
    } catch {
      setMessage("Ocurrio un error al guardar el producto.");
    } finally {
      setIsSaving(false);
    }
  }

  function handleEdit(product) {
    setEditingId(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
      categories: (product.categories || []).map((category) =>
        typeof category === "string" ? category : category._id
      ),
      attributes: (product.attributes || []).length > 0
        ? product.attributes.map((attr) => ({
            name: attr.name,
            options: attr.options.length > 0 ? [...attr.options] : [""],
          }))
        : [],
    });
    setMessage("Editando producto.");
  }

  async function handleDelete(id) {
    const result = await deleteProduct(id);

    if (!result.ok) {
      setMessage(result.message || "No se pudo eliminar el producto.");
      return;
    }

    if (editingId === id) {
      resetForm();
    }

    setMessage(result.message);
    refreshProducts();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[480px_1fr]">
      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-slate-900">
          {editingId ? "Editar producto" : "Nuevo producto"}
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Formulario simple para probar los endpoints del CRUD.
        </p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="name"
            placeholder="Nombre"
            value={form.name}
            onChange={handleChange}
            required
          />
          <textarea
            className="min-h-28 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="description"
            placeholder="Descripcion"
            value={form.description}
            onChange={handleChange}
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="price"
            placeholder="Precio"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="stock"
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none"
            name="image"
            placeholder="Nombre de imagen, ej: cookie.svg"
            value={form.image}
            onChange={handleChange}
          />
          <fieldset className="rounded-lg border border-slate-300 px-4 py-3">
            <legend className="px-1 text-sm font-medium text-slate-700">
              Categorias
            </legend>

            {initialCategories.length === 0 ? (
              <p className="py-2 text-sm text-slate-500">
                Crea una categoria antes de asociarla a productos.
              </p>
            ) : (
              <div className="grid gap-3">
                {initialCategories.map((category) => (
                  <label
                    key={category._id}
                    className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 px-3 py-2 hover:bg-slate-50"
                  >
                    <input
                      checked={form.categories.includes(category._id)}
                      className="mt-1 h-4 w-4"
                      name="categories"
                      type="checkbox"
                      value={category._id}
                      onChange={handleCategoryChange}
                    />
                    <span>
                      <span className="block text-sm font-medium text-slate-900">
                        {category.name}
                      </span>
                      {category.description ? (
                        <span className="mt-1 block text-xs text-slate-500">
                          {category.description}
                        </span>
                      ) : null}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </fieldset>

          <fieldset className="rounded-lg border border-slate-300 px-4 py-3">
            <legend className="px-1 text-sm font-medium text-slate-700">
              Atributos customizables
            </legend>

            {form.attributes.map((attr, ai) => (
              <div key={ai} className="mt-3 rounded-lg border border-slate-200 p-3">
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
                    placeholder="Nombre del atributo, ej: Tamaño"
                    value={attr.name}
                    onChange={(e) => handleAttributeNameChange(ai, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeAttribute(ai)}
                    className="rounded-lg bg-red-100 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-200"
                  >
                    X
                  </button>
                </div>

                <div className="mt-2 space-y-2">
                  {attr.options.map((opt, oi) => (
                    <div key={oi} className="flex items-center gap-2">
                      <input
                        className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none"
                        placeholder="Opción, ej: Chocolate"
                        value={opt}
                        onChange={(e) => handleOptionChange(ai, oi, e.target.value)}
                      />
                      {attr.options.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeOption(ai, oi)}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Quitar
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => addOption(ai)}
                  className="mt-2 text-xs font-medium text-emerald-700 hover:text-emerald-900"
                >
                  + Agregar opcion
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addAttribute}
              className="mt-3 w-full rounded-lg border border-dashed border-slate-300 py-2 text-sm font-medium text-slate-600 hover:border-emerald-300 hover:text-emerald-700"
            >
              + Agregar atributo
            </button>
          </fieldset>

          <div className="flex gap-3">
            <button
              className="rounded-lg bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? "Guardando..." : editingId ? "Actualizar" : "Crear"}
            </button>
            <button
              className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
              type="button"
              onClick={resetForm}
            >
              Limpiar
            </button>
          </div>
        </form>

        {message ? <p className="mt-4 text-sm text-slate-700">{message}</p> : null}
      </section>

      <section className="rounded-lg border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Productos</h2>
            <p className="mt-2 text-sm text-slate-600">
              Lista obtenida desde el container del dashboard.
            </p>
          </div>
          <button
            className="rounded-lg border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700"
            disabled={isRefreshing}
            type="button"
            onClick={refreshProducts}
          >
            {isRefreshing ? "Recargando..." : "Recargar"}
          </button>
        </div>

        {initialProducts.length === 0 ? (
          <p className="mt-6 text-slate-600">Todavia no hay productos cargados.</p>
        ) : (
          <div className="mt-6 grid gap-4">
            {initialProducts.map((product) => (
              <article
                key={product._id}
                className="rounded-lg border border-slate-200 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
                    <p className="mt-2 text-sm text-slate-600">
                      {product.description || "Sin descripcion"}
                    </p>
                  </div>
                  <div className="text-right text-sm text-slate-700">
                    <p>${product.price}</p>
                    <p>Stock: {product.stock}</p>
                  </div>
                </div>

                {product.attributes?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {product.attributes.map((attr) => (
                      <span
                        key={attr.name}
                        className="rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-800"
                        title={`${attr.name}: ${attr.options.join(", ")}`}
                      >
                        {attr.name} ({attr.options.length} opc.)
                      </span>
                    ))}
                  </div>
                )}

                {product.categories?.length ? (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {product.categories.map((category) => (
                      <span
                        key={typeof category === "string" ? category : category._id}
                        className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800"
                      >
                        {typeof category === "string" ? category : category.name}
                      </span>
                    ))}
                  </div>
                ) : null}

                <div className="mt-4 flex gap-3">
                  <button
                    className="rounded-lg bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
                    type="button"
                    onClick={() => handleEdit(product)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded-lg bg-red-100 px-4 py-2 text-sm font-semibold text-red-900"
                    type="button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Eliminar
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
