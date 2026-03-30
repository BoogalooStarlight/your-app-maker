import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import supabase from "@/lib/supabaseClient";

interface CheckInProps {
  onComplete: () => void;
}

type Step = "question" | "module-selector";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

export const CheckIn = ({ onComplete }: CheckInProps) => {
  const [step, setStep] = useState<Step>("question");
  const [userId, setUserId] = useState<string | null>(null);
  const [modules, setModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = useMemo(() => formatDate(new Date()), []);

  const getCurrentUserId = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    if (!earliestModule?.started_at) {
      return;
    }

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
      missingRows.push({
        user_id: currentUserId,
        checked_at: formatDate(cursor),
        cracked: true,
      });
      cursor.setDate(cursor.getDate() + 1);
    }

    if (missingRows.length === 0) {
      return;
    }

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

      if (!currentUserId) {
        return;
      }

      await backfillMissedDays(currentUserId);
    };

    void initialize();
  }, [backfillMissedDays, getCurrentUserId]);

  useEffect(() => {
    if (step !== "module-selector" || !userId) {
      return;
    }

    void loadActiveModules(userId);
  }, [loadActiveModules, step, userId]);

  const handleHeld = async () => {
    if (!userId || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    await supabase.from("daily_checkins").insert({
      user_id: userId,
      checked_at: today,
      cracked: false,
    });

    onComplete();
  };

  const handleCracked = async (moduleSlug: string) => {
    if (!userId || isSubmitting) {
      return;
    }

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

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 backdrop-blur-xl"
      style={{ backgroundColor: "rgba(8, 8, 15, 0.92)", fontFamily: "'DM Sans', sans-serif" }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-xl rounded-3xl border p-8 md:p-10"
        style={{
          background: "rgba(255, 255, 255, 0.028)",
          borderColor: "rgba(255, 255, 255, 0.045)",
          boxShadow: "0 24px 72px rgba(0, 0, 0, 0.45)",
        }}
      >
        {step === "question" ? (
          <div className="flex flex-col items-center text-center">
            <p
              className="text-xs uppercase tracking-[0.32em]"
              style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "'DM Mono', monospace" }}
            >
              AUJOURD&apos;HUI
            </p>
            <h2 className="mt-4 text-[28px] font-bold leading-tight text-white">As-tu tenu ?</h2>

            <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => void handleHeld()}
                disabled={isSubmitting || !userId}
                className="flex-1 rounded-2xl border border-white/10 px-5 py-4 text-base font-semibold text-white transition hover:border-[#7B61FF] hover:bg-[#7B61FF]/18 disabled:cursor-not-allowed disabled:opacity-60"
              >
                ✊ J&apos;ai tenu
              </button>
              <button
                type="button"
                onClick={() => setStep("module-selector")}
                disabled={isSubmitting || !userId}
                className="flex-1 rounded-2xl border border-white/10 px-5 py-4 text-base font-semibold text-white transition hover:border-[#7B61FF] hover:bg-[#7B61FF]/18 disabled:cursor-not-allowed disabled:opacity-60"
              >
                💀 J&apos;ai craqué
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <p
              className="text-xs uppercase tracking-[0.32em]"
              style={{ color: "rgba(255, 255, 255, 0.3)", fontFamily: "'DM Mono', monospace" }}
            >
              QUEL MODULE ?
            </p>

            <div className="mt-7 flex w-full flex-wrap items-center justify-center gap-3">
              {modules.map((moduleSlug) => (
                <button
                  key={moduleSlug}
                  type="button"
                  onClick={() => void handleCracked(moduleSlug)}
                  disabled={isSubmitting}
                  className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-semibold capitalize text-white transition hover:border-[#7B61FF] hover:bg-[#7B61FF]/18 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {moduleSlug.replace(/[-_]/g, " ")}
                </button>
              ))}

              {modules.length === 0 && (
                <p className="text-sm text-white/60">Aucun module actif trouvé.</p>
              )}
            </div>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 rounded-3xl border border-[#7B61FF]/15" />
      </motion.div>
    </div>
  );
};

export default CheckIn;
