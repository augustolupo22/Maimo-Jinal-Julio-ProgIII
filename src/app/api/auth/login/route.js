import { getUserByEmail } from "@/lib/users";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.email) {
      return Response.json(
        { message: "El email es requerido" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(body.email);

    if (!user) {
      return Response.json(
        { message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return Response.json({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    return Response.json(
      { message: "Error al iniciar sesion", error: error.message },
      { status: 500 }
    );
  }
}
