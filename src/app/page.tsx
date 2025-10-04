// src/app/page.tsx - VERSIÓN CON GEOLOCALIZACIÓN
"use client"
import Link from "next/link"
import { PlusCircleIcon, MapIcon, ChartBarIcon, UserIcon, EyeIcon, CalendarIcon } from "@heroicons/react/24/outline"
import './globals.css'; 
import EnvironmentalDataPanel from "@/components/EnvironmentalDataPanel"

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
<div className="min-h-screen bg-background p-6 flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-foreground via-primary to-primary bg-clip-text text-transparent mb-2">
            TurtleTrack Cancún
          </h1>
          <p className="text-xl text-muted-foreground font-light">
            Sistema de conservación de tortugas marinas - Caribe Mexicano
          </p>
          <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Datos en tiempo real para tu ubicación actual</span>
          </div>
        </div>
        <div className="w-12 h-12 rounded-2xl gradient-purple-blue flex items-center justify-center text-white font-semibold border-2 border-border">
          <UserIcon className="w-6 h-6" />
        </div>
      </div>

      {/* Datos Ambientales BASADOS EN GEOLOCALIZACIÓN */}
      <EnvironmentalDataPanel />


      {/* Tarjetas de acción principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mb-8">
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

      {/* Sección inferior con actividad reciente y estadísticas rápidas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tarjeta de actividad reciente */}
        <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border lg:col-span-2">
          <h3 className="text-xl font-semibold text-foreground mb-6">Actividad Reciente</h3>

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

        {/* Estadísticas rápidas */}
        <div className="bg-card backdrop-blur-xl rounded-3xl p-8 border border-border">
          <h3 className="text-xl font-semibold text-foreground mb-6">Resumen del Día</h3>
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-1">12</div>
              <div className="text-sm text-muted-foreground">Eventos Hoy</div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">3</div>
                <div className="text-xs text-muted-foreground">Anidaciones</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">8</div>
                <div className="text-xs text-muted-foreground">Arqueos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-1">1</div>
                <div className="text-xs text-muted-foreground">Intentos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-500 mb-1">85</div>
                <div className="text-xs text-muted-foreground">Huevos</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}