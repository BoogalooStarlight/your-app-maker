import { ArrowLeft, Clock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ComingSoon = () => {
  const location = useLocation();
  
  const pageInfo: Record<string, { title: string; description: string; color: string }> = {
    "/alcohol": {
      title: "Anti-Alcool",
      description: "Suivez votre consommation d'alcool, comptez vos jours de sobriété et surveillez la santé de votre foie.",
      color: "text-destructive",
    },
    "/mental": {
      title: "Santé Mentale",
      description: "Méditation guidée, exercices de respiration et suivi de votre bien-être émotionnel.",
      color: "text-accent",
    },
    "/energy": {
      title: "Énergie & Sommeil",
      description: "Optimisez vos cycles de sommeil et boostez votre énergie naturellement.",
      color: "text-primary",
    },
    "/heart": {
      title: "Santé Cardiaque",
      description: "Suivez vos progrès cardiovasculaires et les améliorations de votre endurance.",
      color: "text-rose-400",
    },
  };

  const info = pageInfo[location.pathname] || {
    title: "Fonctionnalité",
    description: "Cette fonctionnalité est en cours de développement.",
    color: "text-primary",
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass">
        <div className="container flex h-16 items-center">
          <Link to="/app">
            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <span className={`font-bold text-lg ml-4 ${info.color}`}>{info.title}</span>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <Clock className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className={`text-3xl font-bold ${info.color}`}>
            Bientôt disponible
          </h1>
          
          <p className="text-muted-foreground">
            {info.description}
          </p>
          
          <div className="pt-4">
            <Link to="/app">
              <Button variant="outline" className="border-border/50 hover:border-primary/50">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          {/* Decorative */}
          <div className="pt-8">
            <p className="text-xs text-muted-foreground/50 uppercase tracking-widest">
              En développement
            </p>
            <div className="mt-2 h-1 w-32 mx-auto rounded-full bg-muted overflow-hidden">
              <div className="h-full w-1/3 rounded-full gradient-cyber" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ComingSoon;
