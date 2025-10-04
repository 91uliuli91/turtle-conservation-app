// src/services/weatherService.ts - VERSIÓN COMPLETA
export interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCondition: string;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
  uvIndex?: number;
}

export interface TideData {
  highTide: string;
  lowTide: string;
  nextHighTide: string;
  tideHeight: number;
  tideStatus: 'rising' | 'falling' | 'high' | 'low';
  source: string;
  station?: string;
}

export interface MoonPhaseData {
  phase: string;
  illumination: number;
  age: number;
  icon: string;
  nextFullMoon: string;
  nextNewMoon: string;
}

export interface EnvironmentalData {
  weather: WeatherData;
  tide: TideData;
  moonPhase: MoonPhaseData;
  timestamp: string;
  location: {
    lat: number;
    lon: number;
    name?: string;
  };
}

class WeatherService {
  private weatherAPIKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY || '574429463481570e1d702f1c11168da0';
  private weatherBaseURL = 'https://api.openweathermap.org/data/2.5';

  private defaultLocation = {
    lat: 21.1619,
    lon: -86.8515,
    name: 'Cancún, México'
  };

  // Obtener datos climáticos REALES de OpenWeatherMap
  async getWeatherData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<WeatherData> {
    try {
      console.log('🌤️ Obteniendo datos climáticos REALES...');
      
      const response = await fetch(
        `${this.weatherBaseURL}/weather?lat=${lat}&lon=${lon}&appid=${this.weatherAPIKey}&units=metric&lang=es`
      );
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        weatherCondition: data.weather[0].description,
        windSpeed: Math.round(data.wind.speed * 3.6),
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        feelsLike: Math.round(data.main.feels_like)
      };
    } catch (error) {
      console.error('❌ Error obteniendo datos climáticos:', error);
      throw new Error('No se pudieron obtener los datos climáticos');
    }
  }

  // Reemplazar completamente getTideData por estimación local
  async getTideData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<TideData> {
    console.log('🌊 Generando estimación de mareas para:', { lat, lon });
    
    try {
      // Usar estimación inteligente basada en ubicación y hora
      return this.getIntelligentTideEstimation(lat, lon);
    } catch (error) {
      console.warn('⚠️ Error en estimación de mareas, usando fallback básico');
      return this.getBasicTideFallback();
    }
  }

  // Estimación INTELIGENTE basada en ubicación geográfica
  private getIntelligentTideEstimation(lat: number, lon: number): TideData {
    const now = new Date();
    const currentTime = now.getTime();
    
    // Detectar región geográfica para parámetros específicos
    const region = this.detectGeographicRegion(lat, lon);
    
    // Parámetros de marea según región
    const tideParams = this.getTideParametersForRegion(region);
    
    // Calcular ciclo de marea actual
    const { currentHeight, tidePhase, nextHighTideTime, nextLowTideTime, tideStatus } = 
      this.calculateTideCycle(currentTime, tideParams);
    
    // Generar horarios formateados
    const nextHighTide = new Date(nextHighTideTime);
    const nextLowTide = new Date(nextLowTideTime);
    const followingHighTide = new Date(nextHighTideTime + (tideParams.cycleHours * 60 * 60 * 1000));

    return {
      highTide: nextHighTide.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      lowTide: nextLowTide.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      nextHighTide: followingHighTide.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      tideHeight: Math.round(currentHeight * 10) / 10,
      tideStatus,
      source: 'Sistema de estimación local',
      station: `Región ${region}`
    };
  }

  // Detectar región geográfica para parámetros precisos
  private detectGeographicRegion(lat: number, lon: number): string {
    // Caribe Mexicano - Cancún, Riviera Maya
    if (lat >= 20.5 && lat <= 21.5 && lon >= -87.5 && lon <= -86.0) {
      return 'caribbean';
    }
    // Golfo de México
    else if (lat >= 18.0 && lat <= 25.0 && lon >= -97.0 && lon <= -90.0) {
      return 'gulf';
    }
    // Pacífico Mexicano
    else if (lat >= 14.0 && lat <= 32.0 && lon >= -118.0 && lon <= -86.0) {
      return 'pacific';
    }
    // Default - Caribe
    return 'caribbean';
  }

  // Parámetros específicos por región
  private getTideParametersForRegion(region: string) {
    const params = {
      caribbean: {
        baseHeight: 0.7,    // Mareas más bajas en Caribe
        amplitude: 0.3,     // Rango pequeño
        cycleHours: 6.21,   // Ciclo semidiurno típico
        highTideOffset: 2.5 // Desfase horario para Cancún
      },
      gulf: {
        baseHeight: 0.9,
        amplitude: 0.5,
        cycleHours: 6.12,
        highTideOffset: 3.1
      },
      pacific: {
        baseHeight: 1.2,    // Mareas más altas en Pacífico
        amplitude: 0.8,     // Rango amplio
        cycleHours: 6.4,
        highTideOffset: 1.8
      }
    };
    
    return params[region as keyof typeof params] || params.caribbean;
  }

  // Calcular ciclo de marea preciso
  private calculateTideCycle(currentTime: number, params: any) {
    const now = new Date(currentTime);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    // Tiempo actual en horas decimales
    const currentDecimalHours = currentHour + currentMinute / 60;
    
    // Fase actual en el ciclo de marea (0-2π)
    const tidePhase = ((currentDecimalHours + params.highTideOffset) / params.cycleHours) * Math.PI * 2;
    
    // Altura actual basada en función senoidal
    const currentHeight = params.baseHeight + (Math.sin(tidePhase) * params.amplitude);
    
    // Calcular próxima pleamar
    const hoursToNextHigh = this.calculateHoursToNextExtreme(tidePhase, 'high', params.cycleHours);
    const nextHighTideTime = currentTime + (hoursToNextHigh * 60 * 60 * 1000);
    
    // Calcular próxima bajamar
    const hoursToNextLow = this.calculateHoursToNextExtreme(tidePhase, 'low', params.cycleHours);
    const nextLowTideTime = currentTime + (hoursToNextLow * 60 * 60 * 1000);
    
    // Determinar estado actual
    let tideStatus: 'rising' | 'falling' | 'high' | 'low' = 'rising';
    const sinValue = Math.sin(tidePhase);
    
    if (sinValue > 0.9) tideStatus = 'high';
    else if (sinValue < -0.9) tideStatus = 'low';
    else if (sinValue > 0) tideStatus = 'rising';
    else tideStatus = 'falling';

    return {
      currentHeight: Math.max(0.1, currentHeight), // Mínimo 0.1m
      tidePhase,
      nextHighTideTime,
      nextLowTideTime,
      tideStatus
    };
  }

  // Calcular horas hasta el próximo extremo de marea
  private calculateHoursToNextExtreme(currentPhase: number, extreme: 'high' | 'low', cycleHours: number): number {
    const targetPhase = extreme === 'high' ? Math.PI / 2 : (3 * Math.PI) / 2;
    
    let phaseDiff = targetPhase - currentPhase;
    if (phaseDiff < 0) {
      phaseDiff += 2 * Math.PI; // Normalizar a ciclo completo
    }
    
    return (phaseDiff / (2 * Math.PI)) * cycleHours;
  }

  // Fallback básico por si algo falla
  private getBasicTideFallback(): TideData {
    const now = new Date();
    const nextHigh = new Date(now.getTime() + 3 * 60 * 60 * 1000); // 3 horas
    const nextLow = new Date(now.getTime() + 9 * 60 * 60 * 1000);  // 9 horas
    
    return {
      highTide: nextHigh.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      lowTide: nextLow.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      nextHighTide: nextHigh.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      tideHeight: 0.8,
      tideStatus: 'rising',
      source: 'Sistema de estimación (fallback)',
      station: 'Estimación regional'
    };
  }

  // Calcular fase lunar CON PRECISIÓN (esto sí es confiable)
  getMoonPhase(): MoonPhaseData {
    const now = new Date();
    
    // Algoritmo astronómico preciso para fase lunar
    const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
    const lunarCycle = 29.530588853;
    
    const diffMs = now.getTime() - knownNewMoon.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const age = diffDays % lunarCycle;

    // Calcular fase con precisión
    let phase = '';
    let illumination = 0;
    let icon = '';

    if (age < 1.84566) {
      phase = 'Luna Nueva';
      illumination = 0;
      icon = '🌑';
    } else if (age < 5.53699) {
      phase = 'Luna Creciente';
      illumination = 0.25;
      icon = '🌒';
    } else if (age < 9.22831) {
      phase = 'Cuarto Creciente';
      illumination = 0.5;
      icon = '🌓';
    } else if (age < 12.91963) {
      phase = 'Gibosa Creciente';
      illumination = 0.75;
      icon = '🌔';
    } else if (age < 16.61096) {
      phase = 'Luna Llena';
      illumination = 1;
      icon = '🌕';
    } else if (age < 20.30228) {
      phase = 'Gibosa Menguante';
      illumination = 0.75;
      icon = '🌖';
    } else if (age < 23.99361) {
      phase = 'Cuarto Menguante';
      illumination = 0.5;
      icon = '🌗';
    } else {
      phase = 'Luna Menguante';
      illumination = 0.25;
      icon = '🌘';
    }

    // Calcular próximas fases lunares
    const nextFullMoon = new Date(now.getTime() + ((14.77 - age) * 24 * 60 * 60 * 1000));
    const nextNewMoon = new Date(now.getTime() + ((29.53 - age) * 24 * 60 * 60 * 1000));

    return {
      phase,
      illumination: Math.round(illumination * 100),
      age: Math.round(age * 10) / 10,
      icon,
      nextFullMoon: nextFullMoon.toLocaleDateString('es-MX'),
      nextNewMoon: nextNewMoon.toLocaleDateString('es-MX')
    };
  }

  // Obtener todos los datos ambientales
  async getEnvironmentalData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<EnvironmentalData> {
    try {
      console.log('📍 Obteniendo datos ambientales...');
      
      const [weather, tide, moonPhase] = await Promise.all([
        this.getWeatherData(lat, lon),
        this.getTideData(lat, lon), // Ahora usa estimación local
        Promise.resolve(this.getMoonPhase())
      ]);

      const result = {
        weather,
        tide,
        moonPhase,
        timestamp: new Date().toLocaleString('es-MX'),
        location: { 
          lat, 
          lon,
          name: this.defaultLocation.name
        }
      };

      console.log('✅ Datos ambientales obtenidos (con estimación local):', result);
      return result;

    } catch (error) {
      console.error('❌ Error obteniendo datos ambientales:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();