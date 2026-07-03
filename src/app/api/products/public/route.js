import { connectDB } from "@/lib/mongodb";
import "@/models/Category";
import Product from "@/models/Product";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const filter = {};

    if (search) {
      const regex = new RegExp(search, "i");
      filter.$or = [{ name: regex }, { description: regex }];
    }

    if (category) {
      filter.categories = category;
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    await connectDB();
    const products = await Product.find(filter)
      .populate("categories")
      .sort({ createdAt: -1 })
      .lean();

    return Response.json(products);
  } catch (error) {
    return Response.json(
      { message: "Error al obtener los productos", error: error.message },
      { status: 500 }
    );
  }
}
