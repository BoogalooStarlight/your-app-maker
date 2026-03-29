import { Clock, Cigarette, Wallet, TrendingUp, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { LungVisualization } from "@/components/LungVisualization";
import { HealthMilestone } from "@/components/HealthMilestone";
import { SetupModal } from "@/components/SetupModal";
import { AppNavigation } from "@/components/AppNavigation";
import { useSmokingTracker } from "@/hooks/useSmokingTracker";

const glassCardClass =
  "rounded-[24px] border border-[rgba(255,255,255,0.045)] bg-[rgba(255,255,255,0.028)] backdrop-blur-[24px]";

const labelClass =
  "text-[10px] uppercase tracking-[0.16em] text-[rgba(255,255,255,0.35)] font-['DM_Sans']";

const Smoking = () => {
  const { isSetup, stats, saveData, getMilestones, getTimeDisplay } = useSmokingTracker();

  const timeDisplay = getTimeDisplay();
  const milestones = getMilestones();
  const achievedCount = milestones.filter((m) => m.achieved).length;

  if (!isSetup) {
    return <SetupModal onComplete={saveData} />;
  }

  return (
    <div className="min-h-screen bg-[#08080F] text-white font-['DM_Sans']">
      <main className="mx-auto flex w-full max-w-[430px] flex-col gap-6 px-4 pb-28 pt-6">
        <header className="flex items-center gap-3">
          <Link
            to="/modules"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.03)] text-[rgba(255,255,255,0.95)] transition-colors hover:bg-[rgba(255,255,255,0.06)]"
            aria-label="Retour"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold text-[rgba(255,255,255,0.95)]">Tabac</h1>
        </header>

        <section className={`${glassCardClass} p-6 text-center`}>
          <p className={labelClass}>Sans cigarette depuis</p>
          <div className="mt-3 flex items-end justify-center gap-2">
            <span className="font-['DM_Mono'] text-6xl font-bold leading-none text-[#9D87FF]">
              {timeDisplay.primary}
            </span>
            <span className="pb-1 text-lg font-semibold text-[rgba(255,255,255,0.55)]">{timeDisplay.unit}</span>
          </div>
          <p className="mt-3 text-sm text-[rgba(255,255,255,0.35)]">{timeDisplay.secondary}</p>
        </section>

        <section className="space-y-3">
          <h2 className="text-base font-semibold text-[rgba(255,255,255,0.95)]">Vos statistiques</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              {
                icon: Clock,
                label: "Jours clean",
                value: stats.totalDays > 0 ? `${stats.totalDays}j` : `${stats.totalHours}h`,
                subValue:
                  stats.totalDays > 0
                    ? `${stats.totalHours % 24}h ${stats.totalMinutes % 60}min`
                    : `${stats.totalMinutes % 60} minutes`,
                valueClass: "text-[#9D87FF]",
              },
              {
                icon: Cigarette,
                label: "Cigarettes évitées",
                value: stats.cigarettesAvoided.toLocaleString(),
                subValue: "non fumées",
                valueClass: "text-[rgba(255,255,255,0.95)]",
              },
              {
                icon: Wallet,
                label: "Argent économisé",
                value: `${stats.moneySaved.toFixed(0)}€`,
                subValue: "dans votre poche",
                valueClass: "text-[#9D87FF]",
              },
              {
                icon: TrendingUp,
                label: "Objectifs atteints",
                value: `${achievedCount}/${milestones.length}`,
                subValue: "étapes franchies",
                valueClass: "text-[rgba(255,255,255,0.95)]",
              },
            ].map((item) => (
              <article key={item.label} className={`${glassCardClass} p-4`}>
                <div className="mb-3 flex items-center gap-2 text-[rgba(255,255,255,0.55)]">
                  <item.icon className="h-4 w-4" />
                  <p className={labelClass}>{item.label}</p>
                </div>
                <p className={`font-['DM_Mono'] text-2xl font-bold ${item.valueClass}`}>{item.value}</p>
                <p className="mt-1 text-xs text-[rgba(255,255,255,0.35)]">{item.subValue}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-[rgba(255,255,255,0.95)]">Récupération pulmonaire</h2>
            <span className="rounded-full border border-[rgba(123,97,255,0.3)] bg-[rgba(123,97,255,0.12)] px-3 py-1 text-xs font-medium text-[#9D87FF]">
              {Math.round(stats.lungHealthPercentage)}% récupéré
            </span>
          </div>

          <div className={`${glassCardClass} p-5`}>
            <div className="flex flex-col items-center gap-5">
              <div className="h-48 w-48">
                <LungVisualization healthPercentage={stats.lungHealthPercentage} />
              </div>

              <div className="w-full space-y-3 text-center">
                <h3 className="text-sm font-semibold text-[rgba(255,255,255,0.95)]">Vos poumons se régénèrent</h3>
                <p className="text-sm text-[rgba(255,255,255,0.55)]">
                  {stats.lungHealthPercentage < 20
                    ? "Le processus de guérison vient de commencer. Chaque minute compte !"
                    : stats.lungHealthPercentage < 50
                      ? "Vos bronches commencent à se détendre. La respiration devient plus facile."
                      : stats.lungHealthPercentage < 80
                        ? "Votre capacité pulmonaire s'améliore significativement. Continuez !"
                        : "Vos poumons sont presque entièrement régénérés. Félicitations !"}
                </p>

                <div className="space-y-2">
                  <div className="h-2 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#7B61FF] transition-all duration-1000 ease-out"
                      style={{ width: `${stats.lungHealthPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-[rgba(255,255,255,0.35)]">
                    Récupération complète estimée : 1 an après l'arrêt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-base font-semibold text-[rgba(255,255,255,0.95)]">Étapes de santé</h2>
            <span className="text-xs text-[rgba(255,255,255,0.55)]">
              {achievedCount} sur {milestones.length} atteintes
            </span>
          </div>

          <div className={`${glassCardClass} space-y-3 p-4`}>
            {milestones.map((milestone, index) => (
              <div
                key={milestone.id}
                className={milestone.achieved ? "rounded-2xl border border-[#7B61FF]/40 bg-[#7B61FF]/10" : "rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)]"}
              >
                <HealthMilestone
                  title={milestone.title}
                  description={milestone.description}
                  timeRequired={milestone.id}
                  achieved={milestone.achieved}
                  delay={100 + index * 50}
                />
              </div>
            ))}
          </div>
        </section>
      </main>

      <AppNavigation />
    </div>
  );
};

export default Smoking;
