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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-black/80 backdrop-blur-md">
      <nav className="mx-auto grid h-16 w-full max-w-md grid-cols-3 items-center px-6">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              aria-label={item.label}
              className="flex items-center justify-center"
            >
              <Icon
                className={`h-6 w-6 transition-all duration-200 ${
                  active ? "fill-white text-white" : "text-white/55"
                }`}
                strokeWidth={1.9}
              />
            </Link>
          );
        })}
      </nav>
    </div>
  );
};
