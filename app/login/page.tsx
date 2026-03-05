"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ConfettiAnimation from "@/components/ui/ConfettiAnimation";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotMessage, setForgotMessage] = useState("");
  const [loginMessage, setLoginMessage] = useState("");
  const [loginSuccess, setLoginSuccess] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      const timer = setTimeout(() => {
        router.push("/profile");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginMessage("");
    setLoginSuccess(false);
    const email = (e.currentTarget.elements.namedItem("email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("password") as HTMLInputElement).value;
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });
    if (result?.ok) {
      setLoginMessage("Login realizado com sucesso! Bem-vindo de volta!");
      setLoginSuccess(true);
      // Optionally, redirect or reload page to update navbar
      // window.location.reload();
    } else {
      setLoginMessage("Falha no login. Verifique suas credenciais.");
      setLoginSuccess(false);
    }
  }

  return (
    <section className="mt-8 "> 
      <h1 className="text-3xl font-bold text-center mb-6">Login</h1>
      <form className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md border border-gray-200" onSubmit={handleSubmit}>
        {loginMessage && (
          <div className={`mb-4 text-center text-lg font-semibold ${loginSuccess ? "text-emerald-600" : "text-red-500"}`}>
            {loginMessage}
          </div>
        )}
        {loginSuccess && <ConfettiAnimation />}
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            autoComplete="email"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition pr-10"
              required
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition"
        >
          Entrar
        </button>

        <div className="text-center my-2">Ou login com </div>

         <button onClick={() => signIn('google')}
            type="submit"
            className="w-full py-2 px-4 bg-gray-400 hover:bg-white/90 text-gray-800 font-semibold rounded-lg shadow-md transition"
          >
            Google
            <FcGoogle className="inline-block ml-2 text-xl" />
          </button>


        <button
          type="button"
          className="w-full py-2 px-4 mt-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md transition"
          onClick={() => setShowForgotModal(true)}
        >
          Esqueci minha senha
        </button>
        {/* Forgot Password Modal */}
        {showForgotModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotMessage("");
                  setForgotEmail("");
                }}
                aria-label="Fechar"
              >
                ×
              </button>
              <h2 className="text-xl font-semibold mb-4">Recuperar senha</h2>
              <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">Digite seu email</label>
              <input
                id="forgot-email"
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-400 focus:outline-none transition mb-3"
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                placeholder="Seu email"
              />
              <button
                className="w-full py-2 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-md transition mb-2"
                onClick={async () => {
                  if (!forgotEmail) {
                    setForgotMessage("Por favor, insira seu email.");
                    return;
                  }
                  setForgotMessage("Se o email existir, enviaremos instruções para redefinir sua senha.");
                  // TODO: Call backend API here
                }}
              >
                Enviar
              </button>
              {forgotMessage && <div className="text-center text-sm text-gray-600 mt-2">{forgotMessage}</div>}
            </div>
          </div>
        )}
      </form>
    </section>
    
  );
}

