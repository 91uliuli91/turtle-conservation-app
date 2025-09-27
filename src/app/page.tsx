// src/app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useOffline } from '../hooks/useOffline';
import WizardForm from '../components/WizardForm';
import DashboardContent from '../components/DashboardContent';
import './dashboard-styles.css';

export default function HomePage() {
  const { isOnline, pendingSyncs } = useOffline();
  const [currentView, setCurrentView] = useState<'dashboard' | 'form'>('form');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Cambiado a false por defecto

  return (
    <div className="dashboard-container">
      {/* Sidebar desplegable */}
      <div className={`sidebar ${isSidebarOpen ? 'sidebar-open' : 'sidebar-closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            {isSidebarOpen ? (
              <svg width="100" height="40" viewBox="0 0 100 40">
                <path d="M12,15 L30,15 L24,27 L12,27 Z" fill="#2dbf78" />
                <text x="38" y="27" fill="#f0fdf4" font-size="20" font-weight="bold">
                  TurtleTrack
                </text>
              </svg>
            ) : (
              <svg width="40" height="40" viewBox="0 0 40 40">
                <path d="M12,15 L30,15 L24,27 L12,27 Z" fill="#2dbf78" />
              </svg>
            )}
          </div>
          
          <button 
            className="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className={`fas ${isSidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'}`}></i>
          </button>
        </div>

        <div className="nav-menu">
          <button 
            onClick={() => setCurrentView('form')}
            className={`nav-item ${currentView === 'form' ? 'active' : ''}`}
          >
            <i className="fas fa-clipboard-list"></i>
            {isSidebarOpen && <span>Nuevo Evento</span>}
          </button>
          
          <button 
            onClick={() => setCurrentView('dashboard')}
            className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          >
            <i className="fas fa-home"></i>
            {isSidebarOpen && <span>Dashboard</span>}
          </button>
          
          <Link href="/mapa" className="nav-item">
            <i className="fas fa-map-marked-alt"></i>
            {isSidebarOpen && <span>Mapa de Eventos</span>}
          </Link>
          
          <Link href="/especies" className="nav-item">
            <i className="fas fa-paw"></i>
            {isSidebarOpen && <span>Especies</span>}
          </Link>
          
          <Link href="/estadisticas" className="nav-item">
            <i className="fas fa-chart-bar"></i>
            {isSidebarOpen && <span>Estadísticas</span>}
          </Link>
          
          <Link href="/configuracion" className="nav-item">
            <i className="fas fa-cog"></i>
            {isSidebarOpen && <span>Configuración</span>}
          </Link>
        </div>
      </div>

      {/* Overlay para móvil */}
      {!isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      {/* Main Content que se adapta al sidebar */}
      <div className={`main-content ${isSidebarOpen ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        {/* Header con botón de menú para móvil */}
        <div className="header">
          <div className="header-left">
            <button 
              className="mobile-menu-toggle"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <i className="fas fa-bars"></i>
            </button>
            
            <div className="welcome-section">
              <p className="greeting">Buen día, Biólogo</p>
              <h1 className="welcome-title">
                {currentView === 'dashboard' ? 'Resumen de Conservación' : 'Registro de Nuevo Evento'}
              </h1>
            </div>
          </div>

          <div className="header-right">
            <div className={`status-indicator ${isOnline ? 'online' : 'offline'}`}>
              <i className={`fas ${isOnline ? 'fa-wifi' : 'fa-wifi-slash'}`}></i>
              <span>{isOnline ? 'En línea' : 'Offline'}</span>
              {pendingSyncs > 0 && <div className="sync-indicator">{pendingSyncs}</div>}
            </div>

            <div className="user-profile">
              <img
                src="https://i.pravatar.cc/100?img=8"
                alt="Biólogo"
                className="profile-pic"
              />
            </div>

            <div className="search-bar">
              <i className="fas fa-search"></i>
              <input type="text" placeholder="Buscar eventos..." />
            </div>
          </div>
        </div>

        {/* Contenido dinámico que se adapta al ancho */}
        <div className="content-area">
          {currentView === 'dashboard' ? (
            <DashboardContent />
          ) : (
            <div className="form-container">
              <WizardForm />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}