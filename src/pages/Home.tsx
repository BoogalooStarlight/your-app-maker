import { useEffect, useState } from "react";
import { Activity, Coins, Heart, LogOut, Shield, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";
import supabase from "@/lib/supabaseClient";
import { useStats } from "@/hooks/useStats";

const Home = () => {
  const navigate = useNavigate();
  const [pseudo, setPseudo] = useState<string>("");
  const stats = useStats();

  useEffect(() => {
    const loadData = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      const value = (user as { user_metadata?: { pseudo?: string } } | null)?.user_metadata?.pseudo;
      setPseudo(value ?? "");
    };

    loadData();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">
        <section className="mb-4 flex items-center justify-between">
          <p className="text-xl font-semibold text-white/90">Bonjour {pseudo || "vous"} 👋</p>
          <button
            type="button"
            onClick={handleSignOut}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-3 py-2 text-sm text-white/80 transition hover:bg-white/10"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </section>

        <section className="rounded-[22px] border border-white/10 bg-[#050506] px-4 py-8">
          <p className="text-center text-[11px] uppercase tracking-[0.22em] text-white/60">Temps de sevrage total</p>

          <div className="mx-auto mt-4 flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-white/10">
            <div className="text-center">
              <p className="text-6xl font-semibold leading-none">{stats.daysClean}</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">Jours</p>
            </div>
          </div>

          {!stats.hasModules && (
            <>
              <p className="mt-5 text-center text-xl font-medium text-white/85">Aucune addiction suivie</p>

              <div className="mt-3 flex justify-center">
                <Link
                  to="/modules"
                  className="rounded-full border border-white/25 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
                >
                  Aller aux modules
                </Link>
              </div>
            </>
          )}
        </section>

        <section className="mt-5 space-y-4">
          <article className="rounded-3xl border border-white/10 bg-[#050506] px-4 py-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Argent</p>
              <Coins className="h-5 w-5 text-white/60" />
            </div>
            <p className="mt-3 text-4xl font-semibold leading-none">
              {stats.moneySaved % 1 === 0 ? stats.moneySaved + "€" : stats.moneySaved.toFixed(2) + "€"}
            </p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#050506] px-4 py-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Évités</p>
              <Activity className="h-5 w-5 text-white/60" />
            </div>
            <p className="mt-3 text-4xl font-semibold leading-none">{stats.avoided}</p>
          </article>

          <article className="rounded-3xl border border-white/10 bg-[#050506] px-4 py-6">
            <div className="flex items-center justify-between">
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Santé</p>
              <Heart className="h-5 w-5 text-white/60" />
            </div>
            <p className="mt-3 text-4xl font-semibold leading-none">{stats.health}%</p>
          </article>
        </section>


        <section className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-[#050506] px-4 py-5">
          <p className="text-lg text-white/85">Objectif annuel</p>
          <div className="flex items-center gap-2 text-white/75">
            <Shield className="h-4 w-4" />
            <Target className="h-4 w-4" />
            <span className="text-base">{stats.health}% complété</span>
          </div>
        </section>
      </main>

      <AppNavigation />
    </div>
  );
};

export default Home;
