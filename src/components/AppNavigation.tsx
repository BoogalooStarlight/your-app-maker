import { BarChart2, Home, LayoutGrid, Trophy } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const items = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/modules", label: "Modules", icon: LayoutGrid },
  { to: "/ranking", label: "Classement", icon: BarChart2 },
  { to: "/trophees", label: "Trophées", icon: Trophy },
];

export const AppNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t-[2.5px] border-[#1a1a1a] bg-[#f5f0e8]">
      <div className="mx-auto flex h-20 w-full max-w-[430px] items-center justify-center gap-4 px-4">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            aria-label={label}
            className={({ isActive }) =>
              cn(
                "flex min-w-16 flex-col items-center justify-center gap-1 rounded-[14px] px-2 py-2 font-['Nunito'] text-[10px] font-bold leading-none text-[#1a1a1a] transition-all",
                isActive
                  ? "bg-[#1a1a1a] text-[#f5f0e8] shadow-[3px_3px_0_#7B61FF]"
                  : "opacity-30",
              )
            }
          >
            <Icon className="h-5 w-5" strokeWidth={2.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
