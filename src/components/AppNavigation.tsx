import { Link, useLocation } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/" },
  { label: "Modules", to: "/modules" },
  { label: "Trophées", to: "/trophees" },
];

const baseClass =
  "rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] transition-all duration-300";

export const AppNavigation = () => {
  const location = useLocation();

  return (
    <nav className="flex flex-wrap items-center gap-2">
      {navItems.map((item) => {
        const active = location.pathname === item.to;

        return (
          <Link
            key={item.to}
            to={item.to}
            className={`${baseClass} ${
              active
                ? "border-white/20 bg-white/10 text-white"
                : "border-white/10 bg-[#1C1C1E] text-white/65 hover:bg-white/5 hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};
