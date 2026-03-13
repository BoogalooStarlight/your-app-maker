import { useMemo, useState } from "react";
import { Flame } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface FornicationSetupData {
  timesPerDay: number;
}

interface FornicationSetupModalProps {
  onComplete: (data: FornicationSetupData) => void | Promise<void>;
  isSubmitting?: boolean;
}

export const FornicationSetupModal = ({ onComplete, isSubmitting = false }: FornicationSetupModalProps) => {
  const [timesPerDayInput, setTimesPerDayInput] = useState("0");

  const timesPerDay = useMemo(() => Math.max(0, Number(timesPerDayInput) || 0), [timesPerDayInput]);

  const handleComplete = () => {
    void onComplete({ timesPerDay });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#09090b] text-white shadow-2xl animate-scale-in">
        <div className="bg-gradient-to-r from-violet-600/80 to-indigo-600/80 p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <Flame className="h-8 w-8" />
          </div>
          <h2 className="text-2xl font-bold">Configurons votre suivi fornication</h2>
          <p className="mt-2 text-white/80">1 question rapide pour personnaliser votre tracker</p>
        </div>

        <div className="space-y-6 p-6">
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-violet-300" />
              <span className="font-medium">Combien de fois par jour cèdes-tu à ce comportement ?</span>
            </div>
            <input
              type="number"
              min={0}
              step="1"
              value={timesPerDayInput}
              onChange={(e) => setTimesPerDayInput(e.target.value)}
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
