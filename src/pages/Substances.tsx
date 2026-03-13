import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Pill, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { SubstancesSetupModal, type SubstancesSetupData } from "@/components/SubstancesSetupModal";

interface ModuleData {
  started_at: string;
  daily_cost_euros: number | null;
  daily_quantity: number | null;
}

interface SubstancesProps {
  slug: "cannabis" | "herbe" | "ballons" | "autre" | "cafeine";
}

const slugLabel: Record<SubstancesProps["slug"], string> = {
  cannabis: "Cannabis",
  herbe: "Herbe",
  ballons: "Ballons",
  autre: "Autre",
  cafeine: "☕ Caféine",
};

const Substances = ({ slug }: SubstancesProps) => {
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingSetup, setIsSubmittingSetup] = useState(false);

  const loadModuleData = useCallback(async () => {
    setIsLoading(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setModuleData(null);
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("user_modules")
      .select("started_at, daily_cost_euros, daily_quantity")
      .eq("user_id", authData.user.id)
      .eq("module_slug", slug)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(`Erreur chargement module ${slug}:`, error.message);
      setIsLoading(false);
      return;
    }

    setModuleData(data);
    setIsLoading(false);
  }, [slug]);

  useEffect(() => {
    void loadModuleData();
  }, [loadModuleData]);

  const handleSetupComplete = async (data: SubstancesSetupData) => {
    setIsSubmittingSetup(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setIsSubmittingSetup(false);
      return;
    }

    const dailyCostEuros = data.weeklySpendEuros / 7;

    const { error } = await supabase.from("user_modules").insert({
      user_id: authData.user.id,
      module_slug: slug,
      started_at: new Date().toISOString(),
      is_active: true,
      daily_cost_euros: dailyCostEuros,
      daily_quantity: data.dailyQuantity,
    });

    if (error) {
      console.error(`Erreur création module ${slug}:`, error.message);
      setIsSubmittingSetup(false);
      return;
    }

    await loadModuleData();
    setIsSubmittingSetup(false);
  };

  const totalDays = useMemo(() => {
    if (!moduleData?.started_at) return 0;
    const start = new Date(moduleData.started_at).getTime();
    if (Number.isNaN(start)) return 0;
    return Math.max(0, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
  }, [moduleData]);

  const consumptionsAvoided = useMemo(() => {
    if (!moduleData?.daily_quantity) return 0;
    return totalDays * moduleData.daily_quantity;
  }, [moduleData, totalDays]);

  const moneySaved = useMemo(() => {
    if (!moduleData?.daily_cost_euros) return 0;
    return totalDays * moduleData.daily_cost_euros;
  }, [moduleData, totalDays]);

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {!moduleData && <SubstancesSetupModal onComplete={handleSetupComplete} isSubmitting={isSubmittingSetup} />}

      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[980px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/app/substances" className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span aria-hidden="true">💊</span>
              <span>{slugLabel[slug]}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-24">
        <section className="rounded-3xl border border-white/10 bg-[#050506] p-5">
          <p className="text-sm uppercase tracking-wide text-white/60">Sans consommation depuis</p>
          <p className="mt-3 text-5xl font-extrabold">{totalDays}</p>
          <p className="text-white/70">{totalDays > 1 ? "jours" : "jour"}</p>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#050506] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">Jours cumulés</p>
              <CalendarDays className="h-4 w-4 text-white/60" />
            </div>
            <p className="mt-2 text-2xl font-bold">{totalDays}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#050506] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">Consommations évitées</p>
              <Pill className="h-4 w-4 text-white/60" />
            </div>
            <p className="mt-2 text-2xl font-bold">{consumptionsAvoided.toFixed(0)}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#050506] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">Argent économisé</p>
              <Wallet className="h-4 w-4 text-white/60" />
            </div>
            <p className="mt-2 text-2xl font-bold">{moneySaved.toFixed(2)} €</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Substances;
