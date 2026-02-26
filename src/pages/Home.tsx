import { Activity, Coins, HeartPulse, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";
import { useAllAddictions } from "@/hooks/useAllAddictions";

const cardClass = "rounded-[24px] border border-white/10 bg-transparent p-4";

const Home = () => {
  const { totalDays, totalMoneySaved, activeCount } = useAllAddictions();

  const totalDaysRounded = Math.floor(totalDays);
  const progressPercent = Math.min(100, Math.round((totalDaysRounded / 365) * 100));
  const ringValue = 565 - (565 * progressPercent) / 100;

  return (
    <div className="min-h-screen bg-[#000000] px-4 py-6 pb-24 text-white md:px-8">
      <div className="mx-auto w-full max-w-6xl space-y-6">
        <section className={`${cardClass} flex flex-col items-center text-center`}>
          <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Temps de sevrage total</p>

          <div className="relative mt-6 h-52 w-52">
            <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
              <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.12)" strokeWidth="10" fill="none" />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="white"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                strokeDasharray="565"
                strokeDashoffset={ringValue}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-5xl font-extrabold leading-none">{totalDaysRounded}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">jours</p>
            </div>
          </div>

          {activeCount === 0 && (
            <div className="mt-4 space-y-3 text-center">
              <p className="text-sm text-white/70">Aucune addiction suivie</p>
              <Link
                to="/modules"
                className="inline-flex rounded-full border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.14em] text-white/85 transition-all duration-300 hover:bg-white/10"
              >
                Aller aux modules
              </Link>
            </div>
          )}
        </section>

        <section className="grid gap-3 md:grid-cols-3">
          <article className={`${cardClass} flex items-center justify-between`}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Argent</p>
              <p className="mt-2 text-3xl font-extrabold">{Math.round(totalMoneySaved)}€</p>
            </div>
            <Coins className="h-5 w-5 text-white/70" />
          </article>

          <article className={`${cardClass} flex items-center justify-between`}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Évités</p>
              <p className="mt-2 text-3xl font-extrabold">{totalDaysRounded}</p>
            </div>
            <Activity className="h-5 w-5 text-white/70" />
          </article>

          <article className={`${cardClass} flex items-center justify-between`}>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/60">Santé</p>
              <p className="mt-2 text-3xl font-extrabold">{progressPercent}%</p>
            </div>
            <HeartPulse className="h-5 w-5 text-white/70" />
          </article>
        </section>

        <article className={`${cardClass} flex items-center justify-between text-sm text-white/70`}>
          <span>Objectif annuel</span>
          <span className="inline-flex items-center gap-2">
            <Shield className="h-4 w-4" />
            {progressPercent}% complété
          </span>
        </article>
      </div>
      <AppNavigation />
    </div>
  );
};

export default Home;
