import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import mongoose from "mongoose";

import connectDB from "@/lib/mongoose";
import Category from "@/models/category";
import User from "@/models/user";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

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

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, { params }: Params) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "ID de categoria inválido." }, { status: 400 });
    }

    const body = await request.json();

    const updatePayload: Record<string, unknown> = {};

    if (typeof body?.active === "boolean") {
      updatePayload.active = body.active;
    }

    if (typeof body?.description === "string") {
      updatePayload.description = body.description.trim();
    }

    if (typeof body?.itemCount === "number" && body.itemCount >= 0) {
      updatePayload.itemCount = Math.floor(body.itemCount);
    }

    if (Object.keys(updatePayload).length === 0) {
      return NextResponse.json({ error: "Nada para atualizar." }, { status: 400 });
    }

    const updated = await Category.findByIdAndUpdate(id, updatePayload, {
      new: true,
      projection: { name: 1, slug: 1, description: 1, itemCount: 1, active: 1 },
    })
      .lean()
      .exec();

    if (!updated) {
      return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
    }

    return NextResponse.json({
      category: {
        id: updated._id?.toString?.() ?? "",
        name: updated.name ?? "",
        slug: updated.slug ?? "",
        description: updated.description ?? "",
        itemCount: Number(updated.itemCount ?? 0),
        active: Boolean(updated.active),
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar categoria:", error);
    return NextResponse.json({ error: "Não foi possível atualizar a categoria agora." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const authError = await requireAdmin();
    if (authError) return authError;

    const { id } = await params;
    if (!mongoose.isValidObjectId(id)) {
      return NextResponse.json({ error: "ID de categoria inválido." }, { status: 400 });
    }

    const deleted = await Category.findByIdAndDelete(id).lean().exec();
    if (!deleted) {
      return NextResponse.json({ error: "Categoria não encontrada." }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erro ao remover categoria:", error);
    return NextResponse.json({ error: "Não foi possível remover a categoria agora." }, { status: 500 });
  }
}
