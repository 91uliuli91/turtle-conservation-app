// src/app/layout.tsx

//El componente layout.tsx configura los aspectos globales de la aplicación, como las fuentes, los metadatos y la hoja de estilos para los íconos. 
// Este layout es utilizado en la aplicación Next.js  como el contenedor principal, asegurando que todas las páginas compartan una estructura común.


import type { Metadata } from "next"; // Importa el tipo de Metadata de Next.js para la configuración de metadatos
import { Geist, Geist_Mono } from "next/font/google"; // Importa las fuentes de Google Geist y Geist_Mono
import "./globals.css"; // Importa los estilos globales de la aplicación

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
  children: React.ReactNode; // Los elementos hijos que se pasarán a este componente RootLayout
}) {
  return (
    <html lang="es" className="dark"> {/* El idioma de la página está configurado a español */}
      <head>
        {/* Enlace a la hoja de estilo de Font Awesome para los íconos */}
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}> {/* Aplica las fuentes Geist y Geist_Mono globalmente */}
        {children} {/* Renderiza el contenido de la página */}
      </body>
    </html>
  );
}
