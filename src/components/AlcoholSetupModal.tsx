import { useMemo, useState } from "react";
import { Beer, CircleDollarSign, GlassWater } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface AlcoholSetupData {
  primaryDrinkType: "beer" | "wine" | "spirits" | "other";
  glassesPerDay: number;
  weeklySpendEuros: number;
}

interface AlcoholSetupModalProps {
  onComplete: (data: AlcoholSetupData) => void | Promise<void>;
  isSubmitting?: boolean;
}

const drinkTypeOptions: { value: AlcoholSetupData["primaryDrinkType"]; label: string }[] = [
  { value: "beer", label: "Bière" },
  { value: "wine", label: "Vin" },
  { value: "spirits", label: "Spiritueux" },
  { value: "other", label: "Autre" },
];

export const AlcoholSetupModal = ({ onComplete, isSubmitting = false }: AlcoholSetupModalProps) => {
  const [step, setStep] = useState(1);
  const [primaryDrinkType, setPrimaryDrinkType] = useState<AlcoholSetupData["primaryDrinkType"]>("beer");
  const [glassesPerDayInput, setGlassesPerDayInput] = useState("0");
  const [weeklySpendInput, setWeeklySpendInput] = useState("0");

  const glassesPerDay = useMemo(() => Math.max(0, Number(glassesPerDayInput) || 0), [glassesPerDayInput]);
  const weeklySpendEuros = useMemo(() => Math.max(0, Number(weeklySpendInput) || 0), [weeklySpendInput]);

  const handleComplete = () => {
    void onComplete({
      primaryDrinkType,
      glassesPerDay,
      weeklySpendEuros,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#09090b] text-white shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-violet-600/80 to-indigo-600/80 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Beer className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Configurons votre suivi alcool</h2>
          <p className="mt-2 text-white/80">3 questions rapides pour personnaliser votre tracker</p>
        </div>

        <div className="flex justify-center gap-2 bg-white/5 py-4">
          {[1, 2, 3].map((s) => (
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
                <Beer className="h-5 w-5 text-violet-300" />
                <span className="font-medium">Type de boisson principale</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {drinkTypeOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setPrimaryDrinkType(option.value)}
                    className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                      primaryDrinkType === option.value
                        ? "border-violet-400 bg-violet-500/20 text-white"
                        : "border-white/20 bg-white/5 text-white/80 hover:bg-white/10"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <GlassWater className="h-5 w-5 text-violet-300" />
                <span className="font-medium">Combien de verres par jour en moyenne ?</span>
              </div>
              <input
                type="number"
                min={0}
                step="1"
                value={glassesPerDayInput}
                onChange={(e) => setGlassesPerDayInput(e.target.value)}
                className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-400"
              />
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <CircleDollarSign className="h-5 w-5 text-violet-300" />
                <span className="font-medium">Combien dépensais-tu par semaine en alcool ? (€)</span>
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
              variant="outline"
              onClick={() => setStep(step - 1)}
              className="flex-1 border-white/20 bg-white/5 text-white hover:bg-white/10"
              disabled={isSubmitting}
            >
              Retour
            </Button>
          )}
          <Button
            onClick={() => (step < 3 ? setStep(step + 1) : handleComplete())}
            className="flex-1 bg-violet-500 text-white hover:bg-violet-500/90"
            disabled={isSubmitting}
          >
            {step < 3 ? "Continuer" : isSubmitting ? "Enregistrement..." : "Commencer"}
          </Button>
        </div>
      </div>
    </div>
  );
};
