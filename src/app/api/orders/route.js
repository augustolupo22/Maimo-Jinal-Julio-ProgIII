import { connectDB } from "@/lib/mongodb";
import { getOrders } from "@/lib/orders";
import { createOrder } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const orders = await getOrders();

    return Response.json(orders);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener las ordenes", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items, total, shippingAddress, contactPhone, contactEmail, notes } = body;

    if (!userId || !items || items.length === 0 || !total || !shippingAddress || !contactPhone || !contactEmail) {
      return Response.json(
        { message: "Todos los campos obligatorios deben ser proporcionados" },
        { status: 400 }
      );
    }

    const order = await createOrder({
      userId,
      items,
      total,
      shippingAddress,
      contactPhone,
      contactEmail,
      notes,
    });

    return Response.json(order, { status: 201 });
  } catch (error) {
    return Response.json(
      { message: "Error al crear la orden", error: error.message },
      { status: 400 }
    );
  }
}
