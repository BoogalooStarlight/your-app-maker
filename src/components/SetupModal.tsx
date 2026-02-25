import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Cigarette, DollarSign, Calendar } from "lucide-react";

interface SetupModalProps {
  onComplete: (data: { quitDate: Date; cigarettesPerDay: number; pricePerPack: number }) => void;
}

export const SetupModal = ({ onComplete }: SetupModalProps) => {
  const [step, setStep] = useState(1);
  const [cigarettesPerDay, setCigarettesPerDay] = useState(10);
  const [pricePerPack, setPricePerPack] = useState(12);
  const [quitDate, setQuitDate] = useState(new Date().toISOString().split('T')[0]);

  const handleComplete = () => {
    onComplete({
      quitDate: new Date(quitDate),
      cigarettesPerDay,
      pricePerPack,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-3xl bg-card shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="gradient-fresh p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-foreground/20 backdrop-blur-sm">
            <Cigarette className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Commençons votre parcours</h2>
          <p className="mt-2 text-white/80">Quelques informations pour personnaliser votre suivi</p>
        </div>

        {/* Steps indicator */}
        <div className="flex justify-center gap-2 py-4 bg-muted/30">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                s === step ? "bg-primary w-12" : s < step ? "bg-success" : "bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-white">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-medium">Quand avez-vous arrêté de fumer ?</span>
              </div>
              <input
                type="date"
                value={quitDate}
                onChange={(e) => setQuitDate(e.target.value)}
                max={new Date().toISOString().split('T')[0]}
                className="w-full border-0 border-b border-white/25 bg-transparent px-0 py-3 text-white [color-scheme:dark] focus:border-primary focus:outline-none"
              />
              <p className="text-sm text-white/70">
                Si vous n'avez pas encore arrêté, sélectionnez aujourd'hui
              </p>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-white">
                <Cigarette className="h-5 w-5 text-warning" />
                <span className="font-medium">Combien de cigarettes fumiez-vous par jour ?</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="60"
                  value={cigarettesPerDay}
                  onChange={(e) => setCigarettesPerDay(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
                />
                <span className="w-16 text-center text-xl font-bold text-white">{cigarettesPerDay}</span>
              </div>
              <p className="text-sm text-white/70">
                {cigarettesPerDay <= 10 ? "Fumeur léger" : cigarettesPerDay <= 20 ? "Fumeur modéré" : "Gros fumeur"}
              </p>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 text-white">
                <DollarSign className="h-5 w-5 text-success" />
                <span className="font-medium">Prix d'un paquet de cigarettes (€)</span>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="5"
                  max="20"
                  step="0.5"
                  value={pricePerPack}
                  onChange={(e) => setPricePerPack(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full bg-muted appearance-none cursor-pointer accent-primary"
                />
                <span className="w-16 text-center text-xl font-bold text-white">{pricePerPack}€</span>
              </div>
              <p className="text-sm text-white/70">
                Prix moyen en France : ~12€
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 pt-0">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)} className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10">
              Retour
            </Button>
          )}
          <Button
            variant="gradient"
            onClick={() => (step < 3 ? setStep(step + 1) : handleComplete())}
            className="flex-1 text-white"
          >
            {step < 3 ? "Continuer" : "Commencer"}
          </Button>
        </div>
      </div>
    </div>
  );
};
