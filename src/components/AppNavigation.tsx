import { Grid3X3, Home, Trophy } from "lucide-react";
import { NavLink } from "@/components/NavLink";

const navItems = [
  { to: "/", icon: Home },
  { to: "/modules", icon: Grid3X3 },
  { to: "/trophees", icon: Trophy },
];

export const AppNavigation = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-[#070708]">
      <div className="mx-auto flex h-16 w-full max-w-md items-center justify-center gap-14 px-6">
        {navItems.map(({ to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-white/55 transition hover:text-white"
            activeClassName="text-white"
            end={to === "/"}
            aria-label={to === "/" ? "Accueil" : to === "/modules" ? "Modules" : "Trophées"}
          >
            <Icon className="h-5 w-5" strokeWidth={1.9} />
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
