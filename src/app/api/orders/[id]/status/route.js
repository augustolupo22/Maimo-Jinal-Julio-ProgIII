import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";

export const dynamic = "force-dynamic";

const VALID_STATUSES = ["Active", "Closed", "Shipped", "Canceled"];

export async function PATCH(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ message: "ID de orden invalido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return Response.json(
        { message: `Estado invalido. Debe ser uno de: ${VALID_STATUSES.join(", ")}` },
        { status: 400 }
      );
    }

    await connectDB();

    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate("userId", "name email");

    if (!order) {
      return Response.json({ message: "Orden no encontrada" }, { status: 404 });
    }

    return Response.json(order);
  } catch (error) {
    return Response.json(
      { message: "Error al actualizar el estado", error: error.message },
      { status: 400 }
    );
  }
}
