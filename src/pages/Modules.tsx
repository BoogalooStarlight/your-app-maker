import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";
import supabase from "@/lib/supabaseClient";

const modules = [
  { slug: "smoking", emoji: "🚬", label: "Tabac", to: "/app/smoking-choice" },
  { slug: "alcohol", emoji: "🍺", label: "Alcool", to: "/app/alcohol" },
  { slug: "substances", emoji: "💊", label: "Substances", to: "/app/substances" },
  { slug: "gambling", emoji: "🎰", label: "Jeux d'argent", to: "/app/gambling" },
  { slug: "pornography", emoji: "🔞", label: "Pornographie", to: "/app/pornography" },
  { slug: "fornication", emoji: "❤️‍🔥", label: "Fornication", to: "/app/fornication" },
  { slug: "screentime", emoji: "📱", label: "Temps d'écran", to: "/app/screentime" },
];

export default function Modules() {
  const [activeModules, setActiveModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchActiveModules = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setActiveModules(new Set());
        return;
      }

      const { data, error } = await supabase
        .from("user_modules")
        .select("module_slug")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (error) {
        console.error("Erreur lors du chargement des modules actifs:", error.message);
        return;
      }

      setActiveModules(new Set((data ?? []).map((module) => module.module_slug)));
    };

    void fetchActiveModules();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-6">
        <h1 className="text-xl font-semibold">Modules addictions</h1>

        <section className="mt-4 space-y-3 rounded-3xl border border-white/10 bg-[#050506] p-3">
          {modules.map(({ slug, emoji, label, to }) => {
            const isActive = activeModules.has(slug);

            return (
              <Link
                key={slug}
                to={to}
                className="block rounded-2xl border border-white/10 bg-black/60 px-4 py-4 transition hover:border-white/25"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-3 text-base text-white/90">
                    <span className="text-lg" aria-hidden="true">
                      {emoji}
                    </span>
                    {label}
                  </span>
                  <span className="flex items-center gap-2">
                    {isActive && (
                      <span className="rounded-full border border-green-500/40 bg-green-500/15 px-2 py-0.5 text-xs font-medium text-green-300">
                        En cours
                      </span>
                    )}
                    <span className="text-white/40">›</span>
                  </span>
                </div>
                <div className="mt-2 h-1 w-full rounded-full bg-white/10">
                  <div className="h-1 rounded-full bg-white/25" style={{ width: "20%" }} />
                </div>
              </Link>
            );
          })}
        </section>
      </main>
      <AppNavigation />
    </div>
  );
}
