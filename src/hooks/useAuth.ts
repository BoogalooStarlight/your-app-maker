import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

type AuthUser = {
  id: string;
  email?: string;
} | null;

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const { data } = await supabase.auth.getUser();

      if (!mounted) {
        return;
      }

      setUser(data.user ?? null);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return { user, loading };
};
