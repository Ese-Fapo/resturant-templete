import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import NextAuthProvider from "@/components/layout/NextAuthProvider";
import { Toaster } from "react-hot-toast";



const roboto = Roboto({ 

  variable: "--font-roboto",
  subsets: ["latin"], weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "Restaurant Menu App",
  description: "An app to browse and order from restaurant menus.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${roboto.variable} antialiased bg-white min-h-screen flex flex-col`}>
        <NextAuthProvider>
          <Header />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </main>
          <Footer />
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
        </NextAuthProvider>
      </body>
    </html>
  );
}
