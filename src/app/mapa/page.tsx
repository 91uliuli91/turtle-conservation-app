// src/app/mapa/page.tsx
'use client';
import { useState } from 'react';

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f23] via-[#1a1a2e] to-[#16213e] text-white">
      {/* Header */}
      <div className="bg-[#1a1a2e]/80 backdrop-blur-xl border-b border-[#334155] sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg gradient-purple-blue flex items-center justify-center">
                <span className="text-white font-bold text-lg">🐢</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-[#f8fafc]">Mapa de Conservación</h1>
                <p className="text-[#94a3b8] text-sm">Costas de Quintana Roo</p>
              </div>
            </div>
            <a
              href="/"
              className="px-4 py-2 bg-[#252542] hover:bg-[#2d2d5a] rounded-xl transition-all duration-200 text-sm"
            >
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-[#1a1a2e]/60 backdrop-blur-xl rounded-2xl border border-[#334155] p-8">
          {/* Estado actual */}
          <div className="text-center space-y-6">
            <div className="w-24 h-24 rounded-full gradient-purple-blue flex items-center justify-center mx-auto">
              <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-[#f8fafc] mb-2">Mapa en Desarrollo</h2>
              <p className="text-[#94a3b8] text-lg mb-6">
                El mapa interactivo de las costas de Quintana Roo estará disponible próximamente
              </p>
            </div>

            {/* Características planificadas */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
              <div className="bg-[#252542]/50 rounded-xl p-4 border border-[#334155]">
                <div className="w-8 h-8 rounded-lg bg-[#059669]/20 flex items-center justify-center mb-3">
                  <span className="text-[#10b981]">🏖️</span>
                </div>
                <h3 className="font-semibold text-[#f8fafc] mb-1">Playas de Anidación</h3>
                <p className="text-[#94a3b8] text-sm">Ubicaciones específicas donde anidan las tortugas</p>
              </div>

              <div className="bg-[#252542]/50 rounded-xl p-4 border border-[#334155]">
                <div className="w-8 h-8 rounded-lg bg-[#dc2626]/20 flex items-center justify-center mb-3">
                  <span className="text-[#ef4444]">🥚</span>
                </div>
                <h3 className="font-semibold text-[#f8fafc] mb-1">Nidos Registrados</h3>
                <p className="text-[#94a3b8] text-sm">Visualización de nidos activos y estadísticas</p>
              </div>

              <div className="bg-[#252542]/50 rounded-xl p-4 border border-[#334155]">
                <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/20 flex items-center justify-center mb-3">
                  <span className="text-[#8b5cf6]">🐢</span>
                </div>
                <h3 className="font-semibold text-[#f8fafc] mb-1">Avistamientos</h3>
                <p className="text-[#94a3b8] text-sm">Registro de tortugas observadas en tiempo real</p>
              </div>

              <div className="bg-[#252542]/50 rounded-xl p-4 border border-[#334155]">
                <div className="w-8 h-8 rounded-lg bg-[#f59e0b]/20 flex items-center justify-center mb-3">
                  <span className="text-[#f59e0b]">🏛️</span>
                </div>
                <h3 className="font-semibold text-[#f8fafc] mb-1">Campamentos</h3>
                <p className="text-[#94a3b8] text-sm">Ubicaciones de campamentos de conservación</p>
              </div>

              <div className="bg-[#252542]/50 rounded-xl p-4 border border-[#334155]">
                <div className="w-8 h-8 rounded-lg bg-[#06b6d4]/20 flex items-center justify-center mb-3">
                  <span className="text-[#06b6d4]">🌊</span>
                </div>
                <h3 className="font-semibold text-[#f8fafc] mb-1">Áreas Protegidas</h3>
                <p className="text-[#94a3b8] text-sm">Zonas marinas y terrestres bajo protección</p>
              </div>

              <div className="bg-[#252542]/50 rounded-xl p-4 border border-[#334155]">
                <div className="w-8 h-8 rounded-lg bg-[#84cc16]/20 flex items-center justify-center mb-3">
                  <span className="text-[#84cc16]">📊</span>
                </div>
                <h3 className="font-semibold text-[#f8fafc] mb-1">Datos Históricos</h3>
                <p className="text-[#94a3b8] text-sm">Tendencias y estadísticas de temporadas anteriores</p>
              </div>
            </div>

            {/* Estado de desarrollo */}
            <div className="mt-8 p-6 bg-gradient-to-r from-[#8b5cf6]/10 to-[#06b6d4]/10 rounded-xl border border-[#8b5cf6]/20">
              <h3 className="text-lg font-semibold text-[#f8fafc] mb-2">Estado de Desarrollo</h3>
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#10b981]"></div>
                  <span className="text-[#94a3b8]">Diseño completado</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div>
                  <span className="text-[#94a3b8]">En desarrollo</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full bg-[#6b7280]"></div>
                  <span className="text-[#94a3b8]">Pendiente</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}