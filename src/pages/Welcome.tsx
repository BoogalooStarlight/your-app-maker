import { useMemo } from "react";
import { Activity, HeartPulse, LucideIcon, Wind } from "lucide-react";
import { Link } from "react-router-dom";

type WelcomeSlide = {
  title: string;
  route: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  glowClass: string;
};

const welcomeSlides: WelcomeSlide[] = [
  {
    title: "Poumons",
    route: "/smoking",
    description: "Suivi de votre récupération pulmonaire et de votre souffle.",
    icon: Wind,
    colorClass: "text-cyan-300",
    glowClass: "shadow-[0_0_60px_rgba(34,211,238,0.35)]",
  },
  {
    title: "Tabac",
    route: "/smoking",
    description: "Progression anti-tabac, cigarettes évitées et argent économisé.",
    icon: HeartPulse,
    colorClass: "text-orange-300",
    glowClass: "shadow-[0_0_60px_rgba(251,146,60,0.35)]",
  },
  {
    title: "Alcool",
    route: "/alcohol",
    description: "Réduction de la consommation et amélioration de votre santé globale.",
    icon: Activity,
    colorClass: "text-amber-300",
    glowClass: "shadow-[0_0_60px_rgba(252,211,77,0.35)]",
  },
];

const Welcome = () => {
  const selectedSlide = useMemo(() => {
    const slideIndex = Math.floor(Math.random() * welcomeSlides.length);
    return welcomeSlides[slideIndex];
  }, []);

  const CurrentIcon = selectedSlide.icon;

  return (
    <Link
      to={selectedSlide.route}
      className="relative block min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950"
      aria-label={`Ouvrir la rubrique ${selectedSlide.title}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.06),transparent_35%)]" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-xs uppercase tracking-[0.3em] text-white/70">VITALIS</p>

        <div className={`mt-10 rounded-full border border-white/20 bg-white/5 p-10 backdrop-blur ${selectedSlide.glowClass}`}>
          <CurrentIcon className={`h-24 w-24 ${selectedSlide.colorClass} animate-pulse`} />
        </div>

        <h1 className="mt-8 text-5xl font-bold md:text-7xl">{selectedSlide.title}</h1>
        <p className="mt-4 max-w-xl text-white/80">{selectedSlide.description}</p>

        <p className="mt-8 text-sm uppercase tracking-[0.2em] text-white/70">
          Rubrique aléatoire sélectionnée au lancement — touchez l&apos;écran
        </p>
      </main>
    </Link>
  );
};

export default Welcome;
