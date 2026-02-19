import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";



const roboto = Roboto({ 

  variable: "--font-roboto",
  subsets: ["latin"], weight: ["400", "500", "700"]
});

export const metadata: Metadata = {
  title: "Restaurant Menu App",
  description: "An app to browse and order from restaurant menus.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${roboto.variable} antialiased`}
      >
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {children}

        </main>
      </body>
    </html>
  );
}
