import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import { authOptions } from "../../auth/[...nextauth]/route";

const REQUIRED_FIELDS = ["street", "city", "postalCode"] as const;
type RequiredField = (typeof REQUIRED_FIELDS)[number];

type AddressPayload = {
  street: string;
  city: string;
  postalCode: string;
  label?: string;
  isDefault?: boolean;
};

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    await connectDB();
    const user = await User.findOne({ email: session.user.email }, { addresses: 1 }).lean();
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ addresses: user.addresses || [] });
  } catch (error) {
    console.error("Erro ao buscar endereços:", error);
    return NextResponse.json({ error: "Não foi possível carregar endereços." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const addresses = Array.isArray(body?.addresses) ? body.addresses : null;

    if (!addresses || addresses.length === 0) {
      return NextResponse.json({ error: "Envie ao menos um endereço válido." }, { status: 400 });
    }

    const sanitized = addresses.map((addr: AddressPayload, index: number) => {
      const trimmed: Record<RequiredField, string> = {
        street: "",
        city: "",
        postalCode: "",
      };

      for (const field of REQUIRED_FIELDS) {
        const value = (addr?.[field] ?? "").toString().trim();
        if (!value) {
          throw new Error(`Endereço ${index + 1}: campo ${field} é obrigatório.`);
        }
        trimmed[field] = value;
      }

      const label = (addr?.label ?? "Endereço").toString().trim() || "Endereço";
      const isDefault = Boolean(addr?.isDefault);
      return {
        ...trimmed,
        label,
        isDefault,
      };
    });

    // Garantir que haja um default
    if (!sanitized.some((a: typeof sanitized[number]) => a.isDefault)) {
      sanitized[0].isDefault = true;
    }

    await connectDB();
    const updated = await User.findOneAndUpdate(
      { email: session.user.email },
      { addresses: sanitized },
      { new: true, projection: { addresses: 1 } }
    ).lean();

    if (!updated) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    return NextResponse.json({ addresses: updated.addresses || [] });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Não foi possível salvar endereços.";
    const status = message.includes("obrigatório") ? 400 : 500;
    console.error("Erro ao salvar endereços:", error);
    return NextResponse.json({ error: message }, { status });
  }
}
