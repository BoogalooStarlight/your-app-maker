import { useMemo } from "react";
import { Activity, HeartPulse, LucideIcon, Wind } from "lucide-react";
import { Link } from "react-router-dom";

type WelcomeSlide = {
  title: string;
  route: string;
  description: string;
  icon: LucideIcon;
  accentClass: string;
};

const welcomeSlides: WelcomeSlide[] = [
  {
    title: "Poumons",
    route: "/smoking",
    description: "Vos poumons respirent la liberté.",
    icon: Wind,
    accentClass: "text-cyan-300",
  },
  {
    title: "Tabac",
    route: "/smoking",
    description: "Chaque jour sans cigarette améliore votre souffle.",
    icon: HeartPulse,
    accentClass: "text-orange-300",
  },
  {
    title: "Alcool",
    route: "/alcohol",
    description: "Votre équilibre revient pas à pas.",
    icon: Activity,
    accentClass: "text-amber-300",
  },
];

const Welcome = () => {
  const selectedSlide = useMemo(() => {
    const slideIndex = Math.floor(Math.random() * welcomeSlides.length);
    return welcomeSlides[slideIndex];
  }, []);

  const CurrentIcon = selectedSlide.icon;

  const smokingData = localStorage.getItem("smokingTrackerData");
  let days = 0;
  let regenerated = 5;

  if (smokingData) {
    try {
      const data = JSON.parse(smokingData);
      const quitDate = new Date(data.quitDate);
      const totalMinutes = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60));
      days = Math.max(0, Math.floor(totalMinutes / (60 * 24)));
      regenerated = Math.min(100, Math.max(5, Math.round((days / 365) * 100)));
    } catch {
      days = 0;
      regenerated = 5;
    }
  }

  return (
    <Link
      to={selectedSlide.route}
      className="block min-h-screen bg-[#060915] px-4 py-5 text-white"
      aria-label={`Ouvrir la rubrique ${selectedSlide.title}`}
    >
      <div className="mx-auto flex min-h-[calc(100vh-2.5rem)] w-full max-w-5xl flex-col rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_50%_18%,rgba(44,85,160,0.22),transparent_35%),#050713] px-5 pb-5 pt-8 md:px-8">
        <header className="text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">Aujourd&apos;hui</p>
          <h1 className="mt-2 text-4xl font-light md:text-5xl">{selectedSlide.title}</h1>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center">
          <div className="relative flex h-72 w-72 items-center justify-center rounded-full border border-cyan-300/20 bg-cyan-400/10 md:h-80 md:w-80">
            <div className="absolute h-56 w-56 rounded-full border border-cyan-200/20 bg-cyan-300/10" />
            <div className="absolute h-40 w-40 rounded-full border border-cyan-100/20 bg-cyan-200/10" />
            <CurrentIcon className={`relative z-10 h-24 w-24 ${selectedSlide.accentClass}`} strokeWidth={1.75} />
          </div>

          <p className="mt-8 text-center text-2xl text-white/75">{selectedSlide.description}</p>

          <div className="mt-6 flex items-center gap-6 rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-center">
            <div>
              <p className="text-4xl font-light leading-none">{days}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/50">jours</p>
            </div>
            <div className="h-12 w-px bg-white/10" />
            <div>
              <p className="text-4xl font-light leading-none">{regenerated}%</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-white/50">régénéré</p>
            </div>
          </div>
        </main>

        <footer className="grid grid-cols-4 rounded-2xl border border-white/10 bg-white/5 px-2 py-2 text-center text-xs text-white/45">
          <div className="rounded-xl bg-violet-500/20 py-2 text-violet-200">Accueil</div>
          <div className="py-2">Respirer</div>
          <div className="py-2">Courir</div>
          <div className="py-2">Profil</div>
        </footer>
      </div>
    </Link>
  );
};

export default Welcome;
