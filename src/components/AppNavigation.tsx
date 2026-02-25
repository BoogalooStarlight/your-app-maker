import { NavLink } from "@/components/NavLink";

const AppNavigation = () => {
  return (
    <nav className="flex items-center gap-4">
      <NavLink to="/modules" className="text-white/70" activeClassName="text-white">
        Modules
      </NavLink>
      <NavLink to="/trophees" className="text-white/70" activeClassName="text-white">
        Trophées
      </NavLink>
    </nav>
  );
};

export default AppNavigation;
