import { useEffect, useMemo, useState } from "react";
import { getAllAddictions, type Addiction, type AddictionType } from "@/lib/addictionStore";

const DAY_MS = 1000 * 60 * 60 * 24;

export interface AddictionSummary {
  id: string;
  type: AddictionType;
  name: string;
  elapsedDays: number;
  moneySaved: number;
}

export interface UseAllAddictionsResult {
  addictions: AddictionSummary[];
  totalDays: number;
  totalMoneySaved: number;
  activeCount: number;
}

const toElapsedDays = (startDate: string, nowMs: number): number => {
  const startMs = new Date(startDate).getTime();
  if (Number.isNaN(startMs)) return 0;
  return Math.max(0, (nowMs - startMs) / DAY_MS);
};

const computeMoneySaved = (addiction: Addiction, elapsedDays: number): number => {
  switch (addiction.type) {
    case "smoking":
      return (addiction.config.cigarettesPerDay / 20) * addiction.config.pricePerPack * elapsedDays;
    case "alcohol":
      return addiction.config.drinksPerDay * addiction.config.pricePerDrink * elapsedDays;
    case "balloons": {
      const itemsPerDay = addiction.config.balloonsPerDay ?? 0;
      const pricePerItem = addiction.config.pricePerBalloon ?? 0;
      return itemsPerDay * pricePerItem * elapsedDays;
    }
    case "behavioral":
    case "drugs":
    default:
      return 0;
  }
};

const buildSummaries = (items: Addiction[], nowMs: number): AddictionSummary[] => {
  return items
    .filter((item) => item.isActive)
    .map((item) => {
      const elapsedDays = toElapsedDays(item.startDate, nowMs);
      return {
        id: item.id,
        type: item.type,
        name: item.name,
        elapsedDays,
        moneySaved: computeMoneySaved(item, elapsedDays),
      };
    });
};

export const useAllAddictions = (): UseAllAddictionsResult => {
  const [nowMs, setNowMs] = useState<number>(() => Date.now());
  const [items, setItems] = useState<Addiction[]>(() => getAllAddictions());

  useEffect(() => {
    setItems(getAllAddictions());
    setNowMs(Date.now());

    const timer = window.setInterval(() => {
      setItems(getAllAddictions());
      setNowMs(Date.now());
    }, 60_000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const addictions = useMemo(() => buildSummaries(items, nowMs), [items, nowMs]);

  const totalDays = useMemo(() => addictions.reduce((sum, item) => sum + item.elapsedDays, 0), [addictions]);
  const totalMoneySaved = useMemo(() => addictions.reduce((sum, item) => sum + item.moneySaved, 0), [addictions]);

  return {
    addictions,
    totalDays,
    totalMoneySaved,
    activeCount: addictions.length,
  };
};
