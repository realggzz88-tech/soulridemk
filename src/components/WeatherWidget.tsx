import { useWeather } from "@/hooks/use-weather";
import { Cloud, Sun, CloudRain, CloudSnow, Wind, Thermometer, Droplets, CloudFog } from "lucide-react";
import { cn } from "@/lib/utils";

interface WeatherWidgetProps {
  lat: number;
  lng: number;
  spotName?: string;
  compact?: boolean;
}

const getWeatherIcon = (conditions: string, size: number = 24) => {
  const lowerConditions = conditions.toLowerCase();
  const iconClass = "transition-all duration-300";
  
  if (lowerConditions.includes("rain") || lowerConditions.includes("drizzle")) {
    return <CloudRain size={size} className={cn(iconClass, "text-mountain-blue")} style={{ filter: "drop-shadow(0 0 8px hsl(215 50% 55% / 0.6))" }} />;
  }
  if (lowerConditions.includes("snow") || lowerConditions.includes("sleet")) {
    return <CloudSnow size={size} className={cn(iconClass, "text-foreground/80")} style={{ filter: "drop-shadow(0 0 8px hsl(200 50% 80% / 0.6))" }} />;
  }
  if (lowerConditions.includes("fog") || lowerConditions.includes("mist")) {
    return <CloudFog size={size} className={cn(iconClass, "text-muted-foreground")} style={{ filter: "drop-shadow(0 0 6px hsl(220 10% 60% / 0.5))" }} />;
  }
  if (lowerConditions.includes("cloud")) {
    return <Cloud size={size} className={cn(iconClass, "text-foreground/70")} style={{ filter: "drop-shadow(0 0 6px hsl(220 10% 70% / 0.4))" }} />;
  }
  if (lowerConditions.includes("clear") || lowerConditions.includes("sun")) {
    return <Sun size={size} className={cn(iconClass, "text-soul-amber")} style={{ filter: "drop-shadow(0 0 12px hsl(32 85% 52% / 0.7))" }} />;
  }
  if (lowerConditions.includes("wind")) {
    return <Wind size={size} className={cn(iconClass, "text-earth-green-glow")} style={{ filter: "drop-shadow(0 0 8px hsl(160 50% 45% / 0.5))" }} />;
  }
  
  return <Sun size={size} className={cn(iconClass, "text-soul-amber")} style={{ filter: "drop-shadow(0 0 12px hsl(32 85% 52% / 0.7))" }} />;
};

const WeatherWidget = ({ lat, lng, spotName, compact = false }: WeatherWidgetProps) => {
  // Live OpenWeather when VITE_OPENWEATHER_API_KEY is set; otherwise a local estimate.
  const { weather, loading, error } = useWeather(lat, lng);

  if (loading) {
    return (
      <div className={cn(
        "rounded-xl border border-border/40 backdrop-blur-sm animate-pulse",
        compact ? "p-3" : "p-4"
      )}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-muted/50" />
          <div className="space-y-2">
            <div className="w-20 h-4 bg-muted/50 rounded" />
            <div className="w-32 h-3 bg-muted/30 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className={cn(
        "rounded-xl bg-muted/20 border border-border/30 backdrop-blur-sm",
        compact ? "p-3" : "p-4"
      )}>
        <div className="flex items-center gap-3">
          <Cloud size={compact ? 20 : 24} className="text-muted-foreground" />
          <div>
            <p className="text-sm text-muted-foreground">Weather unavailable</p>
            <p className="text-xs text-muted-foreground/70">Configure API key for live data</p>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/20 border border-border/30 backdrop-blur-sm">
        {getWeatherIcon(weather.conditions, 18)}
        <span className="text-sm font-medium">{weather.temp}°C</span>
        <span className="text-xs text-muted-foreground capitalize">{weather.description}</span>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 border border-border/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-background/50 border border-border/30">
              {getWeatherIcon(weather.conditions, 32)}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-display tracking-wide">{weather.temp}°C</span>
                <span className="text-sm text-muted-foreground capitalize">{weather.description}</span>
              </div>
              {spotName && (
                <p className="text-xs text-muted-foreground mt-1">Current conditions at {spotName}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-border/30">
        <div className="p-3 text-center">
          <Thermometer size={14} className="mx-auto mb-1 text-soul-amber" style={{ filter: "drop-shadow(0 0 4px hsl(32 85% 52% / 0.5))" }} />
          <p className="text-xs text-muted-foreground">High/Low</p>
          <p className="text-sm font-medium">{weather.tempMax}° / {weather.tempMin}°</p>
        </div>
        <div className="p-3 text-center">
          <Droplets size={14} className="mx-auto mb-1 text-mountain-blue" style={{ filter: "drop-shadow(0 0 4px hsl(215 50% 55% / 0.5))" }} />
          <p className="text-xs text-muted-foreground">Humidity</p>
          <p className="text-sm font-medium">{weather.humidity}%</p>
        </div>
        <div className="p-3 text-center">
          <Wind size={14} className="mx-auto mb-1 text-earth-green-glow" style={{ filter: "drop-shadow(0 0 4px hsl(160 50% 45% / 0.5))" }} />
          <p className="text-xs text-muted-foreground">Wind</p>
          <p className="text-sm font-medium">{weather.windSpeed} m/s</p>
        </div>
      </div>

      {/* Riding Advice */}
      <div className="p-3 bg-background/30 border-t border-border/30">
        <p className="text-sm text-center text-foreground/90 tracking-wide">
          {weather.ridingAdvice}
        </p>
      </div>
    </div>
  );
};

export default WeatherWidget;
