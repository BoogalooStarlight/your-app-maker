import { useStats } from "@/hooks/useStats";

const T = {
  bg: "#08080F",
  surface: "rgba(255,255,255,0.028)",
  border: "1px solid rgba(255,255,255,0.045)",
  accent: "#7B61FF",
  accentMid: "#9D87FF",
  accentSurface: "rgba(123,97,255,0.10)",
  accentBorder: "1px solid rgba(123,97,255,0.25)",
  text: "#FFFFFF",
  textMuted: "rgba(255,255,255,0.25)",
  textDim: "rgba(255,255,255,0.18)",
  mono: "'DM Mono', 'Courier New', monospace",
  sans: "'DM Sans', sans-serif",
};

const card: React.CSSProperties = {
  background: T.surface,
  border: T.border,
  borderRadius: 20,
  position: "relative",
  overflow: "hidden",
};

interface Badge {
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string; strokeWidth?: number }>;
  unlocked: boolean;
  description: string;
}

export default function Trophies() {
  const { daysClean, moneySaved, avoided, health } = useStats();

  const badges: Badge[] = [
    {
      label: "24H",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
        </svg>
      ),
      unlocked: daysClean >= 1,
      description: "Première journée clean",
    },
    {
      label: "3 JOURS",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ),
      unlocked: daysClean >= 3,
      description: "3 jours de résistance",
    },
    {
      label: "7 JOURS",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12v7a6 6 0 01-12 0V3z"/><path d="M6 6H3a1 1 0 000 2c0 2 1.5 3.5 3 4"/><path d="M18 6h3a1 1 0 010 2c0 2-1.5 3.5-3 4"/><path d="M12 16v4"/><path d="M8 20h8"/>
        </svg>
      ),
      unlocked: daysClean >= 7,
      description: "Une semaine entière",
    },
    {
      label: "14 JOURS",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
        </svg>
      ),
      unlocked: daysClean >= 14,
      description: "Deux semaines clean",
    },
    {
      label: "30 JOURS",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
        </svg>
      ),
      unlocked: daysClean >= 30,
      description: "Un mois de liberté",
    },
    {
      label: "100€",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
        </svg>
      ),
      unlocked: moneySaved >= 100,
      description: "100€ économisés",
    },
    {
      label: "200 ÉVITÉS",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M4.93 4.93l14.14 14.14"/>
        </svg>
      ),
      unlocked: avoided >= 200,
      description: "200 unités évitées",
    },
    {
      label: "SANTÉ 30%",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
        </svg>
      ),
      unlocked: health >= 30,
      description: "30% de santé récupérée",
    },
    {
      label: "SOMMEIL STABLE",
      icon: ({ size = 20, strokeWidth = 1.5 }) => (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
        </svg>
      ),
      unlocked: daysClean >= 21,
      description: "21 jours pour un sommeil stable",
    },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const progressPct = Math.round((unlockedCount / badges.length) * 100);
  const nextBadge = badges.find((b) => !b.unlocked);

  const daysRemaining = nextBadge?.label.includes("JOURS")
    ? parseInt(nextBadge.label) - daysClean
    : nextBadge?.label === "24H"
    ? 1 - daysClean
    : null;

  const nextProgress = nextBadge?.label.includes("JOURS")
    ? Math.min((daysClean / parseInt(nextBadge.label)) * 100, 100)
    : nextBadge?.label === "24H"
    ? Math.min(daysClean * 100, 100)
    : 0;

  return (
    <div style={{ background: T.bg, minHeight: "100dvh", padding: "20px 18px 100px", fontFamily: T.sans, color: T.text }}>

      {/* Ambient glow */}
      <div style={{ position: "fixed", top: -120, left: "50%", transform: "translateX(-50%)", width: 400, height: 400, borderRadius: "50%", background: "radial-gradient(circle, rgba(123,97,255,0.08) 0%, transparent 70%)", pointerEvents: "none", zIndex: 0 }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: 430, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ paddingTop: 12, marginBottom: 20 }}>
          <p style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: T.textDim }}>PROGRESSION</p>
          <h1 style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em", marginTop: 2 }}>Trophées</h1>
        </div>

        {/* Stats 3 colonnes */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
          <div style={{ ...card, padding: "12px 8px", textAlign: "center" }}>
            <p style={{ fontFamily: T.mono, fontSize: 22, color: T.accentMid, lineHeight: 1 }}>{unlockedCount}</p>
            <p style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginTop: 4 }}>Obtenus</p>
          </div>
          <div style={{ ...card, padding: "12px 8px", textAlign: "center" }}>
            <p style={{ fontFamily: T.mono, fontSize: 22, color: T.text, lineHeight: 1 }}>{badges.length - unlockedCount}</p>
            <p style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginTop: 4 }}>Restants</p>
          </div>
          <div style={{ ...card, padding: "12px 8px", textAlign: "center" }}>
            <p style={{ fontFamily: T.mono, fontSize: 22, color: T.text, lineHeight: 1 }}>{progressPct}%</p>
            <p style={{ fontSize: 9, letterSpacing: "0.1em", textTransform: "uppercase", color: T.textMuted, marginTop: 4 }}>Complété</p>
          </div>
        </div>

        {/* Prochain objectif */}
        {nextBadge && (
          <div style={{ ...card, padding: "16px 18px", marginBottom: 14 }}>
            <p style={{ fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase", color: T.textMuted, marginBottom: 12 }}>Prochain objectif</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: "50%", background: T.accentSurface, border: T.accentBorder, display: "flex", alignItems: "center", justifyContent: "center", color: T.accentMid }}>
                  <nextBadge.icon size={16} strokeWidth={1.5} />
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 500 }}>{nextBadge.label}</p>
                  <p style={{ fontSize: 11, color: "rgba(255,255,255,0.32)" }}>
                    {daysRemaining != null && daysRemaining > 0
                      ? `encore ${daysRemaining} jour${daysRemaining > 1 ? "s" : ""}`
                      : nextBadge.description}
                  </p>
                </div>
              </div>
              <span style={{ fontFamily: T.mono, fontSize: 13, color: T.accentMid }}>{Math.round(nextProgress)}%</span>
            </div>
            <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${nextProgress}%`, background: `linear-gradient(90deg, ${T.accentMid} 0%, ${T.accent} 100%)`, borderRadius: 100, boxShadow: "0 0 8px rgba(123,97,255,0.4)", transition: "width 1s ease" }} />
            </div>
          </div>
        )}

        {/* Grille badges */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.label}
                style={{
                  borderRadius: 16,
                  border: badge.unlocked ? T.accentBorder : T.border,
                  background: badge.unlocked ? T.accentSurface : T.surface,
                  padding: "14px 8px",
                  textAlign: "center",
                  opacity: badge.unlocked ? 1 : 0.3,
                  transition: "all 0.2s",
                }}
              >
                <div style={{ marginBottom: 6, color: badge.unlocked ? T.accentMid : T.text, display: "flex", justifyContent: "center" }}>
                  <Icon size={20} strokeWidth={1.5} />
                </div>
                <p style={{ fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase", color: badge.unlocked ? T.accentMid : "rgba(255,255,255,0.22)" }}>
                  {badge.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
