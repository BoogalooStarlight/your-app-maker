import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import supabase from "@/lib/supabaseClient";

const Auth = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const title = useMemo(() => (mode === "signin" ? "Connexion" : "Inscription"), [mode]);
  const identifierLabel = useMemo(() => (mode === "signin" ? "Email ou pseudo" : "Email"), [mode]);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      if (mode === "signin") {
        const identifier = email.trim();
        let signInEmail = identifier;

        if (!identifier.includes("@")) {
          const { data, error: lookupError } = await supabase
            .from("profiles")
            .select("email")
            .eq("pseudo", identifier)
            .single();

          if (lookupError || !data?.email) {
            setError("Pseudo introuvable.");
            return;
          }

          signInEmail = data.email;
        }

        const { error: signInError } = await supabase.auth.signInWithPassword({ email: signInEmail, password });

        if (signInError) {
          setError("Identifiants incorrects.");
          return;
        }

        navigate("/");
      } else {
        const trimmedUsername = username.trim();

        if (trimmedUsername.length < 3 || trimmedUsername.length > 20) {
          setError("Pseudo invalide (3–20 caractères).");
          return;
        }

        const { data, error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError) {
          throw signUpError;
        }

        const user = data.user;

        if (!user) {
          throw new Error("Impossible de finaliser l'inscription.");
        }

        const { error: upsertError } = await supabase
          .from("profiles")
          .upsert({ id: user.id, pseudo: trimmedUsername });

        if (upsertError) {
          if (upsertError.code === "23505") {
            setError("Ce pseudo est déjà pris.");
            return;
          }

          throw upsertError;
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08080F] px-4 py-10 text-white [font-family:'DM_Sans',sans-serif]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(123,97,255,0.08) 0%, rgba(123,97,255,0.03) 30%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[360px]">
        <header className="mb-8 text-center">
          <p className="mb-4 text-[11px] uppercase tracking-[0.28em] text-[rgba(255,255,255,0.3)] [font-family:'DM_Mono',monospace]">
            RIVE
          </p>
          <h1 className="text-[26px] font-bold leading-tight tracking-[-0.03em] text-[rgba(255,255,255,0.95)]">
            Combattre son âme.
          </h1>
          <p className="mt-2 text-[13px] text-[rgba(255,255,255,0.35)]">Ton espace d&apos;accès sécurisé.</p>
        </header>

        <div className="rounded-[28px] border border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.028)] px-6 py-7 shadow-[0_24px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-[14px] bg-[rgba(255,255,255,0.05)] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-[10px] px-4 py-2.5 text-sm font-medium transition ${
                mode === "signin" ? "bg-[#7B61FF] text-white shadow-[0_10px_24px_rgba(123,97,255,0.35)]" : "text-white/[0.5]"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-[10px] px-4 py-2.5 text-sm font-medium transition ${
                mode === "signup" ? "bg-[#7B61FF] text-white shadow-[0_10px_24px_rgba(123,97,255,0.35)]" : "text-white/[0.5]"
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)]">Pseudo</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ton pseudo"
                  className="w-full rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-4 py-[13px] text-[14px] text-white outline-none transition placeholder:text-white/[0.22] focus:border-[rgba(123,97,255,0.5)]"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)]">{identifierLabel}</label>
              <input
                type={mode === "signin" ? "text" : "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-4 py-[13px] text-[14px] text-white outline-none transition focus:border-[rgba(123,97,255,0.5)]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)]">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-[14px] border border-[rgba(255,255,255,0.07)] bg-[rgba(255,255,255,0.04)] px-4 py-[13px] text-[14px] text-white outline-none transition focus:border-[rgba(123,97,255,0.5)]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[14px] bg-[#7B61FF] py-[13px] text-[15px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Chargement..." : title}
            </button>
          </form>

          {mode === "signin" && (
            <button
              type="button"
              className="mx-auto mt-4 block text-center text-[12px] text-[rgba(255,255,255,0.28)] transition hover:text-[rgba(255,255,255,0.5)]"
            >
              Mot de passe oublié ?
            </button>
          )}

          {message && <p className="mt-4 text-sm text-white/80">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Auth;
