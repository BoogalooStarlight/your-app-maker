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
  score: number;
  rank: number;
};

type UserModuleRow = {
  user_id: string;
  started_at: string;
  profiles: {
    pseudo: string | null;
  } | null;
};

const ACCENT_SOFT = "#9D87FF";
const CARD = "border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] backdrop-blur-[24px]";

const getDaysUntilNextMonday = () => {
  const now = new Date();
  const day = now.getDay();
  const daysUntil = day === 0 ? 1 : 8 - day;
  return daysUntil;
};

const getTopThreeStyles = (rank: number) => {
  if (rank === 1) {
    return {
      position: "text-[#F5D06F]",
      row: "border-[#F5D06F]/20 bg-[#F5D06F]/[0.05] shadow-[0_0_24px_rgba(245,208,111,0.08)]",
    };
  }

  if (rank === 2) {
    return {
      position: "text-[#C9D4E6]",
      row: "border-[#C9D4E6]/15 bg-[#C9D4E6]/[0.04] shadow-[0_0_20px_rgba(201,212,230,0.06)]",
    };
  }

  if (rank === 3) {
    return {
      position: "text-[#D8A47F]",
      row: "border-[#D8A47F]/15 bg-[#D8A47F]/[0.04] shadow-[0_0_20px_rgba(216,164,127,0.06)]",
    };
  }

  return {
    position: "text-white/42",
    row: "border-white/[0.045] bg-transparent shadow-none",
  };
};

