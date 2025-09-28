// src/components/ClientBodyWrapper.tsx
//El componente ClientBodyWrapper es útil para limpiar los atributos no deseados de las extensiones del navegador, 
// mejorando la experiencia del usuario y evitando que estos atributos interfieran con la funcionalidad o el diseño de la página.
'use client';

import { useEffect } from 'react';

// Este componente envuelve los elementos hijos y asegura que ciertos atributos de extensión sean limpiados de la etiqueta <body>
export default function ClientBodyWrapper({
  children,
}: {
  children: React.ReactNode; // Los elementos hijos que se pasarán a este componente
}) {
  useEffect(() => {
    // Función que limpia los atributos específicos que podrían haber sido añadidos por extensiones de navegador
    const cleanupAttributes = () => {
      // Eliminamos atributos no deseados, como los agregados por Grammarly y otras extensiones
      document.body.removeAttribute('cz-shortcut-listen');
      document.body.removeAttribute('g_editable');
      document.body.removeAttribute('contenteditable');
      document.body.removeAttribute('data-gramm');
      document.body.removeAttribute('data-gramm_editor');
      document.body.removeAttribute('data-enable-grammarly');
    };

    // Ejecutamos la limpieza de atributos inmediatamente después de que el componente se monta
    cleanupAttributes();
    
    // Creamos un observador para detectar cambios futuros en los atributos del cuerpo del documento
    const observer = new MutationObserver(cleanupAttributes);
    
    // Observamos los cambios en los atributos de <body>, específicamente los atributos que añadieron las extensiones
    observer.observe(document.body, { 
      attributes: true,  // Solo observamos cambios en los atributos
      attributeFilter: ['cz-shortcut-listen', 'g_editable', 'contenteditable', 'data-gramm', 'data-gramm_editor', 'data-enable-grammarly'] 
    });

    // Cuando el componente se desmonta, desconectamos el observador para evitar fugas de memoria
    return () => observer.disconnect();
  }, []); // El useEffect se ejecuta solo una vez al montar el componente

  // Renderizamos los elementos hijos dentro del componente
  return <>{children}</>;
}
