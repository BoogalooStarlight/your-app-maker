import { Check, Lock } from "lucide-react";

interface HealthMilestoneProps {
  title: string;
  description: string;
  timeRequired: string;
  achieved: boolean;
  delay?: number;
}

export const HealthMilestone = ({ title, description, timeRequired, achieved, delay = 0 }: HealthMilestoneProps) => {
  return (
    <div 
      className={`relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-500 opacity-0 animate-slide-in-right ${
        achieved 
          ? "border-success/30 bg-success/5" 
          : "border-border bg-card/50"
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Status Icon */}
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
        achieved 
          ? "bg-success text-success-foreground shadow-lg" 
          : "bg-muted text-muted-foreground"
      }`}>
        {achieved ? <Check className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
      </div>
      
      {/* Content */}
      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <h4 className={`font-semibold transition-colors ${achieved ? "text-foreground" : "text-muted-foreground"}`}>
            {title}
          </h4>
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            achieved 
              ? "bg-success/20 text-success" 
              : "bg-muted text-muted-foreground"
          }`}>
            {timeRequired}
          </span>
        </div>
        <p className={`text-sm transition-colors ${achieved ? "text-muted-foreground" : "text-muted-foreground/60"}`}>
          {description}
        </p>
      </div>
      
      {/* Glow effect for achieved */}
      {achieved && (
        <div className="absolute inset-0 rounded-xl bg-success/5 animate-pulse pointer-events-none" />
      )}
    </div>
  );
};
