import { Award, Flame, Heart, Moon, Shield, Star, Wallet } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import { useStats } from "@/hooks/useStats";

const ACCENT = "#7B61FF";
const ACCENT_MID = "#9D87FF";

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
      <div className="min-h-screen bg-[#08080F] text-white">
        <div className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 rounded-[20px] bg-white/[0.028] animate-pulse border border-white/[0.045]" />
          ))}
        </div>
        <AppNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080F] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">

        {/* Header */}
        <div className="mb-6">
          <p className="text-[9px] uppercase tracking-[0.18em] text-white/[0.18] mb-1">Progression</p>
          <h1 className="text-xl font-semibold tracking-[-0.02em]">Trophées</h1>
        </div>

        {/* Stats 3 colonnes */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-2 py-3 text-center">
            <p className="text-[22px] font-semibold leading-none" style={{ fontFamily: "'DM Mono', monospace", color: ACCENT_MID }}>{unlockedCount}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/25">Obtenus</p>
          </div>
          <div className="rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-2 py-3 text-center">
            <p className="text-[22px] font-semibold leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>{badges.length - unlockedCount}</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/25">Restants</p>
          </div>
          <div className="rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-2 py-3 text-center">
            <p className="text-[22px] font-semibold leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>{progressPct}%</p>
            <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/25">Complété</p>
          </div>
        </div>

        {/* Prochain objectif */}
        {nextBadge && nextDayBadge && (
          <div className="mb-4 rounded-[20px] border border-white/[0.045] bg-white/[0.028] px-4 py-4">
            <p className="text-[9px] uppercase tracking-[0.12em] text-white/25 mb-3">Prochain objectif</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full"
                style={{ background: "rgba(123,97,255,0.12)", border: "1px solid rgba(123,97,255,0.25)" }}>
                {(() => { const Icon = nextBadge.icon; return <Icon className="h-4 w-4" style={{ color: ACCENT_MID }} strokeWidth={1.5} />; })()}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{nextBadge.label}</p>
                <p className="text-[11px] text-white/40">
                  {daysRemaining === 1 ? "encore 1 jour" : daysRemaining ? `encore ${daysRemaining} jours` : nextBadge.description}
                </p>
              </div>
              <p className="text-sm font-semibold" style={{ fontFamily: "'DM Mono', monospace", color: ACCENT_MID }}>{nextProgress}%</p>
            </div>
            <div className="w-full rounded-full overflow-hidden" style={{ height: 3, background: "rgba(255,255,255,0.06)" }}>
              <div className="h-full rounded-full transition-all duration-700"
                style={{ width: `${nextProgress}%`, background: `linear-gradient(90deg, ${ACCENT_MID} 0%, ${ACCENT} 100%)`, boxShadow: "0 0 8px rgba(123,97,255,0.4)" }} />
            </div>
          </div>
        )}

        {/* Grille badges */}
        <div className="grid grid-cols-3 gap-2">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <article
                key={badge.label}
                className="rounded-[16px] p-3 text-center transition-all duration-300"
                style={{
                  background: badge.unlocked ? "rgba(123,97,255,0.10)" : "rgba(255,255,255,0.028)",
                  border: badge.unlocked ? "1px solid rgba(123,97,255,0.25)" : "1px solid rgba(255,255,255,0.045)",
                  opacity: badge.unlocked ? 1 : 0.3,
                }}
              >
                {badge.unlocked && (
                  <div className="flex justify-center mb-1">
                    <div className="h-[5px] w-[5px] rounded-full" style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }} />
                  </div>
                )}
                <Icon
                  className="mx-auto h-5 w-5"
                  style={{ color: badge.unlocked ? ACCENT_MID : "rgba(255,255,255,0.6)" }}
                  strokeWidth={1.5}
                />
                <p className="mt-2 text-[9px] uppercase tracking-[0.1em]"
                  style={{ color: badge.unlocked ? ACCENT_MID : "rgba(255,255,255,0.22)", fontWeight: badge.unlocked ? 500 : 400 }}>
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
