
"use client";

import React, { useState } from "react";
import { MdOutlinePersonAddAlt1 } from "react-icons/md";

import { FcGoogle } from "react-icons/fc";
import { headers } from "next/dist/server/request/headers";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("As senhas não coincidem.");
      return;
    }
    setSuccess("Cadastro realizado com sucesso!");
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  };
        
        // Removed invalid 'ev.preventDefault();' as 'ev' is not defined.
        fetch("/api/register", {
          method: "POST",
          body: JSON.stringify(form),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.error) {
              setError(data.error);
            } else {
              setSuccess("Cadastro realizado com sucesso!");
              setForm({ name: "", email: "", password: "", confirmPassword: "" });
            }
          })
          .catch((err) => {
            setError("Ocorreu um erro. Por favor, tente novamente.");
          });

  return (
    <section className="flex flex-col items-center justify-center min-h-[70vh] py-8 px-2 sm:px-6 lg:px-8 bg-gradient-to-r from-emerald-100 to-lime-100">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-gray-100">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-emerald-700 mb-6">Crie sua conta</h2>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
              required
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                required
              />
            </div>
            <div className="flex-1">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmar Senha</label>
              <input
                type="password"
                name="confirmPassword"
                id="confirmPassword"
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
                required
              />
            </div>
          </div>
          {error && <div className="text-red-500 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition"
          >
            Registrar
            <MdOutlinePersonAddAlt1 className="inline-block ml-2 text-xl" />
          </button>
          <div className="text-center mt-4">ou fazer login com </div>

 <button
            type="submit"
            className="w-full py-2 px-4 bg-gray-400 hover:bg-white/90 text-gray-800 font-semibold rounded-lg shadow-md transition"
          >
            Google
            <FcGoogle className="inline-block ml-2 text-xl" />
          </button>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Já tem uma conta? <a href="/login" className="text-emerald-600 hover:text-emerald-800">Entrar</a>
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

