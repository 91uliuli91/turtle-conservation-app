// src/services/weatherService.ts - VERSIÓN CON WORLD TIDES REAL
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
  
  // WorldTides API - DATOS REALES
  private tidesAPIKey = process.env.NEXT_PUBLIC_TIDES_API_KEY || '1de48ffd-5337-47c7-828f-d46b9f12525c';
  private tidesBaseURL = 'https://www.worldtides.info/api/v2';

  private defaultLocation = {
    lat: 21.1619,  // Cancún, México
    lon: -86.8515,
    name: 'Cancún, México'
  };

  // Obtener datos climáticos REALES
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

  // Obtener datos de mareas REALES de WorldTides
  async getTideData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<TideData> {
    try {
      console.log('🌊 Obteniendo datos REALES de mareas de WorldTides...');
      
      // WorldTides API para extremos de marea (pleamares y bajamares)
      const response = await fetch(
        `${this.tidesBaseURL}?extremes&lat=${lat}&lon=${lon}&key=${this.tidesAPIKey}`
      );

      if (!response.ok) {
        throw new Error(`WorldTides API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Datos REALES de WorldTides:', data);
      
      return this.processWorldTidesData(data, lat, lon);
      
    } catch (error) {
      console.error('❌ Error obteniendo datos de mareas REALES:', error);
      throw new Error('No se pudieron obtener los datos de mareas de WorldTides');
    }
  }

  // Procesar datos REALES de WorldTides
  private processWorldTidesData(tideData: any, lat: number, lon: number): TideData {
    const now = new Date();
    const currentTime = now.getTime();

    if (!tideData.extremes || tideData.extremes.length === 0) {
      throw new Error('No hay datos de mareas disponibles para esta ubicación');
    }

    // Encontrar la próxima pleamar (high tide) y bajamar (low tide)
    let nextHighTide: any = null;
    let nextLowTide: any = null;
    let currentTideHeight = 0;

    for (const extreme of tideData.extremes) {
      const tideTime = new Date(extreme.dt * 1000).getTime();
      
      if (extreme.type === 'High' && (!nextHighTide || tideTime < nextHighTide.dt * 1000)) {
        nextHighTide = extreme;
      }
      
      if (extreme.type === 'Low' && (!nextLowTide || tideTime < nextLowTide.dt * 1000)) {
        nextLowTide = extreme;
      }

      // Encontrar el evento de marea más cercano para altura actual
      if (Math.abs(tideTime - currentTime) < 2 * 60 * 60 * 1000) { // Dentro de 2 horas
        currentTideHeight = extreme.height;
      }
    }

    // Si no encontramos altura actual, usar la más reciente
    if (currentTideHeight === 0 && tideData.extremes.length > 0) {
      currentTideHeight = tideData.extremes[0].height;
    }

    // Determinar estado de la marea
    let tideStatus: 'rising' | 'falling' | 'high' | 'low' = 'rising';
    if (nextHighTide && nextLowTide) {
      const highTideTime = new Date(nextHighTide.dt * 1000).getTime();
      const lowTideTime = new Date(nextLowTide.dt * 1000).getTime();
      
      if (currentTime > highTideTime - 3600000 && currentTime < highTideTime + 3600000) {
        tideStatus = 'high';
      } else if (currentTime > lowTideTime - 3600000 && currentTime < lowTideTime + 3600000) {
        tideStatus = 'low';
      } else if (currentTime < highTideTime) {
        tideStatus = 'rising';
      } else {
        tideStatus = 'falling';
      }
    }

    return {
      highTide: nextHighTide ? new Date(nextHighTide.dt * 1000).toLocaleTimeString('es-MX', { 
        hour: '2-digit', minute: '2-digit' 
      }) : '--:--',
      
      lowTide: nextLowTide ? new Date(nextLowTide.dt * 1000).toLocaleTimeString('es-MX', { 
        hour: '2-digit', minute: '2-digit' 
      }) : '--:--',
      
      nextHighTide: nextHighTide ? new Date(nextHighTide.dt * 1000).toLocaleTimeString('es-MX', { 
        hour: '2-digit', minute: '2-digit' 
      }) : '--:--',
      
      tideHeight: Math.round(currentTideHeight * 10) / 10,
      tideStatus,
      source: 'WorldTides',
      station: tideData.station || 'Estación más cercana'
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

  // Obtener todos los datos ambientales REALES
  async getEnvironmentalData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<EnvironmentalData> {
    try {
      console.log('📍 Obteniendo datos ambientales REALES para:', { lat, lon });
      
      const [weather, tide, moonPhase] = await Promise.all([
        this.getWeatherData(lat, lon),
        this.getTideData(lat, lon),
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

      console.log('✅ Todos los datos REALES obtenidos:', result);
      return result;

    } catch (error) {
      console.error('❌ Error obteniendo datos ambientales REALES:', error);
      throw error;
    }
  }

  // Método para obtener pronóstico de mareas (extendido)
  async getTideForecast(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon, days: number = 3) {
    try {
      const response = await fetch(
        `${this.tidesBaseURL}?extremes&lat=${lat}&lon=${lon}&length=${days * 24 * 60}&key=${this.tidesAPIKey}`
      );

      if (!response.ok) {
        throw new Error(`WorldTides forecast error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error obteniendo pronóstico de mareas:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();