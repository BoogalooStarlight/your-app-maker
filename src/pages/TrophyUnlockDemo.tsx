import { useState } from "react";
import TrophyUnlock from "@/components/TrophyUnlock";

const TrophyUnlockDemo = () => {
  const [showTrophy, setShowTrophy] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  const replay = () => {
    setReplayKey((key) => key + 1);
    setShowTrophy(true);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#120E20] px-6 py-12 text-white">
      <section className="w-full max-w-xl rounded-3xl border border-[#C9BBFF]/20 bg-white/[0.04] p-8 text-center shadow-2xl shadow-[#7B61FF]/15 backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#9D87FF]">Démo isolée</p>
        <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">TrophyUnlock</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#C9BBFF]">
          Déclenche l'animation cinématique de déblocage du trophée, sans connexion à la logique applicative.
        </p>

        <button
          type="button"
          onClick={replay}
          className="mt-8 rounded-full bg-[#7B61FF] px-7 py-3 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_28px_rgba(123,97,255,0.42)] transition hover:bg-[#9D87FF] focus:outline-none focus:ring-2 focus:ring-[#C9BBFF] focus:ring-offset-2 focus:ring-offset-[#120E20]"
        >
          Rejouer
        </button>
      </section>

      {showTrophy && (
        <TrophyUnlock
          key={replayKey}
          shape="heptagon"
          numeral="VII"
          title="Sept nuits"
          subtitle="Palier 7 jours · Tabac"
          emoji="🚬"
          onClose={() => setShowTrophy(false)}
        />
      )}
    </main>
  );
};

export default TrophyUnlockDemo;
