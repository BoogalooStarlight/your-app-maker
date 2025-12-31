import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  color: "primary" | "success" | "warning" | "accent" | "destructive";
  isActive?: boolean;
  stats?: string;
  delay?: number;
}

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    border: "border-primary/30 hover:border-primary/60",
    text: "text-primary",
    glow: "hover:shadow-[0_0_30px_hsl(210_100%_60%/0.3)]",
  },
  success: {
    bg: "bg-success/10",
    border: "border-success/30 hover:border-success/60",
    text: "text-success",
    glow: "hover:shadow-[0_0_30px_hsl(145_80%_50%/0.3)]",
  },
  warning: {
    bg: "bg-warning/10",
    border: "border-warning/30 hover:border-warning/60",
    text: "text-warning",
    glow: "hover:shadow-[0_0_30px_hsl(38_100%_55%/0.3)]",
  },
  accent: {
    bg: "bg-accent/10",
    border: "border-accent/30 hover:border-accent/60",
    text: "text-accent",
    glow: "hover:shadow-[0_0_30px_hsl(170_100%_50%/0.3)]",
  },
  destructive: {
    bg: "bg-destructive/10",
    border: "border-destructive/30 hover:border-destructive/60",
    text: "text-destructive",
    glow: "hover:shadow-[0_0_30px_hsl(0_85%_55%/0.3)]",
  },
};

export const CategoryCard = ({
  title,
  description,
  icon: Icon,
  href,
  color,
  isActive,
  stats,
  delay = 0,
}: CategoryCardProps) => {
  const colors = colorClasses[color];

  return (
    <Link
      to={href}
      className={`
        group relative block p-6 rounded-2xl border backdrop-blur-sm
        transition-all duration-500 ease-out
        ${colors.border} ${colors.glow}
        bg-card/50
        animate-fade-in-up
      `}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Background gradient on hover */}
      <div className={`absolute inset-0 rounded-2xl ${colors.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

      {/* Content */}
      <div className="relative z-10 space-y-4">
        {/* Icon */}
        <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${colors.bg} ${colors.text} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className="w-6 h-6" />
        </div>

        {/* Text */}
        <div>
          <h3 className="text-lg font-semibold text-foreground group-hover:text-gradient transition-all duration-300">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
        </div>

        {/* Stats or status */}
        {(stats || isActive !== undefined) && (
          <div className="flex items-center gap-2">
            {isActive !== undefined && (
              <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isActive ? "text-success" : "text-muted-foreground"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-success animate-pulse" : "bg-muted-foreground"}`} />
                {isActive ? "Actif" : "Non configuré"}
              </span>
            )}
            {stats && (
              <span className={`text-xs font-medium ${colors.text}`}>
                {stats}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Arrow indicator */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
        <svg className={`w-5 h-5 ${colors.text}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
};
