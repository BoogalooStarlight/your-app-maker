import { useState } from "react";
import { ArrowLeft, Clock, RotateCcw, TrendingUp, Wine, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HealthMilestone } from "@/components/HealthMilestone";
import { StatCard } from "@/components/StatCard";
import { useAlcoholTracker } from "@/hooks/useAlcoholTracker";

const Alcohol = () => {
  const { isSetup, stats, saveData, handleReset, handleDelete, getMilestones, getTimeDisplay } = useAlcoholTracker();

  const [drinksPerDay, setDrinksPerDay] = useState(3);
  const [pricePerDrink, setPricePerDrink] = useState(4);
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);

  const timeDisplay = getTimeDisplay;
  const milestones = getMilestones();
  const achievedCount = milestones.filter((m) => m.achieved).length;

  if (!isSetup) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md overflow-hidden rounded-3xl border border-blue-400/20 bg-card shadow-2xl">
          <div
            className="p-8 text-center text-white"
            style={{ background: "linear-gradient(145deg, hsl(213 94% 60% / 0.22) 0%, hsl(220 15% 8%) 100%)" }}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/20 backdrop-blur-sm">
              <Wine className="h-8 w-8 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">Commençons votre suivi alcool</h2>
            <p className="mt-2 text-white/80">Quelques informations pour personnaliser votre parcours</p>
          </div>

          <div className="space-y-5 p-6">
            <div className="space-y-2">
              <label className="text-sm text-white/75">Date d'arrêt</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                max={new Date().toISOString().split("T")[0]}
                className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-white [color-scheme:dark] focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/75">Verres par jour</label>
              <input
                type="number"
                min={1}
                value={drinksPerDay}
                onChange={(e) => setDrinksPerDay(Math.max(1, Number(e.target.value) || 1))}
                className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-white/75">Prix moyen par verre (€)</label>
              <input
                type="number"
                min={0}
                step={0.5}
                value={pricePerDrink}
                onChange={(e) => setPricePerDrink(Math.max(0, Number(e.target.value) || 0))}
                className="w-full rounded-xl border border-white/20 bg-transparent px-3 py-2 text-white focus:border-blue-400 focus:outline-none"
              />
            </div>

            <Button
              onClick={() =>
                saveData({
                  drinksPerDay,
                  pricePerDrink,
                  startDate: new Date(startDate),
                })
              }
              className="w-full bg-blue-500 text-white hover:bg-blue-400"
            >
              Démarrer le suivi
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <header className="glass fixed left-0 right-0 top-0 z-50">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/20">
                <Wine className="h-5 w-5 text-blue-400" />
              </div>
              <span className="text-lg font-bold">Anti-Alcool</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-muted-foreground hover:text-blue-300">
              <RotateCcw className="mr-2 h-4 w-4" />
              Réinitialiser
            </Button>
            <Button variant="ghost" size="sm" onClick={handleDelete} className="text-muted-foreground hover:text-destructive">
              Supprimer
            </Button>
          </div>
        </div>
      </header>

      <main className="container space-y-8 pb-12 pt-24">
        <section
          className="relative overflow-hidden rounded-3xl border border-blue-400/30 p-8 text-foreground shadow-[0_0_60px_hsl(213_94%_60%/0.15)]"
          style={{ background: "linear-gradient(145deg, hsl(213 94% 60% / 0.1) 0%, hsl(220 15% 8%) 100%)" }}
        >
          <div className="relative z-10 space-y-2 text-center">
            <p className="text-sm font-medium uppercase tracking-wider text-blue-300/80">Sans alcool depuis</p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-7xl font-extrabold tracking-tight text-blue-300">{timeDisplay.primary}</span>
              <span className="text-2xl font-semibold text-blue-300/70">{timeDisplay.unit}</span>
            </div>
            <p className="text-muted-foreground">{timeDisplay.secondary}</p>
          </div>
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl" />
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Vos statistiques</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard
              icon={<Clock className="h-5 w-5" />}
              label="Temps sans alcool"
              value={stats.totalDays > 0 ? `${stats.totalDays}j` : `${stats.totalHours}h`}
              subValue={stats.totalDays > 0 ? `${stats.totalHours % 24}h ${stats.totalMinutes % 60}min` : `${stats.totalMinutes % 60} minutes`}
              color="primary"
              delay={100}
            />
            <StatCard
              icon={<Wine className="h-5 w-5" />}
              label="Verres évités"
              value={stats.drinksAvoided.toLocaleString()}
              subValue="non consommés"
              color="accent"
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
              color="primary"
              delay={400}
            />
          </div>
        </section>

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

export default Alcohol;
