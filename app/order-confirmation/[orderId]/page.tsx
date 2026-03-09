"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

type OrderConfirmation = {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

export default function OrderConfirmationPage({
  params,
}: {
  params: { orderId: string };
}) {
  const { status } = useSession();
  const [order, setOrder] = useState<OrderConfirmation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      return;
    }

    if (status === "authenticated") {
      // Fetch order details
      const fetchOrder = async () => {
        try {
          const response = await fetch(`/api/orders/${params.orderId}`, {
            method: "GET",
            cache: "no-store",
          });

          if (response.ok) {
            const data = await response.json();
            setOrder(data.order);
          }
        } catch (error) {
          console.error("Failed to fetch order:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchOrder();
    }
  }, [status, params.orderId]);

  if (status === "unauthenticated") {
    return (
      <section className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-6">
            Por favor, faça login para visualizar seu pedido.
          </p>
          <Link
            href="/login"
            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg transition-all duration-200"
          >
            Fazer Login
          </Link>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Carregando detalhes do pedido...</p>
        </div>
      </section>
    );
  }

  if (!order) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-6">Pedido não encontrado.</p>
          <Link
            href="/menu"
            className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg transition-all duration-200"
          >
            Voltar ao Cardápio
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center mb-8">
          <div className="text-6xl mb-4 animate-bounce">✅</div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">
            Pedido Confirmado!
          </h1>
          <p className="text-lg text-gray-600 mb-4">
            Obrigado por sua compra. Seu pedido foi recebido e está sendo preparado.
          </p>

          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Número do Pedido</p>
            <p className="text-2xl font-bold text-emerald-700 font-mono">
              #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Data</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(order.createdAt).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-lg font-semibold text-emerald-600">
                R$ {order.total.toFixed(2).replace(".", ",")}
              </p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Itens do Pedido</h2>

          <div className="space-y-3">
            {order.items?.map((item) => (
              <div
                key={item.name}
                className="flex justify-between items-center pb-3 border-b border-gray-200 last:border-b-0"
              >
                <div>
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">
                    Quantidade: {item.quantity}
                  </p>
                </div>
                <p className="font-semibold text-gray-900">
                  R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Status Timeline */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Acompanhamento do Pedido
          </h2>

          <div className="space-y-4">
            {[
              { status: "confirmed", label: "Pedido Confirmado", icon: "✅" },
              {
                status: "preparing",
                label: "Preparando Comida",
                icon: "👨‍🍳",
              },
              {
                status: "out_for_delivery",
                label: "Saiu para Entrega",
                icon: "🚚",
              },
              {
                status: "delivered",
                label: "Entregue",
                icon: "🏠",
              },
            ].map((step) => (
              <div key={step.status} className="flex items-center gap-4">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                    step.status === order.status ||
                    ["confirmed"].includes(order.status)
                      ? "bg-emerald-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.icon}
                </div>
                <div>
                  <p
                    className={`font-semibold ${
                      step.status === order.status ||
                      ["confirmed"].includes(order.status)
                        ? "text-emerald-600"
                        : "text-gray-400"
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-sm text-gray-500">
                    {step.status === order.status
                      ? "Em andamento"
                      : "Aguardando"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/menu"
            className="block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold text-center shadow-lg transition-all duration-200"
          >
            Fazer Mais Pedidos
          </Link>
          <Link
            href="/profile"
            className="block px-6 py-3 border-2 border-emerald-600 text-emerald-600 hover:bg-emerald-50 rounded-full font-semibold text-center transition-all duration-200"
          >
            Ver Meus Pedidos
          </Link>
        </div>
      </div>
    </section>
  );
}
