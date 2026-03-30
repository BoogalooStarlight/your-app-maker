import { useEffect, useState } from "react";
import supabase from "@/lib/supabaseClient";

export interface Stats {
  daysClean: number;
  moneySaved: number;
  avoided: number;
  health: number;
  hasModules: boolean;
  loading: boolean;
}

interface UserModule {
  daily_cost_euros: number | null;
  daily_quantity: number | null;
}

const initialStats: Stats = {
  daysClean: 0,
  moneySaved: 0,
  avoided: 0,
  health: 0,
  hasModules: false,
  loading: true,
};

function computeStats(modules: UserModule[], daysCleanCount = 0): Stats {
  if (modules.length === 0) {
    return {
      daysClean: daysCleanCount,
      moneySaved: 0,
      avoided: 0,
      health: Math.min(100, Math.round((daysCleanCount / 365) * 100)),
      hasModules: false,
      loading: false,
    };
  }

  const daysClean = daysCleanCount;

  const moneySaved = modules.reduce((sum, module) => {
    return sum + (module.daily_cost_euros ?? 0) * daysClean;
  }, 0);

  const avoided = modules.reduce((sum, module) => {
    return sum + (module.daily_quantity ?? 0) * daysClean;
  }, 0);

  const health = Math.min(100, Math.round((daysClean / 365) * 100));

  return {
    daysClean,
    moneySaved,
    avoided,
    health,
    hasModules: modules.length > 0,
    loading: false,
  };
}

export function useStats(): Stats {
  const [stats, setStats] = useState<Stats>(initialStats);

  useEffect(() => {
    const loadStats = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        setStats(computeStats([]));
        return;
      }

      const { count: cleanDaysCount } = await supabase
        .from("daily_checkins")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id)
        .eq("cracked", false);

      const { data: modulesData } = await supabase
        .from("user_modules")
        .select("daily_cost_euros,daily_quantity")
        .eq("user_id", user.id)
        .eq("is_active", true);

      const daysClean = cleanDaysCount ?? 0;

      setStats(computeStats((modulesData ?? []) as UserModule[], daysClean));
    };

    loadStats();
  }, []);

  return stats;
}
