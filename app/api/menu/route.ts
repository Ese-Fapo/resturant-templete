import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import MenuItem from "@/models/menuItem";

export async function GET() {
  try {
    await connectDB();

    const menuItems = await MenuItem.find({ available: true })
      .populate("category", "name slug")
      .sort({ featured: -1, createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      items: menuItems.map((item: any) => ({
        id: item._id?.toString?.() ?? "",
        name: item.name ?? "",
        slug: item.slug ?? "",
        description: item.description ?? "",
        price: Number(item.price ?? 0),
        image: item.image ?? "",
        category: item.category
          ? {
              id: item.category._id?.toString?.() ?? "",
              name: item.category.name ?? "",
              slug: item.category.slug ?? "",
            }
          : null,
        featured: Boolean(item.featured),
      })),
    });
  } catch (error) {
    console.error("Erro ao listar itens do menu público:", error);
    return NextResponse.json({ error: "Não foi possível listar itens do menu agora." }, { status: 500 });
  }
}
