import { useEffect, useState } from "react";
import { ArrowLeft, Pill } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

const SubstancesChoice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSubstancesSubtype = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("user_modules")
        .select("module_slug")
        .eq("user_id", user.id)
        .in("module_slug", ["cannabis", "herbe", "ballons", "autre", "cafeine"])
        .eq("is_active", true)
        .single();

      if (data?.module_slug === "cannabis") {
        navigate("/app/substances/cannabis", { replace: true });
        return;
      }

      if (data?.module_slug === "herbe") {
        navigate("/app/substances/herbe", { replace: true });
        return;
      }

      if (data?.module_slug === "ballons") {
        navigate("/app/substances/ballons", { replace: true });
        return;
      }

      if (data?.module_slug === "autre") {
        navigate("/app/substances/autre", { replace: true });
        return;
      }

      if (data?.module_slug === "cafeine") {
        navigate("/app/substances/cafeine", { replace: true });
        return;
      }

      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch substances module", error);
      }

      setIsLoading(false);
    };

    void checkSubstancesSubtype();
  }, [navigate]);

  if (isLoading) {
    return <div className="min-h-screen bg-black" />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">
        <Link to="/modules" className="inline-flex items-center gap-2 text-white/80 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">Que consommez-vous ?</h1>

        <section className="mt-6 grid gap-3">
          <Link
            to="/app/substances/cannabis"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
          >
            <span className="flex items-center gap-3 text-white/90">
              <Pill className="h-5 w-5 text-white/70" />
              Cannabis
            </span>
            <span className="text-white/40">›</span>
          </Link>

          <Link
            to="/app/substances/herbe"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
          >
            <span className="flex items-center gap-3 text-white/90">
              <Pill className="h-5 w-5 text-white/70" />
              Herbe
            </span>
            <span className="text-white/40">›</span>
          </Link>

          <Link
            to="/app/substances/ballons"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
          >
            <span className="flex items-center gap-3 text-white/90">
              <Pill className="h-5 w-5 text-white/70" />
              Ballons
            </span>
            <span className="text-white/40">›</span>
          </Link>

          <Link
            to="/app/substances/autre"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
          >
            <span className="flex items-center gap-3 text-white/90">
              <Pill className="h-5 w-5 text-white/70" />
              Autre
            </span>
            <span className="text-white/40">›</span>
          </Link>


          <Link
            to="/app/substances/cafeine"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
          >
            <span className="flex items-center gap-3 text-white/90">
              <Pill className="h-5 w-5 text-white/70" />
              ☕ Caféine
            </span>
            <span className="text-white/40">›</span>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default SubstancesChoice;
