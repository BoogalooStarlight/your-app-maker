/*
Optional Supabase RPC if you prefer server-side aggregation in SQL.
This uses MAX(days_clean_this_week) across active modules so multiple active modules
cannot stack more than the 7 available calendar days in the current week.

create or replace function public.weekly_leaderboard()
returns table (
  user_id uuid,
  username text,
  active_modules_count integer,
  days_clean_this_week integer,
  consistency_bonus integer,
  score integer
)
language sql
security definer
as $$
  select
    um.user_id,
    u.username,
    count(*)::int as active_modules_count,
    greatest(
      0,
      min(
        7,
        max((current_date - timezone('utc', um.started_at)::date)::int)
      )
    )::int as days_clean_this_week,
    case
      when max((current_date - timezone('utc', um.started_at)::date)::int) >= 7 then 20
      else 0
    end::int as consistency_bonus,
    (
      greatest(
        0,
        min(
          7,
          max((current_date - timezone('utc', um.started_at)::date)::int)
        )
      ) * 10
      + count(*) * 5
      + case when max((current_date - timezone('utc', um.started_at)::date)::int) >= 7 then 20 else 0 end
    )::int as score
  from public.user_modules um
  join public.users u on u.id = um.user_id
  where um.is_active = true
  group by um.user_id, u.username
  order by score desc, u.username asc
  limit 50;
$$;
*/

import { useEffect, useMemo, useState } from "react";
import { Trophy } from "lucide-react";
import { AppNavigation } from "@/components/AppNavigation";
import supabase from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

type LeaderboardRow = {
  user_id: string;
  username: string;
  active_modules_count: number;
  days_clean_this_week: number;
  consistency_bonus: number;
  total_days_clean: number;
  milestone_bonus: number;
  current_streak: number;
  score: number;
  rank: number;
};

type UserModuleRow = {
  user_id: string;
  module_slug: string | null;
  profiles: {
    pseudo: string | null;
  } | null;
};

type DailyCheckinRow = {
  user_id: string;
  checked_at: string;
  cracked: boolean;
  module_slug: string | null;
};

const CARTOON_BG = "#f5f0e8";
const CARTOON_BLACK = "#1a1a1a";
const CARTOON_PURPLE = "#7B61FF";
const MODULE_META: Record<string, string | { emoji: string; label: string }> = {
  tabac: "🚬 Tabac",
  smoking: { emoji: "🚬", label: "Tabac" },
  alcool: "🍷 Alcool",
  substances: "💊 Substances",
  "jeux-argent": "🎰 Jeux",
  pornographie: "📵 Porno",
  "temps-ecran": "📱 Écran",
  nourriture: "🍫 Nourriture",
  fornication: "🔥 Fornication",
};

const getDaysUntilNextMonday = () => {
  const now = new Date();
  const day = now.getDay();
  const daysUntil = day === 0 ? 1 : 8 - day;
  return daysUntil;
};

