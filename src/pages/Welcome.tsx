import { useMemo } from "react";
import { Link } from "react-router-dom";

type WelcomeSlide = {
  organ: string;
  route: string;
  image: string;
  description: string;
};

const welcomeSlides: WelcomeSlide[] = [
  {
    organ: "Poumons",
    route: "/smoking",
    image:
      "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1920&q=80",
    description: "Suivi de la récupération pulmonaire et des progrès anti-tabac.",
  },
  {
    organ: "Cœur",
    route: "/heart",
    image:
      "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=1920&q=80",
    description: "Améliorations cardio et objectifs de santé cardiaque.",
  },
  {
    organ: "Foie",
    route: "/alcohol",
    image:
      "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=1920&q=80",
    description: "Réduction de l'alcool et suivi de la récupération hépatique.",
  },
  {
    organ: "Cerveau",
    route: "/mental",
    image:
      "https://images.unsplash.com/photo-1518152006812-edab29b069ac?auto=format&fit=crop&w=1920&q=80",
    description: "Bien-être mental, concentration et gestion du stress.",
  },
];

const Welcome = () => {
  const selectedSlide = useMemo(() => {
    const slideIndex = Math.floor(Math.random() * welcomeSlides.length);
    return welcomeSlides[slideIndex];
  }, []);

  const formattedDate = new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <Link
      to={selectedSlide.route}
      className="relative block min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${selectedSlide.image})` }}
      aria-label={`Ouvrir la rubrique ${selectedSlide.organ}`}
    >
      <div className="absolute inset-0 bg-black/55" />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center p-6 text-center text-white">
        <p className="text-sm uppercase tracking-[0.25em] text-white/80">VITALIS</p>
        <h1 className="mt-4 text-5xl font-bold md:text-7xl">{selectedSlide.organ}</h1>
        <p className="mt-3 text-lg text-white/90 md:text-xl">{formattedDate}</p>
        <p className="mt-8 max-w-xl text-white/85">{selectedSlide.description}</p>
        <p className="mt-10 text-sm uppercase tracking-[0.2em] text-white/80">
          Touchez l&apos;écran pour ouvrir cette rubrique
        </p>
      </main>
    </Link>
  );
};

export default Welcome;
