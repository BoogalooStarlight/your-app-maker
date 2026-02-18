import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Atom,
  Brain,
  ChevronRight,
  Cigarette,
  Clock3,
  Coins,
  HeartPulse,
  Moon,
  Wine,
} from "lucide-react";
import { Link } from "react-router-dom";

const RiveMonogram = ({ compact = false }: { compact?: boolean }) => (
  <div className={`flex items-center justify-center ${compact ? "p-1" : "p-10"}`}>
    <svg
      width={compact ? "64" : "120"}
      height={compact ? "64" : "120"}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Monogramme logo"
    >
      <rect x="8" y="8" width="104" height="104" rx="22" fill="black" />
      <text
        x="50"
        y="76"
        fill="white"
        fontSize={compact ? "50" : "56"}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="400"
        textAnchor="middle"
      >
        R
      </text>
      <path d="M58 62L68 84" stroke="white" strokeWidth="6" strokeLinecap="round" />
      <text
        x="73"
        y="76"
        fill="white"
        fontSize={compact ? "50" : "56"}
        fontFamily="Inter, system-ui, sans-serif"
        fontWeight="400"
        textAnchor="middle"
      >
        V
      </text>
    </svg>
  </div>
);

const useCountUp = (target: number, animate: boolean, duration = 900) => {
  const [value, setValue] = useState(target);

  useEffect(() => {
    if (!animate) {
      setValue(target);
      return;
    }

    let frame = 0;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(target * progress);
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, animate, duration]);

  return Math.round(value);
};

const MILESTONES = [
  {
    minutes: 20,
    label: "20 minutes",
    benefit: "Votre pression artérielle commence à se normaliser.",
  },
  {
    minutes: 1440,
    label: "24 heures",
    benefit: "Le risque de crise cardiaque commence à diminuer.",
  },
  {
    minutes: 2880,
    label: "48 heures",
    benefit: "Votre goût et votre odorat commencent à revenir.",
  },
  {
    minutes: 10080,
    label: "1 semaine",
    benefit: "La respiration devient plus facile au quotidien.",
  },
  {
    minutes: 43200,
    label: "1 mois",
    benefit: "Votre capacité pulmonaire progresse nettement.",
  },
];

const formatRemaining = (minutes: number) => {
  const days = Math.floor(minutes / (60 * 24));
  const hours = Math.floor((minutes % (60 * 24)) / 60);

  if (days > 0) return `${days}j ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${minutes} min`;
};

const cardClass =
  "relative overflow-hidden rounded-[28px] border border-[rgba(255,255,255,0.1)] bg-[#1C1C1E] p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]";

