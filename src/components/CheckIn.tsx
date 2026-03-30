import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import supabase from "@/lib/supabaseClient";

interface CheckInProps {
  onComplete: () => void;
}

type Step = "question" | "module-selector";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

const MODULE_LABELS: Record<string, { emoji: string; label: string }> = {
  tabac: { emoji: "🚬", label: "Tabac" },
  alcool: { emoji: "🍷", label: "Alcool" },
  substances: { emoji: "💊", label: "Substances" },
  "jeux-argent": { emoji: "🎰", label: "Jeux d'argent" },
  pornographie: { emoji: "📵", label: "Pornographie" },
  fornication: { emoji: "🔥", label: "Fornication" },
  "temps-ecran": { emoji: "📱", label: "Temps d'écran" },
  nourriture: { emoji: "🍫", label: "Nourriture" },
};

const ENCOURAGEMENTS = [
  "Chaque jour est une nouvelle bataille.",
  "Tu es plus fort que tes envies.",
  "Un pas à la fois. C'est tout ce qu'il faut.",
  "Revenir ici, c'est déjà gagner.",
  "Ton âme mérite ce combat.",
];

export const CheckIn = ({ onComplete }: CheckInProps) => {
  const [step, setStep] = useState<Step>("question");
  const [userId, setUserId] = useState<string | null>(null);
  const [modules, setModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);

  const today = useMemo(() => formatDate(new Date()), []);
  const encouragement = useMemo(
    () => ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)],
    []
  );

  const getCurrentUserId = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? null;
  }, []);

  const backfillMissedDays = useCallback(async (currentUserId: string) => {
    const [{ data: latestCheckin }, { data: earliestModule }] = await Promise.all([
      supabase
        .from("daily_checkins")
        .select("checked_at")
        .eq("user_id", currentUserId)
        .order("checked_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("user_modules")
        .select("started_at")
        .eq("user_id", currentUserId)
        .not("started_at", "is", null)
        .order("started_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
    ]);

    if (!earliestModule?.started_at) return;

    const referenceDate = latestCheckin?.checked_at
      ? new Date(latestCheckin.checked_at)
      : new Date(earliestModule.started_at);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const missingRows: Array<{ user_id: string; checked_at: string; cracked: boolean }> = [];
    const cursor = new Date(referenceDate);
    cursor.setHours(0, 0, 0, 0);

    while (cursor <= yesterday) {
      missingRows.push({ user_id: currentUserId, checked_at: formatDate(cursor), cracked: true });
      cursor.setDate(cursor.getDate() + 1);
    }

    if (missingRows.length === 0) return;

    await supabase
      .from("daily_checkins")
      .upsert(missingRows, { onConflict: "user_id,checked_at", ignoreDuplicates: true });
  }, []);

  const loadActiveModules = useCallback(async (currentUserId: string) => {
    const { data } = await supabase
      .from("user_modules")
      .select("module_slug")
      .eq("user_id", currentUserId)
      .eq("is_active", true);
    setModules((data ?? []).map((item) => item.module_slug));
  }, []);

  useEffect(() => {
    const initialize = async () => {
      const currentUserId = await getCurrentUserId();
      setUserId(currentUserId);
      if (!currentUserId) return;
      await Promise.all([backfillMissedDays(currentUserId), loadActiveModules(currentUserId)]);
    };
    void initialize();
  }, [backfillMissedDays, getCurrentUserId, loadActiveModules]);

  const handleHeld = async () => {
    if (!userId || isSubmitting) return;
    setIsSubmitting(true);
    await supabase.from("daily_checkins").insert({ user_id: userId, checked_at: today, cracked: false });
    onComplete();
  };

  const handleCracked = async (moduleSlug: string) => {
    if (!userId || isSubmitting) return;
    setSelectedModule(moduleSlug);
    setIsSubmitting(true);
    await supabase.from("daily_checkins").insert({
      user_id: userId,
      checked_at: today,
      cracked: true,
      module_slug: moduleSlug,
    });
    await supabase
      .from("user_modules")
      .update({ started_at: new Date().toISOString() })
      .eq("user_id", userId)
      .eq("module_slug", moduleSlug);
    onComplete();
  };

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour, guerrier·ère." : hour < 18 ? "Bonne après-midi." : "Bonsoir, courageux·se.";

  return (
    <div
      className="fixed inset-0 z-[120] flex items-end justify-center sm:items-center"
      style={{
        backgroundColor: "rgba(8, 8, 15, 0.88)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      {/* Soft glow */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 400,
          height: 400,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(123,97,255,0.07) 0%, transparent 70%)",
        }}
      />

      <AnimatePresence mode="wait">
        {step === "question" ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm mx-4 mb-6 sm:mb-0 rounded-[32px] p-7"
            style={{
              background: "rgba(255,255,255,0.028)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            {/* Top label */}
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#7B61FF", boxShadow: "0 0 6px rgba(123,97,255,0.8)" }}
              />
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}
              >
                Check-in du jour
              </p>
            </div>

            {/* Greeting */}
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginBottom: 6 }}>
              {greeting}
            </p>

            {/* Main question */}
            <h2
              style={{
                fontSize: 26,
                fontWeight: 700,
                color: "rgba(255,255,255,0.95)",
                lineHeight: 1.25,
                letterSpacing: "-0.02em",
                marginBottom: 8,
              }}
            >
              As-tu tenu sur tous tes fronts ?
            </h2>

            {/* Modules pill list */}
            {modules.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-7">
                {modules.map((slug) => {
                  const meta = MODULE_LABELS[slug];
                  return (
                    <span
                      key={slug}
                      style={{
                        fontSize: 11,
                        padding: "3px 10px",
                        borderRadius: 999,
                        background: "rgba(123,97,255,0.1)",
                        border: "1px solid rgba(123,97,255,0.2)",
                        color: "rgba(255,255,255,0.55)",
                        fontFamily: "'DM Mono', monospace",
                      }}
                    >
                      {meta ? `${meta.emoji} ${meta.label}` : slug}
                    </span>
                  );
                })}
              </div>
            )}

            {/* Encouragement */}
            <p
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.22)",
                fontStyle: "italic",
                marginBottom: 24,
                lineHeight: 1.5,
              }}
            >
              {encouragement}
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => void handleHeld()}
                disabled={isSubmitting || !userId}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: 18,
                  background: "linear-gradient(135deg, #7B61FF 0%, #9B85FF 100%)",
                  border: "none",
                  color: "white",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  boxShadow: "0 8px 24px rgba(123,97,255,0.35)",
                  letterSpacing: "-0.01em",
                }}
              >
                ✊ Oui, j'ai tenu
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => setStep("module-selector")}
                disabled={isSubmitting || !userId}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  borderRadius: 18,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: isSubmitting ? "not-allowed" : "pointer",
                  opacity: isSubmitting ? 0.6 : 1,
                  letterSpacing: "-0.01em",
                }}
              >
                Non, j'ai craqué
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="module-selector"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-sm mx-4 mb-6 sm:mb-0 rounded-[32px] p-7"
            style={{
              background: "rgba(255,255,255,0.028)",
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)",
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "rgba(255,100,100,0.8)", boxShadow: "0 0 6px rgba(255,100,100,0.5)" }}
              />
              <p
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: 10,
                  letterSpacing: "0.22em",
                  color: "rgba(255,255,255,0.3)",
                  textTransform: "uppercase",
                }}
              >
                C'est ok. On repart.
              </p>
            </div>

            <h2
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: "rgba(255,255,255,0.92)",
                lineHeight: 1.3,
                letterSpacing: "-0.02em",
                marginBottom: 6,
              }}
            >
              Sur quel front as-tu craqué ?
            </h2>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", marginBottom: 24 }}>
              Ça remet le compteur à zéro. Et c'est ok.
            </p>

            <div className="flex flex-col gap-2.5">
              {modules.map((slug, i) => {
                const meta = MODULE_LABELS[slug];
                const isSelected = selectedModule === slug;
                return (
                  <motion.button
                    key={slug}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => void handleCracked(slug)}
                    disabled={isSubmitting}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: "13px 16px",
                      borderRadius: 16,
                      background: isSelected ? "rgba(123,97,255,0.15)" : "rgba(255,255,255,0.04)",
                      border: isSelected
                        ? "1px solid rgba(123,97,255,0.4)"
                        : "1px solid rgba(255,255,255,0.07)",
                      color: "rgba(255,255,255,0.85)",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: isSubmitting ? "not-allowed" : "pointer",
                      opacity: isSubmitting && !isSelected ? 0.4 : 1,
                      textAlign: "left",
                      transition: "all 0.2s ease",
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{meta?.emoji ?? "⚡"}</span>
                    <span>{meta?.label ?? slug}</span>
                  </motion.button>
                );
              })}

              {modules.length === 0 && (
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", textAlign: "center", padding: "20px 0" }}>
                  Aucun module actif trouvé.
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setStep("question")}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "10px",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.2)",
                fontSize: 12,
                cursor: "pointer",
              }}
            >
              ← Retour
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CheckIn;