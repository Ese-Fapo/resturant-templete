"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: string;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  items: OrderItem[];
  deliveryAddress?: {
    street: string;
    city: string;
    postalCode: string;
  };
};

const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
  pending: { label: "Pendente", color: "yellow", icon: "⏳" },
  confirmed: { label: "Confirmado", color: "blue", icon: "✅" },
  preparing: { label: "Preparando", color: "purple", icon: "👨‍🍳" },
  out_for_delivery: { label: "Saiu para Entrega", color: "orange", icon: "🚚" },
  delivered: { label: "Entregue", color: "green", icon: "🏠" },
  cancelled: { label: "Cancelado", color: "red", icon: "❌" },
};

export default function OrdersPage() {
  const router = useRouter();
  const { status } = useSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchOrders();
    }
  }, [status]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const response = await fetch("/api/checkout", {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        throw new Error("Falha ao carregar pedidos");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Erro ao carregar pedidos";
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  const filteredOrders =
    filter === "all"
      ? orders
      : orders.filter((order) => order.status === filter);

  return (
    <section className="min-h-screen bg-linear-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-700">
            Meus Pedidos
          </h1>
          <div className="flex gap-3">
            <Link
              href="/profile"
              className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2 font-semibold"
            >
              Perfil ←
            </Link>
            <Link
              href="/menu"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow transition-all"
            >
              Fazer Novo Pedido
            </Link>
          </div>
        </div>

        {errorMessage && (
          <div className="max-w-4xl mx-auto mb-8 p-4 bg-rose-50 border border-rose-200 rounded-lg text-rose-700">
            {errorMessage}
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Carregando seus pedidos...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Nenhum pedido ainda</h2>
            <p className="text-gray-600 mb-6">
              Você ainda não fez nenhum pedido. Explore nosso cardápio e comece a pedir!
            </p>
            <Link
              href="/menu"
              className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg transition-all duration-200"
            >
              Ir para Cardápio
            </Link>
          </div>
        ) : (
          <>
            {/* Filter Buttons */}
            <div className="mb-8 flex flex-wrap gap-3 justify-center">
              <button
                onClick={() => setFilter("all")}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  filter === "all"
                    ? "bg-emerald-600 text-white shadow-lg"
                    : "bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200"
                }`}
              >
                Todos ({orders.length})
              </button>

              {Object.entries(statusConfig).map(([key, { label, color }]) => {
                const count = orders.filter((o) => o.status === key).length;
                if (count === 0) return null;

                const bgColors: Record<
                  string,
                  string
                > = {
                  yellow: "bg-yellow-100 text-yellow-700 hover:bg-yellow-50 border-yellow-200",
                  blue: "bg-blue-100 text-blue-700 hover:bg-blue-50 border-blue-200",
                  purple: "bg-purple-100 text-purple-700 hover:bg-purple-50 border-purple-200",
                  orange: "bg-orange-100 text-orange-700 hover:bg-orange-50 border-orange-200",
                  green: "bg-green-100 text-green-700 hover:bg-green-50 border-green-200",
                  red: "bg-red-100 text-red-700 hover:bg-red-50 border-red-200",
                };

                return (
                  <button
                    key={key}
                    onClick={() => setFilter(key)}
                    className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 border ${
                      filter === key
                        ? `bg-${color}-600 text-white shadow-lg`
                        : `${bgColors[color]}`
                    }`}
                  >
                    {label} ({count})
                  </button>
                );
              })}
            </div>

            {/* Orders Grid */}
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const config = statusConfig[order.status] || statusConfig.pending;

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
                  >
                    <div className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 pb-4 border-b border-gray-200">
                        <div>
                          <p className="text-sm text-gray-600">Pedido #</p>
                          <p className="text-2xl font-bold text-gray-900 font-mono">
                            {order.id.slice(-8).toUpperCase()}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{config.icon}</span>
                          <div>
                            <p className="text-sm text-gray-600">Status</p>
                            <p className={`font-bold text-${config.color}-600`}>
                              {config.label}
                            </p>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Data</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(order.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-2xl font-bold text-emerald-600">
                            R$ {order.total.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="mb-4 pb-4 border-b border-gray-200">
                        <p className="text-sm font-semibold text-gray-600 mb-3">
                          Itens do Pedido
                        </p>
                        <div className="space-y-2">
                          {order.items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex justify-between text-sm"
                            >
                              <span className="text-gray-700">
                                {item.name} × {item.quantity}
                              </span>
                              <span className="font-semibold text-gray-900">
                                R${" "}
                                {(item.price * item.quantity)
                                  .toFixed(2)
                                  .replace(".", ",")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Delivery Address */}
                      {order.deliveryAddress && (
                        <div className="mb-4 pb-4 border-b border-gray-200">
                          <p className="text-sm font-semibold text-gray-600 mb-2">
                            Endereço de Entrega
                          </p>
                          <p className="text-sm text-gray-700">
                            {order.deliveryAddress.street},{" "}
                            {order.deliveryAddress.city} -{" "}
                            {order.deliveryAddress.postalCode}
                          </p>
                        </div>
                      )}

                      {/* Payment Status */}
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600">
                            Situação do Pagamento
                          </p>
                          <p
                            className={`font-semibold ${
                              order.paymentStatus === "completed"
                                ? "text-green-600"
                                : order.paymentStatus === "failed"
                                  ? "text-red-600"
                                  : "text-yellow-600"
                            }`}
                          >
                            {order.paymentStatus === "completed"
                              ? "✅ Pago"
                              : order.paymentStatus === "failed"
                                ? "❌ Falha no Pagamento"
                                : "⏳ Pendente"}
                          </p>
                        </div>

                        <Link
                          href={`/order-confirmation/${order.id}`}
                          className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold transition-all duration-200"
                        >
                          Ver Detalhes
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
