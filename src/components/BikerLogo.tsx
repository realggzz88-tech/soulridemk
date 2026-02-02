import { motion } from "framer-motion";

interface BikerLogoProps {
  size?: number | "sm" | "md" | "lg";
}

const BikerLogo = ({ size = 40 }: BikerLogoProps) => {
  const numericSize = typeof size === 'number' 
    ? size 
    : size === 'sm' 
      ? 36 
      : size === 'md' 
        ? 56 
        : 80;

  return (
    <div className="relative logo-soul" style={{ width: numericSize, height: numericSize }}>
      <svg
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Embroidered patch background - stitching effect */}
        <circle 
          cx="60" 
          cy="60" 
          r="54" 
          fill="none" 
          stroke="#5F7A6A" 
          strokeWidth="2" 
          strokeDasharray="3,2"
          opacity="0.4"
        />
        <circle 
          cx="60" 
          cy="60" 
          r="50" 
          fill="none" 
          stroke="#8B7355" 
          strokeWidth="1"
          strokeDasharray="1,3"
          opacity="0.25"
        />
        
        {/* Inner stitching holes */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <circle
            key={i}
            cx={60 + 52 * Math.cos((angle * Math.PI) / 180)}
            cy={60 + 52 * Math.sin((angle * Math.PI) / 180)}
            r="1.5"
            fill="#8B7355"
            opacity="0.35"
          />
        ))}

        {/* Hand-sketched wind trails - pencil line feel */}
        <motion.path
          d="M12 48 Q20 45, 30 49 Q38 52, 42 48"
          stroke="url(#windSoul)"
          strokeWidth="1.8"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.6, 0.3] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M8 58 Q18 55, 28 59 Q36 62, 40 57"
          stroke="url(#windSoul)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.5, 0.2] }}
          transition={{ duration: 3.5, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.path
          d="M14 68 Q22 66, 32 70"
          stroke="url(#dustTrail)"
          strokeWidth="1.2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: [0, 0.4, 0.15] }}
          transition={{ duration: 4, delay: 0.8, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Classic motorcycle with rider - no helmet, wind in hair */}
        <g transform="translate(32, 30)" filter="url(#soulGlow)">
          {/* Back wheel - substantial classic look */}
          <circle cx="10" cy="48" r="13" fill="#1A1F1A" stroke="#5F7A6A" strokeWidth="2.5" />
          <circle cx="10" cy="48" r="8" fill="none" stroke="#5F7A6A" strokeWidth="0.8" opacity="0.3" />
          <circle cx="10" cy="48" r="3" fill="#5F7A6A" opacity="0.15" />
          {/* Spokes - hand-drawn feel */}
          <line x1="10" y1="35" x2="10" y2="61" stroke="#5F7A6A" strokeWidth="0.5" opacity="0.25" strokeDasharray="2,1" />
          <line x1="-3" y1="48" x2="23" y2="48" stroke="#5F7A6A" strokeWidth="0.5" opacity="0.25" strokeDasharray="2,1" />
          
          {/* Front wheel */}
          <circle cx="58" cy="48" r="13" fill="#1A1F1A" stroke="#5F7A6A" strokeWidth="2.5" />
          <circle cx="58" cy="48" r="8" fill="none" stroke="#5F7A6A" strokeWidth="0.8" opacity="0.3" />
          <circle cx="58" cy="48" r="3" fill="#5F7A6A" opacity="0.15" />
          <line x1="58" y1="35" x2="58" y2="61" stroke="#5F7A6A" strokeWidth="0.5" opacity="0.25" strokeDasharray="2,1" />
          <line x1="45" y1="48" x2="71" y2="48" stroke="#5F7A6A" strokeWidth="0.5" opacity="0.25" strokeDasharray="2,1" />
          
          {/* Bike frame - classic cruiser silhouette */}
          <path
            d="M10 48 L20 28 L42 24 L58 48"
            stroke="#5F7A6A"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          
          {/* Tank - classic rounded */}
          <ellipse cx="30" cy="26" rx="10" ry="6" fill="#1A1F1A" stroke="#5F7A6A" strokeWidth="1.5" />
          {/* Tank detail - rust accent */}
          <path d="M22 26 Q30 21, 38 26" stroke="#8B4513" strokeWidth="1" fill="none" opacity="0.5" />
          
          {/* Engine block - vintage */}
          <rect x="18" y="34" width="20" height="14" rx="2" fill="url(#engineSoul)" opacity="0.35" />
          <line x1="22" y1="41" x2="34" y2="41" stroke="#5F7A6A" strokeWidth="0.6" opacity="0.25" />
          
          {/* Exhaust - with rust patina */}
          <path d="M38 44 L52 50 L56 54" stroke="#8B4513" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.5" />
          
          {/* Rider - leaning into curve, no helmet, wind in hair */}
          <path
            d="M26 24 Q32 8, 44 10 L54 16"
            stroke="#F5F0E1"
            strokeWidth="2.5"
            fill="none"
            strokeLinecap="round"
          />
          
          {/* Head - bare, no helmet for freedom */}
          <ellipse cx="55" cy="8" rx="6" ry="5.5" fill="#F5F0E1" opacity="0.92" />
          
          {/* Hair flowing in wind - multiple strands */}
          <motion.path
            d="M52 4 Q48 -2, 42 0 Q38 2, 35 -1"
            stroke="#8B7355"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0.8 }}
            animate={{ pathLength: [0.8, 1, 0.8], d: [
              "M52 4 Q48 -2, 42 0 Q38 2, 35 -1",
              "M52 4 Q47 -3, 41 -1 Q37 1, 33 -2",
              "M52 4 Q48 -2, 42 0 Q38 2, 35 -1"
            ]}}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M54 5 Q50 0, 45 2 Q40 4, 36 2"
            stroke="#8B7355"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
            opacity="0.7"
            animate={{ d: [
              "M54 5 Q50 0, 45 2 Q40 4, 36 2",
              "M54 5 Q49 -1, 44 1 Q39 3, 34 0",
              "M54 5 Q50 0, 45 2 Q40 4, 36 2"
            ]}}
            transition={{ duration: 2.8, delay: 0.2, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M53 6 Q49 3, 44 5"
            stroke="#8B7355"
            strokeWidth="1"
            fill="none"
            strokeLinecap="round"
            opacity="0.5"
            animate={{ d: [
              "M53 6 Q49 3, 44 5",
              "M53 6 Q48 2, 43 4",
              "M53 6 Q49 3, 44 5"
            ]}}
            transition={{ duration: 3, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Arm on handlebars */}
          <path d="M44 14 L52 20" stroke="#F5F0E1" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Flowing leaves - oak/pine/forest types with soul */}
        {/* Large oak leaf */}
        <motion.g
          initial={{ x: -5, y: 0, rotate: 0 }}
          animate={{ 
            x: [0, 15, 8], 
            y: [-4, 4, -2], 
            rotate: [0, 25, 10] 
          }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M20 32 Q25 26, 30 30 Q28 34, 32 38 Q26 40, 24 36 Q20 38, 20 32"
            fill="url(#leafSage)"
            opacity="0.75"
          />
          {/* Leaf vein */}
          <path d="M25 32 L26 36" stroke="#3A4A3D" strokeWidth="0.5" opacity="0.4" />
        </motion.g>
        
        {/* Pine needle cluster */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ 
            x: [0, 20, 10], 
            y: [0, -6, 3], 
            rotate: [0, -30, -12] 
          }}
          transition={{ duration: 5, delay: 0.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M16 44 L24 42 L16 46 L24 45 L17 48" stroke="#5F7A6A" strokeWidth="1.2" fill="none" opacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
        </motion.g>
        
        {/* Small round leaf */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ 
            x: [0, 25, 12], 
            y: [0, 8, -1], 
            rotate: [5, 55, 20] 
          }}
          transition={{ duration: 5.5, delay: 1, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M14 56 Q18 52, 22 56 Q18 60, 14 56"
            fill="#6B8E23"
            opacity="0.55"
          />
        </motion.g>
        
        {/* Maple-style leaf */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 10 }}
          animate={{ 
            x: [0, 18, 8], 
            y: [-2, 6, 1], 
            rotate: [10, -20, 5] 
          }}
          transition={{ duration: 4, delay: 0.3, repeat: Infinity, ease: "easeInOut" }}
        >
          <path
            d="M24 48 L28 44 L30 48 L34 45 L32 50 L36 52 L30 52 L28 56 L26 52 L20 52 L24 48"
            fill="url(#leafRust)"
            opacity="0.6"
            transform="scale(0.7)"
          />
        </motion.g>
        
        {/* Twig with tiny leaves */}
        <motion.g
          initial={{ x: 0, y: 0, rotate: 0 }}
          animate={{ 
            x: [0, 22, 11], 
            y: [0, -4, 2], 
            rotate: [0, 35, 15] 
          }}
          transition={{ duration: 4.8, delay: 0.9, repeat: Infinity, ease: "easeInOut" }}
        >
          <path d="M18 65 L28 60" stroke="#8B4513" strokeWidth="1.5" fill="none" opacity="0.45" strokeLinecap="round" />
          <circle cx="18" cy="65" r="2.5" fill="#5F7A6A" opacity="0.5" />
          <circle cx="24" cy="62" r="2" fill="#6B8E23" opacity="0.4" />
        </motion.g>

        {/* Dust/road particles - subtle */}
        <motion.circle
          cx="22"
          cy="72"
          r="1.2"
          fill="#8B7355"
          animate={{ opacity: [0.2, 0.5, 0.2], x: [0, 10, 5] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.circle
          cx="18"
          cy="40"
          r="0.8"
          fill="#5F7A6A"
          animate={{ opacity: [0.3, 0.6, 0.3], x: [0, 12, 6] }}
          transition={{ duration: 3.5, delay: 0.3, repeat: Infinity }}
        />
        <motion.circle
          cx="28"
          cy="52"
          r="1"
          fill="#8B4513"
          animate={{ opacity: [0.2, 0.45, 0.2], x: [0, 8, 4], y: [0, -2, 0] }}
          transition={{ duration: 4, delay: 0.6, repeat: Infinity }}
        />
        <motion.circle
          cx="15"
          cy="62"
          r="0.6"
          fill="#6B8E23"
          animate={{ opacity: [0.15, 0.4, 0.15], x: [0, 14, 7] }}
          transition={{ duration: 3.8, delay: 1.2, repeat: Infinity }}
        />

        <defs>
          <linearGradient id="windSoul" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5F7A6A" stopOpacity="0" />
            <stop offset="50%" stopColor="#5F7A6A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#6B8E23" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="dustTrail" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B7355" stopOpacity="0" />
            <stop offset="50%" stopColor="#8B7355" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#8B4513" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="leafSage" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5F7A6A" />
            <stop offset="100%" stopColor="#6B8E23" />
          </linearGradient>
          <linearGradient id="leafRust" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#8B4513" />
            <stop offset="100%" stopColor="#A0522D" />
          </linearGradient>
          <linearGradient id="engineSoul" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5F7A6A" />
            <stop offset="100%" stopColor="#8B4513" />
          </linearGradient>
          <filter id="soulGlow" x="-15%" y="-15%" width="130%" height="130%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
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
