import { useMemo, useState } from "react";
import { CircleDollarSign, Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SubstancesSetupData {
  dailyQuantity: number;
  weeklySpendEuros: number;
}

interface SubstancesSetupModalProps {
  onComplete: (data: SubstancesSetupData) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const SubstancesSetupModal = ({ onComplete, isSubmitting = false }: SubstancesSetupModalProps) => {
  const [step, setStep] = useState(1);
  const [dailyQuantityInput, setDailyQuantityInput] = useState("0");
  const [weeklySpendInput, setWeeklySpendInput] = useState("0");

  const dailyQuantity = useMemo(() => Math.max(0, Number(dailyQuantityInput) || 0), [dailyQuantityInput]);
  const weeklySpendEuros = useMemo(() => Math.max(0, Number(weeklySpendInput) || 0), [weeklySpendInput]);

  const handleComplete = () => {
    void onComplete({
      dailyQuantity,
      weeklySpendEuros,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#09090b] text-white shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-violet-600/80 to-indigo-600/80 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Pill className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Configurons votre suivi substances</h2>
          <p className="mt-2 text-white/80">2 questions rapides pour personnaliser votre tracker</p>
        </div>

        <div className="flex justify-center gap-2 bg-white/5 py-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full transition-all duration-300 ${
                s === step ? "w-12 bg-violet-400" : s < step ? "bg-green-400" : "bg-white/20"
              }`}
            />
          ))}
        </div>

        <div className="space-y-6 p-6">
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <Pill className="h-5 w-5 text-violet-300" />
                <span className="font-medium">Combien de fois par jour en moyenne ?</span>
              </div>
              <input
                type="number"
                min={0}
                step="1"
                value={dailyQuantityInput}
                onChange={(e) => setDailyQuantityInput(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-400"
              />
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-violet-300" />
                <span className="font-medium">Combien dépensais-tu par semaine ? (€)</span>
              </div>
              <input
                type="number"
                min={0}
                step="0.01"
                value={weeklySpendInput}
                onChange={(e) => setWeeklySpendInput(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-400"
              />
            </div>
          )}
        </div>

        <div className="flex gap-3 p-6 pt-0">
          {step > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((currentStep) => currentStep - 1)}
              className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              Retour
            </Button>
          )}

          <Button
            type="button"
            variant="gradient"
            onClick={() => (step < 2 ? setStep((currentStep) => currentStep + 1) : handleComplete())}
            className="flex-1 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : step < 2 ? "Continuer" : "Commencer"}
          </Button>
        </div>
      </div>
    </div>
  );
};
