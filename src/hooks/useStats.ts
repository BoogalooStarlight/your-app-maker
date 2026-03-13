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
  started_at: string;
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

function computeStats(modules: UserModule[]): Stats {
  if (modules.length === 0) {
    return {
      daysClean: 0,
      moneySaved: 0,
      avoided: 0,
      health: 0,
      hasModules: false,
      loading: false,
    };
  }

  const now = Date.now();
  const oldestStart = Math.min(...modules.map((module) => new Date(module.started_at).getTime()));
  const daysClean = Math.floor((now - oldestStart) / 86400000);

  const moneySaved = modules.reduce((sum, module) => {
    const daysSinceModule = Math.floor((now - new Date(module.started_at).getTime()) / 86400000);
    return sum + (module.daily_cost_euros ?? 0) * daysSinceModule;
  }, 0);

  const avoided = modules.reduce((sum, module) => {
    const daysSinceModule = Math.floor((now - new Date(module.started_at).getTime()) / 86400000);
    return sum + (module.daily_quantity ?? 0) * daysSinceModule;
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

      const { data: modulesData } = await supabase
        .from("user_modules")
        .select("started_at,daily_cost_euros,daily_quantity")
        .eq("user_id", user.id)
        .eq("is_active", true);

      setStats(computeStats((modulesData ?? []) as UserModule[]));
    };

    loadStats();
  }, []);

  return stats;
}

