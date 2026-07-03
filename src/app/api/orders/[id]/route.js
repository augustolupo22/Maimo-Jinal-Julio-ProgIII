import mongoose from "mongoose";
import { getOrderById, updateOrderStatus } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ message: "ID invalido" }, { status: 400 });
  }

  try {
    const order = await getOrderById(id);

    if (!order) {
      return Response.json({ message: "Orden no encontrada" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener la orden", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ message: "ID invalido" }, { status: 400 });
  }

  try {
    const body = await request.json();

    if (!body.status) {
      return Response.json(
        { message: "El estado es requerido" },
        { status: 400 }
      );
    }

    const order = await updateOrderStatus(id, body.status);

    if (!order) {
      return Response.json({ message: "Orden no encontrada" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    return Response.json(
      { message: "Error al actualizar la orden", error: error.message },
      { status: 400 }
    );
  }
}
