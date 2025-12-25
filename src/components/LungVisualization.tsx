import { useMemo } from "react";

interface LungVisualizationProps {
  healthPercentage: number; // 0-100
  className?: string;
}

export const LungVisualization = ({ healthPercentage, className = "" }: LungVisualizationProps) => {
  const lungColor = useMemo(() => {
    // Interpolate from gray/brown (unhealthy) to pink (healthy)
    if (healthPercentage < 20) {
      return "hsl(30, 20%, 45%)"; // Brownish gray
    } else if (healthPercentage < 40) {
      return "hsl(25, 35%, 50%)"; // Brownish
    } else if (healthPercentage < 60) {
      return "hsl(350, 50%, 60%)"; // Pinkish brown
    } else if (healthPercentage < 80) {
      return "hsl(345, 65%, 65%)"; // Light pink
    } else {
      return "hsl(340, 75%, 70%)"; // Healthy pink
    }
  }, [healthPercentage]);

  const glowIntensity = healthPercentage / 100;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Glow effect */}
      <div 
        className="absolute inset-0 rounded-full blur-3xl transition-all duration-1000"
        style={{
          background: `radial-gradient(circle, ${lungColor}40 0%, transparent 70%)`,
          opacity: glowIntensity,
        }}
      />
      
      {/* Lungs SVG */}
      <svg 
        viewBox="0 0 200 200" 
        className="w-full h-full animate-breathe relative z-10"
        style={{ filter: `drop-shadow(0 0 ${20 * glowIntensity}px ${lungColor}50)` }}
      >
        {/* Left Lung */}
        <path
          d="M 70 60 
             Q 45 65, 35 90 
             Q 25 120, 30 145 
             Q 35 170, 55 175 
             Q 75 180, 85 160 
             Q 90 145, 90 120 
             Q 90 95, 85 80 
             Q 80 65, 70 60 Z"
          fill={lungColor}
          className="transition-all duration-1000"
        />
        
        {/* Right Lung */}
        <path
          d="M 130 60 
             Q 155 65, 165 90 
             Q 175 120, 170 145 
             Q 165 170, 145 175 
             Q 125 180, 115 160 
             Q 110 145, 110 120 
             Q 110 95, 115 80 
             Q 120 65, 130 60 Z"
          fill={lungColor}
          className="transition-all duration-1000"
        />
        
        {/* Trachea */}
        <path
          d="M 95 35 
             L 95 75 
             Q 95 85, 90 90 
             M 105 35 
             L 105 75 
             Q 105 85, 110 90"
          stroke={lungColor}
          strokeWidth="4"
          fill="none"
          className="transition-all duration-1000"
        />
        
        {/* Bronchi details */}
        <g opacity={0.6 + (healthPercentage / 250)}>
          {/* Left bronchi */}
          <path
            d="M 90 90 Q 70 100, 55 115 M 75 105 Q 60 120, 50 140"
            stroke={lungColor}
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
          {/* Right bronchi */}
          <path
            d="M 110 90 Q 130 100, 145 115 M 125 105 Q 140 120, 150 140"
            stroke={lungColor}
            strokeWidth="2"
            fill="none"
            opacity="0.7"
          />
        </g>
        
        {/* Health particles */}
        {healthPercentage > 50 && (
          <g className="animate-pulse">
            <circle cx="55" cy="120" r="3" fill="white" opacity="0.4" />
            <circle cx="145" cy="120" r="3" fill="white" opacity="0.4" />
            <circle cx="45" cy="140" r="2" fill="white" opacity="0.3" />
            <circle cx="155" cy="140" r="2" fill="white" opacity="0.3" />
          </g>
        )}
        
        {healthPercentage > 80 && (
          <g className="animate-pulse" style={{ animationDelay: '0.5s' }}>
            <circle cx="65" cy="100" r="2" fill="white" opacity="0.5" />
            <circle cx="135" cy="100" r="2" fill="white" opacity="0.5" />
            <circle cx="50" cy="155" r="2.5" fill="white" opacity="0.4" />
            <circle cx="150" cy="155" r="2.5" fill="white" opacity="0.4" />
          </g>
        )}
      </svg>
    </div>
  );
};
