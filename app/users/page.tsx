"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

type ManagedUser = {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  admin: boolean;
  createdAt?: string;
};

type AdminAuditLogEntry = {
  id: string;
  actorName?: string;
  actorEmail: string;
  targetName?: string;
  targetEmail: string;
  action: "promote" | "demote";
  createdAt?: string;
};

export default function UsersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [auditLogs, setAuditLogs] = useState<AdminAuditLogEntry[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLogs, setLoadingLogs] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const currentUserEmail = useMemo(
    () => session?.user?.email?.toLowerCase() ?? "",
    [session?.user?.email]
  );

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }

    if (status === "authenticated" && !session?.user?.admin) {
      router.replace("/profile");
    }
  }, [status, session, router]);

  useEffect(() => {
    const loadUsers = async () => {
      if (status !== "authenticated" || !session?.user?.admin) return;

      try {
        setLoadingUsers(true);
        const response = await fetch("/api/admin/users", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Falha ao carregar usuários.");
        }

        const normalizedUsers: ManagedUser[] = Array.isArray(data?.users)
          ? data.users.map((user: Partial<ManagedUser>) => ({
              id: user.id || "",
              name: user.name || "Sem nome",
              email: typeof user.email === "string" ? user.email : "",
              phone: user.phone || "",
              admin: Boolean(user.admin),
              createdAt: user.createdAt,
            }))
          : [];

        setUsers(normalizedUsers);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao carregar usuários.";
        toast.error(message);
      } finally {
        setLoadingUsers(false);
      }
    };

    loadUsers();
  }, [status, session?.user?.admin]);

  useEffect(() => {
    const loadAuditLogs = async () => {
      if (status !== "authenticated" || !session?.user?.admin) return;

      try {
        setLoadingLogs(true);
        const response = await fetch("/api/admin/audit-logs", { cache: "no-store" });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error || "Falha ao carregar histórico de auditoria.");
        }

        const normalizedLogs: AdminAuditLogEntry[] = Array.isArray(data?.logs)
          ? data.logs.map((log: Partial<AdminAuditLogEntry>) => ({
              id: log.id || "",
              actorName: log.actorName || "",
              actorEmail: typeof log.actorEmail === "string" ? log.actorEmail : "",
              targetName: log.targetName || "",
              targetEmail: typeof log.targetEmail === "string" ? log.targetEmail : "",
              action: log.action === "demote" ? "demote" : "promote",
              createdAt: log.createdAt,
            }))
          : [];

        setAuditLogs(normalizedLogs);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Falha ao carregar histórico de auditoria.";
        toast.error(message);
      } finally {
        setLoadingLogs(false);
      }
    };

    loadAuditLogs();
  }, [status, session?.user?.admin]);

  const toggleAdmin = async (user: ManagedUser) => {
    try {
      setUpdatingId(user.id);
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          makeAdmin: !user.admin,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || "Não foi possível atualizar o usuário.");
      }

      setUsers((prev) =>
        prev.map((item) =>
          item.id === user.id
            ? {
                ...item,
                admin: !item.admin,
              }
            : item
        )
      );

      const nowIso = new Date().toISOString();
      setAuditLogs((prev) => [
        {
          id: `${Date.now()}-${user.id}`,
          actorName: session?.user?.name || "",
          actorEmail: session?.user?.email || "",
          targetName: user.name,
          targetEmail: user.email || "",
          action: !user.admin ? "promote" : "demote",
          createdAt: nowIso,
        },
        ...prev,
      ]);

      toast.success(data?.message || "Permissão atualizada com sucesso.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao atualizar usuário.";
      toast.error(message);
    } finally {
      setUpdatingId(null);
    }
  };

  if (status === "loading" || (status === "authenticated" && !session?.user?.admin)) {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  return (
    <section className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <Link href="/profile" className="text-emerald-600 hover:text-emerald-700 mb-4 inline-block">
          ← Voltar para o Perfil
        </Link>
        <h1 className="text-4xl font-bold text-emerald-700 mb-6">Gerenciar Usuários</h1>
        <div className="bg-white rounded-lg shadow p-6">
          {loadingUsers ? (
            <p className="text-gray-600">Carregando usuários...</p>
          ) : users.length === 0 ? (
            <p className="text-gray-600">Nenhum usuário encontrado.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-200">
                    <th className="py-3 pr-4 font-semibold text-gray-700">Nome</th>
                    <th className="py-3 pr-4 font-semibold text-gray-700">Email</th>
                    <th className="py-3 pr-4 font-semibold text-gray-700">Telefone</th>
                    <th className="py-3 pr-4 font-semibold text-gray-700">Perfil</th>
                    <th className="py-3 font-semibold text-gray-700">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const normalizedRowEmail = typeof user.email === "string" ? user.email.toLowerCase() : "";
                    const isCurrentUser = normalizedRowEmail !== "" && normalizedRowEmail === currentUserEmail;

                    return (
                      <tr key={user.id} className="border-b border-gray-100">
                        <td className="py-3 pr-4 font-medium text-gray-900">{user.name}</td>
                        <td className="py-3 pr-4 text-gray-700">{user.email || "-"}</td>
                        <td className="py-3 pr-4 text-gray-700">{user.phone || "-"}</td>
                        <td className="py-3 pr-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                              user.admin
                                ? "bg-amber-100 text-amber-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {user.admin ? "Administrador" : "Usuário"}
                          </span>
                        </td>
                        <td className="py-3">
                          <button
                            onClick={() => toggleAdmin(user)}
                            disabled={updatingId === user.id || isCurrentUser}
                            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                              user.admin
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                            title={isCurrentUser ? "Você não pode alterar seu próprio acesso." : undefined}
                          >
                            {updatingId === user.id
                              ? "Atualizando..."
                              : user.admin
                                ? "Remover admin"
                                : "Tornar admin"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-2xl font-bold text-emerald-700 mb-4">Histórico de Auditoria</h2>

          {loadingLogs ? (
            <p className="text-gray-600">Carregando histórico...</p>
          ) : auditLogs.length === 0 ? (
            <p className="text-gray-600">Nenhuma alteração de admin registrada ainda.</p>
          ) : (
            <div className="space-y-3">
              {auditLogs.map((log) => {
                const actionLabel = log.action === "promote" ? "promoveu" : "removeu admin de";
                const when = log.createdAt
                  ? new Date(log.createdAt).toLocaleString("pt-BR")
                  : "Data indisponível";

                const actor = log.actorName || log.actorEmail || "Admin";
                const target = log.targetName || log.targetEmail || "Usuário";

                return (
                  <div key={log.id} className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                    <p className="text-sm text-gray-800">
                      <span className="font-semibold">{actor}</span> {actionLabel} <span className="font-semibold">{target}</span>
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{when}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
