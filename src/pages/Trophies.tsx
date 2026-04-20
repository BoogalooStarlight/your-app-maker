import { useEffect, useState } from "react";
import { AppNavigation } from "@/components/AppNavigation";
import supabase from "@/lib/supabaseClient";

const MODULE_EMOJI: Record<string, string> = {
  smoking: "🚬",
  alcohol: "🍷",
  food: "🍔",
  substances: "💊",
  gambling: "🎰",
  pornography: "🔞",
  fornication: "❤️",
  screentime: "📱",
};

const MODULE_LABEL: Record<string, string> = {
  smoking: "Tabac",
  alcohol: "Alcool",
  food: "Nourriture",
  substances: "Substances",
  gambling: "Jeux d'argent",
  pornography: "Pornographie",
  fornication: "Fornication",
  screentime: "Temps d'écran",
};

type Shape = "circle" | "heptagon" | "diamond" | "pentagon" | "hexagon" | "star8";

type Milestone = {
  days: number;
  roman: string;
  name: string;
  shape: Shape;
};

const MILESTONES: Milestone[] = [
  { days: 1,   roman: "I",      name: "Premier souffle", shape: "circle"   },
  { days: 7,   roman: "VII",    name: "Sept nuits",      shape: "heptagon" },
  { days: 30,  roman: "XXX",    name: "Un mois tenu",    shape: "diamond"  },
  { days: 50,  roman: "L",      name: "Demi-centurie",   shape: "pentagon" },
  { days: 100, roman: "C",      name: "Centurion",       shape: "hexagon"  },
  { days: 365, roman: "CCCLXV", name: "Un an de combat", shape: "star8"    },
];

type ModuleProgress = {
  slug: string;
  daysClean: number;
};

function BadgeShape({ shape, unlocked, featured }: { shape: Shape; unlocked: boolean; featured: boolean }) {
  const fill   = unlocked ? (featured ? "rgba(123,97,255,0.18)" : "rgba(123,97,255,0.12)") : "rgba(255,255,255,0.03)";
  const stroke = unlocked ? (featured ? "#7B61FF" : "rgba(123,97,255,0.5)") : "rgba(255,255,255,0.18)";
  const sw     = featured ? 1.8 : 1.4;
  const inner  = unlocked ? "rgba(123,97,255,0.18)" : "rgba(255,255,255,0.07)";
  return (
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
      {shape === "circle"   && <><circle cx="32" cy="32" r="28" fill={fill} stroke={stroke} strokeWidth={sw}/><circle cx="32" cy="32" r="22" fill="none" stroke={inner} strokeWidth="0.7"/></>}
      {shape === "heptagon" && <><polygon points="32,4 51,15 58,36 48,56 16,56 6,36 13,15" fill={fill} stroke={stroke} strokeWidth={sw}/><polygon points="32,11 47,20 53,36 45,51 19,51 11,36 17,20" fill="none" stroke={inner} strokeWidth="0.7"/></>}
      {shape === "diamond"  && <><polygon points="32,3 61,32 32,61 3,32" fill={fill} stroke={stroke} strokeWidth={sw}/><polygon points="32,11 53,32 32,53 11,32" fill="none" stroke={inner} strokeWidth="0.7"/><line x1="11" y1="32" x2="53" y2="32" stroke={inner} strokeWidth="0.6"/></>}
      {shape === "pentagon" && <><polygon points="32,4 59,22 49,54 15,54 5,22" fill={fill} stroke={stroke} strokeWidth={sw}/><polygon points="32,12 52,27 44,49 20,49 12,27" fill="none" stroke={inner} strokeWidth="0.7"/></>}
      {shape === "hexagon"  && <><polygon points="32,4 56,17 56,47 32,60 8,47 8,17" fill={fill} stroke={stroke} strokeWidth={sw}/><polygon points="32,12 50,22 50,42 32,52 14,42 14,22" fill="none" stroke={inner} strokeWidth="0.7"/></>}
      {shape === "star8"    && <><polygon points="32,4 37,27 60,32 37,37 32,60 27,37 4,32 27,27" fill={fill} stroke={stroke} strokeWidth={sw}/><polygon points="32,13 36,29 51,32 36,35 32,51 28,35 13,32 28,29" fill="none" stroke={inner} strokeWidth="0.7"/></>}
    </svg>
  );
}

