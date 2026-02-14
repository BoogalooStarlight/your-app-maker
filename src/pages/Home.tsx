import { Atom, Brain, ChevronRight, Cigarette, HeartPulse, Moon, Wine } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const smokingData = localStorage.getItem("smokingTrackerData");
  const hasSmokingTracker = !!smokingData;

  let totalDays = 0;
  let cigarettesAvoided = 0;
  let moneySaved = 0;
  let lungHealth = 5;

  if (smokingData) {
    try {
      const data = JSON.parse(smokingData);
      const quitDate = new Date(data.quitDate);
      const totalMinutes = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60));
      totalDays = Math.max(0, Math.floor(totalMinutes / (60 * 24)));

      const cigarettesPerDay = Number(data.cigarettesPerDay) || 0;
      const packPrice = Number(data.packPrice) || 0;

      cigarettesAvoided = Math.floor((totalMinutes / (60 * 24)) * cigarettesPerDay);
      moneySaved = (cigarettesAvoided / 20) * packPrice;
      lungHealth = Math.min(100, Math.max(5, Math.round((totalDays / 365) * 100)));
    } catch {
      totalDays = 0;
      cigarettesAvoided = 0;
      moneySaved = 0;
      lungHealth = 5;
    }
  }

  const moduleLinks = [
    { label: "Anti-Tabac", href: "/smoking", icon: Cigarette, color: "text-amber-300" },
    { label: "Anti-Alcool", href: "/alcohol", icon: Wine, color: "text-rose-300" },
    { label: "Santé mentale", href: "/mental", icon: Brain, color: "text-teal-300" },
    { label: "Énergie & Sommeil", href: "/energy", icon: Moon, color: "text-sky-300" },
    { label: "Anti-Ballons", href: "/balloons", icon: Atom, color: "text-violet-300" },
  ];

  const ringOffset = 314 - (314 * lungHealth) / 100;

  return (
    <div className="min-h-screen bg-[#000000] px-4 py-6 text-white md:px-8 md:py-8">
      <div className="mx-auto w-full max-w-6xl">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-[#8E8E93]">Vitalis</p>
            <h1 className="mt-2 text-3xl font-semibold md:text-4xl">Dashboard</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#8E8E93] backdrop-blur-xl">
            Aujourd&apos;hui
          </div>
        </header>

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#1C1C1E] p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">Smoke-Free</p>
            <div className="mt-4 flex items-end gap-2">
              <p className="text-7xl font-extrabold leading-none">{totalDays}</p>
              <p className="pb-2 text-sm uppercase tracking-wider text-[#8E8E93]">jours</p>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="rounded-2xl bg-black/30 p-3 text-center backdrop-blur-md">
                <p className="text-2xl font-extrabold leading-none">{Math.round(moneySaved)}€</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8E8E93]">économisés</p>
              </div>
              <div className="rounded-2xl bg-black/30 p-3 text-center backdrop-blur-md">
                <p className="text-2xl font-extrabold leading-none">{cigarettesAvoided}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8E8E93]">évitées</p>
              </div>
              <div className="rounded-2xl bg-black/30 p-3 text-center backdrop-blur-md">
                <p className="text-2xl font-extrabold leading-none">{Math.max(0, Math.floor(totalDays / 2))}</p>
                <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8E8E93]">jours vie</p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#1C1C1E] p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">Modules</p>
            <h2 className="mt-3 text-2xl font-semibold">Progression</h2>

            <div className="mt-5 space-y-2">
              {moduleLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/25 px-3 py-3 transition-all duration-300 hover:bg-black/40"
                  >
                    <span className="inline-flex items-center gap-2.5 text-sm">
                      <Icon className={`h-4 w-4 ${item.color}`} />
                      {item.label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#8E8E93]" />
                  </Link>
                );
              })}
            </div>
          </article>

          <article className="rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#1C1C1E] p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">Santé pulmonaire</p>

            <div className="mt-5 flex items-center justify-center">
              <div className="relative h-48 w-48">
                <svg className="h-48 w-48 -rotate-90" viewBox="0 0 120 120" fill="none" aria-hidden="true">
                  <defs>
                    <linearGradient id="lungGradient" x1="0" y1="0" x2="120" y2="120" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#6EE7F9" />
                      <stop offset="1" stopColor="#34D399" />
                    </linearGradient>
                  </defs>
                  <circle cx="60" cy="60" r="50" stroke="rgba(255,255,255,0.12)" strokeWidth="6" />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    stroke="url(#lungGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray="314"
                    strokeDashoffset={ringOffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/15 backdrop-blur-sm">
                  <HeartPulse className="h-7 w-7 text-emerald-300" />
                  <p className="mt-2 text-4xl font-extrabold leading-none">{lungHealth}%</p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/80 backdrop-blur-md">
              {hasSmokingTracker
                ? "Votre récupération pulmonaire progresse, continuez sur ce rythme."
                : "Configurez Anti-Tabac pour activer le suivi détaillé de récupération."}
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default Home;
