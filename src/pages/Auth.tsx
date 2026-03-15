import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === "signin" ? "Connexion" : "Inscription"), [mode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (mode === "signin") {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

        if (signInError) {
          throw signInError;
        }

        navigate("/");
      } else {
        const { error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
          throw signUpError;
        }

        setMessage("Inscription réussie. Vérifie ton email.");
      }
    } catch (submitError) {
      const text = submitError instanceof Error ? submitError.message : "Erreur inconnue";
      setError(text);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#08080F] px-4 py-10 text-white [font-family:'DM_Sans',sans-serif]"
      style={{
        backgroundImage: "radial-gradient(circle at top, rgba(123,97,255,0.08), transparent 55%)",
      }}
    >
      <div className="mx-auto w-full max-w-md">
        <header className="mb-8 text-center">
          <p className="mb-3 text-[9px] uppercase tracking-[0.18em] text-white/[0.18]">RIVE</p>
          <h1 className="text-[26px] font-semibold tracking-[-0.03em]">Combattre son âme.</h1>
          <p className="mt-2 text-sm text-white/[0.28]">Ton espace d&apos;accès sécurisé.</p>
        </header>

        <div className="rounded-[20px] border border-white/[0.045] bg-white/[0.028] p-6 shadow-[0_10px_40px_rgba(0,0,0,0.35)] backdrop-blur-[24px]">
          <div className="mb-6 grid grid-cols-2 rounded-full bg-white/[0.04] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "signin" ? "bg-[#7B61FF]/[0.22] text-[#9D87FF]" : "text-white/[0.35]"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                mode === "signup" ? "bg-[#7B61FF]/[0.22] text-[#9D87FF]" : "text-white/[0.35]"
              }`}
            >
              Inscription
            </button>
          </div>

          <h2 className="mb-6 text-lg font-semibold text-white">{title}</h2>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-white/[0.32]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.04] px-4 py-[13px] text-white outline-none transition focus:border-[#7B61FF]/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.12em] text-white/[0.32]">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-[12px] border border-white/[0.08] bg-white/[0.04] px-4 py-[13px] text-white outline-none transition focus:border-[#7B61FF]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-gradient-to-r from-[#9D87FF] to-[#7B61FF] py-3 text-sm font-semibold text-white shadow-[0_8px_28px_rgba(123,97,255,0.28)] transition hover:opacity-95 disabled:opacity-50"
            >
              {loading ? "Chargement..." : title}
            </button>
          </form>

          {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}

          <button type="button" className="mx-auto mt-6 block text-center text-[11px] text-white/[0.18] transition hover:text-white/[0.35]">
            Mot de passe oublié ?
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
