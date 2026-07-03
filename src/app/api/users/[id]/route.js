import mongoose from "mongoose";
import { getUserById } from "@/lib/users";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ message: "ID de usuario invalido" }, { status: 400 });
  }

  try {
    const user = await getUserById(id);

    if (!user) {
      return Response.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(user);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener el usuario", error: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return Response.json({ message: "ID de usuario invalido" }, { status: 400 });
  }

  try {
    const body = await request.json();
    await connectDB();

    const updateData = {};
    if (body.name) updateData.name = body.name;
    if (body.email) updateData.email = body.email;
    if (body.favorites) updateData.favorites = body.favorites;

    const user = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).select("-password").lean();

    if (!user) {
      return Response.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      favorites: (user.favorites || []).map((f) => f.toString()),
    });
  } catch (error) {
    return Response.json(
      { message: "Error al actualizar el usuario", error: error.message },
      { status: 400 }
    );
  }
}
