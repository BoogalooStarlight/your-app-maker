import { Brain, Circle, Wind, Wine, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const modules = [
  { title: "Poumons", to: "/app/smoking-choice", icon: Wind },
  { title: "Anti-Alcool", to: "/app/alcohol", icon: Wine },
  { title: "Santé mentale", to: "/mental", icon: Brain },
  { title: "Énergie & Sommeil", to: "/energy", icon: Zap },
  { title: "Anti-Ballons", to: "/app/balloons", icon: Circle },
];

export default function Modules() {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-6">
        <h1 className="text-xl font-semibold">Modules addictions</h1>

        <section className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-[#050506] p-3">
          {modules.map(({ title, to, icon: Icon }) => (
            <Link
              key={title}
              to={to}
              className="block rounded-2xl border border-white/10 bg-black/60 px-4 py-4 transition hover:border-white/25"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-3 text-base text-white/90">
                  <Icon className="h-5 w-5 text-white/70" />
                  {title}
                </span>
                <span className="text-white/40">›</span>
              </div>
              <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                <div className="h-1 rounded-full bg-white/25" style={{ width: "20%" }} />
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
