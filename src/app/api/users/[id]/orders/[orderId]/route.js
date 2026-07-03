import mongoose from "mongoose";
import { getOrderByIdAndUser } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id, orderId } = await params;

  if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(orderId)) {
    return Response.json({ message: "ID invalido" }, { status: 400 });
  }

  try {
    const order = await getOrderByIdAndUser(orderId, id);

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
