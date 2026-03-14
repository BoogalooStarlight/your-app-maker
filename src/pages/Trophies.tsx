import { Award, Flame, Heart, Moon, Shield, Star, Wallet } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { useStats } from "@/hooks/useStats";

const Trophies = () => {
  const stats = useStats();

  const badges = [
    { label: "24h", icon: Star, unlocked: stats.daysClean >= 1, description: "Première journée" },
    { label: "3 jours", icon: Flame, unlocked: stats.daysClean >= 3, description: "72h de combat" },
    { label: "7 jours", icon: Award, unlocked: stats.daysClean >= 7, description: "Une semaine entière" },
    { label: "14 jours", icon: Shield, unlocked: stats.daysClean >= 14, description: "Deux semaines" },
    { label: "30 jours", icon: Heart, unlocked: stats.daysClean >= 30, description: "Un mois de sevrage" },
    { label: "100€", icon: Wallet, unlocked: stats.moneySaved >= 100, description: "100€ économisés" },
    { label: "200 évités", icon: Flame, unlocked: stats.avoided >= 200, description: "200 unités évitées" },
    { label: "Santé 30%", icon: Heart, unlocked: stats.health >= 30, description: "Santé en hausse" },
    { label: "Sommeil stable", icon: Moon, unlocked: stats.daysClean >= 10, description: "10 jours de régularité" },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const progressPct = Math.round((unlockedCount / badges.length) * 100);

  const nextBadge = badges.find((b) => !b.unlocked);

  const nextDayBadge = [
    { days: 1, label: "24h" },
    { days: 3, label: "3 jours" },
    { days: 7, label: "7 jours" },
    { days: 14, label: "14 jours" },
    { days: 30, label: "30 jours" },
    { days: 10, label: "Sommeil stable" },
  ].find((b) => stats.daysClean < b.days);

  const daysRemaining = nextDayBadge ? nextDayBadge.days - stats.daysClean : null;
  const nextProgress = nextDayBadge ? Math.round((stats.daysClean / nextDayBadge.days) * 100) : 100;

  if (stats.loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <div className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-[22px] bg-white/5 animate-pulse" />
          ))}
        </div>
        <AppNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">

        <div className="mb-6">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 mb-1">Progression</p>
          <h1 className="text-2xl font-semibold">Trophées</h1>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center">
            <p className="text-2xl font-semibold leading-none">{unlockedCount}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/50">Obtenus</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center">
            <p className="text-2xl font-semibold leading-none">{badges.length - unlockedCount}</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/50">Restants</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 text-center">
            <p className="text-2xl font-semibold leading-none">{progressPct}%</p>
            <p className="mt-1 text-[10px] uppercase tracking-[0.15em] text-white/50">Complété</p>
          </div>
        </div>

        <div className="mb-5">
          <div className="w-full bg-white/10 rounded-full h-[3px]">
            <div
              className="bg-white rounded-full h-[3px] transition-all duration-700"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {nextBadge && nextDayBadge && (
          <div className="mb-6 rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/50 mb-3">Prochain objectif</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20">
                {(() => { const Icon = nextBadge.icon; return <Icon className="h-5 w-5 text-white/70" strokeWidth={1.5} />; })()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{nextBadge.label}</p>
                <p className="text-xs text-white/50">
                  {daysRemaining === 1 ? "encore 1 jour" : daysRemaining ? `encore ${daysRemaining} jours` : nextBadge.description}
                </p>
              </div>
              <p className="text-sm font-semibold text-white/70">{nextProgress}%</p>
            </div>
            <div className="mt-3 w-full bg-white/10 rounded-full h-[2px]">
              <div
                className="bg-white rounded-full h-[2px] transition-all duration-700"
                style={{ width: `${nextProgress}%` }}
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article
                key={badge.label}
                className={`rounded-2xl border p-3 text-center transition-all duration-300 ${
                  badge.unlocked ? "border-white/25 bg-white/10" : "border-white/8 bg-transparent opacity-30"
                }`}
              >
                {badge.unlocked && (
                  <div className="flex justify-center mb-1">
                    <div className="h-[6px] w-[6px] rounded-full bg-white" />
                  </div>
                )}
                <Icon
                  className={`mx-auto h-5 w-5 ${badge.unlocked ? "text-white" : "text-white/60"}`}
                  strokeWidth={1.5}
                />
                <p className={`mt-2 text-[10px] uppercase tracking-[0.12em] ${badge.unlocked ? "text-white font-medium" : "text-white/60"}`}>
                  {badge.label}
                </p>
              </article>
            );
          })}
        </div>

      </main>
      <AppNavigation />
    </div>
  );
};

export default Trophies;
