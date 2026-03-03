export const runtime = "nodejs"; // Ensure Node runtime (Cloudinary requires Node APIs like Buffer)

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import cloudinary, { ensureCloudinaryConfig } from "@/lib/cloudinary";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import { authOptions } from "../../auth/[...nextauth]/route";

const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

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

    try {
      ensureCloudinaryConfig();
    } catch (error) {
      console.error("Cloudinary config error:", error);
      return NextResponse.json(
        { error: "Configuração do Cloudinary ausente ou inacessível." },
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
    let secure_url: string;
    try {
      ({ secure_url } = await uploadToCloudinary(fileBuffer));
    } catch (err: unknown) {
      console.error("Cloudinary upload error:", err);

      const typedErr = err as { message?: string; http_code?: number; error?: unknown } | undefined;
      const message = typedErr?.message || "Falha ao enviar imagem para o Cloudinary.";
      const httpCode = typedErr?.http_code;
      const cloudError = typedErr?.error;

      return NextResponse.json(
        {
          error: "Falha ao enviar imagem para o Cloudinary.",
          details: message,
          code: httpCode,
          cloudinary:
            typeof cloudError === "object" && cloudError !== null
              ? (cloudError as { message?: string; name?: string }).message || (cloudError as { name?: string }).name
              : undefined,
        },
        { status: 502 }
      );
    }

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
    return NextResponse.json(
      { error: "Não foi possível fazer upload agora." },
      { status: 500 }
    );
  }
}
