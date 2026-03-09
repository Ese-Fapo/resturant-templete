import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import MenuItem from "@/models/menuItem";

type RawMenuCategory = {
  _id?: { toString?: () => string };
  name?: string;
  slug?: string;
};

type RawMenuItem = {
  _id?: { toString?: () => string };
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: RawMenuCategory | null;
  featured?: boolean;
};

export async function GET() {
  try {
    await connectDB();

    const menuItems = await MenuItem.find({ available: true })
      .populate("category", "name slug")
      .sort({ featured: -1, createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      items: menuItems.map((item: RawMenuItem) => ({
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

    const message = error instanceof Error ? error.message : "";
    const isMissingMongoEnv = message.includes("Missing MONGODB_URI");

    return NextResponse.json(
      {
        error: isMissingMongoEnv
          ? "Serviço temporariamente indisponível. Configuração de banco de dados ausente no servidor."
          : "Não foi possível listar itens do menu agora.",
      },
      { status: isMissingMongoEnv ? 503 : 500 }
    );
  }
}
