import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";
import supabase from "@/lib/supabaseClient";

type ModuleDefinition = {
  slug: string;
  emoji: string;
  label: string;
  description: string;
  to: string;
  directTo: string;
};

type UserModule = {
  module_slug: string;
  is_active: boolean;
  started_at: string;
  daily_cost_euros: number | null;
  daily_quantity: number | null;
};

type ModuleStats = {
  days: number;
  moneySaved: number;
  avoided: number;
  health: number;
};

const modules: ModuleDefinition[] = [
  {
    slug: "smoking",
    emoji: "🚬",
    label: "Tabac",
    description: "Réduire puis arrêter la cigarette.",
    to: "/app/smoking-choice",
    directTo: "/app/smoking",
  },
  {
    slug: "alcohol",
    emoji: "🍷",
    label: "Alcool",
    description: "Stabiliser votre consommation d'alcool.",
    to: "/app/alcohol",
    directTo: "/app/alcohol",
  },
  {
    slug: "food",
    emoji: "🍔",
    label: "Nourriture",
    description: "Limiter les compulsions alimentaires.",
    to: "/app/food",
    directTo: "/app/food",
  },
  {
    slug: "substances",
    emoji: "💊",
    label: "Substances",
    description: "Sortir de la dépendance aux substances.",
    to: "/app/substances",
    directTo: "/app/substances",
  },
  {
    slug: "gambling",
    emoji: "🎰",
    label: "Jeux d'argent",
    description: "Reprendre le contrôle de vos mises.",
    to: "/app/gambling",
    directTo: "/app/gambling",
  },
  {
    slug: "pornography",
    emoji: "🔞",
    label: "Pornographie",
    description: "Retrouver une consommation saine.",
    to: "/app/pornography",
    directTo: "/app/pornography",
  },
  {
    slug: "fornication",
    emoji: "❤️",
    label: "Fornication",
    description: "Canaliser les impulsions sexuelles.",
    to: "/app/fornication",
    directTo: "/app/fornication",
  },
  {
    slug: "screentime",
    emoji: "📱",
    label: "Temps d'écran",
    description: "Réduire les heures passées sur écran.",
    to: "/app/screentime",
    directTo: "/app/screentime",
  },
  {
    slug: "music",
    emoji: "🎵",
    label: "Musique",
    description: "Diminuer le temps d'écoute quotidienne.",
    to: "/app/music",
    directTo: "/app/music",
  },
];

const modulePastelBySlug: Record<string, string> = {
  smoking: "#ffd6d6",
  alcohol: "#ffe4b5",
  food: "#d4f5e2",
  substances: "#ede8ff",
  gambling: "#ffd6d6",
  pornography: "#ffd6d6",
  fornication: "#ffd6d6",
  screentime: "#e8f4ff",
  music: "#e8f4ff",
};

const computeModuleStats = (module?: UserModule): ModuleStats => {
  if (!module?.is_active) {
    return { days: 0, moneySaved: 0, avoided: 0, health: 0 };
  }

  const now = Date.now();
  const start = new Date(module.started_at).getTime();
  const days = Math.max(0, Math.floor((now - start) / 86400000));
  const moneySaved = (module.daily_cost_euros ?? 0) * days;
  const avoided = (module.daily_quantity ?? 0) * days;
  const health = Math.min(100, Math.round((days / 365) * 100));

  return { days, moneySaved, avoided, health };
};

