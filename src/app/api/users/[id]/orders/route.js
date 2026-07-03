import mongoose from "mongoose";
import { getOrdersByUser } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ message: "ID de usuario invalido" }, { status: 400 });
  }

  try {
    const orders = await getOrdersByUser(id);

    return Response.json(orders);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener las ordenes", error: error.message },
      { status: 500 }
    );
  }
}
