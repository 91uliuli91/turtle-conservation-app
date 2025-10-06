// src/app/not-found.tsx - VERSIÓN SIMPLIFICADA CON NUEVO DEGRADADO
"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"
import LogoTortuga from "@/components/icons/LogoTortuga"

export default function NotFound() {
  const router = useRouter()
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", currentPath)
  }, [currentPath])

  return (
    <div className="dark min-h-screen relative overflow-hidden" style={{
      background: 'linear-gradient(135deg, #151E2B 0%, #161625 50%, #151522 100%)'
    }}>
      {/* Contenedor principal centrado */}
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full mx-auto relative z-10 space-y-8 animate-fade-in">
          
          {/* Icon Container - Centrado perfecto */}
          <div className="flex justify-center mb-8">
            <div className="relative group">
              {/* Circle Container - Simple y elegante */}
              <div className="relative w-40 h-40 rounded-full border border-gray-700/50 bg-gray-800/30 backdrop-blur-sm group-hover:border-emerald-500/50 transition-all duration-500 flex items-center justify-center">
                {/* Contenedor interno para centrado absoluto */}
                <div className="flex items-center justify-center w-full h-full p-4 pt-24">
                  <LogoTortuga 
                    className="w-24 h-24 text-emerald-400/90 group-hover:text-emerald-300 transition-all duration-500 animate-float mx-auto " 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Code with gradient */}
          <div className="space-y-2">
            <h1 className="text-[140px] font-extralight leading-none tracking-tight">
              <span className="bg-gradient-to-r from-neutral-200 via-emerald-200 to-neutral-200 bg-clip-text text-transparent">
                404
              </span>
            </h1>
            <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
          </div>

          {/* Message */}
          <div className="space-y-4">
            <h2 className="text-2xl font-light text-neutral-300 tracking-wide">
              Página no encontrada
            </h2>
            <p className="text-sm font-light text-neutral-400 max-w-md mx-auto leading-relaxed">
              La página que buscas no existe o ha sido movida.
              <br />
              Como una tortuga, tomemos el camino de regreso.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}