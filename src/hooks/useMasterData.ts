//src/hooks/useMasterData.ts
'use client';

import { useState, useEffect } from 'react';

interface MasterData {
  campamentos: any[];
  tortugas: any[];
  personal: any[];
}

export function useMasterData() {
  const [data, setData] = useState<MasterData>({
    campamentos: [],
    tortugas: [], 
    personal: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        setLoading(true);
        
        // Cargar datos en paralelo
        const [campamentosRes, tortugasRes, personalRes] = await Promise.all([
          fetch('/api/campamentos'),
          fetch('/api/tortugas'), 
          fetch('/api/personal')
        ]);

        if (!campamentosRes.ok || !tortugasRes.ok || !personalRes.ok) {
          throw new Error('Error cargando datos maestros');
        }

        const [campamentos, tortugas, personal] = await Promise.all([
          campamentosRes.json(),
          tortugasRes.json(),
          personalRes.json()
        ]);

        setData({
          campamentos: campamentos.data || [],
          tortugas: tortugas.data || [],
          personal: personal.data || []
        });

      } catch (err) {
        setError('No se pudieron cargar los datos maestros');
        console.error('Error loading master data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMasterData();
  }, []);

  return { data, loading, error };
}