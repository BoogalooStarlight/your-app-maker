const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

interface SupabaseAuthResponse {
  access_token?: string;
  refresh_token?: string;
  user?: {
    id: string;
    email?: string;
  };
  error?: string;
  error_description?: string;
}

const assertConfig = (): void => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variables Supabase manquantes (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)");
  }
};

const authRequest = async (
  endpoint: "signInWithPassword" | "signUp",
  email: string,
  password: string,
): Promise<SupabaseAuthResponse> => {
  assertConfig();

  const response = await fetch(`${supabaseUrl}/auth/v1/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
    },
    body: JSON.stringify({ email, password }),
  });

  const data = (await response.json()) as SupabaseAuthResponse;

  if (!response.ok) {
    const message = data.error_description || data.error || "Erreur Supabase";
    throw new Error(message);
  }

  return data;
};

export const supabase = {
  auth: {
    signInWithPassword: async (params: { email: string; password: string }) => {
      const data = await authRequest("signInWithPassword", params.email, params.password);
      return { data, error: null };
    },
    signUp: async (params: { email: string; password: string }) => {
      const data = await authRequest("signUp", params.email, params.password);
      return { data, error: null };
    },
  },
};
