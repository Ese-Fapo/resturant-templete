"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/useCart";

type UserAddress = {
  _id: string;
  street: string;
  city: string;
  postalCode: string;
  label: string;
  isDefault: boolean;
};

type PaymentMethod = "credit_card" | "debit_card" | "pix" | "cash";

export default function CheckoutPage() {
  const router = useRouter();
  const { status } = useSession();
  const cart = useCart();

  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit_card");
  const [notes, setNotes] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Load user addresses
  useEffect(() => {
    if (status === "authenticated") {
      fetchAddresses();
    }
  }, [status]);

  const fetchAddresses = async () => {
    try {
      setLoadingAddresses(true);
      const response = await fetch("/api/profile/address", {
        method: "GET",
        cache: "no-store",
      });

      if (response.ok) {
        const data = await response.json();
        setAddresses(data.addresses || []);
        // Auto-select default address
        const defaultAddr = data.addresses?.find(
          (addr: UserAddress) => addr.isDefault
        );
        if (defaultAddr) {
          setSelectedAddressId(defaultAddr._id);
        }
      }
    } catch (error) {
      console.error("Failed to fetch addresses:", error);
      setErrorMessage("Não foi possível carregar os endereços.");
    } finally {
      setLoadingAddresses(false);
    }
  };

  const handleCheckout = async () => {
    if (!selectedAddressId) {
      setErrorMessage("Selecione um endereço de entrega.");
      return;
    }

    if (cart.isEmpty) {
      setErrorMessage("Seu carrinho está vazio.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Validate cart items
      const validateResponse = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "validate",
          items: cart.items,
        }),
      });

      if (!validateResponse.ok) {
        const error = await validateResponse.json();
        throw new Error(error.error || "Validação de carrinho falhou.");
      }

      // Process checkout
      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.items,
          deliveryAddressId: selectedAddressId,
          paymentMethod,
          notes,
        }),
      });

      if (!checkoutResponse.ok) {
        const error = await checkoutResponse.json();
        throw new Error(error.error || "Falha ao processar o pedido.");
      }

      const result = await checkoutResponse.json();

      if (result.success) {
        cart.clearCart();
        router.push(`/order-confirmation/${result.order.id}`);
      }
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Erro ao processar o pedido.";
      setErrorMessage(message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading" || status === "unauthenticated") {
    return <div className="text-center mt-10">Carregando...</div>;
  }

  if (cart.isEmpty) {
    return (
      <section className="min-h-screen bg-linear-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Carrinho vazio</h2>
            <p className="text-gray-600 mb-6">
              Você precisa de itens no carrinho para proceed com o checkout.
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
    <section className="min-h-screen bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-700">
            Checkout
          </h1>
          <Link
            href="/cart"
            className="text-emerald-600 hover:text-emerald-700 inline-flex items-center gap-2 font-semibold"
          >
            ← Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Endereço de Entrega
              </h2>

              {loadingAddresses ? (
                <p className="text-gray-500">Carregando endereços...</p>
              ) : addresses.length === 0 ? (
                <div className="text-center py-6">
                  <p className="text-gray-600 mb-3">Nenhum endereço salvo.</p>
                  <Link
                    href="/profile"
                    className="text-emerald-600 hover:text-emerald-700 font-semibold"
                  >
                    Adicionar endereço no perfil
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((address) => (
                    <label
                      key={address._id}
                      className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                      style={{
                        borderColor:
                          selectedAddressId === address._id
                            ? "#10b981"
                            : "#e5e7eb",
                        backgroundColor:
                          selectedAddressId === address._id ? "#f0fdf4" : "white",
                      }}
                    >
                      <input
                        type="radio"
                        name="address"
                        value={address._id}
                        checked={selectedAddressId === address._id}
                        onChange={(e) => setSelectedAddressId(e.target.value)}
                        className="mr-4"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {address.label}
                        </p>
                        <p className="text-gray-600 text-sm">
                          {address.street}, {address.city} - {address.postalCode}
                        </p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Método de Pagamento
              </h2>

              <div className="space-y-3">
                {[
                  { value: "credit_card" as PaymentMethod, label: "💳 Cartão de Crédito" },
                  { value: "debit_card" as PaymentMethod, label: "🏦 Cartão de Débito" },
                  { value: "pix" as PaymentMethod, label: "📱 PIX" },
                  { value: "cash" as PaymentMethod, label: "💵 Dinheiro na Entrega" },
                ].map((method) => (
                  <label
                    key={method.value}
                    className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    style={{
                      borderColor:
                        paymentMethod === method.value ? "#10b981" : "#e5e7eb",
                      backgroundColor:
                        paymentMethod === method.value ? "#f0fdf4" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) =>
                        setPaymentMethod(e.target.value as PaymentMethod)
                      }
                      className="mr-4"
                    />
                    <span className="font-semibold text-gray-900">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Special Notes */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Observações
              </h2>

              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Sem cebola, extra queijo, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-2">
                Máximo 500 caracteres
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Resumo</h2>

              <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-96 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span className="text-gray-700">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="font-semibold text-gray-900">
                      R$ {(item.price * item.quantity).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
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
                  <span>Entrega</span>
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

              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-sm">
                  {errorMessage}
                </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={isProcessing || !selectedAddressId}
                className="w-full px-6 py-3 bg-linear-to-r from-emerald-500 to-lime-500 hover:from-emerald-600 hover:to-lime-600 disabled:from-gray-400 disabled:to-gray-400 text-white rounded-full font-bold shadow-lg transition-all duration-200 transform hover:scale-105"
              >
                {isProcessing ? "Processando..." : "Confirmar Pedido"}
              </button>

              <Link
                href="/cart"
                className="block w-full mt-3 px-6 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-full font-semibold text-center transition-all duration-200"
              >
                Voltar ao Carrinho
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
