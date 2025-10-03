// src/app/layout.tsx

//El componente layout.tsx configura los aspectos globales de la aplicación, como las fuentes, los metadatos y la hoja de estilos para los íconos. 
// Este layout es utilizado en la aplicación Next.js  como el contenedor principal, asegurando que todas las páginas compartan una estructura común.


import type { Metadata } from "next"; // Importa el tipo de Metadata de Next.js para la configuración de metadatos
import { Geist, Geist_Mono } from "next/font/google"; // Importa las fuentes de Google Geist y Geist_Mono
import "./globals.css"; // Importa los estilos globales de la aplicación
// donde lo uses (Navbar, layout, etc.)
import LogoTortuga from "@/components/icons/LogoTortuga";
import LogoTortugaWordmark from "@/components/icons/LogoTortugaWordmark";

// Configuración de la fuente Geist (sans-serif) con una variable CSS para uso global
const geistSans = Geist({
  variable: "--font-geist-sans", // Define una variable CSS para usar la fuente Geist en la aplicación
  subsets: ["latin"], // Usa el subconjunto de caracteres latinos
});

// Configuración de la fuente Geist_Mono (monoespaciada) con una variable CSS para uso global
const geistMono = Geist_Mono({
  variable: "--font-geist-mono", // Define una variable CSS para usar la fuente monoespaciada en la aplicación
  subsets: ["latin"], // Usa el subconjunto de caracteres latinos
});

// Definición de los metadatos de la página (título y descripción)
export const metadata: Metadata = {
  title: "TurtleTrack - Sistema de Conservación", // Título de la página
  description: "Sistema de gestión para conservación de tortugas marinas", // Descripción de la página
};

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
      </head>
      <header className="p-4">
          <LogoTortugaWordmark className="w-12 h-8 text-emerald-600" />
        </header>
      <body className={`${geistSans.variable} ${geistMono.variable} font-uber-move`}>
        {children}
      </body>
    </html>
  )
}
