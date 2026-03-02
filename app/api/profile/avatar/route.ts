import { promises as fs } from "fs";
import { join } from "path";
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import { authOptions } from "../../auth/[...nextauth]/route";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar");

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: "Arquivo de imagem é obrigatório." }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Formato não suportado. Use JPEG, PNG, WEBP ou AVIF." }, { status: 400 });
    }

    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: "Imagem deve ter no máximo 2MB." }, { status: 400 });
    }

    const uploadsDir = join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${randomUUID()}.${file.type.split("/")[1] || "jpg"}`;
    const filePath = join(uploadsDir, fileName);

    await fs.writeFile(filePath, fileBuffer);

    const publicUrl = `/uploads/${fileName}`;

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { image: publicUrl },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Avatar atualizado com sucesso.",
      image: publicUrl,
    });
  } catch (error) {
    console.error("Erro ao fazer upload do avatar:", error);
    return NextResponse.json({ error: "Não foi possível fazer upload agora." }, { status: 500 });
  }
}
