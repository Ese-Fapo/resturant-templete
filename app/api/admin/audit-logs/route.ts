import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import connectDB from "@/lib/mongoose";
import User from "@/models/user";
import AdminAuditLog from "@/models/adminAuditLog";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
    }

    await connectDB();

    const currentUser = await User.findOne({ email: session.user.email }).lean().exec();
    if (!currentUser?.admin) {
      return NextResponse.json({ error: "Acesso negado." }, { status: 403 });
    }

    const logs = await AdminAuditLog.find(
      {},
      {
        actorName: 1,
        actorEmail: 1,
        targetName: 1,
        targetEmail: 1,
        action: 1,
        createdAt: 1,
      }
    )
      .sort({ createdAt: -1 })
      .limit(100)
      .lean()
      .exec();

    return NextResponse.json({
      logs: logs.map((log) => ({
        id: log._id?.toString?.() ?? "",
        actorName: log.actorName || "",
        actorEmail: log.actorEmail,
        targetName: log.targetName || "",
        targetEmail: log.targetEmail,
        action: log.action,
        createdAt: log.createdAt,
      })),
    });
  } catch (error) {
    console.error("Erro ao buscar audit logs de admin:", error);
    return NextResponse.json(
      { error: "Não foi possível carregar o histórico de auditoria agora." },
      { status: 500 }
    );
  }
}
