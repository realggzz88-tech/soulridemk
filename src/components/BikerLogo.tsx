import { motion } from "framer-motion";

interface BikerLogoProps {
  size?: number | "sm" | "md" | "lg";
}

const BikerLogo = ({ size = 40 }: BikerLogoProps) => {
  // Convert size prop to numeric value
  const numericSize = typeof size === 'number' 
    ? size 
    : size === 'sm' 
      ? 32 
      : size === 'md' 
        ? 48 
        : 64;

  return (
    <div className="relative" style={{ width: numericSize, height: numericSize }}>
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Wind/Speed lines */}
        <motion.path
          d="M5 45 Q15 43, 25 45"
          stroke="url(#windGradient)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M8 55 Q18 53, 30 55"
          stroke="url(#windGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.8, 0.3] }}
          transition={{ duration: 1.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M3 65 Q13 63, 28 65"
          stroke="url(#windGradient)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0.2] }}
          transition={{ duration: 2, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Motorcycle silhouette - leaning forward */}
        <g transform="translate(25, 30)">
          {/* Back wheel */}
          <circle cx="10" cy="40" r="12" fill="#1a1a2e" stroke="#10B981" strokeWidth="2" />
          <circle cx="10" cy="40" r="6" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.5" />
          
          {/* Front wheel */}
          <circle cx="55" cy="40" r="12" fill="#1a1a2e" stroke="#10B981" strokeWidth="2" />
          <circle cx="55" cy="40" r="6" fill="none" stroke="#10B981" strokeWidth="1" opacity="0.5" />
          
          {/* Bike body/frame - angled forward */}
          <path
            d="M10 40 L25 20 L45 18 L55 40"
            stroke="#10B981"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Engine block */}
          <path
            d="M20 35 L35 32 L35 40 L20 40 Z"
            fill="#10B981"
            opacity="0.3"
          />
          
          {/* Rider silhouette - leaning forward aggressively */}
          <path
            d="M25 20 Q30 5, 40 8 L50 12 Q55 8, 52 5"
            stroke="white"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          {/* Helmet */}
          <ellipse cx="52" cy="6" rx="6" ry="5" fill="white" opacity="0.9" />
          {/* Arms on handlebars */}
          <path
            d="M42 12 L48 16"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>

        {/* Floating leaves */}
        <motion.g
          initial={{ x: -10, y: 0, rotate: 0 }}
          animate={{ x: [0, 15, 5], y: [-5, 5, -3], rotate: [0, 45, 15] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M20 25 Q25 20, 30 25 Q25 30, 20 25"
            fill="#10B981"
            opacity="0.8"
          />
        </motion.g>
        
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: [0, 20, 10], y: [0, -8, 4], rotate: [0, -30, -10] }}
          transition={{ duration: 2.5, delay: 0.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M15 35 Q18 32, 22 35 Q18 38, 15 35"
            fill="#00D4B4"
            opacity="0.6"
          />
        </motion.g>
        
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ x: [0, 25, 12], y: [0, 3, -2], rotate: [0, 60, 20] }}
          transition={{ duration: 3.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M12 50 Q16 46, 20 50 Q16 54, 12 50"
            fill="#10B981"
            opacity="0.5"
          />
        </motion.g>

        {/* Small particle dots */}
        <motion.circle
          cx="18"
          cy="42"
          r="1.5"
          fill="#00D4B4"
          animate={{ opacity: [0.3, 1, 0.3], x: [0, 8, 4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <motion.circle
          cx="22"
          cy="58"
          r="1"
          fill="#10B981"
          animate={{ opacity: [0.5, 1, 0.5], x: [0, 10, 5] }}
          transition={{ duration: 2.5, delay: 0.3, repeat: Infinity }}
        />

        <defs>
          <linearGradient id="windGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" stopOpacity="0" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#00D4B4" stopOpacity="0.3" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default BikerLogo;
