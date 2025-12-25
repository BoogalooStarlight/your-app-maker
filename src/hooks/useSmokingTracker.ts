import { useState, useEffect, useCallback } from "react";

interface TrackerData {
  quitDate: string;
  cigarettesPerDay: number;
  pricePerPack: number;
}

interface TrackerStats {
  totalMinutes: number;
  totalHours: number;
  totalDays: number;
  cigarettesAvoided: number;
  moneySaved: number;
  lungHealthPercentage: number;
}

const MILESTONES = [
  { id: "20min", minutes: 20, title: "Pression artérielle normalisée", description: "Votre tension artérielle et votre pouls retrouvent des niveaux normaux." },
  { id: "8h", minutes: 480, title: "Oxygène restauré", description: "Le niveau d'oxygène dans votre sang redevient normal." },
  { id: "24h", minutes: 1440, title: "Risque cardiaque réduit", description: "Le risque de crise cardiaque commence à diminuer." },
  { id: "48h", minutes: 2880, title: "Goût et odorat améliorés", description: "Les terminaisons nerveuses commencent à se régénérer." },
  { id: "72h", minutes: 4320, title: "Respiration facilitée", description: "Les bronches se détendent, la respiration devient plus facile." },
  { id: "2sem", minutes: 20160, title: "Circulation améliorée", description: "La circulation sanguine s'améliore significativement." },
  { id: "1mois", minutes: 43200, title: "Énergie retrouvée", description: "Moins d'essoufflement, plus d'énergie au quotidien." },
  { id: "3mois", minutes: 129600, title: "Fonction pulmonaire +30%", description: "La capacité pulmonaire augmente jusqu'à 30%." },
  { id: "6mois", minutes: 259200, title: "Toux réduite", description: "La toux et l'encombrement diminuent considérablement." },
  { id: "1an", minutes: 525600, title: "Risque cardiaque divisé par 2", description: "Le risque de maladie coronarienne est réduit de moitié." },
];

export const useSmokingTracker = () => {
  const [data, setData] = useState<TrackerData | null>(null);
  const [stats, setStats] = useState<TrackerStats>({
    totalMinutes: 0,
    totalHours: 0,
    totalDays: 0,
    cigarettesAvoided: 0,
    moneySaved: 0,
    lungHealthPercentage: 0,
  });

  // Load data from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("smokingTrackerData");
    if (saved) {
      setData(JSON.parse(saved));
    }
  }, []);

  // Calculate stats
  const calculateStats = useCallback(() => {
    if (!data) return;

    const quitDate = new Date(data.quitDate);
    const now = new Date();
    const diffMs = now.getTime() - quitDate.getTime();
    const totalMinutes = Math.max(0, Math.floor(diffMs / 60000));
    const totalHours = Math.floor(totalMinutes / 60);
    const totalDays = Math.floor(totalHours / 24);

    // Cigarettes per minute (assuming 16 waking hours)
    const cigarettesPerMinute = data.cigarettesPerDay / (16 * 60);
    const cigarettesAvoided = Math.floor(cigarettesPerMinute * totalMinutes);

    // Money saved (20 cigarettes per pack)
    const pricePerCigarette = data.pricePerPack / 20;
    const moneySaved = cigarettesAvoided * pricePerCigarette;

    // Lung health percentage (improves over time, max at 1 year)
    const maxMinutesForFullRecovery = 525600; // 1 year
    const lungHealthPercentage = Math.min(100, (totalMinutes / maxMinutesForFullRecovery) * 100);

    setStats({
      totalMinutes,
      totalHours,
      totalDays,
      cigarettesAvoided,
      moneySaved,
      lungHealthPercentage,
    });
  }, [data]);

  // Update stats every minute
  useEffect(() => {
    calculateStats();
    const interval = setInterval(calculateStats, 60000);
    return () => clearInterval(interval);
  }, [calculateStats]);

  // Save data
  const saveData = (newData: { quitDate: Date; cigarettesPerDay: number; pricePerPack: number }) => {
    const dataToSave: TrackerData = {
      quitDate: newData.quitDate.toISOString(),
      cigarettesPerDay: newData.cigarettesPerDay,
      pricePerPack: newData.pricePerPack,
    };
    localStorage.setItem("smokingTrackerData", JSON.stringify(dataToSave));
    setData(dataToSave);
  };

  // Reset data
  const resetData = () => {
    localStorage.removeItem("smokingTrackerData");
    setData(null);
  };

  // Get achieved milestones
  const getMilestones = () => {
    return MILESTONES.map((milestone) => ({
      ...milestone,
      achieved: stats.totalMinutes >= milestone.minutes,
    }));
  };

  // Format time display
  const getTimeDisplay = () => {
    const days = stats.totalDays;
    const hours = stats.totalHours % 24;
    const minutes = stats.totalMinutes % 60;

    if (days > 0) {
      return { primary: days.toString(), unit: days === 1 ? "jour" : "jours", secondary: `${hours}h ${minutes}min` };
    } else if (hours > 0) {
      return { primary: hours.toString(), unit: hours === 1 ? "heure" : "heures", secondary: `${minutes} minutes` };
    } else {
      return { primary: minutes.toString(), unit: minutes === 1 ? "minute" : "minutes", secondary: "depuis votre arrêt" };
    }
  };

  return {
    isSetup: !!data,
    data,
    stats,
    saveData,
    resetData,
    getMilestones,
    getTimeDisplay,
  };
};
