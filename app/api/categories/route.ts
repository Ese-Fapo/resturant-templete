import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongoose";
import Category from "@/models/category";
import User from "@/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

export async function GET() {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const categories = await Category.find({}, { name: 1, slug: 1, description: 1, itemCount: 1, active: 1 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      categories: categories.map((category: { _id?: { toString(): string }; name?: string; slug?: string; description?: string; itemCount?: number; active?: boolean }) => ({
        id: category._id?.toString?.() ?? "",
        name: category.name ?? "",
        slug: category.slug ?? "",
        description: category.description ?? "",
        itemCount: Number(category.itemCount ?? 0),
        active: Boolean(category.active),
      })),
    });
  } catch (error) {
    console.error("Erro ao listar categorias:", error);
    return NextResponse.json({ error: "Não foi possível listar categorias agora." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { name, description } = await request.json();
    const trimmedName = (name as string | undefined)?.trim() || "";
    const trimmedDescription = (description as string | undefined)?.trim() || "";

    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Informe um nome de categoria com ao menos 2 caracteres." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(trimmedName);
    const finalSlug = baseSlug || `categoria-${Date.now()}`;

    const existing = await Category.findOne({ slug: finalSlug }).lean().exec();
    if (existing) {
      return NextResponse.json({ error: "Essa categoria já existe." }, { status: 409 });
    }

    const created = await Category.create({
      name: trimmedName,
      slug: finalSlug,
      description: trimmedDescription,
      itemCount: 0,
      active: true,
    });

    return NextResponse.json(
      {
        category: {
          id: created._id.toString(),
          name: created.name,
          slug: created.slug,
          description: created.description || "",
          itemCount: Number(created.itemCount || 0),
          active: Boolean(created.active),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return NextResponse.json({ error: "Não foi possível criar a categoria agora." }, { status: 500 });
  }
}
