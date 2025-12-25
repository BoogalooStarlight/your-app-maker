import { ReactNode } from "react";

interface StatCardProps {
  icon: ReactNode;
  label: string;
  value: string | number;
  subValue?: string;
  color?: "primary" | "success" | "warning" | "accent";
  delay?: number;
}

export const StatCard = ({ icon, label, value, subValue, color = "primary", delay = 0 }: StatCardProps) => {
  const colorClasses = {
    primary: "from-primary/10 to-primary/5 border-primary/20",
    success: "from-success/10 to-success/5 border-success/20",
    warning: "from-warning/10 to-warning/5 border-warning/20",
    accent: "from-accent/10 to-accent/5 border-accent/20",
  };

  const iconColorClasses = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    accent: "text-accent bg-accent/10",
  };

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-card transition-all duration-300 hover:scale-[1.02] hover:shadow-glow ${colorClasses[color]} opacity-0 animate-fade-in`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {subValue && (
            <p className="text-xs text-muted-foreground">{subValue}</p>
          )}
        </div>
        <div className={`rounded-xl p-2.5 ${iconColorClasses[color]}`}>
          {icon}
        </div>
      </div>
      
      {/* Decorative gradient */}
      <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full bg-gradient-to-br from-current to-transparent opacity-5 blur-2xl" />
    </div>
  );
};
