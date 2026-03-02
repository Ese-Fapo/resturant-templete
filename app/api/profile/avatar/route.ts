import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import cloudinary from "@/lib/cloudinary";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import { authOptions } from "../../auth/[...nextauth]/route";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const hasCloudinaryEnv =
  !!process.env.CLOUDINARY_CLOUD_NAME &&
  !!process.env.CLOUDINARY_API_KEY &&
  !!process.env.CLOUDINARY_API_SECRET;

async function uploadToCloudinary(buffer: Buffer) {
  return await new Promise<{
    secure_url: string;
  }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "avatars",
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

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    if (!hasCloudinaryEnv) {
      return NextResponse.json(
        { error: "Configuração do Cloudinary ausente no servidor." },
        { status: 500 }
      );
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

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const { secure_url } = await uploadToCloudinary(fileBuffer);

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      { image: secure_url },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({
      message: "Avatar atualizado com sucesso.",
      image: secure_url,
    });
  } catch (error) {
    console.error("Erro ao fazer upload do avatar:", error);
    return NextResponse.json({ error: "Não foi possível fazer upload agora." }, { status: 500 });
  }
}
