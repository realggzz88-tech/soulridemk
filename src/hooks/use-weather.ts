import { useEffect, useState } from "react";
import { isOpenWeatherConfigured, publicEnv } from "@/lib/public-env";

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

export const getRidingAdvice = (conditions: string, temp: number, windSpeed: number): string => {
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

/** Stable stand-in used when no OpenWeather key is configured. Same coordinates always match. */
export function buildMockWeather(lat: number, lng: number): WeatherData {
  const seed = Math.abs((lat * 1000 + lng * 100) % 100);
  const conditions = seed < 20 ? "Clouds" : seed < 40 ? "Clear" : seed < 60 ? "Sunny" : seed < 80 ? "Partly Cloudy" : "Clear";
  const temp = 12 + Math.round(seed / 10);
  const windSpeed = 2 + (seed % 8);

  return {
    temp,
    tempMin: temp - 3,
    tempMax: temp + 4,
    description: conditions.toLowerCase(),
    icon: conditions === "Clear" || conditions === "Sunny" ? "01d" : conditions === "Clouds" ? "03d" : "02d",
    humidity: 50 + (seed % 30),
    windSpeed,
    conditions,
    ridingAdvice: getRidingAdvice(conditions, temp, windSpeed),
  };
}

function isAbortError(error: unknown): boolean {
  return error instanceof DOMException && error.name === "AbortError";
}

export const useWeather = (lat: number, lng: number) => {
  const configured = isOpenWeatherConfigured();
  const [weather, setWeather] = useState<WeatherData | null>(() =>
    configured ? null : buildMockWeather(lat, lng),
  );
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const apiKey = publicEnv.openWeatherApiKey;
    if (!isOpenWeatherConfigured(apiKey)) {
      setWeather(buildMockWeather(lat, lng));
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    let active = true;

    const fetchWeather = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${BASE_URL}?lat=${lat}&lon=${lng}&appid=${apiKey}&units=metric`,
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }

        const data = (await response.json()) as WeatherApiResponse;
        if (!active) return;

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
        if (!active || isAbortError(err)) return;
        setWeather(null);
        setError(err instanceof Error ? err.message : "Weather fetch failed");
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchWeather();

    return () => {
      active = false;
      controller.abort();
    };
  }, [lat, lng]);

  return { weather, loading, error };
};

/** @deprecated Prefer useWeather, which falls back to the same estimate when no API key is set. */
export const useMockWeather = (lat: number, lng: number) => {
  const [weather, setWeather] = useState<WeatherData | null>(() => buildMockWeather(lat, lng));

  useEffect(() => {
    setWeather(buildMockWeather(lat, lng));
  }, [lat, lng]);

  return { weather, loading: false, error: null as string | null };
};
