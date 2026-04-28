import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar"; // Importando a Sidebar

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "UniCondo - Gestão de Condomínios",
  description: "Sistema completo de gestão",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex h-screen bg-brand-dark overflow-hidden">
        {/* Aqui entra a Sidebar ao lado do conteúdo */}
        <Sidebar /> 
        
        <main className="flex-1 overflow-y-auto bg-brand-dark">
          {children}
        </main>
      </body>
    </html>
  );
}