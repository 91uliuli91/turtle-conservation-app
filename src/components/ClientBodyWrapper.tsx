// src/components/ClientBodyWrapper.tsx
//El componente ClientBodyWrapper es útil para limpiar los atributos no deseados de las extensiones del navegador,
// mejorando la experiencia del usuario y evitando que estos atributos interfieran con la funcionalidad o el diseño de la página.
// src/components/ClientBodyWrapper.tsx
"use client"

import type React from "react"
import { useEffect } from "react"

export default function ClientBodyWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    const cleanupAttributes = () => {
      document.body.removeAttribute("cz-shortcut-listen")
      document.body.removeAttribute("g_editable")
      document.body.removeAttribute("contenteditable")
      document.body.removeAttribute("data-gramm")
      document.body.removeAttribute("data-gramm_editor")
      document.body.removeAttribute("data-enable-grammarly")
    }

    cleanupAttributes()

    const observer = new MutationObserver(cleanupAttributes)
    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [
        "cz-shortcut-listen",
        "g_editable",
        "contenteditable",
        "data-gramm",
        "data-gramm_editor",
        "data-enable-grammarly",
      ],
    })

    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}