import { Clock, Cigarette, Wallet, TrendingUp, ArrowLeft, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LungVisualization } from "@/components/LungVisualization";
import { StatCard } from "@/components/StatCard";
import { HealthMilestone } from "@/components/HealthMilestone";
import { SetupModal } from "@/components/SetupModal";
import { useSmokingTracker } from "@/hooks/useSmokingTracker";

const Smoking = () => {
  const { isSetup, stats, saveData, resetData, getMilestones, getTimeDisplay } = useSmokingTracker();

  const timeDisplay = getTimeDisplay();
  const milestones = getMilestones();
  const achievedCount = milestones.filter(m => m.achieved).length;

  if (!isSetup) {
    return <SetupModal onComplete={saveData} />;
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-warning/20">
                <Cigarette className="h-5 w-5 text-warning" />
              </div>
              <span className="font-bold text-lg">Anti-Tabac</span>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={resetData} className="text-muted-foreground hover:text-destructive">
            <RotateCcw className="h-4 w-4 mr-2" />
            Réinitialiser
          </Button>
        </div>
      </header>

      <main className="container pt-24 pb-12 space-y-8">
        {/* Hero Section - Time Counter */}
        <section className="relative overflow-hidden rounded-3xl border border-warning/30 p-8 text-foreground shadow-[0_0_60px_hsl(38_100%_55%/0.15)]" 
          style={{ background: "linear-gradient(145deg, hsl(38 100% 55% / 0.1) 0%, hsl(220 15% 8%) 100%)" }}>
          <div className="relative z-10 text-center space-y-2">
            <p className="text-sm font-medium text-warning/80 uppercase tracking-wider">
              Sans cigarette depuis
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-7xl font-extrabold tracking-tight text-warning">{timeDisplay.primary}</span>
              <span className="text-2xl font-semibold text-warning/70">{timeDisplay.unit}</span>
            </div>
            <p className="text-muted-foreground">{timeDisplay.secondary}</p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-warning/10 blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-warning/5 blur-2xl translate-y-1/2 -translate-x-1/2" />
        </section>

        {/* Lung Visualization */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Récupération pulmonaire</h2>
            <span className="text-sm font-semibold px-3 py-1 rounded-full bg-success/10 text-success glow-success">
              {Math.round(stats.lungHealthPercentage)}% récupéré
            </span>
          </div>
          
          <div className="relative rounded-3xl border border-border/30 p-6 glass overflow-hidden">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-48 h-48 md:w-56 md:h-56">
                <LungVisualization healthPercentage={stats.lungHealthPercentage} />
              </div>
              
              <div className="flex-1 space-y-4 text-center md:text-left">
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Vos poumons se régénèrent</h3>
                  <p className="text-muted-foreground mt-1">
                    {stats.lungHealthPercentage < 20 
                      ? "Le processus de guérison vient de commencer. Chaque minute compte !"
                      : stats.lungHealthPercentage < 50
                      ? "Vos bronches commencent à se détendre. La respiration devient plus facile."
                      : stats.lungHealthPercentage < 80
                      ? "Votre capacité pulmonaire s'améliore significativement. Continuez !"
                      : "Vos poumons sont presque entièrement régénérés. Félicitations !"}
                  </p>
                </div>
                
                {/* Progress bar */}
                <div className="space-y-2">
                  <div className="h-3 rounded-full bg-muted overflow-hidden">
                    <div 
                      className="h-full rounded-full bg-success transition-all duration-1000 ease-out glow-success"
                      style={{ width: `${stats.lungHealthPercentage}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Récupération complète estimée : 1 an après l'arrêt
                  </p>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 rounded-full bg-success/5 blur-3xl" />
          </div>
        </section>

        {/* Stats Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Vos statistiques</h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="Temps sans fumer"
              value={stats.totalDays > 0 ? `${stats.totalDays}j` : `${stats.totalHours}h`}
              subValue={stats.totalDays > 0 ? `${stats.totalHours % 24}h ${stats.totalMinutes % 60}min` : `${stats.totalMinutes % 60} minutes`}
              color="primary"
              delay={100}
            />
            <StatCard
              icon={<Cigarette className="h-5 w-5" />}
              label="Cigarettes évitées"
              value={stats.cigarettesAvoided.toLocaleString()}
              subValue="non fumées"
              color="warning"
              delay={200}
            />
            <StatCard
              icon={<Wallet className="h-5 w-5" />}
              label="Argent économisé"
              value={`${stats.moneySaved.toFixed(0)}€`}
              subValue="dans votre poche"
              color="success"
              delay={300}
            />
            <StatCard
              icon={<TrendingUp className="h-5 w-5" />}
              label="Objectifs atteints"
              value={`${achievedCount}/${milestones.length}`}
              subValue="étapes franchies"
              color="accent"
              delay={400}
            />
          </div>
        </section>

        {/* Milestones */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Étapes de santé</h2>
            <span className="text-sm text-muted-foreground">
              {achievedCount} sur {milestones.length} atteintes
            </span>
          </div>
          
          <div className="space-y-3">
            {milestones.map((milestone, index) => (
              <HealthMilestone
                key={milestone.id}
                title={milestone.title}
                description={milestone.description}
                timeRequired={milestone.id}
                achieved={milestone.achieved}
                delay={100 + index * 50}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Smoking;
