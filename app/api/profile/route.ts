import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne(
      { email: session.user.email },
      { name: 1, email: 1, phone: 1, addresses: 1 }
    )
      .lean()
      .exec();

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id?.toString?.() ?? "",
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        addresses: user.addresses || [],
      },
    });
  } catch (error) {
    console.error("Erro ao carregar perfil:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o perfil agora." },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const { name, phone } = await request.json();
    const trimmedName = (name as string | undefined)?.trim() || "";
    const trimmedPhone = (phone as string | undefined)?.trim() || "";

    if (!trimmedName || trimmedName.length < 2) {
      return NextResponse.json(
        { error: "Informe um nome com ao menos 2 caracteres." },
        { status: 400 }
      );
    }

    if (trimmedPhone && trimmedPhone.length < 8) {
      return NextResponse.json(
        { error: "Informe um telefone válido (mínimo 8 caracteres)." },
        { status: 400 }
      );
    }

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { name: trimmedName, phone: trimmedPhone },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json(
        { error: "Usuário não encontrado." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Nome atualizado com sucesso.",
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar o perfil agora." },
      { status: 500 }
    );
  }
}
