import { ArrowLeft, Atom, Brain, HeartPulse, Moon, ShieldAlert, Wine } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

type ModuleConfig = {
  title: string;
  description: string;
  icon: typeof Wine;
  accent: string;
  metricLabel: string;
  metricValue: string;
  metricSub: string;
  checklist: string[];
  focus: string[];
};

const modules: Record<string, ModuleConfig> = {
  "/alcohol": {
    title: "Anti-Alcool",
    description: "Réduction progressive, suivi des déclencheurs et récupération du foie.",
    icon: Wine,
    accent: "text-rose-300",
    metricLabel: "Sobriété actuelle",
    metricValue: "7",
    metricSub: "jours",
    checklist: [
      "Hydratation améliorée",
      "Sommeil plus stable",
      "Réduction du stress hépatique",
    ],
    focus: [
      "Limiter les occasions à risque cette semaine",
      "Remplacer 1 verre par une boisson sans alcool",
      "Journal court des envies (2 min/jour)",
    ],
  },
  "/mental": {
    title: "Santé Mentale",
    description: "Routines de respiration, charge mentale et équilibre émotionnel.",
    icon: Brain,
    accent: "text-teal-300",
    metricLabel: "Niveau de sérénité",
    metricValue: "68",
    metricSub: "%",
    checklist: [
      "Respiration 4-7-8 effectuée",
      "Temps d'écran soir réduit",
      "Qualité d'humeur en hausse",
    ],
    focus: [
      "2 sessions de respiration (matin/soir)",
      "Marche de 20 minutes",
      "1 heure sans notifications",
    ],
  },
  "/energy": {
    title: "Énergie & Sommeil",
    description: "Reconstruction de l'énergie quotidienne et optimisation du repos.",
    icon: Moon,
    accent: "text-sky-300",
    metricLabel: "Énergie perçue",
    metricValue: "74",
    metricSub: "%",
    checklist: [
      "Heure de coucher régulière",
      "Réveil plus facile",
      "Moins de fatigue après-midi",
    ],
    focus: [
      "Coucher avant 23h sur 5 jours",
      "Couper caféine après 14h",
      "Routine écran OFF 45 min avant sommeil",
    ],
  },
  "/heart": {
    title: "Santé Cardiaque",
    description: "Suivi cardio léger, endurance et prévention au quotidien.",
    icon: HeartPulse,
    accent: "text-fuchsia-300",
    metricLabel: "Score cardio",
    metricValue: "81",
    metricSub: "%",
    checklist: [
      "Fréquence cardiaque plus stable",
      "Récupération à l'effort améliorée",
      "Tension mieux équilibrée",
    ],
    focus: [
      "30 min de marche rapide, 4x/semaine",
      "Respiration cohérence cardiaque",
      "Réduire sel et ultra-transformés",
    ],
  },
  "/balloons": {
    title: "Anti-Ballons (Protoxyde d'azote)",
    description: "Réduction des usages, prévention neurologique et suivi des risques B12.",
    icon: Atom,
    accent: "text-amber-300",
    metricLabel: "Risque actuel",
    metricValue: "Modéré",
    metricSub: "à réduire",
    checklist: [
      "Sensibilisation aux risques nerveux",
      "Plan d'évitement des soirées à risque",
      "Surveillance fatigue/fourmillements",
    ],
    focus: [
      "Éviter l'usage solitaire et fréquent",
      "Prévoir alternatives sociales sans proto",
      "Consulter un pro si signes neurologiques",
    ],
  },
};

const ComingSoon = () => {
  const location = useLocation();

  const module =
    modules[location.pathname] ?? {
      title: "Programme Santé",
      description: "Suivi personnalisé en cours de préparation.",
      icon: ShieldAlert,
      accent: "text-white",
      metricLabel: "Statut",
      metricValue: "Bientôt",
      metricSub: "disponible",
      checklist: ["Paramètres de base", "Premières recommandations", "Suivi simplifié"],
      focus: ["Configurer votre profil", "Définir un objectif", "Revenir chaque jour"],
    };

  const Icon = module.icon;

  return (
    <div className="min-h-screen bg-[#07090f] px-4 py-6 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <Link to="/">
            <Button variant="ghost" size="icon" className="rounded-2xl border border-white/10 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className="text-sm text-white/50">Module détaillé</span>
        </header>

        <section className="grid gap-5 lg:grid-cols-2">
          <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-medium leading-tight">{module.title}</h1>
                <p className="mt-2 text-sm text-white/60">{module.description}</p>
              </div>
              <div className={`rounded-2xl bg-white/10 p-3 ${module.accent}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-wider text-white/50">{module.metricLabel}</p>
              <p className="mt-2 text-4xl font-light">{module.metricValue}</p>
              <p className="text-sm text-white/60">{module.metricSub}</p>
            </div>

            <div className="mt-6 space-y-2">
              {module.checklist.map((item) => (
                <div key={item} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2">
                  <span className="text-sm text-white/85">{item}</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-300" />
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
            <h2 className="text-lg font-medium">Plan d'action recommandé</h2>
            <p className="mt-1 text-sm text-white/60">Objectifs simples pour les 7 prochains jours.</p>

            <div className="mt-5 space-y-3">
              {module.focus.map((item, index) => (
                <div key={item} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-wider text-white/45">Étape {index + 1}</p>
                  <p className="mt-1 text-sm text-white/85">{item}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100/90">
              <p className="font-medium">Important</p>
              <p className="mt-1 text-amber-100/80">
                Ces conseils ne remplacent pas un avis médical. En cas de symptômes persistants, consultez un professionnel de santé.
              </p>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
};

export default ComingSoon;
