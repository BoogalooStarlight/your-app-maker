import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addAddiction,
  deleteAddiction,
  getAllAddictions,
  resetAddiction,
  type Addiction,
  type AlcoholConfig,
  updateAddiction,
} from "@/lib/addictionStore";

interface AlcoholTrackerStats {
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  drinksAvoided: number;
  moneySaved: number;
}

interface AlcoholMilestone {
  id: string;
  minutes: number;
  title: string;
  description: string;
  achieved: boolean;
}

interface SetupInput {
  drinksPerDay: number;
  pricePerDrink: number;
  startDate: Date;
}

const MILESTONES_BASE = [
  { id: "20min", minutes: 20, title: "20 min", description: "Normalisation de la fréquence cardiaque." },
  { id: "12h", minutes: 720, title: "12h", description: "Taux d'alcool à zéro dans le sang." },
  { id: "24h", minutes: 1440, title: "24h", description: "Réduction de l'anxiété." },
  { id: "48h", minutes: 2880, title: "48h", description: "Le cerveau commence à récupérer." },
  { id: "72h", minutes: 4320, title: "72h", description: "Pic du sevrage passé." },
  { id: "1sem", minutes: 10080, title: "1 semaine", description: "Meilleur sommeil." },
  { id: "1mois", minutes: 43200, title: "1 mois", description: "Foie qui récupère significativement." },
  { id: "1an", minutes: 525600, title: "1 an", description: "Risque de maladie du foie réduit de moitié." },
] as const;

const EMPTY_STATS: AlcoholTrackerStats = {
  totalMinutes: 0,
  totalHours: 0,
  totalDays: 0,
  drinksAvoided: 0,
  moneySaved: 0,
};

const findAlcoholAddiction = (): Addiction | null => {
  const items = getAllAddictions();
  const active = items.find((item) => item.type === "alcohol" && item.isActive);
  if (active) return active;

  const fallback = items.find((item) => item.type === "alcohol");
  return fallback ?? null;
};

const calculateStats = (addiction: Addiction | null): AlcoholTrackerStats => {
  if (!addiction || addiction.type !== "alcohol") return EMPTY_STATS;

  const start = new Date(addiction.startDate).getTime();
  if (Number.isNaN(start)) return EMPTY_STATS;

  const diffMs = Math.max(0, Date.now() - start);
  const totalMinutes = Math.floor(diffMs / 60000);
  const totalHours = Math.floor(totalMinutes / 60);
  const totalDays = Math.floor(totalHours / 24);

  const drinksPerMinute = addiction.config.drinksPerDay / (24 * 60);
  const drinksAvoided = Math.floor(drinksPerMinute * totalMinutes);
  const moneySaved = drinksAvoided * addiction.config.pricePerDrink;

  return {
    totalMinutes,
    totalHours,
    totalDays,
    drinksAvoided,
    moneySaved,
  };
};

export const useAlcoholTracker = () => {
  const [addiction, setAddiction] = useState<Addiction | null>(() => findAlcoholAddiction());
  const [stats, setStats] = useState<AlcoholTrackerStats>(() => calculateStats(findAlcoholAddiction()));

  const refresh = useCallback(() => {
    const next = findAlcoholAddiction();
    setAddiction(next);
    setStats(calculateStats(next));
  }, []);

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 1000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const saveData = useCallback((data: SetupInput) => {
    const config: AlcoholConfig = {
      drinksPerDay: data.drinksPerDay,
      pricePerDrink: data.pricePerDrink,
    };

    const existing = findAlcoholAddiction();

    if (existing) {
      updateAddiction(existing.id, {
        name: "Alcool",
        type: "alcohol",
        config,
        isActive: true,
        startDate: data.startDate.toISOString(),
      });
    } else {
      addAddiction({
        name: "Alcool",
        type: "alcohol",
        config,
        isActive: true,
        startDate: data.startDate.toISOString(),
      });
    }

    refresh();
  }, [refresh]);

  const handleReset = useCallback(() => {
    if (!addiction) return;
    resetAddiction(addiction.id);
    refresh();
  }, [addiction, refresh]);

  const handleDelete = useCallback(() => {
    if (!addiction) return;
    deleteAddiction(addiction.id);
    refresh();
  }, [addiction, refresh]);

  const getMilestones = useCallback((): AlcoholMilestone[] => {
    return MILESTONES_BASE.map((milestone) => ({
      ...milestone,
      achieved: stats.totalMinutes >= milestone.minutes,
    }));
  }, [stats.totalMinutes]);

  const getTimeDisplay = useMemo(() => {
    const days = stats.totalDays;
    const hours = stats.totalHours % 24;
    const minutes = stats.totalMinutes % 60;

    if (days > 0) {
      return {
        primary: `${days}`,
        unit: days === 1 ? "jour" : "jours",
        secondary: `${hours}h ${minutes}min`,
      };
    }

    if (hours > 0) {
      return {
        primary: `${hours}`,
        unit: hours === 1 ? "heure" : "heures",
        secondary: `${minutes} minutes`,
      };
    }

    return {
      primary: `${minutes}`,
      unit: minutes === 1 ? "minute" : "minutes",
      secondary: "depuis votre arrêt",
    };
  }, [stats.totalDays, stats.totalHours, stats.totalMinutes]);

  return {
    isSetup: !!addiction && addiction.type === "alcohol" && addiction.isActive,
    addiction: addiction && addiction.type === "alcohol" ? addiction : null,
    stats,
    saveData,
    handleReset,
    handleDelete,
    getMilestones,
    getTimeDisplay,
  };
};
