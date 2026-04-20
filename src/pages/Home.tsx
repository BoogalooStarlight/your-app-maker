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

      if (!user?.id) {
        setPseudo("");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("pseudo")
        .eq("id", user.id)
        .maybeSingle();

      setPseudo(profile?.pseudo ?? "");

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
    <div className="min-h-screen bg-[#f5f0e8] text-[#1a1a1a]" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <section className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#5a564d]">Dashboard personnel</p>
            <p className="mt-1 text-2xl font-black text-[#1a1a1a]">Bonjour {pseudo || "vous"} ✨</p>
          </div>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-full border-[2.5px] border-[#1a1a1a] bg-[#1a1a1a] px-4 py-2 text-sm font-black text-[#f5f0e8] shadow-[3px_3px_0_#7B61FF] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_#7B61FF]"
          >
            <LogOut className="h-4 w-4" />
            Quitter
          </button>
        </section>

        <section className="rounded-[20px] border-[2.5px] border-[#1a1a1a] bg-[#ffffff] px-5 py-6 shadow-[4px_4px_0_#1a1a1a]">
          <p className="text-center text-[11px] font-black uppercase tracking-[0.25em] text-[#5a564d]">Temps de sevrage total</p>

          <div className="relative mx-auto mt-5 flex h-[240px] w-[240px] items-center justify-center">
            <svg className="absolute h-full w-full" viewBox="0 0 240 240" fill="none" aria-hidden>
              <circle cx="120" cy="120" r={ARC_RADIUS} stroke="#e8e3d8" strokeWidth="12" fill="none" strokeDasharray={`${ARC_LENGTH} ${ARC_GAP}`} transform="rotate(-60 120 120)" />
              <circle
                cx="120"
                cy="120"
                r={ARC_RADIUS}
                stroke={ACCENT}
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                strokeDasharray={`${ARC_LENGTH} ${ARC_GAP}`}
                strokeDashoffset={ARC_LENGTH * (1 - arcProgress)}
                transform="rotate(-60 120 120)"
              />
            </svg>

            <div className="relative text-center">
              <p className="text-6xl font-black leading-none text-[#1a1a1a]">{animatedDays}</p>
              <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-[#5a564d]">jours clean</p>
            </div>
          </div>

          {!stats.hasModules && (
            <div className="mt-2 text-center">
              <p className="text-lg font-extrabold text-[#2f2f2f]">Aucune addiction suivie pour l'instant.</p>
              <Link
                to="/modules"
                className="mt-4 inline-flex items-center justify-center rounded-full border-[2.5px] border-[#1a1a1a] bg-[#1a1a1a] px-6 py-2 text-xs font-black uppercase tracking-[0.18em] text-[#f5f0e8] shadow-[4px_4px_0_#7B61FF] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_#7B61FF]"
              >
                Ajouter un module
              </Link>
            </div>
          )}
        </section>

        <section className="mt-5 grid gap-4">
          <article className="rounded-[20px] border-[2.5px] border-[#1a1a1a] bg-[#d4f5e2] px-5 py-5 shadow-[3px_3px_0_#1a1a1a]">
            <div className="flex items-center justify-between text-[#1a5c33]">
              <p className="text-[11px] font-black uppercase tracking-[0.18em]">Argent économisé</p>
              <Coins className="h-4 w-4" style={{ color: "#1a5c33" }} />
            </div>
            <p className="mt-3 text-4xl font-black leading-none text-[#1a5c33]">
              {animatedMoney % 1 === 0 ? `${animatedMoney.toFixed(0)}€` : `${animatedMoney.toFixed(2)}€`}
            </p>
          </article>

          <article className="rounded-[20px] border-[2.5px] border-[#1a1a1a] bg-[#ffd6d6] px-5 py-5 shadow-[3px_3px_0_#1a1a1a]">
            <div className="flex items-center justify-between text-[#7a1a1a]">
              <p className="text-[11px] font-black uppercase tracking-[0.18em]">Évités</p>
              <Activity className="h-4 w-4" style={{ color: "#7a1a1a" }} />
            </div>
            <p className="mt-3 text-4xl font-black leading-none text-[#7a1a1a]">{animatedAvoided}</p>
          </article>

          <article className="rounded-[20px] border-[2.5px] border-[#1a1a1a] bg-[#ede8ff] px-5 py-5 shadow-[3px_3px_0_#1a1a1a]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-[#3d2a8a]">Objectif annuel</p>
                <p className="mt-2 text-lg font-black text-[#3d2a8a]">{Math.round(animatedGoal)}% complété</p>
              </div>
              <Sparkles className="h-5 w-5" style={{ color: "#3d2a8a" }} />
            </div>

            <div className="mt-4 h-[10px] overflow-hidden rounded-[100px] border-2 border-[#1a1a1a] bg-[#e8e3d8]">
              <div
                className="h-full rounded-[100px] bg-[#1a1a1a]"
                style={{
                  width: `${Math.max(0, Math.min(animatedGoal, 100))}%`,
                }}
              />
            </div>
          </article>
        </section>

        <section className="mt-6 rounded-[20px] border-[2.5px] border-[#1a1a1a] bg-[#fdf9c4] px-5 py-4 text-center shadow-[4px_4px_0_#1a1a1a]">
          <p className="text-sm font-extrabold italic text-[#1a1a1a]">“Chaque jour sans rechute est une victoire silencieuse qui change tout.”</p>
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
