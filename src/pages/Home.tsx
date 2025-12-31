import { Cigarette, Wine, Brain, Zap, Settings } from "lucide-react";
import { HumanBodyMatrix } from "@/components/HumanBodyMatrix";
import { CategoryCard } from "@/components/CategoryCard";
import { Button } from "@/components/ui/button";

const Home = () => {
  // Get tracker states from localStorage
  const smokingData = localStorage.getItem("smokingTrackerData");
  const hasSmokingTracker = !!smokingData;

  // Calculate lung health if smoking tracker is active
  let lungHealth = 0;
  if (smokingData) {
    try {
      const data = JSON.parse(smokingData);
      const quitDate = new Date(data.quitDate);
      const totalMinutes = Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60));
      const totalDays = totalMinutes / (60 * 24);
      lungHealth = Math.min(100, Math.round((totalDays / 365) * 100));
    } catch (e) {
      lungHealth = 0;
    }
  }

  const categories = [
    {
      title: "Anti-Tabac",
      description: "Suivez votre progression, visualisez la récupération de vos poumons et célébrez chaque victoire.",
      icon: Cigarette,
      href: "/smoking",
      color: "warning" as const,
      isActive: hasSmokingTracker,
      stats: hasSmokingTracker ? `${lungHealth}% récupéré` : undefined,
    },
    {
      title: "Anti-Alcool",
      description: "Surveillez votre consommation, suivez vos jours de sobriété et améliorez votre santé hépatique.",
      icon: Wine,
      href: "/alcohol",
      color: "destructive" as const,
      isActive: false,
    },
    {
      title: "Santé Mentale",
      description: "Méditation, gestion du stress et suivi de votre bien-être émotionnel au quotidien.",
      icon: Brain,
      href: "/mental",
      color: "accent" as const,
      isActive: false,
    },
    {
      title: "Énergie & Sommeil",
      description: "Optimisez votre sommeil et boostez votre énergie pour des journées plus productives.",
      icon: Zap,
      href: "/energy",
      color: "primary" as const,
      isActive: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-cyber">
                <Zap className="h-5 w-5 text-background" />
              </div>
              <div className="absolute inset-0 rounded-xl gradient-cyber blur-lg opacity-50" />
            </div>
            <div>
              <span className="font-bold text-lg text-gradient">VITALIS</span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Life Optimizer</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <main className="pt-20 pb-12">
        {/* Hero Section with Human Body */}
        <section className="container py-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            {/* Left: Body visualization */}
            <div className="relative rounded-3xl overflow-hidden border border-border/30 bg-card/30 backdrop-blur-sm min-h-[500px]">
              <HumanBodyMatrix
                activeOrgans={{
                  lungs: lungHealth,
                  heart: 100,
                  liver: 100,
                  brain: 100,
                }}
              />
            </div>

            {/* Right: Welcome text and stats */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Votre corps.
                  <br />
                  <span className="text-gradient">Votre contrôle.</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-md">
                  Visualisez en temps réel l'impact de vos choix sur votre santé. 
                  Chaque décision compte, chaque progrès est mesuré.
                </p>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl glass-light">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Programmes actifs</p>
                  <p className="text-3xl font-bold text-gradient mt-1">{hasSmokingTracker ? 1 : 0}</p>
                </div>
                <div className="p-4 rounded-2xl glass-light">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Santé globale</p>
                  <p className="text-3xl font-bold text-success mt-1">{hasSmokingTracker ? `${Math.round((lungHealth + 300) / 4)}%` : "—"}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <Button className="gradient-cyber text-background font-semibold px-6 shadow-cyber hover:opacity-90 transition-opacity">
                  Commencer maintenant
                </Button>
                <Button variant="outline" className="border-border/50 hover:border-primary/50 hover:text-primary">
                  En savoir plus
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="container py-12">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">Programmes de santé</h2>
                <p className="text-sm text-muted-foreground mt-1">Choisissez un domaine à améliorer</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {categories.map((category, index) => (
                <CategoryCard
                  key={category.title}
                  {...category}
                  delay={100 + index * 100}
                />
              ))}
            </div>
          </div>
        </section>

        {/* Status bar at bottom */}
        <section className="container">
          <div className="rounded-2xl glass-light p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-sm text-muted-foreground">Système actif</span>
              </div>
              <div className="w-px h-4 bg-border" />
              <span className="text-sm text-muted-foreground">
                Dernière mise à jour : <span className="text-foreground">maintenant</span>
              </span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">
              v1.0.0
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Home;
