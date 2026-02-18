import { House, LayoutGrid, Trophy } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/", icon: House },
  { label: "Modules", to: "/modules", icon: LayoutGrid },
  { label: "Trophées", to: "/trophees", icon: Trophy },
];

export const AppNavigation = () => {
  const location = useLocation();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-4">
      <nav className="pointer-events-auto grid w-full max-w-md grid-cols-3 rounded-2xl border border-white/10 bg-[#1C1C1E]/95 p-1.5 shadow-[0_-12px_30px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center justify-center gap-1 rounded-xl py-2 text-[10px] uppercase tracking-[0.14em] transition-all duration-300 ${
                active ? "bg-white/10 text-white" : "text-white/55 hover:text-white"
              }`}
            >
              <Icon className={`h-4 w-4 ${active ? "text-white" : "text-white/65"}`} strokeWidth={1.8} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
