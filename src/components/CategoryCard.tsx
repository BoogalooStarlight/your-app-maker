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
}

const colorClasses = {
  primary: "text-sky-300",
  success: "text-emerald-300",
  warning: "text-amber-300",
  accent: "text-teal-300",
  destructive: "text-rose-300",
};

export const CategoryCard = ({
  title,
  description,
  icon: Icon,
  href,
  color,
  isActive,
  stats,
}: CategoryCardProps) => {
  return (
    <Link
      to={href}
      className="group block rounded-3xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-xl transition-colors hover:bg-white/[0.07]"
    >
      <div className="space-y-4">
        <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 ${colorClasses[color]}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div>
          <h3 className="text-lg font-medium text-white">{title}</h3>
          <p className="mt-1 text-sm text-white/60 line-clamp-2">{description}</p>
        </div>

        {(stats || isActive !== undefined) && (
          <div className="flex items-center gap-2 text-xs">
            {isActive !== undefined && (
              <span className={`inline-flex items-center gap-1.5 ${isActive ? "text-emerald-300" : "text-white/50"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${isActive ? "bg-emerald-300" : "bg-white/40"}`} />
                {isActive ? "Actif" : "Non configuré"}
              </span>
            )}
            {stats && <span className={`${colorClasses[color]} font-medium`}>{stats}</span>}
          </div>
        )}
      </div>
    </Link>
  );
};
