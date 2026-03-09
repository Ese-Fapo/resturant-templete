"use client";

import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCart } from "@/hooks/useCart";

export default function CartPage() {
  const cart = useCart();
  const { status } = useSession();

  if (cart.isEmpty) {
    return (
      <section className="min-h-screen bg-linear-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-700">
              Seu Carrinho
            </h1>
            <Link
              href="/menu"
              className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2 font-semibold"
            >
              ← Voltar
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
            <p className="text-gray-600 mb-6">
              Explore nosso cardápio e adicione alguns itens ao seu carrinho.
            </p>
            <Link
              href="/menu"
              className="inline-block px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold shadow-lg transition-all duration-200"
            >
              Ver Cardápio
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-linear-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-700">
            Seu Carrinho
          </h1>
          <Link
            href="/menu"
            className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2 font-semibold"
          >
            ← Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {cart.items.map((item) => (
                <div
                  key={item.id}
                  className="border-b border-gray-200 last:border-b-0 p-6 flex gap-6 hover:bg-gray-50 transition-colors"
                >
                  {/* Item Image */}
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-2xl">
                        🍽️
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-500 mb-2">{item.category.name}</p>
                    )}
                    <p className="text-emerald-600 font-semibold">
                      R$ {item.price.toFixed(2).replace(".", ",")}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end gap-3">
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <button
                        onClick={() =>
                          cart.updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="px-3 py-2 hover:bg-gray-100 font-semibold text-gray-700"
                      >
                        −
                      </button>
                      <span className="px-4 py-2 font-semibold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          cart.updateQuantity(item.id, item.quantity + 1)
                        }
                        className="px-3 py-2 hover:bg-gray-100 font-semibold text-gray-700"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                      </p>
                      <button
                        onClick={() => cart.removeItem(item.id)}
                        className="text-rose-600 hover:text-rose-700 text-sm font-semibold mt-1"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.itemQuantityTotal} itens)</span>
                  <span className="font-semibold">
                    R$ {cart.subtotal.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Taxa (10%)</span>
                  <span className="font-semibold">
                    R$ {cart.tax.toFixed(2).replace(".", ",")}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Taxa de Entrega</span>
                  <span className="font-semibold">
                    R$ {cart.deliveryFee.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-emerald-600">
                  R$ {cart.total.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {status === "authenticated" ? (
                <Link
                  href="/checkout"
                  className="block w-full px-6 py-3 bg-linear-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 text-white rounded-full font-bold shadow-lg text-center transition-all duration-200 transform hover:scale-105"
                >
                  Ir para Checkout
                </Link>
              ) : (
                <>
                  <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm">
                    Faça login para finalizar sua compra com segurança.
                  </div>
                  <Link
                    href="/login?callbackUrl=/checkout"
                    className="block w-full px-6 py-3 bg-linear-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-full font-bold shadow-lg text-center transition-all duration-200 transform hover:scale-105"
                  >
                    Entrar para Finalizar
                  </Link>
                </>
              )}

              <button
                onClick={() => cart.clearCart()}
                className="w-full mt-3 px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-semibold transition-all duration-200"
              >
                Limpar Carrinho
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
