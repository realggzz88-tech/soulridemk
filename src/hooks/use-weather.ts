import { useState, useEffect } from "react";

// OpenWeatherMap API - replace with your own key
const API_KEY = "YOUR_API_KEY";
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export interface WeatherData {
  temp: number;
  tempMin: number;
  tempMax: number;
  description: string;
  icon: string;
  humidity: number;
  windSpeed: number;
  conditions: string;
  ridingAdvice: string;
}

interface WeatherApiResponse {
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
  };
}

const getRidingAdvice = (conditions: string, temp: number, windSpeed: number): string => {
  const lowerConditions = conditions.toLowerCase();
  
  if (lowerConditions.includes("rain") || lowerConditions.includes("drizzle")) {
    return "⚠️ Wet roads ahead – ride with caution and reduce speed";
  }
  if (lowerConditions.includes("thunderstorm")) {
    return "🌩️ Storm warning – consider postponing your ride";
  }
  if (lowerConditions.includes("snow") || lowerConditions.includes("sleet")) {
    return "❄️ Icy conditions possible – winter gear essential";
  }
  if (lowerConditions.includes("fog") || lowerConditions.includes("mist")) {
    return "🌫️ Low visibility – use fog lights and ride slow";
  }
  if (windSpeed > 10) {
    return "💨 Strong winds – expect gusts on mountain passes";
  }
  if (temp > 30) {
    return "☀️ Hot day – stay hydrated and take shade breaks";
  }
  if (temp < 5) {
    return "🥶 Cold conditions – layer up and watch for ice";
  }
  if (lowerConditions.includes("clear") || lowerConditions.includes("sun")) {
    return "🏍️ Perfect riding weather – enjoy the journey!";
  }
  if (lowerConditions.includes("cloud")) {
    return "☁️ Mild conditions – great for scenic rides";
  }
  
  return "🛣️ Check local conditions before setting off";
};

export const useWeather = (lat: number, lng: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      // Skip if using placeholder key
      if (API_KEY === "YOUR_API_KEY") {
        setLoading(false);
        setError("API key not configured");
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}?lat=${lat}&lon=${lng}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data: WeatherApiResponse = await response.json();
        
        const conditions = data.weather[0]?.main || "Unknown";
        const temp = Math.round(data.main.temp);
        const windSpeed = data.wind.speed;

        setWeather({
          temp,
          tempMin: Math.round(data.main.temp_min),
          tempMax: Math.round(data.main.temp_max),
          description: data.weather[0]?.description || "Unknown",
          icon: data.weather[0]?.icon || "01d",
          humidity: data.main.humidity,
          windSpeed,
          conditions,
          ridingAdvice: getRidingAdvice(conditions, temp, windSpeed),
        });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Weather fetch failed");
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [lat, lng]);

  return { weather, loading, error };
};

// Mock weather for demo when API key not configured
export const useMockWeather = (lat: number, lng: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    // Generate consistent "random" weather based on coordinates
    const seed = Math.abs((lat * 1000 + lng * 100) % 100);
    const conditions = seed < 20 ? "Clouds" : seed < 40 ? "Clear" : seed < 60 ? "Sunny" : seed < 80 ? "Partly Cloudy" : "Clear";
    const temp = 12 + Math.round(seed / 10);
    const windSpeed = 2 + (seed % 8);

    setWeather({
      temp,
      tempMin: temp - 3,
      tempMax: temp + 4,
      description: conditions.toLowerCase(),
      icon: conditions === "Clear" || conditions === "Sunny" ? "01d" : conditions === "Clouds" ? "03d" : "02d",
      humidity: 50 + (seed % 30),
      windSpeed,
      conditions,
      ridingAdvice: getRidingAdvice(conditions, temp, windSpeed),
    });
  }, [lat, lng]);

  return { weather, loading: false, error: null };
};
