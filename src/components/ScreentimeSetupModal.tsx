import { useMemo, useState } from "react";
import { Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface ScreentimeSetupData {
  hoursPerDay: number;
}

interface ScreentimeSetupModalProps {
  onComplete: (data: ScreentimeSetupData) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const ScreentimeSetupModal = ({ onComplete, isSubmitting = false }: ScreentimeSetupModalProps) => {
  const [hoursPerDayInput, setHoursPerDayInput] = useState("0");

  const hoursPerDay = useMemo(() => Math.max(0, Number(hoursPerDayInput) || 0), [hoursPerDayInput]);

  const handleComplete = () => {
    void onComplete({
      hoursPerDay,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#09090b] text-white shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-violet-600/80 to-indigo-600/80 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Smartphone className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Configurons votre suivi du temps d'écran</h2>
          <p className="mt-2 text-white/80">1 question rapide pour personnaliser votre tracker</p>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-violet-300" />
              <span className="font-medium">Combien d'heures par jour passais-tu sur ton téléphone ?</span>
            </div>

            <input
              type="number"
              min={0}
              step="0.1"
              value={hoursPerDayInput}
              onChange={(e) => setHoursPerDayInput(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/5 px-3 py-3 text-white outline-none focus:border-violet-400"
            />
          </div>
        </div>

        <div className="p-6 pt-0">
          <Button
            onClick={handleComplete}
            className="w-full bg-violet-500 text-white hover:bg-violet-500/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Enregistrement..." : "Commencer"}
          </Button>
        </div>
      </div>
    </div>
  );
};