const Ranking = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"weekly" | "alltime">("weekly");
  const [activeFilter, setActiveFilter] = useState<string>("global");
  const [rawModules, setRawModules] = useState<UserModuleRow[]>([]);
  const [rawCheckins, setRawCheckins] = useState<DailyCheckinRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      const { data: modulesData, error: modulesError } = await supabase
        .from("user_modules")
        .select("user_id, module_slug, profiles(pseudo)")
        .eq("is_active", true);

      if (modulesError) {
        console.error("Erreur lors du chargement du classement:", modulesError.message);
        setRawModules([]);
        setRawCheckins([]);
        setLoading(false);
        return;
      }

      const { data: checkinsData, error: checkinsError } = await supabase
        .from("daily_checkins")
        .select("user_id, checked_at, cracked, module_slug");

      if (checkinsError) {
        console.error("Erreur lors du chargement des check-ins:", checkinsError.message);
        setRawModules([]);
        setRawCheckins([]);
        setLoading(false);
        return;
      }

      setRawModules((modulesData as UserModuleRow[] | null) ?? []);
      setRawCheckins((checkinsData as DailyCheckinRow[] | null) ?? []);
      setLoading(false);
    };

    void fetchLeaderboard();
  }, []);

  const moduleFilters = useMemo(() => {
    const slugs = new Set<string>();
    rawModules.forEach((entry) => {
      if (entry.module_slug) slugs.add(entry.module_slug);
    });
    return Array.from(slugs);
  }, [rawModules]);

  const { weeklyLeaderboard, allTimeLeaderboard } = useMemo(() => {
    const weeklyByUser = new Map<string, Omit<LeaderboardRow, "rank" | "score">>();
    const allTimeByUser = new Map<string, Omit<LeaderboardRow, "rank" | "score">>();

    const mondayStart = new Date();
    mondayStart.setHours(0, 0, 0, 0);
    const day = mondayStart.getDay();
    const daysSinceMonday = (day + 6) % 7;
    mondayStart.setDate(mondayStart.getDate() - daysSinceMonday);

    const checkinsByUser = new Map<string, DailyCheckinRow[]>();
    rawCheckins.forEach((checkin) => {
      const existing = checkinsByUser.get(checkin.user_id);
      if (existing) {
        existing.push(checkin);
      } else {
        checkinsByUser.set(checkin.user_id, [checkin]);
      }
    });

    const userActiveModules = new Map<string, Set<string>>();
    rawModules.forEach((entry) => {
      if (entry.module_slug) {
        const modules = userActiveModules.get(entry.user_id) ?? new Set<string>();
        modules.add(entry.module_slug);
        userActiveModules.set(entry.user_id, modules);
      }
    });

    const computeCurrentStreak = (checkins: DailyCheckinRow[]) => {
      if (checkins.length === 0) return 0;

      const crackedByDay = new Map<string, boolean>();
      checkins.forEach((checkin) => {
        const dayKey = new Date(checkin.checked_at).toISOString().slice(0, 10);
        if (checkin.cracked) {
          crackedByDay.set(dayKey, true);
        } else if (!crackedByDay.has(dayKey)) {
          crackedByDay.set(dayKey, false);
        }
      });

      let streak = 0;
      const cursor = new Date();
      cursor.setHours(0, 0, 0, 0);

      while (true) {
        const dayKey = cursor.toISOString().slice(0, 10);
        if (crackedByDay.get(dayKey) === false) {
          streak += 1;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }

      return streak;
    };

    rawModules.forEach((entry) => {
      const hasActiveModule = activeFilter === "global" || userActiveModules.get(entry.user_id)?.has(activeFilter);
      if (!hasActiveModule) return;

      const userCheckins = (checkinsByUser.get(entry.user_id) ?? []).filter((checkin) => {
        if (activeFilter === "global") return true;
        return checkin.module_slug === activeFilter || checkin.module_slug === null;
      });
      const cleanCheckins = userCheckins.filter((checkin) => !checkin.cracked);
      const daysCleanThisWeek = cleanCheckins.filter((checkin) => new Date(checkin.checked_at) >= mondayStart).length;
      const totalDaysClean = cleanCheckins.length;
      const consistencyBonus = daysCleanThisWeek >= 7 ? 20 : 0;
      const currentStreak = computeCurrentStreak(userCheckins);

      const weeklyExisting = weeklyByUser.get(entry.user_id);
      if (!weeklyExisting) {
        weeklyByUser.set(entry.user_id, {
          user_id: entry.user_id,
          username: entry.profiles?.pseudo?.trim() || "Anonyme",
          active_modules_count: 1,
          days_clean_this_week: daysCleanThisWeek,
          consistency_bonus: consistencyBonus,
          total_days_clean: totalDaysClean,
          milestone_bonus: 0,
          current_streak: currentStreak,
        });
      } else {
        weeklyExisting.active_modules_count += 1;
        weeklyExisting.days_clean_this_week = daysCleanThisWeek;
        weeklyExisting.total_days_clean = totalDaysClean;
        weeklyExisting.consistency_bonus = consistencyBonus;
        weeklyExisting.current_streak = currentStreak;
      }

      const allTimeExisting = allTimeByUser.get(entry.user_id);
      if (!allTimeExisting) {
        allTimeByUser.set(entry.user_id, {
          user_id: entry.user_id,
          username: entry.profiles?.pseudo?.trim() || "Anonyme",
          active_modules_count: 1,
          days_clean_this_week: daysCleanThisWeek,
          consistency_bonus: consistencyBonus,
          total_days_clean: totalDaysClean,
          milestone_bonus: 0,
          current_streak: currentStreak,
        });
      } else {
        allTimeExisting.active_modules_count += 1;
        allTimeExisting.days_clean_this_week = daysCleanThisWeek;
        allTimeExisting.total_days_clean = totalDaysClean;
        allTimeExisting.consistency_bonus = consistencyBonus;
        allTimeExisting.current_streak = currentStreak;
      }
    });

    const rankRows = (rows: Omit<LeaderboardRow, "rank" | "score">[], scoreFor: (entry: Omit<LeaderboardRow, "rank" | "score">) => number) => rows
      .map((entry) => ({
        ...entry,
        score: scoreFor(entry),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.username.localeCompare(b.username, "fr");
      })
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));

    const weeklyLeaderboard = rankRows(Array.from(weeklyByUser.values()), (entry) => entry.days_clean_this_week * 10 + entry.active_modules_count * 5 + entry.consistency_bonus);

    const allTimeLeaderboard = rankRows(Array.from(allTimeByUser.values()), (entry) => {
      const milestoneBonus = entry.total_days_clean >= 365 ? 500 : entry.total_days_clean >= 100 ? 150 : entry.total_days_clean >= 50 ? 50 : 0;
      return entry.total_days_clean * 2 + entry.active_modules_count * 10 + milestoneBonus;
    }).map((entry) => ({
      ...entry,
      milestone_bonus: entry.total_days_clean >= 365 ? 500 : entry.total_days_clean >= 100 ? 150 : entry.total_days_clean >= 50 ? 50 : 0,
    }));

    return { weeklyLeaderboard, allTimeLeaderboard };
  }, [activeFilter, rawCheckins, rawModules]);

  const leaderboard = mode === "weekly" ? weeklyLeaderboard : allTimeLeaderboard;
  const currentUserRow = useMemo(() => leaderboard.find((entry) => entry.user_id === user?.id) ?? null, [leaderboard, user?.id]);
  const topFifty = useMemo(() => leaderboard.slice(0, 50), [leaderboard]);
  const daysUntilNextMonday = useMemo(() => getDaysUntilNextMonday(), []);

  return (
    <div className="min-h-screen text-[#1a1a1a]" style={{ background: CARTOON_BG, fontFamily: "'Nunito', sans-serif" }}>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[#1a1a1a]" style={{ fontFamily: "'Nunito', sans-serif" }}>Classement</h1>
            <p className="mt-1 text-sm font-bold text-[#1a1a1a]/70">{mode === "weekly" ? "Semaine en cours" : "Depuis le début"}</p>
          </div>

          {mode === "weekly" ? (
            <div
              className="rounded-[12px] px-4 py-3 text-right"
              style={{ background: CARTOON_BLACK, color: CARTOON_BG, fontFamily: "'Nunito', sans-serif" }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em]">Reset</p>
              <p className="mt-1 text-sm font-bold">
                {daysUntilNextMonday} {daysUntilNextMonday > 1 ? "jours" : "jour"}
              </p>
              <p className="mt-0.5 text-[11px] font-bold opacity-80">avant lundi</p>
            </div>
          ) : null}
        </header>

        <div className="mb-5 grid grid-cols-2 gap-2 rounded-full border-[2.5px] p-1.5" style={{ background: "#ffffff", borderColor: CARTOON_BLACK }}>
          <button
            type="button"
            onClick={() => setMode("weekly")}
            className={`rounded-full px-4 py-2.5 text-sm font-extrabold transition ${
              mode === "weekly" ? "" : "bg-transparent text-[#1a1a1a]/65"
            }`}
            style={mode === "weekly" ? { background: CARTOON_BLACK, color: CARTOON_BG } : undefined}
          >
            Cette semaine
          </button>
          <button
            type="button"
            onClick={() => setMode("alltime")}
            className={`rounded-full px-4 py-2.5 text-sm font-extrabold transition ${
              mode === "alltime" ? "" : "bg-transparent text-[#1a1a1a]/65"
            }`}
            style={mode === "alltime" ? { background: CARTOON_BLACK, color: CARTOON_BG } : undefined}
          >
            All time
          </button>
        </div>

        <div className="mb-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setActiveFilter("global")}
            className="shrink-0 rounded-full border-[2.5px] px-4 py-2 text-sm font-extrabold transition"
            style={activeFilter === "global"
              ? { background: CARTOON_PURPLE, color: "#FFFFFF", borderColor: CARTOON_PURPLE, boxShadow: "3px 3px 0 #1a1a1a" }
              : { background: "#ffffff", color: CARTOON_BLACK, borderColor: CARTOON_BLACK }}
          >
            🌍 Global
          </button>
          {moduleFilters.map((slug) => (
            <button
              key={slug}
              type="button"
              onClick={() => setActiveFilter(slug)}
              className="shrink-0 rounded-full border-[2.5px] px-4 py-2 text-sm font-extrabold transition"
              style={activeFilter === slug
                ? { background: CARTOON_PURPLE, color: "#FFFFFF", borderColor: CARTOON_PURPLE, boxShadow: "3px 3px 0 #1a1a1a" }
                : { background: "#ffffff", color: CARTOON_BLACK, borderColor: CARTOON_BLACK }}
            >
              {typeof MODULE_META[slug] === "string" ? MODULE_META[slug] : MODULE_META[slug] ? `${MODULE_META[slug].emoji} ${MODULE_META[slug].label}` : slug}
            </button>
          ))}
        </div>

        <section
          className="sticky top-4 z-20 mb-5 rounded-[20px] border-[2.5px] px-5 py-4"
          style={{ background: "#ede8ff", borderColor: CARTOON_BLACK, boxShadow: "4px 4px 0 #7B61FF" }}
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#1a1a1a]/70">Votre rang</p>
              <p className="mt-2 text-3xl font-black text-[#7B61FF]">{currentUserRow ? `#${currentUserRow.rank}` : "Non classé"}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border-[2.5px] bg-white" style={{ borderColor: CARTOON_BLACK, boxShadow: "3px 3px 0 #1a1a1a" }}>
                <Trophy className="h-5 w-5" style={{ color: CARTOON_PURPLE }} />
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-[#1a1a1a]">{currentUserRow?.username ?? "Vous"}</p>
                <p className="mt-1 text-lg font-black text-[#1a1a1a]">
                  {currentUserRow?.score ?? 0} pts
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          className="overflow-hidden rounded-[20px] border-[2.5px] bg-white"
          style={{ borderColor: CARTOON_BLACK, boxShadow: "4px 4px 0 #1a1a1a" }}
        >
          <div className="border-b-[2.5px] px-4 py-3" style={{ borderColor: CARTOON_BLACK }}>
            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#1a1a1a]/70">{mode === "weekly" ? "Top 50 hebdomadaire" : "Top 50 all time"}</p>
          </div>

          {loading ? (
            <div className="px-4 py-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex animate-pulse items-center gap-3 border-b-[2px] py-4 last:border-b-0" style={{ borderColor: "#d7d0c4" }}>
                  <div className="h-5 w-8 rounded bg-[#ece5d8]" />
                  <div className="h-4 flex-1 rounded bg-[#ece5d8]" />
                  <div className="h-5 w-16 rounded bg-[#ece5d8]" />
                </div>
              ))}
            </div>
          ) : topFifty.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm font-bold text-[#1a1a1a]/60">{mode === "weekly" ? "Aucun combattant cette semaine." : "Aucun combattant pour le moment."}</div>
          ) : (
            <div className="px-3 py-2">
              {topFifty.map((entry, index) => {
                const isCurrentUser = entry.user_id === user?.id;

                return (
                  <div
                    key={entry.user_id}
                    className="mb-2 flex items-center gap-3 rounded-[16px] border-[2.5px] bg-white px-3 py-3 transition-all last:mb-0"
                    style={{
                      borderColor: CARTOON_BLACK,
                      boxShadow: isCurrentUser ? "3px 3px 0 #7B61FF" : "3px 3px 0 #1a1a1a",
                      opacity: 1,
                      transform: "translateY(0)",
                      animation: `ranking-fade 0.45s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <div className={`w-9 text-base font-black ${entry.rank === 1 ? "text-[#7B61FF]" : "text-[#1a1a1a]"}`}>
                      #{entry.rank}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[15px] font-extrabold text-[#1a1a1a]">{entry.username}</p>
                      {entry.current_streak > 0 ? <p className="mt-0.5 text-xs font-extrabold text-[#FF8A00]">🔥 {entry.current_streak}j</p> : null}
                    </div>

                    <div className="text-right">
                      <p className="text-base font-black text-[#1a1a1a]">{entry.score}</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#1a1a1a]/55">pts</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <style>{`
        @keyframes ranking-fade {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      <AppNavigation />
    </div>
  );
};

export default Ranking;
