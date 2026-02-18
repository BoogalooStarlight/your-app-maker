import { useMemo } from "react";
import { Atom, Brain, ChevronRight, Cigarette, Moon, Wine } from "lucide-react";
import { Link } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";
import { getSmokingMetrics } from "@/lib/smokingMetrics";

const cardClass = "rounded-[28px] border border-white/10 bg-[#1C1C1E] p-5";

const Modules = () => {
  const metrics = useMemo(() => getSmokingMetrics(), []);

  const modules = [
    { label: "Anti-Tabac", href: "/smoking", icon: Cigarette, progress: Math.max(8, metrics.progressPercent) },
    { label: "Anti-Alcool", href: "/alcohol", icon: Wine, progress: 18 },
    { label: "Santé mentale", href: "/mental", icon: Brain, progress: 12 },
    { label: "Énergie & Sommeil", href: "/energy", icon: Moon, progress: 22 },
    { label: "Anti-Ballons", href: "/balloons", icon: Atom, progress: 10 },
  ];

  return (
    <div className="min-h-screen bg-[#000000] px-4 py-6 text-white md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[18px] font-bold tracking-[0.04em]">RIVE</h1>
          <AppNavigation />
        </header>

        <section className={`${cardClass} space-y-4`}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Modules addictions</p>

          {modules.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                to={item.href}
                key={item.label}
                className="block rounded-2xl border border-white/10 bg-black/40 p-4 transition-all duration-300 hover:bg-white/5"
              >
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-3 text-sm text-white/90">
                    <Icon className="h-4 w-4 text-white/70" />
                    {item.label}
                  </span>
                  <ChevronRight className="h-4 w-4 text-white/50" />
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-white/10">
                  <div className="h-1.5 rounded-full bg-white/65" style={{ width: `${item.progress}%` }} />
                </div>
              </Link>
            );
          })}
        </section>
      </div>
    </div>
  );
};

export default Modules;
