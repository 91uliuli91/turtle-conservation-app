// OPCIÓN 2: Navbar más limpio con menú hamburguesa para Siembra y Eclosión
"use client"
import { useState } from "react"
import Link from "next/link"
import { PlusCircleIcon, MapIcon, ChartBarIcon } from "@heroicons/react/24/outline"
import EnvironmentalDataPanel from "@/components/EnvironmentalDataPanel"
import ProfileMenu from "@/components/ProfileMenu"

export default function TurtleTrackDashboard() {
  const [showMenu, setShowMenu] = useState(false)

  const activityData = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      title: "Avistamiento de Tortuga Caguama",
      time: "Hace 2 horas",
      location: "Playa Delfines",
    },
    {
      icon: <div className="w-5 h-5 rounded-full bg-gradient-to-r from-emerald-400 to-green-400"></div>,
      title: "Liberación de crías exitosa",
      time: "Ayer, 18:30",
      location: "Playa Tortugas",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground animate-fadeIn pb-20">
      <div className="p-6">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary">TurtleTrack</h1>
          <ProfileMenu />
        </header>

        <main className="space-y-6">
          <EnvironmentalDataPanel />

          {/* Acciones Rápidas - Solo Siembra y Eclosión */}
          <section className="p-5 rounded-2xl bg-card border border-border">
            <h3 className="font-semibold mb-4 text-lg text-foreground">Acciones Rápidas</h3>
            <div className="grid grid-cols-2 gap-3">
              <Link 
                href="/siembra"
                className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/40 transition-colors text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">Siembra</span>
              </Link>
              
              <Link 
                href="/eclosion"
                className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20 hover:border-cyan-500/40 transition-colors text-center group"
              >
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                  <svg className="w-4 h-4 text-cyan-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-foreground">Eclosión</span>
              </Link>
            </div>
          </section>

          <section className="p-5 rounded-2xl bg-card border border-border animate-slideInUp delay-300">
            <h3 className="font-semibold mb-4 text-lg text-foreground">Actividad Reciente</h3>
            
            <div className="space-y-4">
              {activityData.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-accent transition-colors duration-300"
                >
                  <div className="w-10 h-10 rounded-xl gradient-purple-blue/20 flex items-center justify-center text-primary flex-shrink-0">
                    {activity.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground text-sm font-medium leading-tight mb-1">{activity.title}</p>
                    <p className="text-muted-foreground text-xs">
                      {activity.time} • {activity.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      {/* Menú Hamburguesa Flotante - Solo Siembra y Eclosión */}
      {showMenu && (
        <>
          <div 
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setShowMenu(false)}
          />
          
          <div className="fixed bottom-20 right-4 bg-card border border-border rounded-2xl shadow-xl backdrop-blur-xl z-50 animate-fadeInUp">
            <div className="p-2 space-y-1 min-w-[180px]">
              <Link 
                href="/siembra"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-xl transition-colors text-foreground"
              >
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Siembra</span>
              </Link>
              
              <Link 
                href="/eclosion"
                onClick={() => setShowMenu(false)}
                className="flex items-center gap-3 px-4 py-3 hover:bg-accent rounded-xl transition-colors text-foreground"
              >
                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">Eclosión</span>
              </Link>
            </div>
          </div>
        </>
      )}

      {/* Navegación inferior */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 p-3 shadow-lg">
        <div className="flex justify-around items-center h-full max-w-lg mx-auto">
          <Link 
            href="/mapa" 
            className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl"
          >
            <MapIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Mapa</span>
          </Link>

          <Link 
            href="/estadisticas" 
            className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl"
          >
            <ChartBarIcon className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Datos</span>
          </Link>

          <Link 
            href="/formulario" 
            className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg -mt-10 border-4 border-background animate-pulse hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105"
          >
            <PlusCircleIcon className="w-8 h-8" />
          </Link>

          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl relative"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <span className="text-xs mt-1 font-medium">Más</span>
            {showMenu && (
              <div className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full animate-pulse" />
            )}
          </button>
       <ProfileMenu />
          {/* Placeholder para mantener la estructura de 5 elementos */}
          <div className="w-14 opacity-0">
            <div className="w-6 h-6"></div>
          </div>
        </div>
      </nav>
    </div>
  )
}  