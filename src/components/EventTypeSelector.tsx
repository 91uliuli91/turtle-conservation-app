// src/components/EventTypeSelector.tsx

// Este componente permite seleccionar uno de los tres tipos de eventos (Arqueo, Intento, Anidación),
// mostrando un diseño interactivo y visualmente atractivo, con un icono y descripción de cada tipo de evento.
"use client"
import '../app/globals.css';
import AnidacionIcon from "@/components/icons/AnidacionIcon";
import ArqueoIcon from "@/components/icons/IntentoIcon";
import IntentoIcon from "@/components/icons/ArqueoIcon";


interface EventTypeSelectorProps {
  onSelect: (type: string) => void
}

export default function EventTypeSelector({ onSelect }: EventTypeSelectorProps) {
  const eventTypes = [
    {
      id: "arqueo",
      name: "Arqueo",
      icon: <ArqueoIcon className="w-11 h-15 " />,
      description: "Registro de tortuga avistada",
      gradient: "gradient-emerald-teal",
      bgColor: "from-emerald-500/10 to-teal-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      id: "intento",
      name: "Intento",
      icon: <IntentoIcon className="w-12 h-12" />, // hereda color actual
      description: "Intento de anidación",
      bgColor: "from-purple-500/10 to-pink-500/10",
      gradient: "gradient-purple-pink",
      borderColor: "border-purple-500/20",
    },
    {
      id: "anidacion",
      name: "Anidación",
      icon: <AnidacionIcon className="w-12 h-12" />, // hereda color del contenedor
      description: "Nido con huevos",
      bgColor: "from-blue-500/10 to-cyan-500/10",
      gradient: "gradient-blue-cyan",
      borderColor: "border-blue-500/20",
    },
  ]

  return (
    <div className="flex flex-col items-center animate-fadeInUp">
      <div className="bg-card rounded-3xl p-8 shadow-xl border border-border/50 w-full max-w-md">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-light text-foreground mb-2 text-balance">Nuevo Registro</h2>
          <p className="text-muted-foreground text-lg text-pretty">¿Qué tipo de evento registras?</p>
        </div>

        <div className="space-y-4">
          {eventTypes.map((event, index) => (
            <button
              key={event.id}
              onClick={() => onSelect(event.id)}
              className={`group w-full p-6 rounded-3xl border transition-all duration-500 ease-out
                        hover:scale-105 hover:shadow-2xl hover:shadow-primary/10
                        bg-gradient-to-r ${event.bgColor} ${event.borderColor}
                        hover:border-primary/30 animate-fadeInUp`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 rounded-2xl bg-card shadow-lg flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform duration-300">
                  <div className="text-foreground group-hover:text-primary transition-colors duration-300">
                    {event.icon}
                  </div>
                </div>

                <div className="text-left flex-1 m-0">
                  <div className="text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors duration-300">
                    {event.name}
                  </div>
                  <div className="text-muted-foreground text-sm leading-relaxed">{event.description}</div>
                </div>

                <div className="w-10 h-10 rounded-2xl bg-muted/50 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-8 pt-6 border-t border-border/30">
          <p className="text-center text-xs text-muted-foreground tracking-wide">
            SELECCIONA UNA OPCIÓN PARA CONTINUAR
          </p>
        </div>
      </div>
    </div>
  )
}