const Home = () => {
  const smokingData = localStorage.getItem("smokingTrackerData");
  const hasSmokingTracker = !!smokingData;

  const hasSeenOnboarding = useMemo(
    () => localStorage.getItem("vitalisOnboardingSeen") === "true",
    [],
  );

  const [showOnboarding, setShowOnboarding] = useState(!hasSeenOnboarding);
  const [step, setStep] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [dashboardVisible, setDashboardVisible] = useState(hasSeenOnboarding);

  let totalMinutes = 0;
  let totalDays = 0;
  let cigarettesAvoided = 0;
  let moneySaved = 0;
  let lungHealth = 5;

  if (smokingData) {
    try {
      const data = JSON.parse(smokingData);
      const quitDate = new Date(data.quitDate);
      totalMinutes = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60));
      totalMinutes = Math.max(0, totalMinutes);
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
      totalMinutes = 0;
    }
  }

  const shouldAnimateCounters = !showOnboarding && dashboardVisible;
  const daysDisplay = useCountUp(totalDays, shouldAnimateCounters);
  const moneyDisplay = useCountUp(Math.round(moneySaved), shouldAnimateCounters);
  const cigarettesDisplay = useCountUp(cigarettesAvoided, shouldAnimateCounters);
  const lungHealthDisplay = useCountUp(lungHealth, shouldAnimateCounters);

  const moduleLinks = [
    { label: "Anti-Tabac", href: "/smoking", icon: Cigarette, color: "text-amber-300" },
    { label: "Anti-Alcool", href: "/alcohol", icon: Wine, color: "text-rose-300" },
    { label: "Santé mentale", href: "/mental", icon: Brain, color: "text-teal-300" },
    { label: "Énergie & Sommeil", href: "/energy", icon: Moon, color: "text-sky-300" },
    { label: "Anti-Ballons", href: "/balloons", icon: Atom, color: "text-violet-300" },
  ];

  const onboardingSteps = [
    {
      title: "Bienvenue dans votre nouvelle trajectoire.",
      body: "Une expérience claire, premium et apaisante pour suivre vos progrès santé.",
      content: (
        <div className="logo-container flex w-full items-center justify-center text-center">
          <RiveMonogram />
        </div>
      ),
    },
    {
      title: "Tout ce qui compte, au même endroit.",
      body: "Comprenez instantanément votre progression santé, vos économies et le temps gagné.",
      content: (
        <div className="grid w-full max-w-md gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1C1C1E] p-4">
            <HeartPulse className="h-5 w-5 text-emerald-300" />
            <span className="text-sm text-white/85">Santé</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1C1C1E] p-4">
            <Coins className="h-5 w-5 text-sky-300" />
            <span className="text-sm text-white/85">Économies</span>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1C1C1E] p-4">
            <Clock3 className="h-5 w-5 text-violet-300" />
            <span className="text-sm text-white/85">Temps gagné</span>
          </div>
        </div>
      ),
    },
    {
      title: "Prêt à démarrer ?",
      body: "Votre dashboard vous attend avec une lecture simple de votre parcours.",
      content: (
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("vitalisOnboardingSeen", "true");
            setIsFading(true);
            window.setTimeout(() => {
              setShowOnboarding(false);
              setDashboardVisible(true);
            }, 300);
          }}
          className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:scale-[1.02]"
        >
          Commencer mon parcours
        </button>
      ),
    },
  ] as const;

  const lungRingOffset = 314 - (314 * lungHealthDisplay) / 100;
  const nextMilestone = MILESTONES.find((m) => totalMinutes < m.minutes) ?? null;

  useEffect(() => {
    if (dashboardVisible) {
      const timer = window.setTimeout(() => {
        setIsFading(false);
      }, 350);
      return () => window.clearTimeout(timer);
    }
  }, [dashboardVisible]);

  const nextStep = () => {
    if (step >= onboardingSteps.length - 1) return;

    setIsFading(true);
    window.setTimeout(() => {
      setStep((previous) => previous + 1);
      setIsFading(false);
    }, 250);
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white">
      {showOnboarding && (
        <div className="flex min-h-screen items-center justify-center px-4 py-8">
          <div className="w-full max-w-2xl rounded-[28px] border border-white/10 bg-black p-8">
            <div className={`space-y-8 transition-opacity duration-300 ${isFading ? "opacity-0" : "opacity-100"}`}>
              {step > 0 && (
                <div className="space-y-3 text-center">
                  <p className="text-[11px] uppercase tracking-[0.2em] text-[#8E8E93]">Onboarding</p>
                  <h1 className="text-3xl font-semibold md:text-4xl">{onboardingSteps[step].title}</h1>
                  <p className="text-sm text-[#8E8E93]">{onboardingSteps[step].body}</p>
                </div>
              )}

              <div className={`flex items-center justify-center ${step === 0 ? "min-h-[320px]" : ""}`}>{onboardingSteps[step].content}</div>

              {step < onboardingSteps.length - 1 && (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="rounded-full border border-white/10 bg-[#1C1C1E] px-6 py-2.5 text-sm text-white transition-all duration-300 hover:scale-[1.02]"
                  >
                    Continuer
                  </button>
                </div>
              )}

              <div className="flex items-center justify-center gap-2">
                {onboardingSteps.map((_, index) => (
                  <span
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      step === index ? "w-7 bg-white" : "w-1.5 bg-white/35"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {!showOnboarding && (
        <div
          className={`px-4 py-4 transition-all duration-300 md:px-8 md:py-6 ${
            dashboardVisible ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"
          }`}
        >
          <div className="mx-auto w-full max-w-6xl">
            <header className="mb-3 grid min-h-[50px] grid-cols-[1fr_auto_1fr] items-center">
              <div className="flex items-center gap-1.5">
                <span className="font-['Inter'] text-[18px] font-bold tracking-[0.02em] text-white">RIVE</span>
                <span className="inline-block h-2 w-2 rounded-full bg-[#34C759]" aria-hidden="true" />
              </div>

              <div className="flex items-center justify-center">
                <div className="rounded-full border border-white/10 bg-white/[0.03] p-2 backdrop-blur-md">
                  <Activity className="h-4 w-4 text-white/60 animate-[pulse_2.2s_ease-in-out_infinite]" />
                </div>
              </div>

              <div className="flex justify-end">
                <div className="rounded-2xl border-[0.5px] border-white/10 bg-[rgba(255,255,255,0.05)] px-3 py-1.5 text-xs uppercase tracking-[0.16em] text-[#8E8E93] backdrop-blur-xl">
                  Aujourd&apos;hui
                </div>
              </div>
            </header>

            <section className="grid gap-5 lg:grid-cols-2">
              <article className={`${cardClass} lg:col-span-2`}>
                <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_35%,rgba(255,255,255,0)_60%)] opacity-35" />
                <div className="relative z-10">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">Temps de sevrage</p>
                  <div className="mt-4 flex items-end gap-2">
                    <p className="text-8xl font-extrabold leading-none">{daysDisplay}</p>
                    <p className="pb-3 text-sm uppercase tracking-wider text-[#8E8E93]">jours</p>
                  </div>
                </div>
              </article>

              <div className="space-y-5">
                <article className={cardClass}>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_35%,rgba(255,255,255,0)_60%)] opacity-35" />
                  <div className="relative z-10">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">Stats secondaires</p>
                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="rounded-2xl bg-black/30 p-3 text-center backdrop-blur-md">
                        <p className="text-3xl font-extrabold leading-none">{moneyDisplay}€</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8E8E93]">économisés</p>
                      </div>
                      <div className="rounded-2xl bg-black/30 p-3 text-center backdrop-blur-md">
                        <p className="text-3xl font-extrabold leading-none">{cigarettesDisplay}</p>
                        <p className="mt-1 text-[10px] uppercase tracking-wider text-[#8E8E93]">évitées</p>
                      </div>
                    </div>
                  </div>
                </article>

                <article className={cardClass}>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_35%,rgba(255,255,255,0)_60%)] opacity-35" />
                  <div className="relative z-10">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[#8E8E93]">Prochaine victoire</p>
                    {nextMilestone ? (
                      <>
                        <h2 className="mt-3 text-2xl font-semibold">{nextMilestone.label}</h2>
                        <p className="mt-2 text-sm text-white/80">{nextMilestone.benefit}</p>
                        <p className="mt-3 text-xs uppercase tracking-wider text-[#8E8E93]">
                          Dans {formatRemaining(nextMilestone.minutes - totalMinutes)}
                        </p>
                      </>
                    ) : (
                      <>
                        <h2 className="mt-3 text-2xl font-semibold">Objectif annuel atteint</h2>
                        <p className="mt-2 text-sm text-white/80">Vos bénéfices santé majeurs sont déjà engagés. Continuez.</p>
                      </>
                    )}
                  </div>
                </article>
              </div>

              <div className="space-y-5">
                <article className={cardClass}>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_35%,rgba(255,255,255,0)_60%)] opacity-35" />
                  <div className="relative z-10">
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
                  </div>
                </article>

                <article className={cardClass}>
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.03)_35%,rgba(255,255,255,0)_60%)] opacity-35" />
                  <div className="relative z-10">
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
                            strokeDashoffset={lungRingOffset}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-black/15 backdrop-blur-sm">
                          <HeartPulse className="h-7 w-7 text-emerald-300" />
                          <p className="mt-2 text-4xl font-extrabold leading-none">{lungHealthDisplay}%</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 p-3 text-sm text-white/80 backdrop-blur-md">
                      {hasSmokingTracker
                        ? "Votre récupération pulmonaire progresse, continuez sur ce rythme."
                        : "Configurez Anti-Tabac pour activer le suivi détaillé de récupération."}
                    </div>
                  </div>
                </article>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
