// src/components/DashboardContent.tsx
'use client';
import Link from 'next/link'; // Importamos Link de Next.js para navegación entre páginas

export default function DashboardContent() {
  return (
    <div className="dashboard-container-grid">
      {/* Main Dashboard Content */}
      <div className="dashboard-main">
        {/* Stats Cards - Tarjetas con estadísticas */}
        <div className="stats-cards">
          {/* Card 1: Nidos Registrados */}
          <div className="stat-card">
            <div className="card-icon">
              <i className="fas fa-egg"></i>
            </div>
            <p className="card-title">Nidos Registrados</p>
            <h2 className="card-amount">24</h2>
            <div className="card-trend positive">+12% este mes</div>
          </div>

          {/* Card 2: Tortugas Avistadas */}
          <div className="stat-card">
            <div className="card-icon">
              <i className="fas fa-turtle"></i>
            </div>
            <p className="card-title">Tortugas Avistadas</p>
            <h2 className="card-amount">156</h2>
            <div className="card-trend positive">+8% este mes</div>
          </div>

          {/* Card 3: Crías Liberadas */}
          <div className="stat-card">
            <div className="card-icon">
              <i className="fas fa-baby"></i>
            </div>
            <p className="card-title">Crías Liberadas</p>
            <h2 className="card-amount">1,240</h2>
            <div className="card-trend positive">+15% este mes</div>
          </div>
        </div>

        {/* Campaign Card - Información de la campaña actual */}
        <div className="campaign-card">
          <div className="campaign-info">
            <h2 className="campaign-title">Temporada de Anidación 2024</h2>
            <p className="campaign-desc">
              Estamos en el pico de la temporada de anidación. Mantén un registro 
              detallado de cada evento para mejorar nuestros programas de conservación.
            </p>
            <button className="campaign-btn">
              <i className="fas fa-plus"></i>
              Registrar Nuevo Evento
            </button>
          </div>

          {/* Campamento Tamul - Detalles */}
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

          {/* Actividad del Equipo */}
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
        {/* Metrics Card - Tasa de éxito mensual */}
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

        {/* Alert Card - Alerta de marea */}
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

        {/* Weather Card - Información del clima */}
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
  );
}
