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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const updateSize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    updateSize();

    // Matrix rain effect
    const columns = Math.floor(canvas.offsetWidth / 15);
    const drops: number[] = Array(columns).fill(1);
    const chars = "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";

    // Data nodes for body visualization
    const nodes: { x: number; y: number; radius: number; opacity: number; speed: number }[] = [];
    for (let i = 0; i < 50; i++) {
      nodes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        radius: Math.random() * 2 + 1,
        opacity: Math.random(),
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = "rgba(8, 10, 14, 0.05)";
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Matrix rain
      ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
      ctx.font = "12px monospace";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * 15, drops[i] * 15);

        if (drops[i] * 15 > canvas.offsetHeight && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      // Floating data nodes
      ctx.fillStyle = "rgba(59, 130, 246, 0.6)";
      nodes.forEach((node) => {
        node.y -= node.speed;
        node.opacity = 0.3 + Math.sin(Date.now() / 1000 + node.x) * 0.3;

        if (node.y < 0) {
          node.y = canvas.offsetHeight;
          node.x = Math.random() * canvas.offsetWidth;
        }

        ctx.beginPath();
        ctx.globalAlpha = node.opacity;
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, []);

  const lungHealth = activeOrgans.lungs ?? 0;
  const heartHealth = activeOrgans.heart ?? 100;
  const liverHealth = activeOrgans.liver ?? 100;
  const brainHealth = activeOrgans.brain ?? 100;

  const getOrganColor = (health: number) => {
    if (health >= 80) return "text-success";
    if (health >= 50) return "text-warning";
    return "text-destructive";
  };

  const getOrganGlow = (health: number) => {
    if (health >= 80) return "drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]";
    if (health >= 50) return "drop-shadow-[0_0_15px_rgba(251,191,36,0.6)]";
    return "drop-shadow-[0_0_15px_rgba(239,68,68,0.6)]";
  };

  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center">
      {/* Background canvas with matrix effect */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-30"
      />

      {/* Human body silhouette SVG */}
      <div className="relative z-10 animate-float">
        <svg
          viewBox="0 0 200 400"
          className="w-48 h-96 md:w-64 md:h-[450px]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Body outline with glow */}
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="hsl(210 100% 60%)" stopOpacity="0.8" />
              <stop offset="50%" stopColor="hsl(170 100% 50%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(210 100% 60%)" stopOpacity="0.4" />
            </linearGradient>
            <linearGradient id="circuitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(210 100% 60%)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(170 100% 50%)" stopOpacity="0.3" />
            </linearGradient>
          </defs>

          {/* Circuit lines on body */}
          <g stroke="url(#circuitGradient)" strokeWidth="0.5" opacity="0.5">
            <path d="M100 50 L100 80 L85 100 L85 150" className="animate-data-flow" strokeDasharray="5,5" />
            <path d="M100 50 L100 80 L115 100 L115 150" className="animate-data-flow" strokeDasharray="5,5" />
            <path d="M70 140 L60 180 L50 250" className="animate-data-flow" strokeDasharray="5,5" />
            <path d="M130 140 L140 180 L150 250" className="animate-data-flow" strokeDasharray="5,5" />
            <path d="M90 200 L85 280 L80 350" className="animate-data-flow" strokeDasharray="5,5" />
            <path d="M110 200 L115 280 L120 350" className="animate-data-flow" strokeDasharray="5,5" />
          </g>

          {/* Body silhouette */}
          <path
            d="M100 10 
               C120 10 130 25 130 40
               C130 55 120 65 100 70
               C80 65 70 55 70 40
               C70 25 80 10 100 10
               M100 70
               L100 85
               M75 90 L45 150 L40 180
               M125 90 L155 150 L160 180
               M100 85
               C130 90 140 100 140 130
               L140 200
               C140 220 130 230 100 230
               C70 230 60 220 60 200
               L60 130
               C60 100 70 90 100 85
               M100 230
               L100 250
               M90 250 L85 350 L75 390
               M110 250 L115 350 L125 390"
            stroke="url(#bodyGradient)"
            strokeWidth="2"
            filter="url(#glow)"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Brain */}
          <g className={`${getOrganColor(brainHealth)} ${getOrganGlow(brainHealth)} transition-all duration-500`}>
            <ellipse cx="100" cy="35" rx="20" ry="18" fill="currentColor" fillOpacity="0.3" />
            <ellipse cx="100" cy="35" rx="20" ry="18" stroke="currentColor" strokeWidth="1" fill="none" />
            <text x="100" y="38" textAnchor="middle" fontSize="8" fill="currentColor" fontWeight="bold">
              {brainHealth}%
            </text>
          </g>

          {/* Heart */}
          <g className={`${getOrganColor(heartHealth)} ${getOrganGlow(heartHealth)} transition-all duration-500`}>
            <path
              d="M95 115 C95 110 90 105 85 105 C80 105 77 110 77 115 C77 125 95 135 95 135 C95 135 113 125 113 115 C113 110 110 105 105 105 C100 105 95 110 95 115"
              fill="currentColor"
              fillOpacity="0.3"
              className="animate-breathe"
            />
            <path
              d="M95 115 C95 110 90 105 85 105 C80 105 77 110 77 115 C77 125 95 135 95 135 C95 135 113 125 113 115 C113 110 110 105 105 105 C100 105 95 110 95 115"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          </g>

          {/* Lungs */}
          <g className={`${getOrganColor(lungHealth)} ${getOrganGlow(lungHealth)} transition-all duration-500`}>
            {/* Left lung */}
            <path
              d="M70 120 C60 125 55 140 55 160 C55 180 65 190 75 185 C80 182 82 170 82 155 C82 140 78 125 70 120"
              fill="currentColor"
              fillOpacity="0.3"
              className="animate-breathe"
            />
            <path
              d="M70 120 C60 125 55 140 55 160 C55 180 65 190 75 185 C80 182 82 170 82 155 C82 140 78 125 70 120"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            {/* Right lung */}
            <path
              d="M130 120 C140 125 145 140 145 160 C145 180 135 190 125 185 C120 182 118 170 118 155 C118 140 122 125 130 120"
              fill="currentColor"
              fillOpacity="0.3"
              className="animate-breathe"
            />
            <path
              d="M130 120 C140 125 145 140 145 160 C145 180 135 190 125 185 C120 182 118 170 118 155 C118 140 122 125 130 120"
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
            <text x="100" y="160" textAnchor="middle" fontSize="10" fill="currentColor" fontWeight="bold">
              {lungHealth}%
            </text>
          </g>

          {/* Liver */}
          <g className={`${getOrganColor(liverHealth)} ${getOrganGlow(liverHealth)} transition-all duration-500`}>
            <ellipse cx="115" cy="195" rx="18" ry="12" fill="currentColor" fillOpacity="0.3" />
            <ellipse cx="115" cy="195" rx="18" ry="12" stroke="currentColor" strokeWidth="1" fill="none" />
            <text x="115" y="198" textAnchor="middle" fontSize="7" fill="currentColor" fontWeight="bold">
              {liverHealth}%
            </text>
          </g>

          {/* Data points with pulse animation */}
          <g className="text-primary">
            <circle cx="100" cy="35" r="3" fill="currentColor" className="animate-node-pulse" />
            <circle cx="95" cy="120" r="3" fill="currentColor" className="animate-node-pulse" style={{ animationDelay: "0.3s" }} />
            <circle cx="70" cy="155" r="2" fill="currentColor" className="animate-node-pulse" style={{ animationDelay: "0.5s" }} />
            <circle cx="130" cy="155" r="2" fill="currentColor" className="animate-node-pulse" style={{ animationDelay: "0.7s" }} />
            <circle cx="115" cy="195" r="2" fill="currentColor" className="animate-node-pulse" style={{ animationDelay: "0.9s" }} />
          </g>
        </svg>

        {/* Scan line effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-scan-line" />
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-primary/30" />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-primary/30" />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-primary/30" />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-primary/30" />
    </div>
  );
};
