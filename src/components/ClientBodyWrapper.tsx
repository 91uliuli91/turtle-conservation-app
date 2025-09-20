// src/components/ClientBodyWrapper.tsx
'use client';

import { useEffect } from 'react';

export default function ClientBodyWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Limpiar atributos agregados por extensiones
    const cleanupAttributes = () => {
      document.body.removeAttribute('cz-shortcut-listen');
      document.body.removeAttribute('g_editable');
      document.body.removeAttribute('contenteditable');
      document.body.removeAttribute('data-gramm');
      document.body.removeAttribute('data-gramm_editor');
      document.body.removeAttribute('data-enable-grammarly');
    };

    // Limpiar inmediatamente y en cada cambio del DOM
    cleanupAttributes();
    
    // Observer para detectar cambios futuros
    const observer = new MutationObserver(cleanupAttributes);
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['cz-shortcut-listen', 'g_editable', 'contenteditable', 'data-gramm', 'data-gramm_editor', 'data-enable-grammarly'] 
    });

    return () => observer.disconnect();
  }, []);

  return <>{children}</>;
}