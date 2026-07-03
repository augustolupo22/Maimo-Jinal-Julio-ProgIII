import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name || !body.email || !body.password) {
      return Response.json(
        { message: "Nombre, email y contrasena son requeridos" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: body.email });
    if (existing) {
      return Response.json(
        { message: "El email ya esta registrado" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);
    const user = await User.create({
      name: body.name,
      email: body.email,
      password: hashedPassword,
    });

    return Response.json(
      { _id: user._id.toString(), name: user.name, email: user.email },
      { status: 201 }
    );
  } catch (error) {
    return Response.json(
      { message: "Error al registrar el usuario", error: error.message },
      { status: 400 }
    );
  }
}
