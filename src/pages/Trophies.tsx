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
      <div className="min-h-screen bg-[#08080F] font-sans text-white">
        <div className="mx-auto w-full max-w-[430px] space-y-4 px-4 pb-24 pt-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-[20px] border border-white/[0.045] bg-white/[0.028]" />
          ))}
        </div>
        <AppNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080F] font-sans text-white">
      <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">
        <header className="mb-6">
          <p className="mb-1 text-[9px] uppercase tracking-widest text-white/20">PROGRESSION</p>
          <h1 className="text-xl font-semibold">Trophées</h1>
        </header>

        <div className="mb-5 grid grid-cols-3 gap-3">
          <div className="rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-3 py-4 text-center">
            <p className="text-2xl leading-none text-[#9D87FF]" style={{ fontFamily: "DM Mono" }}>
              {unlockedCount}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-white/25">Obtenus</p>
          </div>
          <div className="rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-3 py-4 text-center">
            <p className="text-2xl leading-none text-white" style={{ fontFamily: "DM Mono" }}>
              {badges.length - unlockedCount}
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-white/25">Restants</p>
          </div>
          <div className="rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-3 py-4 text-center">
            <p className="text-2xl leading-none text-white" style={{ fontFamily: "DM Mono" }}>
              {progressPct}%
            </p>
            <p className="mt-1 text-[9px] uppercase tracking-widest text-white/25">% Complété</p>
          </div>
        </div>

        {nextBadge && nextDayBadge && (
          <div className="mb-6 rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-4 py-4">
            <p className="mb-3 text-[9px] uppercase tracking-widest text-white/25">Prochain objectif</p>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(123,97,255,0.25)] bg-[rgba(123,97,255,0.12)]">
                <Trophy className="h-5 w-5 text-[#9D87FF]" strokeWidth={1.7} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{nextBadge.label}</p>
                <p className="text-xs text-white/55">
                  {daysRemaining === 1 ? "encore 1 jour" : daysRemaining ? `encore ${daysRemaining} jours` : nextBadge.description}
                </p>
              </div>
              <p className="text-sm font-semibold text-[#9D87FF]" style={{ fontFamily: "DM Mono" }}>
                {nextProgress}%
              </p>
            </div>
            <div className="mt-3 h-[3px] w-full rounded-full bg-white/10">
              <div
                className="h-[3px] rounded-full bg-gradient-to-r from-[#9D87FF] to-[#7B61FF] shadow-[0_0_8px_rgba(123,97,255,0.4)] transition-all duration-700"
                style={{ width: `${nextProgress}%` }}
              />
            </div>
          </div>
        )}

        <section className="grid grid-cols-3 gap-3">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article
                key={badge.label}
                className={`rounded-[16px] border p-3 text-center transition-all duration-300 ${
                  badge.unlocked
                    ? "border-[rgba(123,97,255,0.25)] bg-[rgba(123,97,255,0.10)]"
                    : "border-white/[0.045] bg-white/[0.028] opacity-30"
                }`}
              >
                <Icon className={`mx-auto h-5 w-5 ${badge.unlocked ? "text-[#9D87FF]" : "text-white/60"}`} strokeWidth={1.5} />
                <p className={`mt-2 text-[10px] uppercase tracking-[0.12em] ${badge.unlocked ? "font-medium text-[#9D87FF]" : "text-white/60"}`}>
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
