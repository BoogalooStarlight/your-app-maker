import { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Link } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

interface ModuleData {
  started_at: string;
}

const Fornication = () => {
  const [moduleData, setModuleData] = useState<ModuleData | null>(null);

  const loadModuleData = useCallback(async () => {
    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      setModuleData(null);
      return;
    }

    const { data, error } = await supabase
      .from("user_modules")
      .select("started_at")
      .eq("user_id", authData.user.id)
      .eq("module_slug", "fornication")
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error("Erreur chargement module fornication:", error.message);
      return;
    }

    setModuleData(data);
  }, []);

  useEffect(() => {
    void loadModuleData();
  }, [loadModuleData]);

  const totalDays = useMemo(() => {
    if (!moduleData?.started_at) return 0;
    const start = new Date(moduleData.started_at).getTime();
    if (Number.isNaN(start)) return 0;
    return Math.max(0, Math.floor((Date.now() - start) / (1000 * 60 * 60 * 24)));
  }, [moduleData]);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/95 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-[980px] items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <Link to="/modules" className="rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2 text-lg font-semibold">
              <span aria-hidden="true">❤️‍🔥</span>
              <span>Fornication</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-24">
        <section className="rounded-3xl border border-white/10 bg-[#050506] p-5">
          <p className="text-sm uppercase tracking-wide text-white/60">Sans fornication depuis</p>
          <p className="mt-3 text-5xl font-extrabold">{totalDays}</p>
          <p className="text-white/70">{totalDays > 1 ? "jours" : "jour"}</p>
        </section>

        <section className="mt-4">
          <div className="rounded-2xl border border-white/10 bg-[#050506] p-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">Jours cumulés</p>
              <CalendarDays className="h-4 w-4 text-white/60" />
            </div>
            <p className="mt-2 text-2xl font-bold">{totalDays}</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Fornication;
