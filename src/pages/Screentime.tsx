import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays, Smartphone } from "lucide-react";
import { Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";
import { ScreentimeSetupModal, type ScreentimeSetupData } from "@/components/ScreentimeSetupModal";

interface ScreentimeModuleData {
  started_at: string;
  daily_quantity: number | null;
}

const Screentime = () => {
  const [moduleData, setModuleData] = useState<ScreentimeModuleData | null>(null);
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
      .select("started_at, daily_quantity")
      .eq("user_id", authData.user.id)
      .eq("module_slug", "screentime")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Erreur chargement module screentime:", error.message);
      setIsLoading(false);
      return;
    }

    setModuleData(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    void loadModuleData();
  }, [loadModuleData]);

  const handleSetupComplete = async (data: ScreentimeSetupData) => {
    setIsSubmittingSetup(true);

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setIsSubmittingSetup(false);
      return;
    }

    const { error } = await supabase.from("user_modules").insert({
      user_id: authData.user.id,
      module_slug: "screentime",
      started_at: new Date().toISOString(),
      is_active: true,
      daily_cost_euros: 0,
      daily_quantity: data.hoursPerDay,
    });

    if (error) {
      console.error("Erreur création module screentime:", error.message);
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

  const recoveredHours = useMemo(() => {
    if (!moduleData?.daily_quantity) return 0;
    return totalDays * moduleData.daily_quantity;
  }, [moduleData, totalDays]);

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {!moduleData && <ScreentimeSetupModal onComplete={handleSetupComplete} isSubmitting={isSubmittingSetup} />}

      <header className="fixed left-0 right-0 top-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[980px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/modules" className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span aria-hidden="true">📱</span>
              <span>Temps d'écran</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-24">
        <section className="rounded-3xl border border-white/10 bg-[#050506] p-5">
          <p className="text-sm uppercase tracking-wide text-white/60">Réduction depuis</p>
          <p className="mt-3 text-5xl font-extrabold">{totalDays}</p>
          <p className="text-white/70">{totalDays > 1 ? "jours" : "jour"}</p>
        </section>

        <section className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-[#050506] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">Jours cumulés</p>
              <CalendarDays className="h-4 w-4 text-white/60" />
            </div>
            <p className="mt-2 text-2xl font-bold">{totalDays}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#050506] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">Heures récupérées</p>
              <Smartphone className="h-4 w-4 text-white/60" />
            </div>
            <p className="mt-2 text-2xl font-bold">{recoveredHours.toFixed(1)} h</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Screentime;
