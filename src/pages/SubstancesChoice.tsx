import { ArrowLeft, Pill } from "lucide-react";
import { Link } from "react-router-dom";

const SubstancesChoice = () => {
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