const Ranking = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState<"weekly" | "alltime">("weekly");
  const [rawModules, setRawModules] = useState<UserModuleRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_modules")
        .select("user_id,started_at,profiles(pseudo)")
        .eq("is_active", true);

      if (error) {
        console.error("Erreur lors du chargement du classement:", error.message);
        setRawModules([]);
        setLoading(false);
        return;
      }

      setRawModules((data as UserModuleRow[] | null) ?? []);
      setLoading(false);
    };

    void fetchLeaderboard();
  }, []);

  const { weeklyLeaderboard, allTimeLeaderboard } = useMemo(() => {
    const weeklyByUser = new Map<string, Omit<LeaderboardRow, "rank" | "score">>();
    const allTimeByUser = new Map<string, Omit<LeaderboardRow, "rank" | "score">>();
    const now = Date.now();

    rawModules.forEach((entry) => {
      const diff = Math.max(0, Math.floor((now - new Date(entry.started_at).getTime()) / 86400000));
      const daysCleanThisWeek = Math.min(7, diff);

      const weeklyExisting = weeklyByUser.get(entry.user_id);
      if (!weeklyExisting) {
        weeklyByUser.set(entry.user_id, {
          user_id: entry.user_id,
          username: entry.profiles?.pseudo?.trim() || "Anonyme",
          active_modules_count: 1,
          // Deliberate choice: we keep the MAX active streak capped at 7 days instead of summing
          // per module, so users are ranked on weekly consistency rather than module stacking.
          days_clean_this_week: daysCleanThisWeek,
          consistency_bonus: diff >= 7 ? 20 : 0,
          total_days_clean: diff,
          milestone_bonus: 0,
        });
      } else {
        weeklyExisting.active_modules_count += 1;
        weeklyExisting.days_clean_this_week = Math.max(weeklyExisting.days_clean_this_week, daysCleanThisWeek);
        weeklyExisting.total_days_clean = Math.max(weeklyExisting.total_days_clean, diff);
        if (diff >= 7) {
          weeklyExisting.consistency_bonus = 20;
        }
      }

      const allTimeExisting = allTimeByUser.get(entry.user_id);
      if (!allTimeExisting) {
        allTimeByUser.set(entry.user_id, {
          user_id: entry.user_id,
          username: entry.profiles?.pseudo?.trim() || "Anonyme",
          active_modules_count: 1,
          days_clean_this_week: daysCleanThisWeek,
          consistency_bonus: diff >= 7 ? 20 : 0,
          total_days_clean: diff,
          milestone_bonus: 0,
        });
      } else {
        allTimeExisting.active_modules_count += 1;
        allTimeExisting.days_clean_this_week = Math.max(allTimeExisting.days_clean_this_week, daysCleanThisWeek);
        allTimeExisting.total_days_clean = Math.max(allTimeExisting.total_days_clean, diff);
        if (diff >= 7) {
          allTimeExisting.consistency_bonus = 20;
        }
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
      const milestoneBonus = (entry.total_days_clean >= 50 ? 50 : 0) + (entry.total_days_clean >= 100 ? 150 : 0) + (entry.total_days_clean >= 365 ? 500 : 0);
      return entry.total_days_clean * 2 + entry.active_modules_count * 10 + milestoneBonus;
    }).map((entry) => ({
      ...entry,
      milestone_bonus: (entry.total_days_clean >= 50 ? 50 : 0) + (entry.total_days_clean >= 100 ? 150 : 0) + (entry.total_days_clean >= 365 ? 500 : 0),
    }));

    return { weeklyLeaderboard, allTimeLeaderboard };
  }, [rawModules]);

  const leaderboard = mode === "weekly" ? weeklyLeaderboard : allTimeLeaderboard;
  const currentUserRow = useMemo(() => leaderboard.find((entry) => entry.user_id === user?.id) ?? null, [leaderboard, user?.id]);
  const topFifty = useMemo(() => leaderboard.slice(0, 50), [leaderboard]);
  const daysUntilNextMonday = useMemo(() => getDaysUntilNextMonday(), []);

  return (
    <div className="min-h-screen bg-[#08080F] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white/95">Classement</h1>
            <p className="mt-1 text-sm text-white/45">{mode === "weekly" ? "Semaine en cours" : "Depuis le début"}</p>
          </div>

          {mode === "weekly" ? (
            <div className={`rounded-[18px] px-4 py-3 text-right ${CARD}`}>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Reset</p>
              <p className="mt-1 text-sm font-semibold text-white/88">
                {daysUntilNextMonday} {daysUntilNextMonday > 1 ? "jours" : "jour"}
              </p>
              <p className="mt-0.5 text-[11px] text-white/40">avant lundi</p>
            </div>
          ) : null}
        </header>

        <div className="mb-5 grid grid-cols-2 gap-1 rounded-[14px] bg-[rgba(255,255,255,0.05)] p-1">
          <button
            type="button"
            onClick={() => setMode("weekly")}
            className={`rounded-[10px] px-4 py-2.5 text-sm font-medium transition ${
              mode === "weekly" ? "bg-[#7B61FF] text-white shadow-[0_10px_24px_rgba(123,97,255,0.35)]" : "bg-transparent text-[rgba(255,255,255,0.4)]"
            }`}
          >
            Cette semaine
          </button>
          <button
            type="button"
            onClick={() => setMode("alltime")}
            className={`rounded-[10px] px-4 py-2.5 text-sm font-medium transition ${
              mode === "alltime" ? "bg-[#7B61FF] text-white shadow-[0_10px_24px_rgba(123,97,255,0.35)]" : "bg-transparent text-[rgba(255,255,255,0.4)]"
            }`}
          >
            All time
          </button>
        </div>

        <section className={`sticky top-4 z-20 mb-5 rounded-[24px] px-5 py-4 ${CARD}`} style={{ borderColor: "rgba(123,97,255,0.55)", boxShadow: "0 18px 50px rgba(123,97,255,0.12)" }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Votre rang</p>
              <p className="mt-2 text-xl font-semibold text-white/95">{currentUserRow ? `#${currentUserRow.rank}` : "Non classé"}</p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5">
                <Trophy className="h-5 w-5" style={{ color: ACCENT_SOFT }} />
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-white/92">{currentUserRow?.username ?? "Vous"}</p>
                <p className="mt-1 text-lg font-semibold" style={{ color: ACCENT_SOFT, fontFamily: "'DM Mono', monospace" }}>
                  {currentUserRow?.score ?? 0} pts
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className={`overflow-hidden rounded-[24px] ${CARD}`}>
          <div className="border-b border-white/[0.045] px-4 py-3">
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">{mode === "weekly" ? "Top 50 hebdomadaire" : "Top 50 all time"}</p>
          </div>

          {loading ? (
            <div className="px-4 py-2">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="flex animate-pulse items-center gap-3 border-b border-white/[0.04] py-4 last:border-b-0">
                  <div className="h-5 w-8 rounded bg-white/10" />
                  <div className="h-4 flex-1 rounded bg-white/10" />
                  <div className="h-5 w-16 rounded bg-white/10" />
                </div>
              ))}
            </div>
          ) : topFifty.length === 0 ? (
            <div className="px-6 py-16 text-center text-sm text-white/40">{mode === "weekly" ? "Aucun combattant cette semaine." : "Aucun combattant pour le moment."}</div>
          ) : (
            <div className="px-3 py-2">
              {topFifty.map((entry, index) => {
                const isCurrentUser = entry.user_id === user?.id;
                const topThreeStyles = getTopThreeStyles(entry.rank);

                return (
                  <div
                    key={entry.user_id}
                    className={`mb-1 flex items-center gap-3 rounded-[18px] border px-3 py-3 transition-all last:mb-0 ${topThreeStyles.row} ${
                      isCurrentUser ? "bg-[rgba(123,97,255,0.12)]" : ""
                    }`}
                    style={{
                      borderColor: isCurrentUser ? "rgba(123,97,255,0.48)" : undefined,
                      opacity: 1,
                      transform: "translateY(0)",
                      animation: `ranking-fade 0.45s ease-out ${index * 0.05}s both`,
                    }}
                  >
                    <div className={`w-9 text-sm font-semibold ${topThreeStyles.position}`} style={{ fontFamily: "'DM Mono', monospace" }}>
                      #{entry.rank}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className={`truncate text-[15px] ${entry.rank <= 3 ? "font-semibold text-white/96" : "font-medium text-white/88"}`}>{entry.username}</p>
                    </div>

                    <div className="text-right" style={{ fontFamily: "'DM Mono', monospace" }}>
                      <p className="text-base font-semibold" style={{ color: ACCENT_SOFT }}>{entry.score}</p>
                      <p className="text-[10px] uppercase tracking-[0.14em] text-white/30">pts</p>
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
