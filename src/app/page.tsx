// page.tsx - Versión actualizada con tema oscuro y estilo unificado
"use client"
import Link from "next/link"
import { PlusCircleIcon, MapIcon, ChartBarIcon, UserIcon, EyeIcon, CalendarIcon } from "@heroicons/react/24/outline"
import './globals.css'; 

export default function TurtleTrackDashboard() {
  const activityData = [
    {
      icon: <EyeIcon className="w-5 h-5" />,
      title: "Avistamiento de Tortuga Verde",
      time: "Hace 2 horas",
      location: "Playa Norte",
    },
    {
      icon: <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-400 to-blue-400"></div>,
      title: "Liberación de crías exitosa",
      time: "Ayer, 16:30",
      location: "Playa Sur",
    },
    {
      icon: <CalendarIcon className="w-5 h-5" />,
      title: "Nuevo evento programado",
      time: "Mañana, 08:00",
      location: "Santuario",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col items-center justify-center">
      {/* Header con avatar de usuario */}
      <div className="absolute top-6 right-6 flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl gradient-purple-blue flex items-center justify-center text-white font-semibold border-2 border-border">
          <UserIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Título principal */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent mb-4">
          TurtleTrack
        </h1>
        <p className="text-xl text-muted-foreground font-light">Sistema de conservación de tortugas marinas</p>
      </div>

      {/* Tarjetas de acción principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
        <Link href="/formulario" className="group">
          <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border hover:bg-accent transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-purple-blue flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <PlusCircleIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Registrar Evento</h3>
              <p className="text-muted-foreground leading-relaxed">Registra nuevos avistamientos y eventos</p>
            </div>
          </div>
        </Link>

        <Link href="/mapa" className="group">
          <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border hover:bg-accent transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-blue-cyan flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <MapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Ver Mapa</h3>
              <p className="text-muted-foreground leading-relaxed">Explora eventos en el mapa</p>
            </div>
          </div>
        </Link>

        <Link href="/estadisticas" className="group">
          <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border hover:bg-accent transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 h-full">
            <div className="text-center">
              <div className="w-16 h-16 rounded-2xl gradient-purple-pink flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <ChartBarIcon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">Estadísticas</h3>
              <p className="text-muted-foreground leading-relaxed">Analiza datos de conservación</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Tarjeta de actividad reciente */}
      <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border w-full max-w-md">
        <h3 className="text-xl font-semibold text-foreground mb-6 text-center">Actividad Reciente</h3>

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
      </div>
    </div>
  )
}