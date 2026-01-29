import React from 'react';
import { motion } from 'motion/react';

interface DigitalPhysicianLogoProps {
  size?: number;
  animated?: boolean;
}

export const DigitalPhysicianLogo: React.FC<DigitalPhysicianLogoProps> = ({ 
  size = 120, 
  animated = true 
}) => {
  if (animated) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex items-center justify-center"
      >
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer decorative circle */}
          <circle
            cx="60"
            cy="60"
            r="58"
            stroke="#D4A017"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 4"
          />
          
          {/* Background circle */}
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="#FDFBF7"
            stroke="#708D57"
            strokeWidth="1.5"
          />
          
          {/* Traditional mortar and pestle */}
          <g>
            {/* Mortar bowl */}
            <path
              d="M35 65 C35 70, 40 75, 50 75 L70 75 C80 75, 85 70, 85 65 L85 55 C85 50, 80 45, 70 45 L50 45 C40 45, 35 50, 35 55 Z"
              fill="#8B6F4F"
              stroke="#3E6B48"
              strokeWidth="1.5"
            />
            
            {/* Pestle */}
            <g>
              <ellipse
                cx="75"
                cy="40"
                rx="3"
                ry="8"
                fill="#8B6F4F"
                stroke="#3E6B48"
                strokeWidth="1"
              />
              <rect
                x="73"
                y="48"
                width="4"
                height="12"
                rx="2"
                fill="#8B6F4F"
                stroke="#3E6B48"
                strokeWidth="1"
              />
            </g>
          </g>
          
          {/* Digital elements - circuit pattern */}
          <g opacity="0.6">
            {/* Digital nodes */}
            <circle cx="25" cy="30" r="2" fill="#3E6B48" />
            <circle cx="95" cy="30" r="2" fill="#3E6B48" />
            <circle cx="25" cy="90" r="2" fill="#3E6B48" />
            <circle cx="95" cy="90" r="2" fill="#3E6B48" />
            
            {/* Connecting lines */}
            <path
              d="M25 30 L35 40 M95 30 L85 40 M25 90 L35 80 M95 90 L85 80"
              stroke="#708D57"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </g>
          
          {/* Herbal leaves decoration */}
          <g>
            {/* Left leaf */}
            <path
              d="M20 60 Q15 50, 25 45 Q30 50, 25 60 Q20 65, 20 60"
              fill="#708D57"
            />
            
            {/* Right leaf */}
            <path
              d="M100 60 Q105 50, 95 45 Q90 50, 95 60 Q100 65, 100 60"
              fill="#708D57"
            />
            
            {/* Top leaf */}
            <path
              d="M60 20 Q50 15, 45 25 Q50 30, 60 25 Q65 20, 60 20"
              fill="#708D57"
            />
            
            {/* Bottom leaf */}
            <path
              d="M60 100 Q50 105, 45 95 Q50 90, 60 95 Q65 100, 60 100"
              fill="#708D57"
            />
          </g>
          
          {/* Central cross symbol */}
          <g>
            <rect
              x="57"
              y="30"
              width="6"
              height="20"
              rx="3"
              fill="#3E6B48"
            />
            <rect
              x="50"
              y="37"
              width="20"
              height="6"
              rx="3"
              fill="#3E6B48"
            />
            
            {/* Small decorative dots */}
            <circle cx="60" cy="25" r="1.5" fill="#D4A017" />
            <circle cx="60" cy="95" r="1.5" fill="#D4A017" />
            <circle cx="45" cy="60" r="1.5" fill="#D4A017" />
            <circle cx="75" cy="60" r="1.5" fill="#D4A017" />
          </g>
          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#D4A017" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3E6B48" stopOpacity="0.2" />
            </radialGradient>
          </defs>
        </svg>
      </motion.div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Same static content */}
        <circle
          cx="60"
          cy="60"
          r="58"
          stroke="#D4A017"
          strokeWidth="2"
          fill="none"
          strokeDasharray="8 4"
        />
        
        <circle
          cx="60"
          cy="60"
          r="50"
          fill="#FDFBF7"
          stroke="#708D57"
          strokeWidth="1.5"
        />
        
        <g>
          <path
            d="M35 65 C35 70, 40 75, 50 75 L70 75 C80 75, 85 70, 85 65 L85 55 C85 50, 80 45, 70 45 L50 45 C40 45, 35 50, 35 55 Z"
            fill="#8B6F4F"
            stroke="#3E6B48"
            strokeWidth="1.5"
          />
          
          <g>
            <ellipse
              cx="75"
              cy="40"
              rx="3"
              ry="8"
              fill="#8B6F4F"
              stroke="#3E6B48"
              strokeWidth="1"
            />
            <rect
              x="73"
              y="48"
              width="4"
              height="12"
              rx="2"
              fill="#8B6F4F"
              stroke="#3E6B48"
              strokeWidth="1"
            />
          </g>
        </g>
        
        <g opacity="0.6">
          <circle cx="25" cy="30" r="2" fill="#3E6B48" />
          <circle cx="95" cy="30" r="2" fill="#3E6B48" />
          <circle cx="25" cy="90" r="2" fill="#3E6B48" />
          <circle cx="95" cy="90" r="2" fill="#3E6B48" />
          
          <path
            d="M25 30 L35 40 M95 30 L85 40 M25 90 L35 80 M95 90 L85 80"
            stroke="#708D57"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </g>
        
        <g>
          <path
            d="M20 60 Q15 50, 25 45 Q30 50, 25 60 Q20 65, 20 60"
            fill="#708D57"
          />
          <path
            d="M100 60 Q105 50, 95 45 Q90 50, 95 60 Q100 65, 100 60"
            fill="#708D57"
          />
          <path
            d="M60 20 Q50 15, 45 25 Q50 30, 60 25 Q65 20, 60 20"
            fill="#708D57"
          />
          <path
            d="M60 100 Q50 105, 45 95 Q50 90, 60 95 Q65 100, 60 100"
            fill="#708D57"
          />
        </g>
        
        <g>
          <rect
            x="57"
            y="30"
            width="6"
            height="20"
            rx="3"
            fill="#3E6B48"
          />
          <rect
            x="50"
            y="37"
            width="20"
            height="6"
            rx="3"
            fill="#3E6B48"
          />
          
          <circle cx="60" cy="25" r="1.5" fill="#D4A017" />
          <circle cx="60" cy="95" r="1.5" fill="#D4A017" />
          <circle cx="45" cy="60" r="1.5" fill="#D4A017" />
          <circle cx="75" cy="60" r="1.5" fill="#D4A017" />
        </g>
        
        <defs>
          <radialGradient id="glowGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#D4A017" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3E6B48" stopOpacity="0.2" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};