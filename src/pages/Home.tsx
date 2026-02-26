import { Activity, Coins, Heart, Shield, Target } from "lucide-react";
import { Link } from "react-router-dom";
import { AppNavigation } from "@/components/AppNavigation";

const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">
        <section className="rounded-[22px] border border-white/10 bg-[#050506] px-4 py-5">
          <p className="text-center text-[11px] uppercase tracking-[0.22em] text-white/60">Temps de sevrage total</p>

          <div className="mx-auto mt-4 flex h-44 w-44 items-center justify-center rounded-full border-[10px] border-white/10">
            <div className="text-center">
              <p className="text-6xl font-semibold leading-none">0</p>
              <p className="mt-1 text-xs uppercase tracking-[0.2em] text-white/60">Jours</p>
            </div>
          </div>

          <p className="mt-5 text-center text-xl font-medium text-white/85">Aucune addiction suivie</p>

          <div className="mt-3 flex justify-center">
            <Link
              to="/modules"
              className="rounded-full border border-white/25 px-5 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white/10"
            >
              Aller aux modules
            </Link>
          </div>
        </section>

        <section className="mt-5 grid gap-3">
          <article className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#050506] px-4 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Argent</p>
              <p className="mt-2 text-5xl font-semibold leading-none">0€</p>
            </div>
            <Coins className="h-6 w-6 text-white/60" />
          </article>

          <article className="flex items-center justify-between rounded-3xl border border-white/10 bg-[#050506] px-4 py-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-white/55">Évités</p>
              <p className="mt-2 text-5xl font-semibold leading-none">0</p>
            </div>
            <Activity className="h-6 w-6 text-white/60" />
          </article>


        <section className="container py-2">
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl glass-light p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Argent</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0€</p>
            </div>
            <div className="rounded-2xl glass-light p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Évités</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="rounded-2xl glass-light p-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Santé</p>
              <p className="mt-2 text-3xl font-bold text-foreground">0%</p>
            </div>
          </div>
        </section>

        {/* Status bar at bottom */}
        <section className="container">
          <div className="rounded-2xl glass-light p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Système actif</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <span className="text-sm text-muted-foreground">
                Dernière mise à jour : <span className="text-foreground">maintenant</span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              v1.0.0
            </div>
            <Heart className="h-6 w-6 text-white/60" />
          </article>
        </section>

        <section className="mt-4 flex items-center justify-between rounded-3xl border border-white/10 bg-[#050506] px-4 py-4">
          <p className="text-lg text-white/85">Objectif annuel</p>
          <div className="flex items-center gap-2 text-white/75">
            <Shield className="h-4 w-4" />
            <Target className="h-4 w-4" />
            <span className="text-base">0% complété</span>
          </div>
        </section>
      </main>

      <AppNavigation />
    </div>
  );
};

export default Home;
