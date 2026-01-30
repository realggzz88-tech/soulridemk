import { cn } from "@/lib/utils";

interface MapLoadingSpinnerProps {
  className?: string;
  message?: string;
}

const MapLoadingSpinner = ({ className, message = "Loading map..." }: MapLoadingSpinnerProps) => {
  return (
    <div className={cn(
      "absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm",
      className
    )}>
      {/* Animated Road Line Spinner */}
      <div className="relative w-24 h-24 mb-4">
        {/* Outer ring */}
        <div 
          className="absolute inset-0 rounded-full border-2 border-border/30"
          style={{ boxShadow: 'inset 0 0 20px hsl(0 0% 0% / 0.3)' }}
        />
        
        {/* Animated road line */}
        <svg 
          className="absolute inset-0 animate-spin" 
          style={{ animationDuration: '3s' }}
          viewBox="0 0 100 100"
        >
          <defs>
            <linearGradient id="roadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(160, 50%, 45%)" stopOpacity="0" />
              <stop offset="30%" stopColor="hsl(160, 50%, 45%)" stopOpacity="1" />
              <stop offset="70%" stopColor="hsl(32, 85%, 52%)" stopOpacity="1" />
              <stop offset="100%" stopColor="hsl(32, 85%, 52%)" stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="url(#roadGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray="60 200"
          />
        </svg>
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <svg 
            width="28" 
            height="28" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1.5"
            className="text-earth-green-glow"
            style={{ filter: 'drop-shadow(0 0 8px hsl(160 50% 45% / 0.5))' }}
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
        
        {/* Pulsing glow effect */}
        <div 
          className="absolute inset-2 rounded-full animate-pulse"
          style={{ 
            background: 'radial-gradient(circle, hsl(160 40% 30% / 0.2) 0%, transparent 70%)',
            animationDuration: '2s'
          }}
        />
      </div>
      
      {/* Loading text */}
      <p className="text-sm text-muted-foreground tracking-wide animate-pulse">
        {message}
      </p>
      
      {/* Subtle road line animation at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
        <div 
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, transparent, hsl(160 50% 45% / 0.5), hsl(32 85% 52% / 0.4), transparent)',
            animation: 'roadSweep 2s ease-in-out infinite',
          }}
        />
      </div>
      
      <style>{`
        @keyframes roadSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default MapLoadingSpinner;
