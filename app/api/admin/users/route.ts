import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import AdminAuditLog from "@/models/adminAuditLog";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return {
      error: NextResponse.json({ error: "Não autenticado." }, { status: 401 }),
      adminEmail: null,
      adminId: null,
      adminName: null,
    };
  }

  await connectDB();

  const currentUser = await User.findOne({ email: session.user.email }).lean().exec();
  if (!currentUser?.admin) {
    return {
      error: NextResponse.json({ error: "Acesso negado." }, { status: 403 }),
      adminEmail: null,
      adminId: null,
      adminName: null,
    };
  }

  return {
    error: null,
    adminEmail: session.user.email,
    adminId: currentUser._id?.toString?.() ?? null,
    adminName: currentUser.name ?? "",
  };
}

export async function GET() {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const users = await User.find({}, { name: 1, email: 1, phone: 1, admin: 1, createdAt: 1 })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      users: users.map((user) => ({
        id: user._id?.toString?.() ?? "",
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        admin: Boolean(user.admin),
        createdAt: user.createdAt,
      })),
    });
  } catch (error) {
    console.error("Erro ao listar usuários:", error);
    return NextResponse.json({ error: "Não foi possível listar usuários agora." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const auth = await requireAdmin();
    if (auth.error) return auth.error;

    const { userId, makeAdmin } = await request.json();

    if (!userId || typeof makeAdmin !== "boolean") {
      return NextResponse.json({ error: "Payload inválido." }, { status: 400 });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
    }

    if (!makeAdmin && targetUser.email === auth.adminEmail) {
      return NextResponse.json(
        { error: "Você não pode remover seus próprios privilégios de admin." },
        { status: 400 }
      );
    }

    const previousAdminState = Boolean(targetUser.admin);
    targetUser.admin = makeAdmin;
    await targetUser.save();

    if (previousAdminState !== makeAdmin && auth.adminId) {
      await AdminAuditLog.create({
        actorUserId: auth.adminId,
        actorEmail: auth.adminEmail,
        actorName: auth.adminName || "",
        targetUserId: targetUser._id,
        targetEmail: targetUser.email,
        targetName: targetUser.name || "",
        action: makeAdmin ? "promote" : "demote",
      });
    }

    return NextResponse.json({
      message: makeAdmin ? "Usuário promovido a admin com sucesso." : "Privilégio de admin removido com sucesso.",
      user: {
        id: targetUser._id.toString(),
        email: targetUser.email,
        admin: targetUser.admin,
      },
    });
  } catch (error) {
    console.error("Erro ao atualizar privilégios de admin:", error);
    return NextResponse.json(
      { error: "Não foi possível atualizar os privilégios agora." },
      { status: 500 }
    );
  }
}
