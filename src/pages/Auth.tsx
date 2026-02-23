import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";

const GUEST_MODE_KEY = "isGuest";

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

        localStorage.removeItem(GUEST_MODE_KEY);
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

  const handleGuestMode = () => {
    localStorage.setItem(GUEST_MODE_KEY, "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-black px-4 py-8 text-white">
      <div className="mx-auto w-full max-w-md rounded-[28px] border border-white/10 bg-[#1C1C1E] p-6">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-black/40 p-1">
          <button
            type="button"
            onClick={() => setMode("signin")}
            className={`rounded-xl py-2 text-sm transition ${mode === "signin" ? "bg-white text-black" : "text-white/70"}`}
          >
            Connexion
          </button>
          <button
            type="button"
            onClick={() => setMode("signup")}
            className={`rounded-xl py-2 text-sm transition ${mode === "signup" ? "bg-white text-black" : "text-white/70"}`}
          >
            Inscription
          </button>
        </div>

        <h1 className="mb-1 text-2xl font-semibold">{title}</h1>
        <p className="mb-6 text-sm text-white/60">Accède à ton espace RIVE.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/40"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase tracking-wider text-white/60">Mot de passe</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full rounded-xl border border-white/15 bg-black/40 px-3 py-2 text-white outline-none focus:border-white/40"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-white py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
          >
            {loading ? "Chargement..." : title}
          </button>
        </form>

        <button
          type="button"
          onClick={handleGuestMode}
          className="mt-3 w-full rounded-xl border border-white/20 bg-transparent py-2.5 text-sm font-semibold text-white transition hover:bg-white/10"
        >
          Continuer en mode invité
        </button>

        {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
        {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
      </div>
    </div>
  );
};

export default Auth;
