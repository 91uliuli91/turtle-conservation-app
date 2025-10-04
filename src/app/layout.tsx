// src/app/layout.tsx
//El componente layout.tsx configura los aspectos globales de la aplicación, como las fuentes, los metadatos y la hoja de estilos para los íconos. 
// Este layout es utilizado en la aplicación Next.js  como el contenedor principal, asegurando que todas las páginas compartan una estructura común.
// src/app/layout.tsx - VERSIÓN CORREGIDA
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LogoTortugaWordmark from "@/components/icons/LogoTortugaWordmark";
import ClientBodyWrapper from "@/components/ClientBodyWrapper"; // ← Importar

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TurtleTrack - Sistema de Conservación",
  description: "Sistema de gestión para conservación de tortugas marinas",
};

// Script para limpiar atributos antes de que React hidrate
const cleanupScript = `
  // Limpiar atributos de extensiones inmediatamente
  if (typeof window !== 'undefined') {
    document.body.removeAttribute("cz-shortcut-listen");
    document.body.removeAttribute("g_editable");
    document.body.removeAttribute("contenteditable");
    document.body.removeAttribute("data-gramm");
    document.body.removeAttribute("data-gramm_editor");
    document.body.removeAttribute("data-enable-grammarly");
  }
`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="stylesheet" href="https://fonts.cdnfonts.com/css/uber-move-text" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
        <script dangerouslySetInnerHTML={{ __html: cleanupScript }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-uber-move`}>
        {/* Envuelve todo el contenido con ClientBodyWrapper */}
        <ClientBodyWrapper>
          <header className="p-4">
            <LogoTortugaWordmark className="w-12 h-8 text-emerald-600" />
          </header>
          {children}
        </ClientBodyWrapper>
      </body>
    </html>
  )
}
