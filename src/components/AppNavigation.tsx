import { Home, LayoutGrid, Trophy } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/modules", label: "Modules", icon: LayoutGrid },
  { to: "/trophees", label: "Trophées", icon: Trophy },
];

export const AppNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-[430px] items-center justify-center gap-14 px-6">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                "flex h-10 w-10 items-center justify-center rounded-lg text-white/55 transition-colors hover:text-white",
                isActive && "text-white",
              )
            }
          >
            <Icon className="h-5 w-5" strokeWidth={1.9} />
            <span className="sr-only">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
