import { useMemo } from "react";
import { Award, Flame, Heart, Moon, Shield, Star, Wallet } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { getSmokingMetrics } from "@/lib/smokingMetrics";

const cardClass = "rounded-[28px] border border-white/10 bg-[#1C1C1E] p-5";

const Trophies = () => {
  const metrics = useMemo(() => getSmokingMetrics(), []);

  const badges = [
    { label: "24h", icon: Star, unlocked: metrics.totalDays >= 1 },
    { label: "3 jours", icon: Flame, unlocked: metrics.totalDays >= 3 },
    { label: "7 jours", icon: Award, unlocked: metrics.totalDays >= 7 },
    { label: "14 jours", icon: Shield, unlocked: metrics.totalDays >= 14 },
    { label: "30 jours", icon: Heart, unlocked: metrics.totalDays >= 30 },
    { label: "100€", icon: Wallet, unlocked: metrics.moneySaved >= 100 },
    { label: "200 évités", icon: Flame, unlocked: metrics.cigarettesAvoided >= 200 },
    { label: "Santé 30%", icon: Heart, unlocked: metrics.lungHealth >= 30 },
    { label: "Sommeil stable", icon: Moon, unlocked: metrics.totalDays >= 10 },
  ];

  return (
    <div className="min-h-screen bg-[#000000] px-4 py-6 text-white md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[18px] font-bold tracking-[0.04em]">RIVE</h1>
          <AppNavigation />
        </header>

        <section className={`${cardClass} space-y-4`}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Trophées</p>
          <div className="grid grid-cols-3 gap-3">
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <article
                  key={badge.label}
                  className={`rounded-2xl border border-white/10 bg-black/40 p-3 text-center transition-all duration-300 ${
                    badge.unlocked ? "opacity-100 shadow-[0_0_24px_rgba(255,255,255,0.22)]" : "opacity-20"
                  }`}
                >
                  <Icon className="mx-auto h-6 w-6 text-white" strokeWidth={1.7} />
                  <p className="mt-2 text-[11px] uppercase tracking-[0.12em] text-white">{badge.label}</p>
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Trophies;
