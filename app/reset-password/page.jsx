"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Get token from URL
  const token = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("token") : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setMessage("Preencha todos os campos.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("As senhas não coincidem.");
      return;
    }
    setLoading(true);
    setMessage("");
    const res = await fetch("/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    const data = await res.json();
    if (data.success) {
      // Simulate login and restore user data
      // In real app, fetch user data from backend
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify({ email: "test@example.com", name: "Test User" }));
      }
      setMessage("Senha redefinida com sucesso! Redirecionando...");
      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setMessage(data.error || "Erro ao redefinir senha.");
    }
    setLoading(false);
  };

  return (
    <section className="mt-8 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Redefinir Senha</h1>
      <form className="max-w-md w-full bg-white p-6 rounded-lg shadow-md border border-gray-200" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nova senha</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Confirme a nova senha</label>
          <input
            type="password"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition"
          disabled={loading}
        >
          {loading ? "Redefinindo..." : "Redefinir Senha"}
        </button>
        {message && <div className="text-center text-sm text-gray-600 mt-4">{message}</div>}
      </form>
    </section>
  );
}
