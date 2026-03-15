import { Award, Flame, Heart, Moon, Shield, Star, Trophy, Wallet } from "lucide-react";
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
      <div className="min-h-screen bg-[#08080F] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <main className="mx-auto w-full max-w-[430px] px-[18px] pb-24 pt-[20px]">
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-20 animate-pulse rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)]"
              />
            ))}
          </div>
        </main>
        <AppNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080F] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <main className="mx-auto w-full max-w-[430px] px-[18px] pb-24 pt-[20px]">
        <header className="mb-5">
          <p className="text-[9px] uppercase tracking-[0.18em] text-[rgba(255,255,255,0.18)]">PROGRESSION</p>
          <h1 className="mt-1 text-[20px] font-semibold tracking-[-0.02em] text-white">Trophées</h1>
        </header>

        <section className="mb-4 grid grid-cols-3 gap-3">
          <article className="rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-[8px] py-[12px] text-center">
            <p className="text-[22px] leading-none text-[#9D87FF]" style={{ fontFamily: "'DM Mono', monospace" }}>
              {unlockedCount}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.25)]">Obtenus</p>
          </article>

          <article className="rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-[8px] py-[12px] text-center">
            <p className="text-[22px] leading-none text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
              {badges.length - unlockedCount}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.25)]">Restants</p>
          </article>

          <article className="rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-[8px] py-[12px] text-center">
            <p className="text-[22px] leading-none text-white" style={{ fontFamily: "'DM Mono', monospace" }}>
              {progressPct}%
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.25)]">% Complété</p>
          </article>
        </section>

        {nextBadge && nextDayBadge && (
          <section className="mb-5 rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-[18px] py-[16px]">
            <p className="mb-3 text-[9px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.25)]">Prochain objectif</p>

            <div className="flex items-center gap-3">
              <div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(123,97,255,0.25)] bg-[rgba(123,97,255,0.12)]">
                <Trophy className="h-4 w-4 text-[#9D87FF]" strokeWidth={1.7} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-white">{nextBadge.label}</p>
                <p className="text-xs text-[rgba(255,255,255,0.55)]">
                  {daysRemaining === 1 ? "encore 1 jour" : daysRemaining ? `encore ${daysRemaining} jours` : nextBadge.description}
                </p>
              </div>

              <p className="text-sm text-[#9D87FF]" style={{ fontFamily: "'DM Mono', monospace" }}>
                {nextProgress}%
              </p>
            </div>

            <div className="mt-3 h-[3px] w-full rounded-full bg-[rgba(255,255,255,0.06)]">
              <div
                className="h-[3px] rounded-full bg-gradient-to-r from-[#9D87FF] to-[#7B61FF] shadow-[0_0_8px_rgba(123,97,255,0.4)] transition-all duration-700"
                style={{ width: `${nextProgress}%` }}
              />
            </div>
          </section>
        )}

        <section className="grid grid-cols-3 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article
                key={badge.label}
                className={`rounded-[20px] border px-[8px] py-[12px] text-center transition-all duration-300 ${
                  badge.unlocked
                    ? "border-[rgba(123,97,255,0.25)] bg-[rgba(123,97,255,0.10)]"
                    : "border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] opacity-30"
                }`}
              >
                <Icon className={`mx-auto h-5 w-5 ${badge.unlocked ? "text-[#9D87FF]" : "text-white/60"}`} strokeWidth={1.5} />
                <p className={`mt-2 text-[10px] uppercase tracking-[0.1em] ${badge.unlocked ? "text-[#9D87FF]" : "text-white/60"}`}>
                  {badge.label}
                </p>
              </article>
            );
          })}
        </section>
      </main>

      <AppNavigation />
    </div>
  );
};

export default Trophies;
