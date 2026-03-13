import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const fornicationChoices = [
  { icon: "👁️", label: "Regard", to: "/app/fornication/regard" },
  { icon: "💬", label: "Interactions", to: "/app/fornication/interactions" },
  { icon: "🤝", label: "Contact", to: "/app/fornication/contact" },
  { icon: "🔥", label: "Acte", to: "/app/fornication/acte" },
] as const;

const FornicationChoice = () => {
  return (
    <div className="min-h-screen bg-black text-white">
      <main className="mx-auto w-full max-w-[430px] px-4 pb-24 pt-6">
        <Link to="/modules" className="inline-flex items-center gap-2 text-white/80 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" />
          Retour
        </Link>

        <h1 className="mt-4 text-2xl font-semibold">Quel est ton combat ?</h1>

        <section className="mt-6 grid gap-3">
          {fornicationChoices.map((choice) => (
            <Link
              key={choice.to}
              to={choice.to}
              className="flex items-center justify-between rounded-2xl border border-white/10 bg-[#050506] px-4 py-4 transition hover:border-white/25"
            >
              <span className="flex items-center gap-3 text-white/90">
                <span className="text-lg" aria-hidden="true">
                  {choice.icon}
                </span>
                {choice.label}
              </span>
              <span className="text-white/40">›</span>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
};

export default FornicationChoice;
