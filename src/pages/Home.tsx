import { Brain, Cigarette, HeartPulse, Moon, TrendingUp, Wine } from "lucide-react";
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
      const cigarettesPerPack = 20;

      cigarettesAvoided = Math.floor((totalMinutes / (60 * 24)) * cigarettesPerDay);
      moneySaved = (cigarettesAvoided / cigarettesPerPack) * packPrice;
      lungHealth = Math.min(100, Math.max(5, Math.round((totalDays / 365) * 100)));
    } catch {
      totalDays = 0;
      cigarettesAvoided = 0;
      moneySaved = 0;
      lungHealth = 5;
    }
  }

  const healthSteps = [
    { label: "Respiration plus facile", time: "1 jour", done: totalDays >= 1 },
    { label: "Odorat amélioré", time: "7 jours", done: totalDays >= 7 },
    { label: "Capacité pulmonaire", time: "1 mois", done: totalDays >= 30 },
  ];

  return (
    <div className="min-h-screen bg-[#07090f] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-white/45">VITALIS</p>
            <h1 className="mt-1 text-2xl font-medium">Tableau de bord santé</h1>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/70">Aujourd&apos;hui</div>
        </div>

        <section className="grid gap-5 lg:grid-cols-3">
          <article className="rounded-[28px] border border-emerald-300/20 bg-gradient-to-b from-emerald-300/10 to-transparent p-5">
            <p className="text-lg font-medium">Bonjour Thomas</p>
            <p className="text-sm text-white/60">Vous êtes sans cigarette.</p>

            <div className="mx-auto mt-6 flex h-40 w-40 items-center justify-center rounded-full border border-emerald-300/40 bg-emerald-300/10">
              <div className="text-center">
                <p className="text-5xl font-light leading-none">{totalDays}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-white/60">jours</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/5 p-2">
                <p className="text-xl font-light">{Math.round(moneySaved)}€</p>
                <p className="text-[10px] uppercase tracking-wider text-white/55">économisés</p>
              </div>
              <div className="rounded-xl bg-white/5 p-2">
                <p className="text-xl font-light">{cigarettesAvoided}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/55">évitées</p>
              </div>
              <div className="rounded-xl bg-white/5 p-2">
                <p className="text-xl font-light">{Math.max(0, Math.floor(totalDays / 2))}</p>
                <p className="text-[10px] uppercase tracking-wider text-white/55">jours vie</p>
              </div>
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-medium">Progression</h2>
              <TrendingUp className="h-5 w-5 text-white/60" />
            </div>

            <div className="space-y-3">
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-2xl font-light">{totalDays} <span className="text-sm text-white/60">jours</span></p>
                <p className="text-xs text-white/55">Smoke-free</p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-2xl font-light">{Math.round(moneySaved)}€ <span className="text-sm text-white/60">économisés</span></p>
              </div>
              <div className="rounded-2xl bg-white/5 p-3">
                <p className="text-2xl font-light">{cigarettesAvoided} <span className="text-sm text-white/60">cigarettes</span></p>
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <Link to="/smoking" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:bg-white/[0.06]">
                <span className="inline-flex items-center gap-2"><Cigarette className="h-4 w-4 text-amber-300" /> Anti-Tabac</span>
                <span className="text-white/60">ouvrir</span>
              </Link>
              <Link to="/alcohol" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:bg-white/[0.06]">
                <span className="inline-flex items-center gap-2"><Wine className="h-4 w-4 text-rose-300" /> Anti-Alcool</span>
                <span className="text-white/60">ouvrir</span>
              </Link>
              <Link to="/mental" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:bg-white/[0.06]">
                <span className="inline-flex items-center gap-2"><Brain className="h-4 w-4 text-teal-300" /> Santé mentale</span>
                <span className="text-white/60">ouvrir</span>
              </Link>
              <Link to="/energy" className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm hover:bg-white/[0.06]">
                <span className="inline-flex items-center gap-2"><Moon className="h-4 w-4 text-sky-300" /> Énergie & Sommeil</span>
                <span className="text-white/60">ouvrir</span>
              </Link>
            </div>
          </article>

          <article className="rounded-[28px] border border-cyan-300/20 bg-gradient-to-b from-cyan-300/10 to-transparent p-5">
            <div className="mb-4">
              <h2 className="text-xl font-medium">Santé pulmonaire</h2>
              <p className="text-sm text-white/60">Récupération fonction respiratoire</p>
            </div>

            <div className="mx-auto mt-3 flex h-44 w-44 items-center justify-center rounded-full border border-cyan-300/40 bg-cyan-300/10">
              <div className="text-center">
                <HeartPulse className="mx-auto h-10 w-10 text-cyan-300" />
                <p className="mt-2 text-4xl font-light">{lungHealth}%</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              {healthSteps.map((step) => (
                <div key={step.label} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <div>
                    <p className="text-sm">{step.label}</p>
                    <p className="text-xs text-white/50">{step.time}</p>
                  </div>
                  <span className={`h-2.5 w-2.5 rounded-full ${step.done ? "bg-emerald-300" : "bg-white/25"}`} />
                </div>
              ))}
            </div>
          </article>
        </section>

        {!hasSmokingTracker && (
          <p className="mt-5 text-sm text-white/55">
            Configurez d&apos;abord Anti-Tabac pour activer les vraies statistiques (jours, argent, récupération).
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
