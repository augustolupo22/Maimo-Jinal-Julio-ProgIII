import mongoose from "mongoose";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const dynamic = "force-dynamic";

function invalidIdResponse() {
  return Response.json({ message: "ID de usuario invalido" }, { status: 400 });
}

export async function GET(_request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    await connectDB();
    const user = await User.findById(id).populate("favorites").lean();

    if (!user) {
      return Response.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(user.favorites);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener favoritos", error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return Response.json(
        { message: "ID de producto invalido" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { favorites: productId } },
      { new: true, runValidators: true }
    ).populate("favorites");

    if (!user) {
      return Response.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(user.favorites);
  } catch (error) {
    return Response.json(
      { message: "Error al agregar favorito", error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    let productId;
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      productId = body.productId;
    } else {
      const { searchParams } = new URL(request.url);
      productId = searchParams.get("productId");
    }

    if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
      return Response.json(
        { message: "ID de producto invalido" },
        { status: 400 }
      );
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { $pull: { favorites: productId } },
      { new: true, runValidators: true }
    ).populate("favorites");

    if (!user) {
      return Response.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(user.favorites);
  } catch (error) {
    return Response.json(
      { message: "Error al eliminar favorito", error: error.message },
      { status: 400 }
    );
  }
}

export async function PUT(request, { params }) {
  const { id } = await params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return invalidIdResponse();
  }

  try {
    const body = await request.json();
    const { favorites } = body;

    if (!Array.isArray(favorites)) {
      return Response.json(
        { message: "El campo favorites debe ser un array" },
        { status: 400 }
      );
    }

    for (const favId of favorites) {
      if (!mongoose.Types.ObjectId.isValid(favId)) {
        return Response.json(
          { message: "Uno o mas IDs de producto son invalidos" },
          { status: 400 }
        );
      }
    }

    await connectDB();
    const user = await User.findByIdAndUpdate(
      id,
      { $addToSet: { favorites: { $each: favorites } } },
      { new: true, runValidators: true }
    ).populate("favorites");

    if (!user) {
      return Response.json({ message: "Usuario no encontrado" }, { status: 404 });
    }

    return Response.json(user.favorites);
  } catch (error) {
    return Response.json(
      { message: "Error al sincronizar favoritos", error: error.message },
      { status: 400 }
    );
  }
}
