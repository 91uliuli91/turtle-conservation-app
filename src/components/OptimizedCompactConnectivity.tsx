// src/components/OptimizedCompactConnectivity.tsx
"use client"
import { memo } from 'react';
import { useNetworkStatus } from "../hooks/useNetworkStatus";

interface CompactConnectivityProps {
  onShowModal: () => void;
}

// Componente optimizado con memo
const CompactConnectivity = memo(({ onShowModal }: CompactConnectivityProps) => {
  const { networkStatus } = useNetworkStatus();

  console.log('🔁 CompactConnectivity renderizado'); // Para debug

  return (
    <div 
      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-300 cursor-pointer hover:shadow-md ${
        networkStatus.isConnected
          ? "bg-success/10 text-success border-success/30 hover:bg-success/20"
          : "bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/20"
      }`}
      onClick={onShowModal}
      title="Click para ver detalles de conectividad"
    >
      <div className="flex items-center gap-2">  
        <div className={`w-2 h-2 rounded-full ${
          networkStatus.isConnected ? "bg-success" : "bg-destructive"
        } animate-pulse`}></div>
        <span className="font-semibold">
          {networkStatus.isConnected ? "Online" : "Offline"}
        </span>
      </div>
    </div>
  );
});

// Display name para mejor debugging
CompactConnectivity.displayName = 'CompactConnectivity';

export default CompactConnectivity;