function Badge({ milestone, emoji, unlocked, featured }: { milestone: Milestone; emoji: string; unlocked: boolean; featured: boolean }) {
  const romanColor = unlocked ? "#3D2A8A" : "#1A1A1A";
  return (
    <div
      className={[
        "flex flex-col items-center gap-[7px] px-2 pt-4 pb-[13px] rounded-[20px] border-[2.5px] transition-all duration-200",
        unlocked && !featured
          ? "border-[#7B61FF] bg-[#EDE8FF] shadow-[3px_3px_0_#7B61FF] hover:-translate-y-0.5"
          : unlocked && featured
          ? "border-[#7B61FF] bg-[#EDE8FF] shadow-[3px_3px_0_#7B61FF]"
          : "border-[#1A1A1A] bg-white shadow-[3px_3px_0_#1A1A1A] opacity-30",
      ].join(" ")}
    >
      <div className="relative w-16 h-16 flex items-center justify-center">
        <BadgeShape shape={milestone.shape} unlocked={unlocked} featured={featured} />
        <span
          className="absolute text-[20px] leading-none"
          style={{ top: "50%", left: "50%", transform: "translate(-50%, -54%)", opacity: unlocked ? 0.35 : 0.2 }}
          aria-hidden="true"
        >
          {emoji}
        </span>
        <span
          className="absolute bottom-[8px] left-0 right-0 text-center text-[10px] tracking-[1px]"
          style={{ color: romanColor }}
        >
          {milestone.roman}
        </span>
      </div>
      <p className={`text-[10.5px] text-center ${unlocked ? "text-[#3D2A8A]" : "text-[#1A1A1A]"}`}>
        {milestone.name}
      </p>
    </div>
  );
}

function NextObjective({ milestone, emoji, currentDays }: { milestone: Milestone; emoji: string; currentDays: number }) {
  const progress = Math.min(100, Math.round((currentDays / milestone.days) * 100));
  const daysLeft = milestone.days - currentDays;
  return (
    <div className="bg-white border-[2.5px] border-[#1A1A1A] rounded-[20px] p-5 shadow-[4px_4px_0_#1A1A1A]">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-[#1A1A1A]">{milestone.name}</p>
        <p className="text-xs text-[#3D2A8A]">
          {daysLeft === 1 ? "1 jour restant" : `${daysLeft} jours restants`}
        </p>
      </div>
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-[52px] h-[52px] shrink-0 flex items-center justify-center rounded-full bg-[#EDE8FF] border-2 border-[#7B61FF] shadow-[2px_2px_0_#7B61FF]">
          <svg width="52" height="52" viewBox="0 0 64 64" fill="none">
            {milestone.shape === "circle"   && <circle cx="32" cy="32" r="28" fill="rgba(123,97,255,0.10)" stroke="rgba(123,97,255,0.45)" strokeWidth="1.5" strokeDasharray="4 2"/>}
            {milestone.shape === "heptagon" && <polygon points="32,4 51,15 58,36 48,56 16,56 6,36 13,15" fill="rgba(123,97,255,0.10)" stroke="rgba(123,97,255,0.45)" strokeWidth="1.5" strokeDasharray="4 2"/>}
            {milestone.shape === "diamond"  && <polygon points="32,3 61,32 32,61 3,32" fill="rgba(123,97,255,0.10)" stroke="rgba(123,97,255,0.45)" strokeWidth="1.5" strokeDasharray="4 2"/>}
            {milestone.shape === "pentagon" && <polygon points="32,4 59,22 49,54 15,54 5,22" fill="rgba(123,97,255,0.10)" stroke="rgba(123,97,255,0.45)" strokeWidth="1.5" strokeDasharray="4 2"/>}
            {milestone.shape === "hexagon"  && <polygon points="32,4 56,17 56,47 32,60 8,47 8,17" fill="rgba(123,97,255,0.10)" stroke="rgba(123,97,255,0.45)" strokeWidth="1.5" strokeDasharray="4 2"/>}
            {milestone.shape === "star8"    && <polygon points="32,4 37,27 60,32 37,37 32,60 27,37 4,32 27,27" fill="rgba(123,97,255,0.10)" stroke="rgba(123,97,255,0.45)" strokeWidth="1.5" strokeDasharray="4 2"/>}
          </svg>
          <span
            className="absolute text-[17px] leading-none"
            style={{ top: "50%", left: "50%", transform: "translate(-50%, -58%)", opacity: 0.35 }}
          >
            {emoji}
          </span>
          <span
            className="absolute bottom-[5px] left-0 right-0 text-center text-[9px] tracking-[1px]"
            style={{ color: "#3D2A8A" }}
          >
            {milestone.roman}
          </span>
        </div>
        <p className="text-xs text-[#3A3A3A] leading-relaxed">
          {milestone.days} jours sans rechute. La résistance devient une habitude.
        </p>
      </div>
      <div className="h-[10px] w-full rounded-full bg-[#E8E3D8] overflow-hidden border-2 border-[#1A1A1A]">
        <div
          className="h-full rounded-full bg-[#7B61FF]"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="flex justify-between mt-[7px]">
        <span className="text-[10px] text-[#3D2A8A]">{currentDays} jours</span>
        <span className="text-[10px] text-[#555]">{milestone.days} jours</span>
      </div>
    </div>
  );
}

function ModuleTab({ slug, emoji, label, active, onClick }: { slug: string; emoji: string; label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex items-center gap-1.5 px-3 py-2 rounded-full text-xs whitespace-nowrap transition-all duration-200 border-[2.5px]",
        active
          ? "border-[#7B61FF] bg-[#EDE8FF] text-[#3D2A8A] shadow-[3px_3px_0_#7B61FF]"
          : "border-[#1A1A1A] bg-white text-[#1A1A1A] shadow-[3px_3px_0_#1A1A1A]",
      ].join(" ")}
    >
      <span className="text-sm" aria-hidden="true">{emoji}</span>
      {label}
    </button>
  );
}

