import { useEffect, useState } from "react";
import { ArrowLeft, Cigarette } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

const SmokingChoice = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSmokingSubtype = async () => {
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
        .in("module_slug", ["smoking", "smoking-puff"])
        .eq("is_active", true)
        .single();

      if (data?.module_slug === "smoking") {
        navigate("/app/smoking", { replace: true });
        return;
      }

      if (data?.module_slug === "smoking-puff") {
        navigate("/app/puff", { replace: true });
        return;
      }

      if (error && error.code !== "PGRST116") {
        console.error("Failed to fetch smoking module", error);
      }

      setIsLoading(false);
    };

    void checkSmokingSubtype();
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

        <h1 className="mt-4 text-2xl font-semibold">Que fumez-vous ?</h1>

        <section className="mt-6 grid gap-3">
          <Link
            to="/app/smoking"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
          >
            <span className="flex items-center gap-3 text-white/90">
              <Cigarette className="h-5 w-5 text-white/70" />
              Cigarette
            </span>
            <span className="text-white/40">›</span>
          </Link>

          <Link
            to="/app/puff"
            className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
          >
            <span className="flex items-center gap-3 text-white/90">
              <Cigarette className="h-5 w-5 text-white/70" />
              Puff
            </span>
            <span className="text-white/40">›</span>
          </Link>
        </section>
      </main>
    </div>
  );
};

export default SmokingChoice;
