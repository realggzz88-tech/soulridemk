import { motion } from "framer-motion";

interface BikerLogoProps {
  size?: number | "sm" | "md" | "lg";
}

const BikerLogo = ({ size = 40 }: BikerLogoProps) => {
  const numericSize = typeof size === 'number' 
    ? size 
    : size === 'sm' 
      ? 32 
      : size === 'md' 
        ? 48 
        : 72;

  return (
    <div className="relative logo-glow" style={{ width: numericSize, height: numericSize }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Distressed background circle - like an old patch */}
        <circle 
          cx="50" 
          cy="50" 
          r="46" 
          fill="none" 
          stroke="#0EA5E9" 
          strokeWidth="1.5" 
          strokeDasharray="4,2"
          opacity="0.3"
        />
        <circle 
          cx="50" 
          cy="50" 
          r="42" 
          fill="none" 
          stroke="#0EA5E9" 
          strokeWidth="0.5"
          opacity="0.2"
        />

        {/* Hand-drawn style wind/speed lines */}
        <motion.path
          d="M8 42 Q14 40, 22 43 Q28 45, 32 42"
          stroke="url(#windGradientVintage)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M5 52 Q12 50, 20 52 Q26 54, 30 51"
          stroke="url(#windGradientVintage)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 2.2, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M10 62 Q16 60, 25 63"
          stroke="url(#rustGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0.2] }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Classic motorcycle silhouette - vintage style */}
        <g transform="translate(28, 28)" filter="url(#vintageGlow)">
          {/* Back wheel - thicker, more substantial */}
          <circle cx="8" cy="40" r="11" fill="#0F172A" stroke="#0EA5E9" strokeWidth="2.5" />
          <circle cx="8" cy="40" r="7" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.4" />
          <circle cx="8" cy="40" r="3" fill="#0EA5E9" opacity="0.2" />
          {/* Spokes */}
          <line x1="8" y1="29" x2="8" y2="51" stroke="#0EA5E9" strokeWidth="0.5" opacity="0.3" />
          <line x1="-3" y1="40" x2="19" y2="40" stroke="#0EA5E9" strokeWidth="0.5" opacity="0.3" />
          
          {/* Front wheel */}
          <circle cx="52" cy="40" r="11" fill="#0F172A" stroke="#0EA5E9" strokeWidth="2.5" />
          <circle cx="52" cy="40" r="7" fill="none" stroke="#0EA5E9" strokeWidth="0.8" opacity="0.4" />
          <circle cx="52" cy="40" r="3" fill="#0EA5E9" opacity="0.2" />
          <line x1="52" y1="29" x2="52" y2="51" stroke="#0EA5E9" strokeWidth="0.5" opacity="0.3" />
          <line x1="41" y1="40" x2="63" y2="40" stroke="#0EA5E9" strokeWidth="0.5" opacity="0.3" />
          
          {/* Bike frame - chunky classic look */}
          <path
            d="M8 40 L18 25 L38 22 L52 40"
            stroke="#0EA5E9"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Tank - vintage rounded */}
          <ellipse cx="26" cy="24" rx="8" ry="5" fill="#0F172A" stroke="#0EA5E9" strokeWidth="1.5" />
          <path d="M20 24 Q26 20, 32 24" stroke="#C2410C" strokeWidth="1" fill="none" opacity="0.6" />
          
          {/* Engine - blocky vintage */}
          <rect x="15" y="30" width="18" height="12" rx="2" fill="url(#engineGradientVintage)" opacity="0.4" />
          <line x1="18" y1="36" x2="30" y2="36" stroke="#0EA5E9" strokeWidth="0.5" opacity="0.3" />
          
          {/* Exhaust pipe with rust */}
          <path d="M33 38 L45 42 L48 45" stroke="#C2410C" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.6" />
          
          {/* Rider silhouette - classic pose */}
          <path
            d="M22 22 Q28 8, 38 10 L48 14"
            stroke="#F5F5DC"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Helmet - round vintage */}
          <ellipse cx="48" cy="8" rx="6" ry="5.5" fill="#F5F5DC" opacity="0.95" />
          <path d="M44 9 Q48 12, 52 9" stroke="#0EA5E9" strokeWidth="1" fill="none" opacity="0.4" />
          {/* Arm */}
          <path d="M38 14 L46 18" stroke="#F5F5DC" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Scattered leaves/twigs - vintage muted colors */}
        <motion.g
          initial={{ x: -5, y: 0, rotate: 0 }}
          animate={{ x: [0, 12, 5], y: [-3, 3, -1], rotate: [0, 30, 10] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M18 28 Q22 24, 26 28 Q22 32, 18 28"
            fill="#0EA5E9"
            opacity="0.7"
          />
          {/* Leaf vein */}
          <path d="M21 28 L23 28" stroke="#0F172A" strokeWidth="0.5" opacity="0.4" />
        </motion.g>
        
        {/* Twig */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: [0, 18, 8], y: [0, -8, 2], rotate: [0, -25, -8] }}
          transition={{ duration: 3.5, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M14 38 L20 34 L24 36" stroke="#C2410C" strokeWidth="1.5" fill="none" opacity="0.5" strokeLinecap="round" />
          <circle cx="14" cy="38" r="2" fill="#0EA5E9" opacity="0.4" />
        </motion.g>
        
        {/* Small leaf */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: [0, 20, 10], y: [0, 5, -2], rotate: [0, 50, 20] }}
          transition={{ duration: 4.5, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M12 48 Q15 45, 18 48 Q15 51, 12 48"
            fill="#14B8A6"
            opacity="0.5"
          />
        </motion.g>
        
        {/* Dust/debris particles */}
        <motion.circle
          cx="20"
          cy="55"
          r="1.5"
          fill="#C2410C"
          animate={{ opacity: [0.3, 0.7, 0.3], x: [0, 8, 4] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        />
        <motion.circle
          cx="16"
          cy="35"
          r="1"
          fill="#0EA5E9"
          animate={{ opacity: [0.4, 0.8, 0.4], x: [0, 10, 5] }}
          transition={{ duration: 3, delay: 0.2, repeat: Infinity }}
        />
        <motion.circle
          cx="24"
          cy="45"
          r="0.8"
          fill="#14B8A6"
          animate={{ opacity: [0.2, 0.6, 0.2], x: [0, 12, 6] }}
          transition={{ duration: 2.8, delay: 0.5, repeat: Infinity }}
        />

        <defs>
          <linearGradient id="windGradientVintage" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0EA5E9" stopOpacity="0" />
            <stop offset="50%" stopColor="#0EA5E9" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#14B8A6" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="rustGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C2410C" stopOpacity="0" />
            <stop offset="50%" stopColor="#C2410C" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#B45309" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="engineGradientVintage" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0EA5E9" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
          <filter id="vintageGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default BikerLogo;
