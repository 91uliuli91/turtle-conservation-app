// src/app/page.tsx
'use client';

import Link from 'next/link';
import { useOffline } from '../hooks/useOffline';
import './dashboard-styles.css'; // Crearemos este archivo CSS

export default function DashboardPage() {
  const { isOnline, pendingSyncs } = useOffline();

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <svg width="100" height="40" viewBox="0 0 100 40">
            <path d="M12,15 L30,15 L24,27 L12,27 Z" fill="#2dbf78" />
            <text x="38" y="27" fill="#262A39" font-size="20" font-weight="bold">
              TurtleTrack
            </text>
          </svg>
        </div>

        <div className="nav-menu">
          <Link href="/" className="nav-item active">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </Link>
          <Link href="/formulario" className="nav-item">
            <i className="fas fa-clipboard-list"></i>
            <span>Nuevo Evento</span>
          </Link>
          <Link href="/mapa" className="nav-item">
            <i className="fas fa-map-marked-alt"></i>
            <span>Mapa de Eventos</span>
          </Link>
          <Link href="/especies" className="nav-item">
            <i className="fas fa-paw"></i>
            <span>Especies</span>
          </Link>
          <Link href="/estadisticas" className="nav-item">
            <i className="fas fa-chart-bar"></i>
            <span>Estadísticas</span>
          </Link>
          <Link href="/configuracion" className="nav-item">
            <i className="fas fa-cog"></i>
            <span>Configuración</span>
          </Link>
        </div>

        <div className="premium-box">
          <h3>Modo Investigador</h3>
          <button className="premium-btn">Activar</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Header */}
        <div className="header">
          <div className="welcome-section">
            <p className="greeting">Buen día, Biólogo</p>
            <h1 className="welcome-title">Resumen de Conservación</h1>
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

        {/* Dashboard Container */}
        <div className="dashboard-container-grid">
          {/* Main Dashboard Content */}
          <div className="dashboard-main">
            {/* Stats Cards */}
            <div className="stats-cards">
              <div className="stat-card">
                <div className="card-icon">
                  <i className="fas fa-egg"></i>
                </div>
                <p className="card-title">Nidos Registrados</p>
                <h2 className="card-amount">24</h2>
                <div className="card-trend positive">+12% este mes</div>
              </div>

              <div className="stat-card">
                <div className="card-icon">
                  <i className="fas fa-turtle"></i>
                </div>
                <p className="card-title">Tortugas Avistadas</p>
                <h2 className="card-amount">156</h2>
                <div className="card-trend positive">+8% este mes</div>
              </div>

              <div className="stat-card">
                <div className="card-icon">
                  <i className="fas fa-baby"></i>
                </div>
                <p className="card-title">Crías Liberadas</p>
                <h2 className="card-amount">1,240</h2>
                <div className="card-trend positive">+15% este mes</div>
              </div>
            </div>

            {/* Campaña Card */}
            <div className="campaign-card">
              <div className="campaign-info">
                <h2 className="campaign-title">Temporada de Anidación 2024</h2>
                <p className="campaign-desc">
                  Estamos en el pico de la temporada de anidación. Mantén un registro 
                  detallado de cada evento para mejorar nuestros programas de conservación.
                </p>
                <Link href="/formulario">
                  <button className="campaign-btn">
                    <i className="fas fa-plus"></i>
                    Registrar Nuevo Evento
                  </button>
                </Link>
              </div>

              <div className="turtle-card">
                <div className="card-overlay"></div>
                <div className="card-brand">
                  <div className="card-type">Campamento Tamul</div>
                  <div className="card-logo">
                    <i className="fas fa-water"></i>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="stat-item">
                    <span>Especies Activas</span>
                    <strong>3</strong>
                  </div>
                  <div className="stat-item">
                    <span>Km de Playa</span>
                    <strong>7.2</strong>
                  </div>
                </div>

                <div className="card-details">
                  <div className="detail-item">
                    <div className="detail-label">EQUIPO ACTIVO</div>
                    <div className="detail-value">8 Biólogos</div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-label">TEMP. ACTUAL</div>
                    <div className="detail-value">28.5°C</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Eventos Recientes */}
            <div className="events-section">
              <div className="event-card">
                <h3 className="section-title">Eventos Recientes</h3>

                <div className="event-item">
                  <div className="event-icon">
                    <i className="fas fa-egg"></i>
                  </div>
                  <div className="event-content">
                    <div className="event-title">Anidación - Tortuga Verde</div>
                    <div className="event-time">
                      <i className="far fa-clock"></i> Hoy, 14:45 - Playa Norte
                    </div>
                  </div>
                  <div className="event-badge success">+85 huevos</div>
                </div>

                <div className="event-item">
                  <div className="event-icon">
                    <i className="fas fa-turtle"></i>
                  </div>
                  <div className="event-content">
                    <div className="event-title">Arqueo - Tortuga Carey</div>
                    <div className="event-time">
                      <i className="far fa-clock"></i> Ayer, 16:08 - Zona B
                    </div>
                  </div>
                  <div className="event-badge info">Mediciones</div>
                </div>
              </div>

              <div className="event-card">
                <h3 className="section-title">Actividad del Equipo</h3>

                <div className="event-item">
                  <div className="event-icon">
                    <img src="https://i.pravatar.cc/100?img=12" alt="María González" />
                  </div>
                  <div className="event-content">
                    <div className="event-title">María González</div>
                    <div className="event-time">
                      <i className="far fa-clock"></i> Hoy, 09:35 - 3 eventos
                    </div>
                  </div>
                  <div className="event-badge primary">Activa</div>
                </div>

                <div className="event-item">
                  <div className="event-icon">
                    <img src="https://i.pravatar.cc/100?img=11" alt="Carlos Ruiz" />
                  </div>
                  <div className="event-content">
                    <div className="event-title">Carlos Ruiz</div>
                    <div className="event-time">
                      <i className="far fa-clock"></i> Ayer - 5 eventos
                    </div>
                  </div>
                  <div className="event-badge warning">Descanso</div>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Sidebar */}
          <div className="dashboard-sidebar">
            <div className="metrics-card">
              <h3 className="metrics-title">Métricas Mensuales</h3>
              <div className="metrics-amount">24.7%</div>
              <div className="metrics-subtitle">Tasa de Éxito</div>

              <div className="time-filter">
                <button className="time-option">Día</button>
                <button className="time-option">Semana</button>
                <button className="time-option active">Mes</button>
                <button className="time-option">Año</button>
              </div>

              <div className="chart-container">
                <div className="chart-placeholder">
                  <i className="fas fa-chart-line"></i>
                  <p>Gráfico de métricas</p>
                </div>
              </div>

              <div className="timeline">
                <div className="month">Sep</div>
                <div className="month">Oct</div>
                <div className="month">Nov</div>
                <div className="month active">Dic</div>
                <div className="month">Ene</div>
              </div>
            </div>

            <div className="alert-card">
              <div className="alert-info">
                <div className="alert-title">Alerta de Marea</div>
                <div className="alert-status">Alta</div>
              </div>
              <div className="alert-content">
                <p>Marea alta esperada para las 18:30</p>
                <div className="alert-time">En 2 horas 15 min</div>
              </div>
            </div>

            <div className="weather-card">
              <div className="weather-info">
                <div className="weather-temp">28°C</div>
                <div className="weather-desc">Soleado</div>
              </div>
              <div className="weather-icon">
                <i className="fas fa-sun"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}