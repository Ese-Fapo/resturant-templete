export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import cloudinary, { ensureCloudinaryConfig } from "@/lib/cloudinary";
import connectDB from "@/lib/mongoose";
import MenuItem from "@/models/menuItem";
import Category from "@/models/category";
import User from "@/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

interface MenuItemDoc {
  _id?: { toString(): string };
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  image?: string;
  category?: {
    _id?: { toString(): string };
    name?: string;
    slug?: string;
  };
  available?: boolean;
  featured?: boolean;
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  await connectDB();

  const currentUser = await User.findOne({ email: session.user.email }).lean().exec();
  if (!currentUser?.admin) {
    return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
  }

  return null;
}

async function uploadToCloudinary(buffer: Buffer) {
  return await new Promise<{ secure_url: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "menu-items",
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) {
          return reject(error || new Error("Upload failed"));
        }
        resolve({ secure_url: result.secure_url });
      }
    );

    uploadStream.end(buffer);
  });
}

export async function GET() {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const menuItems = await MenuItem.find({})
      .populate("category", "name slug")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      items: menuItems.map((item: MenuItemDoc) => ({
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
        available: Boolean(item.available),
        featured: Boolean(item.featured),
      })),
    });
  } catch (error) {
    console.error("Erro ao listar itens do menu:", error);
    return NextResponse.json({ error: "Não foi possível listar itens do menu agora." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    try {
      ensureCloudinaryConfig();
    } catch (error) {
      console.error("Cloudinary config error:", error);
      return NextResponse.json(
        { error: "Configuração do Cloudinary ausente ou inacessível." },
        { status: 500 }
      );
    }

    const formData = await request.formData();

    const name = formData.get("name")?.toString().trim() || "";
    const description = formData.get("description")?.toString().trim() || "";
    const priceStr = formData.get("price")?.toString().trim() || "";
    const categoryId = formData.get("categoryId")?.toString().trim() || "";
    const available = formData.get("available") === "true";
    const featured = formData.get("featured") === "true";
    const file = formData.get("image");

    if (!name || name.length < 2) {
      return NextResponse.json(
        { error: "Informe um nome de item com ao menos 2 caracteres." },
        { status: 400 }
      );
    }

    const price = parseFloat(priceStr);
    if (isNaN(price) || price < 0) {
      return NextResponse.json({ error: "Informe um preço válido (maior ou igual a zero)." }, { status: 400 });
    }

    let imageUrl = "";

    if (file && file instanceof File) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          { error: "Formato de imagem não suportado. Use JPEG, PNG, WEBP ou AVIF." },
          { status: 400 }
        );
      }

      if (file.size > MAX_SIZE_BYTES) {
        return NextResponse.json({ error: "Imagem deve ter no máximo 5MB." }, { status: 400 });
      }

      const fileBuffer = Buffer.from(await file.arrayBuffer());
      try {
        const { secure_url } = await uploadToCloudinary(fileBuffer);
        imageUrl = secure_url;
      } catch (err: unknown) {
        console.error("Cloudinary upload error:", err);
        return NextResponse.json({ error: "Falha ao enviar imagem para o Cloudinary." }, { status: 502 });
      }
    }

    const baseSlug = slugify(name);
    const finalSlug = baseSlug || `item-${Date.now()}`;

    const existing = await MenuItem.findOne({ slug: finalSlug }).lean().exec();
    if (existing) {
      return NextResponse.json({ error: "Um item com esse nome já existe." }, { status: 409 });
    }

    let validCategoryId = null;
    if (categoryId) {
      const category = await Category.findById(categoryId).lean().exec();
      if (category) {
        validCategoryId = categoryId;
      }
    }

    const created = await MenuItem.create({
      name,
      slug: finalSlug,
      description,
      price,
      image: imageUrl,
      category: validCategoryId,
      available,
      featured,
    });

    const populated = await MenuItem.findById(created._id).populate("category", "name slug").lean().exec();

    return NextResponse.json(
      {
        item: {
          id: populated?._id?.toString?.() ?? "",
          name: populated?.name ?? "",
          slug: populated?.slug ?? "",
          description: populated?.description ?? "",
          price: Number(populated?.price ?? 0),
          image: populated?.image ?? "",
          category: populated?.category
            ? {
                id: (populated.category as MenuItemDoc["category"])?._id?.toString?.() ?? "",
                name: (populated.category as MenuItemDoc["category"])?.name ?? "",
                slug: (populated.category as MenuItemDoc["category"])?.slug ?? "",
              }
            : null,
          available: Boolean(populated?.available),
          featured: Boolean(populated?.featured),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar item do menu:", error);
    return NextResponse.json({ error: "Não foi possível criar o item do menu agora." }, { status: 500 });
  }
}
