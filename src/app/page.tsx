// src/app/page.tsx - VERSIÓN FINAL CON BOTÓN CENTRAL PARA EVENTOS
"use client"
import Link from "next/link"
import { PlusCircleIcon, MapIcon, ChartBarIcon, UserIcon, EyeIcon, CalendarIcon } from "@heroicons/react/24/outline"
import './globals.css';
import EnvironmentalDataPanel from "@/components/EnvironmentalDataPanel"
import ProfileMenu from "@/components/ProfileMenu"

export default function TurtleTrackDashboard() {
  const activityData = [
    {
      icon: <EyeIcon className="w-5 h-5" />,
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
    {
      icon: <CalendarIcon className="w-5 h-5" />,
      title: "Monitoreo programado",
      time: "Mañana, 06:00",
      location: "Playa Chac Mool",
    },
  ]

  return (
    <div className="min-h-screen bg-background text-foreground animate-fadeIn pb-20">
      <div className="p-6">
        {/* Header simplificado - Sin botón de perfil */}
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary">TurtleTrack</h1>
 
        </header>

        <main>
          {/* Datos Ambientales BASADOS EN GEOLOCALIZACIÓN */}
          <EnvironmentalDataPanel />

          {/* Actividad Reciente */}
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

{/* Navegación inferior - Botón central para eventos */}
<nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 p-3 shadow-lg">
  <div className="flex justify-around items-center h-full max-w-lg mx-auto">
    {/* Botón Mapa */}
    <Link href="/mapa" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl">
      <MapIcon className="w-6 h-6" />
      <span className="text-xs mt-1 font-medium">Mapa</span>
    </Link>

    {/* Botón Estadísticas */}
    <Link href="/estadisticas" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl">
      <ChartBarIcon className="w-6 h-6" />
      <span className="text-xs mt-1 font-medium">Datos</span>
    </Link>

    {/* Botón central destacado - EVENTOS */}
    <Link href="/formulario" className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground shadow-lg -mt-10 border-4 border-background animate-pulse hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105">
      <PlusCircleIcon className="w-8 h-8" />
    </Link>

    {/* Botón Inicio */}
    <Link href="/" className="flex flex-col items-center text-primary transition-colors duration-300 ease-in-out px-4 py-2 rounded-xl">
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
        <div className="w-3 h-3 rounded-full bg-primary"></div>
      </div>
      <span className="text-xs mt-1 font-medium">Siembra</span>
    </Link>
      <ProfileMenu />
  </div>
</nav>
    </div>
  )
}