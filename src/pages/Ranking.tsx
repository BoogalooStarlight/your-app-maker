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
  score: number;
  rank: number;
};

type UserModuleRow = {
  user_id: string;
  started_at: string;
  users: {
    username: string | null;
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
  const [leaderboard, setLeaderboard] = useState<LeaderboardRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("user_modules")
        .select("user_id,started_at,users(username)")
        .eq("is_active", true);

      if (error) {
        console.error("Erreur lors du chargement du classement:", error.message);
        setLeaderboard([]);
        setLoading(false);
        return;
      }

      const byUser = new Map<string, Omit<LeaderboardRow, "rank">>();
      const now = Date.now();

      (data as UserModuleRow[] | null)?.forEach((entry) => {
        const existing = byUser.get(entry.user_id);
        const diff = Math.max(0, Math.floor((now - new Date(entry.started_at).getTime()) / 86400000));
        const daysCleanThisWeek = Math.min(7, diff);

        if (!existing) {
          byUser.set(entry.user_id, {
            user_id: entry.user_id,
            username: entry.users?.username?.trim() || "Anonyme",
            active_modules_count: 1,
            // Deliberate choice: we keep the MAX active streak capped at 7 days instead of summing
            // per module, so users are ranked on weekly consistency rather than module stacking.
            days_clean_this_week: daysCleanThisWeek,
            consistency_bonus: diff >= 7 ? 20 : 0,
            score: 0,
          });
          return;
        }

        existing.active_modules_count += 1;
        existing.days_clean_this_week = Math.max(existing.days_clean_this_week, daysCleanThisWeek);
        if (diff >= 7) {
          existing.consistency_bonus = 20;
        }
      });

      const ranked = Array.from(byUser.values())
        .map((entry) => ({
          ...entry,
          score: entry.days_clean_this_week * 10 + entry.active_modules_count * 5 + entry.consistency_bonus,
        }))
        .sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.username.localeCompare(b.username, "fr");
        })
        .map((entry, index) => ({
          ...entry,
          rank: index + 1,
        }));

      setLeaderboard(ranked);
      setLoading(false);
    };

    void fetchLeaderboard();
  }, []);

  const currentUserRow = useMemo(() => leaderboard.find((entry) => entry.user_id === user?.id) ?? null, [leaderboard, user?.id]);
  const topFifty = useMemo(() => leaderboard.slice(0, 50), [leaderboard]);
  const daysUntilNextMonday = useMemo(() => getDaysUntilNextMonday(), []);

  return (
    <div className="min-h-screen bg-[#08080F] text-white" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <main className="mx-auto w-full max-w-[430px] px-4 pb-28 pt-6">
        <header className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white/95">Classement</h1>
            <p className="mt-1 text-sm text-white/45">Semaine en cours</p>
          </div>

          <div className={`rounded-[18px] px-4 py-3 text-right ${CARD}`}>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/42">Reset</p>
            <p className="mt-1 text-sm font-semibold text-white/88">
              {daysUntilNextMonday} {daysUntilNextMonday > 1 ? "jours" : "jour"}
            </p>
            <p className="mt-0.5 text-[11px] text-white/40">avant lundi</p>
          </div>
        </header>

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
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/38">Top 50 hebdomadaire</p>
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
            <div className="px-6 py-16 text-center text-sm text-white/40">Aucun combattant cette semaine.</div>
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
