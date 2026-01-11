// src/services/weatherService.ts - VERSIÓN MULTI-API
export interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCondition: string;
  windSpeed: number;
  pressure: number;
  visibility: number;
  feelsLike: number;
  uvIndex?: number;
  accuracy?: 'high' | 'medium' | 'low';
  calibrated?: boolean;
  sources?: string[];
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
  // 🔑 MÚLTIPLES APIs GRATUITAS
  private apiKeys = {
    openWeather: process.env.NEXT_PUBLIC_WEATHER_API_KEY || '574429463481570e1d702f1c11168da0',
    weatherApi: process.env.NEXT_PUBLIC_WEATHERAPI_KEY || 'a45b649893284f0a857134612242512', // Gratis 1M llamadas/mes
    openMeteo: 'none' // No requiere API key
  };

  private baseURLs = {
    openWeather: 'https://api.openweathermap.org/data/2.5',
    weatherApi: 'https://api.weatherapi.com/v1',
    openMeteo: 'https://api.open-meteo.com/v1'
  };

  private defaultLocation = {
    lat: 21.1619,
    lon: -86.8515,
    name: 'Cancún, México'
  };

  // 🚀 Obtener datos de MÚLTIPLES fuentes
  async getWeatherData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<WeatherData> {
    try {
      console.log('🌤️ Obteniendo datos de MÚLTIPLES APIs...');
      
      // Obtener datos de todas las APIs en paralelo (WeatherAPI deshabilitada temporalmente)
      const [openWeatherData, openMeteoData] = await Promise.allSettled([
        this.getOpenWeatherData(lat, lon),
        // this.getWeatherApiData(lat, lon), // ❌ Deshabilitada - API key expirada
        this.getOpenMeteoData(lat, lon)
      ]);

      const validResults = [];
      const sources = [];

      // Procesar resultados exitosos
      if (openWeatherData.status === 'fulfilled') {
        validResults.push(openWeatherData.value);
        sources.push('OpenWeather');
      }
      // WeatherAPI deshabilitada temporalmente
      // if (weatherApiData.status === 'fulfilled') {
      //   validResults.push(weatherApiData.value);
      //   sources.push('WeatherAPI');
      // }
      if (openMeteoData.status === 'fulfilled') {
        validResults.push(openMeteoData.value);
        sources.push('OpenMeteo');
      }

      if (validResults.length === 0) {
        throw new Error('Todas las APIs fallaron');
      }

      console.log(`✅ ${validResults.length} APIs respondieron:`, sources);

      // Combinar y promediar resultados
      return this.combineWeatherData(validResults, sources);
      
    } catch (error) {
      console.error('❌ Error con APIs múltiples:', error);
      // Fallback a una sola API
      return this.getOpenWeatherData(lat, lon);
    }
  }

  // 🌐 OPENWEATHERMAP (tu API actual)
  private async getOpenWeatherData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseURLs.openWeather}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKeys.openWeather}&units=metric&lang=es`
      );
      
      if (!response.ok) throw new Error(`OpenWeather: ${response.status}`);
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.main.temp),
        humidity: data.main.humidity,
        weatherCondition: data.weather[0].description,
        windSpeed: Math.round(data.wind.speed * 3.6),
        pressure: data.main.pressure,
        visibility: data.visibility / 1000,
        feelsLike: Math.round(data.main.feels_like),
        accuracy: 'medium'
      };
    } catch (error) {
      console.warn('⚠️ OpenWeather falló:', error);
      throw error;
    }
  }

  // 🌡️ WEATHERAPI.COM (MUY PRECISA - gratis 1M llamadas/mes)
  private async getWeatherApiData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseURLs.weatherApi}/current.json?key=${this.apiKeys.weatherApi}&q=${lat},${lon}&lang=es`
      );
      
      if (!response.ok) throw new Error(`WeatherAPI: ${response.status}`);
      
      const data = await response.json();
      
      return {
        temperature: Math.round(data.current.temp_c),
        humidity: data.current.humidity,
        weatherCondition: data.current.condition.text,
        windSpeed: Math.round(data.current.wind_kph),
        pressure: Math.round(data.current.pressure_mb),
        visibility: data.current.vis_km,
        feelsLike: Math.round(data.current.feelslike_c),
        uvIndex: data.current.uv,
        accuracy: 'high' // WeatherAPI es conocida por su precisión
      };
    } catch (error) {
      console.warn('⚠️ WeatherAPI falló:', error);
      throw error;
    }
  }

  // 📊 OPENMETEO (gratis, sin API key, buena precisión)
  private async getOpenMeteoData(lat: number, lon: number): Promise<WeatherData> {
    try {
      const response = await fetch(
        `${this.baseURLs.openMeteo}/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,surface_pressure,wind_speed_10m,weather_code&timezone=auto`
      );
      
      if (!response.ok) throw new Error(`OpenMeteo: ${response.status}`);
      
      const data = await response.json();
      const current = data.current;
      
      return {
        temperature: Math.round(current.temperature_2m),
        humidity: current.relative_humidity_2m,
        weatherCondition: this.mapWeatherCode(current.weather_code),
        windSpeed: Math.round(current.wind_speed_10m * 3.6), // m/s to km/h
        pressure: Math.round(current.surface_pressure),
        visibility: 10, // OpenMeteo no tiene visibilidad
        feelsLike: Math.round(current.temperature_2m), // Aproximación
        accuracy: 'medium'
      };
    } catch (error) {
      console.warn('⚠️ OpenMeteo falló:', error);
      throw error;
    }
  }

  // 🗺️ Mapear códigos de clima de OpenMeteo
  private mapWeatherCode(code: number): string {
    const weatherMap: { [key: number]: string } = {
      0: 'Despejado',
      1: 'Principalmente despejado',
      2: 'Parcialmente nublado',
      3: 'Nublado',
      45: 'Niebla',
      48: 'Niebla escarchada',
      51: 'Llovizna ligera',
      53: 'Llovizna moderada',
      55: 'Llovizna densa',
      61: 'Lluvia ligera',
      63: 'Lluvia moderada',
      65: 'Lluvia intensa',
      80: 'Chubascos ligeros',
      81: 'Chubascos moderados',
      82: 'Chubascos fuertes',
      95: 'Tormenta eléctrica'
    };
    
    return weatherMap[code] || 'Condiciones desconocidas';
  }

  // 🔄 COMBINAR DATOS DE MÚLTIPLES FUENTES
  private combineWeatherData(results: WeatherData[], sources: string[]): WeatherData {
    // Promediar temperaturas (ponderado por precisión)
    const tempWeights = results.map(r => r.accuracy === 'high' ? 2 : 1);
    const totalWeight = tempWeights.reduce((sum, w) => sum + w, 0);
    
    const avgTemp = Math.round(
      results.reduce((sum, r, i) => sum + r.temperature * tempWeights[i], 0) / totalWeight
    );

    // Promediar humedad
    const avgHumidity = Math.round(
      results.reduce((sum, r) => sum + r.humidity, 0) / results.length
    );

    // Usar la presión más común (evitar outliers)
    const pressures = results.map(r => r.pressure);
    const avgPressure = Math.round(
      pressures.reduce((sum, p) => sum + p, 0) / pressures.length
    );

    // Usar la condición del tiempo de la fuente más precisa
    const bestSource = results.find(r => r.accuracy === 'high') || results[0];
    
    // Calcular sensación térmica mejorada
    const feelsLike = this.calculateImprovedFeelsLike(avgTemp, avgHumidity, bestSource.windSpeed);

    return {
      temperature: avgTemp,
      humidity: avgHumidity,
      weatherCondition: bestSource.weatherCondition,
      windSpeed: bestSource.windSpeed,
      pressure: avgPressure,
      visibility: bestSource.visibility,
      feelsLike: feelsLike,
      uvIndex: bestSource.uvIndex,
      accuracy: results.length >= 2 ? 'high' : 'medium',
      calibrated: results.length > 1,
      sources: sources
    };
  }

  // 🔥 CÁLCULO MEJORADO DE SENSACIÓN TÉRMICA
  private calculateImprovedFeelsLike(temp: number, humidity: number, windSpeed: number): number {
    if (temp >= 27 && humidity >= 40) {
      // Índice de calor para clima cálido/húmedo
      const heatIndex = 
        0.5 * (temp + 61.0 + ((temp - 68.0) * 1.2) + (humidity * 0.094));
      
      return Math.round(Math.max(temp, heatIndex));
    } else if (temp <= 10 && windSpeed >= 5) {
      // Wind chill para clima frío/ventoso
      const windChill = 
        13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed, 0.16) + 
        0.3965 * temp * Math.pow(windSpeed, 0.16);
      
      return Math.round(Math.min(temp, windChill));
    }
    
    return temp;
  }

  // 🎯 MÉTODO PARA COMPARAR APIs (útil para debugging)
  async compareApis(lat: number, lon: number) {
    try {
      const [openWeather, weatherApi, openMeteo] = await Promise.allSettled([
        this.getOpenWeatherData(lat, lon),
        this.getWeatherApiData(lat, lon),
        this.getOpenMeteoData(lat, lon)
      ]);

      const comparison = {
        openWeather: openWeather.status === 'fulfilled' ? openWeather.value : 'Failed',
        weatherApi: weatherApi.status === 'fulfilled' ? weatherApi.value : 'Failed',
        openMeteo: openMeteo.status === 'fulfilled' ? openMeteo.value : 'Failed',
        combined: await this.getWeatherData(lat, lon)
      };

      console.log('🔍 Comparación de APIs:', comparison);
      return comparison;
    } catch (error) {
      console.error('Error en comparación:', error);
      return null;
    }
  }

  // 🌊 TUS MÉTODOS ORIGINALES DE MAREAS Y LUNA (se mantienen igual)
  async getTideData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<TideData> {
    console.log('🌊 Generando estimación de mareas para:', { lat, lon });
    
    try {
      return this.getIntelligentTideEstimation(lat, lon);
    } catch (error) {
      console.warn('⚠️ Error en estimación de mareas, usando fallback básico');
      return this.getBasicTideFallback();
    }
  }

  private getIntelligentTideEstimation(lat: number, lon: number): TideData {
    const now = new Date();
    const currentTime = now.getTime();
    
    const region = this.detectGeographicRegion(lat, lon);
    const tideParams = this.getTideParametersForRegion(region);
    
    const { currentHeight, tidePhase, nextHighTideTime, nextLowTideTime, tideStatus } = 
      this.calculateTideCycle(currentTime, tideParams);
    
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

  private detectGeographicRegion(lat: number, lon: number): string {
    if (lat >= 20.5 && lat <= 21.5 && lon >= -87.5 && lon <= -86.0) {
      return 'caribbean';
    }
    else if (lat >= 18.0 && lat <= 25.0 && lon >= -97.0 && lon <= -90.0) {
      return 'gulf';
    }
    else if (lat >= 14.0 && lat <= 32.0 && lon >= -118.0 && lon <= -86.0) {
      return 'pacific';
    }
    return 'caribbean';
  }

  private getTideParametersForRegion(region: string) {
    const params = {
      caribbean: {
        baseHeight: 0.7,
        amplitude: 0.3,
        cycleHours: 6.21,
        highTideOffset: 2.5
      },
      gulf: {
        baseHeight: 0.9,
        amplitude: 0.5,
        cycleHours: 6.12,
        highTideOffset: 3.1
      },
      pacific: {
        baseHeight: 1.2,
        amplitude: 0.8,
        cycleHours: 6.4,
        highTideOffset: 1.8
      }
    };
    
    return params[region as keyof typeof params] || params.caribbean;
  }

  private calculateTideCycle(currentTime: number, params: any) {
    const now = new Date(currentTime);
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const currentDecimalHours = currentHour + currentMinute / 60;
    const tidePhase = ((currentDecimalHours + params.highTideOffset) / params.cycleHours) * Math.PI * 2;
    const currentHeight = params.baseHeight + (Math.sin(tidePhase) * params.amplitude);
    
    const hoursToNextHigh = this.calculateHoursToNextExtreme(tidePhase, 'high', params.cycleHours);
    const nextHighTideTime = currentTime + (hoursToNextHigh * 60 * 60 * 1000);
    
    const hoursToNextLow = this.calculateHoursToNextExtreme(tidePhase, 'low', params.cycleHours);
    const nextLowTideTime = currentTime + (hoursToNextLow * 60 * 60 * 1000);
    
    let tideStatus: 'rising' | 'falling' | 'high' | 'low' = 'rising';
    const sinValue = Math.sin(tidePhase);
    
    if (sinValue > 0.9) tideStatus = 'high';
    else if (sinValue < -0.9) tideStatus = 'low';
    else if (sinValue > 0) tideStatus = 'rising';
    else tideStatus = 'falling';

    return {
      currentHeight: Math.max(0.1, currentHeight),
      tidePhase,
      nextHighTideTime,
      nextLowTideTime,
      tideStatus
    };
  }

  private calculateHoursToNextExtreme(currentPhase: number, extreme: 'high' | 'low', cycleHours: number): number {
    const targetPhase = extreme === 'high' ? Math.PI / 2 : (3 * Math.PI) / 2;
    
    let phaseDiff = targetPhase - currentPhase;
    if (phaseDiff < 0) {
      phaseDiff += 2 * Math.PI;
    }
    
    return (phaseDiff / (2 * Math.PI)) * cycleHours;
  }

  private getBasicTideFallback(): TideData {
    const now = new Date();
    const nextHigh = new Date(now.getTime() + 3 * 60 * 60 * 1000);
    const nextLow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    
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

  getMoonPhase(): MoonPhaseData {
    const now = new Date();
    const knownNewMoon = new Date(2000, 0, 6, 18, 14, 0);
    const lunarCycle = 29.530588853;
    
    const diffMs = now.getTime() - knownNewMoon.getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    const age = diffDays % lunarCycle;

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

  async getEnvironmentalData(lat: number = this.defaultLocation.lat, lon: number = this.defaultLocation.lon): Promise<EnvironmentalData> {
    try {
      console.log('📍 Obteniendo datos ambientales MULTI-API...');
      
      const [weather, tide, moonPhase] = await Promise.all([
        this.getWeatherData(lat, lon), // ← ¡Ahora usa múltiples APIs!
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

      console.log('✅ Datos MULTI-API obtenidos:', {
        temp: weather.temperature,
        sources: weather.sources,
        accuracy: weather.accuracy
      });
      
      return result;

    } catch (error) {
      console.error('Error obteniendo datos ambientales:', error);
      throw error;
    }
  }
}

export const weatherService = new WeatherService();