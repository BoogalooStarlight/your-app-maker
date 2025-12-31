import { useEffect, useRef } from "react";

interface HumanBodyMatrixProps {
  activeOrgans?: {
    lungs?: number;
    heart?: number;
    liver?: number;
    brain?: number;
  };
}

export const HumanBodyMatrix = ({ activeOrgans = {} }: HumanBodyMatrixProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const lungHealth = activeOrgans.lungs ?? 0;
  const heartHealth = activeOrgans.heart ?? 100;
  const liverHealth = activeOrgans.liver ?? 100;
  const brainHealth = activeOrgans.brain ?? 100;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * 2;
      canvas.height = rect.height * 2;
      ctx.scale(2, 2);
    };
    updateSize();

    // Particles for data flow effect
    const particles: { x: number; y: number; vx: number; vy: number; life: number; maxLife: number }[] = [];
    
    const createParticle = (x: number, y: number) => {
      particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1 - 0.5,
        life: 0,
        maxLife: 60 + Math.random() * 60,
      });
    };

    let frame = 0;
    let animationId: number;

    const draw = () => {
      const width = canvas.width / 2;
      const height = canvas.height / 2;
      
      // Clear with fade effect
      ctx.fillStyle = "rgba(8, 10, 15, 0.1)";
      ctx.fillRect(0, 0, width, height);

      frame++;

      // Create new particles occasionally
      if (frame % 3 === 0) {
        createParticle(width / 2 + (Math.random() - 0.5) * 100, height * 0.7);
      }

      // Update and draw particles
      ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.life > p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        const alpha = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.fillStyle = `rgba(59, 130, 246, ${alpha * 0.5})`;
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw connecting lines between nearby particles
      ctx.strokeStyle = "rgba(59, 130, 246, 0.1)";
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 40) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Horizontal scan line
      const scanY = (frame % 200) * (height / 200);
      const gradient = ctx.createLinearGradient(0, scanY - 2, 0, scanY + 2);
      gradient.addColorStop(0, "rgba(59, 130, 246, 0)");
      gradient.addColorStop(0.5, "rgba(59, 130, 246, 0.3)");
      gradient.addColorStop(1, "rgba(59, 130, 246, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, scanY - 2, width, 4);

      animationId = requestAnimationFrame(draw);
    };

    draw();

    const handleResize = () => {
      updateSize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const getHealthColor = (health: number) => {
    if (health >= 80) return "#22c55e";
    if (health >= 50) return "#f59e0b";
    return "#ef4444";
  };

  const getHealthGlow = (health: number) => {
    if (health >= 80) return "0 0 20px rgba(34, 197, 94, 0.5)";
    if (health >= 50) return "0 0 20px rgba(245, 158, 11, 0.5)";
    return "0 0 20px rgba(239, 68, 68, 0.5)";
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Background canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
      />

      {/* Human body SVG - Modern minimalist style */}
      <div className="relative z-10 animate-float">
        <svg
          viewBox="0 0 300 500"
          className="w-56 h-[400px] md:w-72 md:h-[480px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="bodyOutline" x1="150" y1="0" x2="150" y2="500" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.4" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="softGlow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Body outline - clean modern silhouette */}
          <g filter="url(#glow)">
            {/* Head */}
            <ellipse cx="150" cy="45" rx="28" ry="35" stroke="url(#bodyOutline)" strokeWidth="1.5" fill="none" />
            
            {/* Neck */}
            <path d="M140 80 L140 95 M160 80 L160 95" stroke="url(#bodyOutline)" strokeWidth="1.5" />
            
            {/* Shoulders and torso */}
            <path 
              d="M140 95 
                 C120 95 90 100 70 120
                 L55 180
                 M160 95 
                 C180 95 210 100 230 120
                 L245 180"
              stroke="url(#bodyOutline)" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Arms */}
            <path 
              d="M55 180 L45 260 L50 330
                 M245 180 L255 260 L250 330"
              stroke="url(#bodyOutline)" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Hands */}
            <circle cx="50" cy="340" r="12" stroke="url(#bodyOutline)" strokeWidth="1" fill="none" />
            <circle cx="250" cy="340" r="12" stroke="url(#bodyOutline)" strokeWidth="1" fill="none" />
            
            {/* Torso main body */}
            <path 
              d="M105 100
                 C90 105 80 130 80 170
                 L85 270
                 C85 290 100 300 150 300
                 C200 300 215 290 215 270
                 L220 170
                 C220 130 210 105 195 100"
              stroke="url(#bodyOutline)" 
              strokeWidth="1.5" 
              fill="none"
            />
            
            {/* Hips and legs */}
            <path 
              d="M100 290
                 L90 380
                 L85 460
                 M200 290
                 L210 380
                 L215 460"
              stroke="url(#bodyOutline)" 
              strokeWidth="1.5" 
              fill="none"
              strokeLinecap="round"
            />
            
            {/* Feet */}
            <ellipse cx="85" cy="470" rx="15" ry="8" stroke="url(#bodyOutline)" strokeWidth="1" fill="none" />
            <ellipse cx="215" cy="470" rx="15" ry="8" stroke="url(#bodyOutline)" strokeWidth="1" fill="none" />
          </g>

          {/* Internal circuit lines */}
          <g stroke="#3b82f6" strokeWidth="0.5" opacity="0.3">
            <path d="M150 80 L150 120" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1s" repeatCount="indefinite" />
            </path>
            <path d="M150 120 L130 150 L130 200" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.2s" repeatCount="indefinite" />
            </path>
            <path d="M150 120 L170 150 L170 200" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.2s" repeatCount="indefinite" />
            </path>
            <path d="M150 180 L150 280" strokeDasharray="4 4">
              <animate attributeName="stroke-dashoffset" from="8" to="0" dur="1.5s" repeatCount="indefinite" />
            </path>
          </g>

          {/* Brain indicator */}
          <g filter="url(#softGlow)">
            <circle 
              cx="150" 
              cy="40" 
              r="18" 
              fill={getHealthColor(brainHealth)}
              fillOpacity="0.15"
              stroke={getHealthColor(brainHealth)}
              strokeWidth="1.5"
            >
              <animate attributeName="r" values="18;20;18" dur="3s" repeatCount="indefinite" />
            </circle>
            <text 
              x="150" 
              y="44" 
              textAnchor="middle" 
              fontSize="10" 
              fill={getHealthColor(brainHealth)}
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {brainHealth}%
            </text>
          </g>

          {/* Heart indicator */}
          <g filter="url(#softGlow)">
            <circle 
              cx="160" 
              cy="155" 
              r="16" 
              fill={getHealthColor(heartHealth)}
              fillOpacity="0.15"
              stroke={getHealthColor(heartHealth)}
              strokeWidth="1.5"
            >
              <animate attributeName="r" values="16;18;16" dur="1s" repeatCount="indefinite" />
            </circle>
            <text 
              x="160" 
              y="159" 
              textAnchor="middle" 
              fontSize="9" 
              fill={getHealthColor(heartHealth)}
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              ♥
            </text>
          </g>

          {/* Lungs indicator */}
          <g filter="url(#softGlow)">
            {/* Left lung */}
            <ellipse 
              cx="120" 
              cy="175" 
              rx="22" 
              ry="35" 
              fill={getHealthColor(lungHealth)}
              fillOpacity="0.1"
              stroke={getHealthColor(lungHealth)}
              strokeWidth="1.5"
            >
              <animate attributeName="ry" values="35;37;35" dur="4s" repeatCount="indefinite" />
            </ellipse>
            {/* Right lung */}
            <ellipse 
              cx="180" 
              cy="175" 
              rx="22" 
              ry="35" 
              fill={getHealthColor(lungHealth)}
              fillOpacity="0.1"
              stroke={getHealthColor(lungHealth)}
              strokeWidth="1.5"
            >
              <animate attributeName="ry" values="35;37;35" dur="4s" repeatCount="indefinite" />
            </ellipse>
            <text 
              x="150" 
              y="180" 
              textAnchor="middle" 
              fontSize="12" 
              fill={getHealthColor(lungHealth)}
              fontWeight="700"
              fontFamily="Inter, sans-serif"
            >
              {lungHealth}%
            </text>
          </g>

          {/* Liver indicator */}
          <g filter="url(#softGlow)">
            <ellipse 
              cx="175" 
              cy="230" 
              rx="25" 
              ry="15" 
              fill={getHealthColor(liverHealth)}
              fillOpacity="0.15"
              stroke={getHealthColor(liverHealth)}
              strokeWidth="1.5"
            />
            <text 
              x="175" 
              y="234" 
              textAnchor="middle" 
              fontSize="8" 
              fill={getHealthColor(liverHealth)}
              fontWeight="600"
              fontFamily="Inter, sans-serif"
            >
              {liverHealth}%
            </text>
          </g>

          {/* Pulse points */}
          <g>
            <circle cx="150" cy="95" r="3" fill="#3b82f6">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx="150" cy="280" r="3" fill="#3b82f6">
              <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" begin="0.5s" />
              <animate attributeName="r" values="2;4;2" dur="2s" repeatCount="indefinite" begin="0.5s" />
            </circle>
          </g>
        </svg>

        {/* Status labels */}
        <div className="absolute -right-4 top-8 flex flex-col items-start gap-1 opacity-60">
          <div className="flex items-center gap-2 text-[10px] font-mono text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            SCAN ACTIVE
          </div>
        </div>
      </div>

      {/* Corner frames */}
      <div className="absolute top-4 left-4 w-12 h-12">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
      <div className="absolute top-4 right-4 w-12 h-12">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/50 to-transparent" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-primary/50 to-transparent" />
      </div>
      <div className="absolute bottom-4 left-4 w-12 h-12">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 w-[1px] h-full bg-gradient-to-t from-primary/50 to-transparent" />
      </div>
      <div className="absolute bottom-4 right-4 w-12 h-12">
        <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-l from-primary/50 to-transparent" />
        <div className="absolute bottom-0 right-0 w-[1px] h-full bg-gradient-to-t from-primary/50 to-transparent" />
      </div>

      {/* Bottom data readout */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-[10px] font-mono text-muted-foreground">
        <span>SYS:OK</span>
        <span className="w-1 h-1 rounded-full bg-success" />
        <span>VITALS:NOMINAL</span>
      </div>
    </div>
  );
};
