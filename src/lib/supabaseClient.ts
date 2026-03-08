const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Variables Supabase manquantes (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY)");
}

type AuthChangeEvent = "SIGNED_IN" | "SIGNED_OUT";
type Session = { access_token: string; refresh_token?: string; user: { id: string; email?: string } } | null;
type AuthListener = (event: AuthChangeEvent, session: Session) => void;

const STORAGE_KEY = "rive.supabase.session";

const listeners = new Set<AuthListener>();

const getStoredSession = (): Session => {
  const raw = localStorage.getItem(STORAGE_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
};

const setStoredSession = (session: Session) => {
  if (!session) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
};

const emit = (event: AuthChangeEvent, session: Session) => {
  listeners.forEach((listener) => listener(event, session));
};

const auth = {
  async signInWithPassword({ email, password }: { email: string; password: string }) {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return { data: null, error: payload };
    }

    const session: Session = {
      access_token: payload.access_token,
      refresh_token: payload.refresh_token,
      user: payload.user,
    };

    setStoredSession(session);
    emit("SIGNED_IN", session);

    return { data: { session }, error: null };
  },

  async signUp({ email, password }: { email: string; password: string }) {
    const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({ email, password }),
    });

    const payload = await response.json();

    if (!response.ok) {
      return { data: null, error: payload };
    }

    return { data: payload, error: null };
  },

  async getUser() {
    const session = getStoredSession();

    if (!session?.access_token) {
      return { data: { user: null }, error: null };
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
      headers: {
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (!response.ok) {
      setStoredSession(null);
      emit("SIGNED_OUT", null);
      return { data: { user: null }, error: null };
    }

    const user = await response.json();
    return { data: { user }, error: null };
  },

  onAuthStateChange(callback: AuthListener) {
    listeners.add(callback);
    return {
      data: {
        subscription: {
          unsubscribe: () => listeners.delete(callback),
        },
      },
    };
  },

  async signOut() {
    setStoredSession(null);
    emit("SIGNED_OUT", null);
    return { error: null };
  },
};

const supabase = { auth };

export default supabase;
