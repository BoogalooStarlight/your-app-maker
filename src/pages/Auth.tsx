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
    <div className="flex min-h-screen items-center justify-center bg-[#f5f0e8] px-4 py-10 text-[#1a1a1a] [font-family:'Nunito',sans-serif]">
      <div className="mx-auto w-full max-w-[380px]">
        <header className="mb-8 text-center">
          <p className="mb-3 text-[13px] font-black uppercase tracking-[0.18em] text-[#7B61FF]">
            RIVE
          </p>
          <h1 className="text-[26px] font-black leading-tight text-[#1a1a1a]">
            Combattre son âme.
          </h1>
          <p className="mt-2 text-[13px] text-[rgba(26,26,26,0.5)]">Ton espace d&apos;accès sécurisé.</p>
        </header>

        <div className="rounded-[24px] border-[2.5px] border-[#1a1a1a] bg-white px-6 py-7 shadow-[5px_5px_0_#1a1a1a]">
          <div className="mb-6 grid grid-cols-2 gap-1 rounded-[100px] border-[2.5px] border-[#1a1a1a] bg-[#f5f0e8] p-1">
            <button
              type="button"
              onClick={() => setMode("signin")}
              className={`rounded-[100px] px-4 py-2.5 text-sm font-bold transition ${
                mode === "signin" ? "bg-[#1a1a1a] text-[#f5f0e8]" : "text-[rgba(26,26,26,0.4)]"
              }`}
            >
              Connexion
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`rounded-[100px] px-4 py-2.5 text-sm font-bold transition ${
                mode === "signup" ? "bg-[#1a1a1a] text-[#f5f0e8]" : "text-[rgba(26,26,26,0.4)]"
              }`}
            >
              Inscription
            </button>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(26,26,26,0.5)]">Pseudo</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ton pseudo"
                  className="w-full rounded-[12px] border-[2.5px] border-[#1a1a1a] bg-[#f5f0e8] px-4 py-[13px] text-[14px] text-[#1a1a1a] outline-none transition placeholder:text-[rgba(26,26,26,0.45)] focus:border-[#7B61FF] focus:shadow-[3px_3px_0_#7B61FF]"
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(26,26,26,0.5)]">{identifierLabel}</label>
              <input
                type={mode === "signin" ? "text" : "email"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-[12px] border-[2.5px] border-[#1a1a1a] bg-[#f5f0e8] px-4 py-[13px] text-[14px] text-[#1a1a1a] outline-none transition focus:border-[#7B61FF] focus:shadow-[3px_3px_0_#7B61FF]"
              />
            </div>

            <div>
              <label className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-[rgba(26,26,26,0.5)]">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full rounded-[12px] border-[2.5px] border-[#1a1a1a] bg-[#f5f0e8] px-4 py-[13px] text-[14px] text-[#1a1a1a] outline-none transition focus:border-[#7B61FF] focus:shadow-[3px_3px_0_#7B61FF]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-[16px] bg-[#1a1a1a] py-[13px] text-[15px] font-black text-[#f5f0e8] shadow-[4px_4px_0_#7B61FF] transition hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[3px_3px_0_#7B61FF] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Chargement..." : title}
            </button>
          </form>

          {mode === "signin" && (
            <button
              type="button"
              className="mx-auto mt-4 block text-center text-[11px] text-[rgba(26,26,26,0.35)] transition hover:text-[rgba(26,26,26,0.55)]"
            >
              Mot de passe oublié ?
            </button>
          )}

          {message && <p className="mt-4 text-sm text-[#1a1a1a]">{message}</p>}
          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Auth;