export default function Trophies() {
  const [modules, setModules] = useState<ModuleProgress[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: userModules } = await supabase
        .from("user_modules")
        .select("module_slug, started_at")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (!userModules || userModules.length === 0) { setLoading(false); return; }

      const results: ModuleProgress[] = await Promise.all(
        userModules.map(async (mod) => {
          const { count } = await supabase
            .from("daily_checkins")
            .select("*", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("module_slug", mod.module_slug)
            .eq("cracked", false);
          return { slug: mod.module_slug, daysClean: count ?? 0 };
        })
      );

      setModules(results);
      setActiveSlug(results[0]?.slug ?? null);
      setLoading(false);
    };

    void fetchData();
  }, []);

  const activeModule = modules.find((m) => m.slug === activeSlug);
  const daysClean = activeModule?.daysClean ?? 0;
  const emoji = activeSlug ? (MODULE_EMOJI[activeSlug] ?? "🚬") : "🚬";
  const unlockedCount = MILESTONES.filter((m) => daysClean >= m.days).length;
  const nextMilestone = MILESTONES.find((m) => daysClean < m.days);
  const totalUnlocked = modules.reduce((acc, mod) => acc + MILESTONES.filter((m) => mod.daysClean >= m.days).length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0E8] flex items-center justify-center" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }}>
        <p className="text-[#1A1A1A] text-sm">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F0E8] text-[#1A1A1A]" style={{ fontFamily: "'Nunito', sans-serif", fontWeight: 900 }}>
      <main className="mx-auto w-full max-w-[980px] px-4 pb-24 pt-6">
        <div className="mb-6">
          <h1 className="text-xl tracking-[-0.4px] mb-1 text-[#1A1A1A]">Trophées</h1>
          <p className="text-[13px] text-[#3A3A3A]">Chaque médaille est une bataille gagnée.</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6">
          {[
            { val: totalUnlocked,  label: "Obtenus", card: "bg-[#EDE8FF] text-[#3D2A8A]" },
            { val: modules.length, label: "Restants", card: "bg-white text-[#1A1A1A]" },
            { val: daysClean,      label: "Complété", card: "bg-white text-[#1A1A1A]" },
          ].map(({ val, label, card }) => (
            <div key={label} className={`rounded-[20px] p-3 text-center border-[2.5px] border-[#1A1A1A] shadow-[4px_4px_0_#1A1A1A] ${card}`}>
              <p className="text-xl">{val}</p>
              <p className="text-[10px] uppercase tracking-[0.8px] mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {modules.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1 mb-6 scrollbar-none">
            {modules.map((mod) => (
              <ModuleTab
                key={mod.slug}
                slug={mod.slug}
                emoji={MODULE_EMOJI[mod.slug] ?? "❓"}
                label={MODULE_LABEL[mod.slug] ?? mod.slug}
                active={activeSlug === mod.slug}
                onClick={() => setActiveSlug(mod.slug)}
              />
            ))}
          </div>
        )}

        {modules.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-3xl mb-3">🏆</p>
            <p className="text-sm text-[#3A3A3A]">Aucun module actif.</p>
            <p className="text-xs text-[#666] mt-1">Active un module pour commencer à débloquer des trophées.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{emoji}</span>
                <p className="text-sm text-[#1A1A1A]">
                  {activeSlug ? MODULE_LABEL[activeSlug] : ""}
                </p>
              </div>
              <span className="bg-[#EDE8FF] border-[2.5px] border-[#7B61FF] rounded-full px-3 py-1 text-xs text-[#3D2A8A] shadow-[3px_3px_0_#7B61FF]">
                {daysClean} jour{daysClean > 1 ? "s" : ""}
              </span>
            </div>

            <p className="text-[10px] text-[#555] uppercase tracking-[1.4px] mb-[14px]">Médailles</p>
            <div className="grid grid-cols-3 gap-[10px] mb-6">
              {MILESTONES.map((milestone, i) => (
                <Badge
                  key={milestone.days}
                  milestone={milestone}
                  emoji={emoji}
                  unlocked={daysClean >= milestone.days}
                  featured={daysClean >= milestone.days && i === unlockedCount - 1}
                />
              ))}
            </div>

            {nextMilestone && (
              <>
                <p className="text-[10px] text-[#555] uppercase tracking-[1.4px] mb-[14px]">Prochain objectif</p>
                <NextObjective milestone={nextMilestone} emoji={emoji} currentDays={daysClean} />
              </>
            )}

            {!nextMilestone && (
              <div className="text-center py-8">
                <p className="text-2xl mb-2">👑</p>
                <p className="text-sm text-[#3A3A3A]">Tous les trophées débloqués pour ce module.</p>
              </div>
            )}
          </>
        )}
      </main>
      <AppNavigation />
    </div>
  );
}
