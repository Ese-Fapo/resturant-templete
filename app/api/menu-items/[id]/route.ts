export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

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

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "ID de item inválido." }, { status: 400 });
    }

    const formData = await request.formData();

    const updatePayload: Record<string, unknown> = {};

    const description = formData.get("description")?.toString().trim();
    if (description !== undefined) {
      updatePayload.description = description;
    }

    const priceStr = formData.get("price")?.toString().trim();
    if (priceStr !== undefined) {
      const price = parseFloat(priceStr);
      if (isNaN(price) || price < 0) {
        return NextResponse.json({ error: "Informe um preço válido (maior ou igual a zero)." }, { status: 400 });
      }
      updatePayload.price = price;
    }

    const available = formData.get("available");
    if (available !== null) {
      updatePayload.available = available === "true";
    }

    const featured = formData.get("featured");
    if (featured !== null) {
      updatePayload.featured = featured === "true";
    }

    const categoryId = formData.get("categoryId")?.toString().trim();
    if (categoryId !== undefined) {
      if (categoryId) {
        const category = await Category.findById(categoryId).lean().exec();
        if (category) {
          updatePayload.category = categoryId;
        } else {
          return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
        }
      } else {
        updatePayload.category = null;
      }
    }

    const file = formData.get("image");
    if (file && file instanceof File) {
      try {
        ensureCloudinaryConfig();
      } catch (error) {
        console.error("Cloudinary config error:", error);
        return NextResponse.json(
          { error: "Configuração do Cloudinary ausente ou inacessível." },
          { status: 500 }
        );
      }

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
        updatePayload.image = secure_url;
      } catch (err: unknown) {
        console.error("Cloudinary upload error:", err);
        return NextResponse.json({ error: "Falha ao enviar imagem para o Cloudinary." }, { status: 502 });
      }
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
    }

    const updated = await MenuItem.findByIdAndUpdate(id, updatePayload, {
      new: true,
    })
      .populate("category", "name slug")
      .lean()
      .exec();

    if (!updated) {
      return NextResponse.json({ error: "Item do menu não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      item: {
        id: updated._id?.toString?.() ?? "",
        name: updated.name ?? "",
        slug: updated.slug ?? "",
        description: updated.description ?? "",
        price: Number(updated.price ?? 0),
        image: updated.image ?? "",
        category: updated.category
          ? {
              id: (updated.category as MenuItemDoc["category"])?._id?.toString?.() ?? "",
              name: (updated.category as MenuItemDoc["category"])?.name ?? "",
              slug: (updated.category as MenuItemDoc["category"])?.slug ?? "",
            }
          : null,
        available: Boolean(updated.available),
        featured: Boolean(updated.featured),
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar item do menu:", error);
    return NextResponse.json({ error: "Não foi possível atualizar o item do menu agora." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "ID de item inválido." }, { status: 400 });
    }

    const deleted = await MenuItem.findByIdAndDelete(id).lean().exec();
    if (!deleted) {
      return NextResponse.json({ error: "Item do menu não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover item do menu:", error);
    return NextResponse.json({ error: "Não foi possível remover o item do menu agora." }, { status: 500 });
  }
}
