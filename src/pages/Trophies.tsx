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

  return (
    <div
      style={{
        background: "#08080F",
        minHeight: "100dvh",
        padding: "20px 18px 100px",
        fontFamily: "DM Sans, sans-serif",
        color: "#fff",
      }}
    >
      {stats.loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              style={{
                height: 96,
                borderRadius: 20,
                border: "1px solid rgba(255,255,255,0.045)",
                background: "rgba(255,255,255,0.028)",
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      ) : (
        <>
          <p
            style={{
              fontSize: 9,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
            }}
          >
            PROGRESSION
          </p>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 2, marginBottom: 18 }}>Trophées</h1>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: 14 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.045)",
                borderRadius: 20,
                padding: "12px 8px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#9D87FF", fontFamily: "DM Mono", fontSize: 24, lineHeight: 1 }}>{unlockedCount}</p>
              <p style={{ marginTop: 4, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                Obtenus
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.045)",
                borderRadius: 20,
                padding: "12px 8px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#FFFFFF", fontFamily: "DM Mono", fontSize: 24, lineHeight: 1 }}>{badges.length - unlockedCount}</p>
              <p style={{ marginTop: 4, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                Restants
              </p>
            </div>
            <div
              style={{
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.045)",
                borderRadius: 20,
                padding: "12px 8px",
                textAlign: "center",
              }}
            >
              <p style={{ color: "#FFFFFF", fontFamily: "DM Mono", fontSize: 24, lineHeight: 1 }}>{progressPct}%</p>
              <p style={{ marginTop: 4, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                % Complété
              </p>
            </div>
          </div>

          {nextBadge && nextDayBadge && (
            <div
              style={{
                background: "rgba(255,255,255,0.028)",
                border: "1px solid rgba(255,255,255,0.045)",
                borderRadius: 20,
                padding: "12px 12px 13px",
                marginBottom: 16,
              }}
            >
              <p style={{ marginBottom: 10, fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
                Prochain objectif
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 999,
                    border: "1px solid rgba(123,97,255,0.25)",
                    background: "rgba(123,97,255,0.10)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Trophy size={18} color="#9D87FF" strokeWidth={1.7} />
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{nextBadge.label}</p>
                  <p style={{ fontSize: 12, color: "rgba(255,255,255,0.55)" }}>
                    {daysRemaining === 1 ? "encore 1 jour" : daysRemaining ? `encore ${daysRemaining} jours` : nextBadge.description}
                  </p>
                </div>
                <p style={{ color: "#9D87FF", fontFamily: "DM Mono", fontSize: 14, fontWeight: 600 }}>{nextProgress}%</p>
              </div>
              <div style={{ height: 3, width: "100%", borderRadius: 100, background: "rgba(255,255,255,0.1)", marginTop: 12 }}>
                <div
                  style={{
                    height: 3,
                    width: `${nextProgress}%`,
                    borderRadius: 100,
                    background: "linear-gradient(90deg, #9D87FF 0%, #7B61FF 100%)",
                  }}
                />
              </div>
            </div>
          )}

          <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {badges.map((badge) => {
              const Icon = badge.icon;
              return (
                <article
                  key={badge.label}
                  style={{
                    borderRadius: 16,
                    border: badge.unlocked ? "1px solid rgba(123,97,255,0.25)" : "1px solid rgba(255,255,255,0.045)",
                    background: badge.unlocked ? "rgba(123,97,255,0.10)" : "rgba(255,255,255,0.028)",
                    color: badge.unlocked ? "#9D87FF" : "rgba(255,255,255,0.6)",
                    opacity: badge.unlocked ? 1 : 0.25,
                    padding: 12,
                    textAlign: "center",
                  }}
                >
                  <Icon size={20} style={{ margin: "0 auto" }} strokeWidth={1.5} />
                  <p style={{ marginTop: 8, fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase" }}>{badge.label}</p>
                </article>
              );
            })}
          </section>
        </>
      )}

      <AppNavigation />
    </div>
  );
};

export default Trophies;
