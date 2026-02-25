import { Grid3X3, Home, Trophy } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/modules", label: "Modules", icon: Grid3X3 },
  { to: "/trophees", label: "Trophées", icon: Trophy },
];

export const AppNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#121214]/95 backdrop-blur-xl">
      <div className="mx-auto flex h-20 w-full max-w-xl items-center justify-around px-4 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="group flex min-w-20 flex-col items-center justify-center gap-1 rounded-xl px-3 py-2 text-white/55 transition hover:text-white"
            activeClassName="text-white"
            end={to === "/"}
          >
            <Icon className="h-5 w-5" />
            <span className="text-[11px] font-medium tracking-wide">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
