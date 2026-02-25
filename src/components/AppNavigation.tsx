import { Grid3X3, Home, Trophy } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/", icon: Home, label: "Accueil" },
  { to: "/modules", icon: Grid3X3, label: "Modules" },
  { to: "/trophees", icon: Trophy, label: "Trophées" },
];

export const AppNavigation = () => {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 w-full max-w-[430px] items-center justify-around px-6">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            aria-label={label}
            className="flex h-10 w-10 items-center justify-center text-white/55 transition-colors hover:text-white"
            activeClassName="text-white"
          >
            <Icon className="h-5 w-5" strokeWidth={1.9} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