export default function Modules() {
  const [moduleData, setModuleData] = useState<Record<string, UserModule>>({});
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    const fetchModules = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setModuleData({});
        return;
      }

      const { data, error } = await supabase
        .from("user_modules")
        .select("module_slug,is_active,started_at,daily_cost_euros,daily_quantity")
        .eq("user_id", user.id);

      if (error) {
        console.error("Erreur lors du chargement des modules:", error.message);
        return;
      }

      const mapped = (data ?? []).reduce<Record<string, UserModule>>((acc, item) => {
        acc[item.module_slug] = item as UserModule;
        return acc;
      }, {});

      setModuleData(mapped);
    };

    void fetchModules();
  }, []);

  const modulesWithStats = useMemo(
    () => modules.map((module) => ({ ...module, entry: moduleData[module.slug], stats: computeModuleStats(moduleData[module.slug]) })),
    [moduleData],
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8] text-[#1a1a1a]">
      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-6">
        <h1 className="[font-family:'Nunito',sans-serif] text-2xl font-black text-[#1a1a1a]">Modules addictions</h1>

        <section className="mt-4 space-y-3">
          {modulesWithStats.map(({ slug, emoji, label, description, to, directTo, entry, stats }) => {
            const isExpanded = expandedSlug === slug;
            const isActive = Boolean(entry?.is_active);

            return (
              <article
                key={slug}
                className="overflow-hidden rounded-[20px] border-[2.5px] border-[#1a1a1a] bg-white shadow-[4px_4px_0_#1a1a1a]"
              >
                <button
                  type="button"
                  onClick={() => setExpandedSlug((current) => (current === slug ? null : slug))}
                  className="w-full px-4 py-4 text-left"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <span
                        className="mt-[1px] flex h-[36px] w-[36px] items-center justify-center rounded-[10px] border-2 border-[#1a1a1a] text-xl"
                        style={{ backgroundColor: modulePastelBySlug[slug] ?? "#e8f4ff" }}
                        aria-hidden="true"
                      >
                        {emoji}
                      </span>
                      <div>
                        <p className="[font-family:'Nunito',sans-serif] text-base font-black text-[#1a1a1a]">{label}</p>
                        <p className="mt-1 text-sm text-[#1a1a1a]/70">{description}</p>
                      </div>
                    </div>

                    <span
                      className={
                        isActive
                          ? "rounded-[100px] bg-[#1a1a1a] px-3 py-1 text-xs font-black text-[#f5f0e8]"
                          : "rounded-[100px] border-[1.5px] border-[#1a1a1a] bg-transparent px-3 py-1 text-xs font-black text-[#1a1a1a] opacity-40"
                      }
                    >
                      {isActive ? "En cours" : "Inactif"}
                    </span>
                  </div>
                </button>

                {isExpanded && (
                  <div className="border-t-[2.5px] border-[#1a1a1a] px-4 pb-4 pt-3">
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="rounded-[10px] border-2 border-[#1a1a1a] bg-[#ede8ff] p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#1a1a1a]/65">Jours</p>
                        <p className="mt-1 text-xl font-black text-[#1a1a1a]">{stats.days}</p>
                      </div>
                      <div className="rounded-[10px] border-2 border-[#1a1a1a] bg-[#d4f5e2] p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#1a1a1a]/65">Économisé</p>
                        <p className="mt-1 text-xl font-black text-[#1a1a1a]">
                          {stats.moneySaved % 1 === 0 ? `${stats.moneySaved}€` : `${stats.moneySaved.toFixed(2)}€`}
                        </p>
                      </div>
                      <div className="rounded-[10px] border-2 border-[#1a1a1a] bg-[#ffd6d6] p-2.5">
                        <p className="text-[11px] uppercase tracking-[0.16em] text-[#1a1a1a]/65">Évités</p>
                        <p className="mt-1 text-xl font-black text-[#1a1a1a]">{stats.avoided}</p>
                      </div>
                    </div>

                    <div className="mt-4 h-[10px] w-full overflow-hidden rounded-full border-2 border-[#1a1a1a] bg-[#e8e3d8]">
                      <div className="h-full rounded-full bg-[#1a1a1a] transition-all" style={{ width: `${stats.health}%` }} />
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Link
                        to={isActive ? directTo : to}
                        className="rounded-full border-2 border-[#1a1a1a] bg-[#fff7df] px-4 py-1.5 text-xs font-black text-[#1a1a1a] transition hover:bg-[#ffefc6]"
                      >
                        Ouvrir le module
                      </Link>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </section>
      </main>
      <AppNavigation />
    </div>
  );
}
