import { useEffect, useMemo, useState } from "react";
import { animate, useMotionValue } from "@/lib/motionValue";
import { Activity, Coins, LogOut, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";
import CheckIn from "@/components/CheckIn";
import supabase from "@/lib/supabaseClient";
import { useStats } from "@/hooks/useStats";

const ACCENT = "#7B61FF";
const ARC_SWEEP = 300;
const ARC_RADIUS = 92;
const ARC_CIRCUMFERENCE = 2 * Math.PI * ARC_RADIUS;
const ARC_LENGTH = (ARC_CIRCUMFERENCE * ARC_SWEEP) / 360;
const ARC_GAP = ARC_CIRCUMFERENCE - ARC_LENGTH;

const Home = () => {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState<string>("");
  const [arcProgress, setArcProgress] = useState(0);
  const [animatedDays, setAnimatedDays] = useState(0);
  const [animatedMoney, setAnimatedMoney] = useState(0);
  const [animatedAvoided, setAnimatedAvoided] = useState(0);
  const [animatedGoal, setAnimatedGoal] = useState(0);
  const [showCheckIn, setShowCheckIn] = useState(false);

  const stats = useStats();

  const dayMotion = useMotionValue(0);
  const moneyMotion = useMotionValue(0);
  const avoidedMotion = useMotionValue(0);
  const goalMotion = useMotionValue(0);

  const annualGoal = useMemo(() => Math.min((stats.daysClean / 365) * 100, 100), [stats.daysClean]);

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const value = (user as { user_metadata?: { pseudo?: string } } | null)?.user_metadata?.pseudo;
      setPseudo(value ?? "");

      if (!user?.id) {
        return;
      }

      const today = new Date().toISOString().split("T")[0];
      const { data: checkIn } = await supabase
        .from("daily_checkins")
        .select("user_id")
        .eq("user_id", user.id)
        .eq("checked_at", today)
        .maybeSingle();

      if (!checkIn) {
        setShowCheckIn(true);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    let raf = 0;
    const duration = 1400;
    const start = performance.now();

    const loop = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setArcProgress(eased);

      if (t < 1) {
        raf = requestAnimationFrame(loop);
      }
    };

    raf = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const controls = [
      animate(dayMotion, stats.daysClean, {
        duration: 1.25,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => setAnimatedDays(Math.floor(latest)),
      }),
      animate(moneyMotion, stats.moneySaved, {
        duration: 1.35,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => setAnimatedMoney(latest),
      }),
      animate(avoidedMotion, stats.avoided, {
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => setAnimatedAvoided(Math.floor(latest)),
      }),
      animate(goalMotion, annualGoal, {
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => setAnimatedGoal(latest),
      }),
    ];

    return () => controls.forEach((control) => control.stop());
  }, [annualGoal, avoidedMotion, dayMotion, goalMotion, moneyMotion, stats.avoided, stats.daysClean, stats.moneySaved]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#08080F] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <section className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-white/55">Dashboard personnel</p>
            <p className="mt-1 text-2xl font-semibold text-white/95">Bonjour {pseudo || "vous"} ✨</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-2xl border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.03)] px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Quitter
          </button>
        </section>

        <section className="rounded-[28px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-5 py-6 backdrop-blur-[24px]">
          <p className="text-center text-[11px] uppercase tracking-[0.25em] text-white/65">Temps de sevrage total</p>

          <div className="relative mx-auto mt-5 flex h-[240px] w-[240px] items-center justify-center">
            <svg className="absolute h-full w-full" viewBox="0 0 240 240" fill="none" aria-hidden>
              <defs>
                <linearGradient id="recoveryArc" x1="20" y1="120" x2="220" y2="120" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#9D87FF" />
                  <stop offset="1" stopColor={ACCENT} />
                </linearGradient>
              </defs>

              <circle cx="120" cy="120" r={ARC_RADIUS} stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none" strokeDasharray={`${ARC_LENGTH} ${ARC_GAP}`} transform="rotate(-60 120 120)" />
              <circle
                cx="120"
                cy="120"
                r={ARC_RADIUS}
                stroke="url(#recoveryArc)"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${ARC_LENGTH} ${ARC_GAP}`}
                strokeDashoffset={ARC_LENGTH * (1 - arcProgress)}
                transform="rotate(-60 120 120)"
              />
            </svg>

            <div className="relative text-center">
              <p className="text-6xl font-semibold leading-none">{animatedDays}</p>
              <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/60">jours clean</p>
            </div>
          </div>

          {!stats.hasModules && (
            <div className="mt-2 text-center">
              <p className="text-lg text-white/85">Aucune addiction suivie pour l'instant.</p>
              <Link
                to="/modules"
                className="mt-4 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-[#9D87FF] to-[#7B61FF] px-6 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white shadow-[0_14px_36px_rgba(123,97,255,0.28)] transition hover:brightness-110"
              >
                Ajouter un module
              </Link>
            </div>
          )}
        </section>

        <section className="mt-5 grid gap-4">
          <article className="rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-5 py-5 backdrop-blur-[24px]">
            <div className="flex items-center justify-between text-white/65">
              <p className="text-[11px] uppercase tracking-[0.18em]">Argent économisé</p>
              <Coins className="h-4 w-4" style={{ color: ACCENT }} />
            </div>
            <p className="mt-3 text-4xl font-semibold leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>
              {animatedMoney % 1 === 0 ? `${animatedMoney.toFixed(0)}€` : `${animatedMoney.toFixed(2)}€`}
            </p>
          </article>

          <article className="rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-5 py-5 backdrop-blur-[24px]">
            <div className="flex items-center justify-between text-white/65">
              <p className="text-[11px] uppercase tracking-[0.18em]">Évités</p>
              <Activity className="h-4 w-4" style={{ color: ACCENT }} />
            </div>
            <p className="mt-3 text-4xl font-semibold leading-none" style={{ fontFamily: "'DM Mono', monospace" }}>
              {animatedAvoided}
            </p>
          </article>

          <article className="rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-5 py-5 backdrop-blur-[24px]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-white/65">Objectif annuel</p>
                <p className="mt-2 text-lg text-white/85">{Math.round(animatedGoal)}% complété</p>
              </div>
              <Sparkles className="h-5 w-5" style={{ color: ACCENT }} />
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${Math.max(0, Math.min(animatedGoal, 100))}%`,
                  background: "linear-gradient(90deg, #9D87FF 0%, #7B61FF 100%)",
                  boxShadow: "0 0 16px rgba(123,97,255,0.45)",
                }}
              />
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-[20px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] px-5 py-4 text-center backdrop-blur-[24px]">
          <p className="text-sm italic text-white/72">“Chaque jour sans rechute est une victoire silencieuse qui change tout.”</p>
        </section>
      </main>

      <AppNavigation />

      {showCheckIn && (
        <div className="fixed inset-0 z-50">
          <CheckIn onComplete={() => setShowCheckIn(false)} />
        </div>
      )}
    </div>
  );
};

export default Home;
