import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteAddiction,
  getAddictionById,
  resetAddiction,
  type Addiction,
} from "@/lib/addictionStore";

interface ElapsedTime {
  totalMs: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface UseAddictionResult {
  addiction: Addiction | null;
  elapsed: ElapsedTime;
  moneySaved: number;
  handleReset: () => void;
  handleDelete: () => boolean;
}

const EMPTY_ELAPSED: ElapsedTime = {
  totalMs: 0,
  days: 0,
  hours: 0,
  minutes: 0,
  seconds: 0,
};

const DAY_MS = 1000 * 60 * 60 * 24;

const toElapsed = (startDate: string, nowMs: number): ElapsedTime => {
  const startMs = new Date(startDate).getTime();
  if (Number.isNaN(startMs)) return EMPTY_ELAPSED;

  const totalMs = Math.max(0, nowMs - startMs);
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalMs,
    days,
    hours,
    minutes,
    seconds,
  };
};

const computeMoneySaved = (addiction: Addiction, elapsedMs: number): number => {
  const elapsedDays = elapsedMs / DAY_MS;

  switch (addiction.type) {
    case "smoking":
      return (addiction.config.cigarettesPerDay / 20) * addiction.config.pricePerPack * elapsedDays;
    case "alcohol":
      return addiction.config.drinksPerDay * addiction.config.pricePerDrink * elapsedDays;
    case "balloons": {
      const drinksPerDay = addiction.config.balloonsPerDay ?? 0;
      const pricePerDrink = addiction.config.pricePerBalloon ?? 0;
      return drinksPerDay * pricePerDrink * elapsedDays;
    }
    case "behavioral":
    case "drugs":
    default:
      return 0;
  }
};

export const useAddiction = (id: string): UseAddictionResult => {
  const [addiction, setAddiction] = useState<Addiction | null>(() => getAddictionById(id) ?? null);
  const [nowMs, setNowMs] = useState<number>(() => Date.now());

  useEffect(() => {
    setAddiction(getAddictionById(id) ?? null);
    setNowMs(Date.now());

    const timer = window.setInterval(() => {
      setNowMs(Date.now());
      setAddiction(getAddictionById(id) ?? null);
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [id]);

  const elapsed = useMemo<ElapsedTime>(() => {
    if (!addiction) return EMPTY_ELAPSED;
    return toElapsed(addiction.startDate, nowMs);
  }, [addiction, nowMs]);

  const moneySaved = useMemo<number>(() => {
    if (!addiction) return 0;
    return computeMoneySaved(addiction, elapsed.totalMs);
  }, [addiction, elapsed.totalMs]);

  const handleReset = useCallback(() => {
    const updated = resetAddiction(id);
    setAddiction(updated ?? null);
    setNowMs(Date.now());
  }, [id]);

  const handleDelete = useCallback((): boolean => {
    const deleted = deleteAddiction(id);
    if (deleted) {
      setAddiction(null);
      setNowMs(Date.now());
    }
    return deleted;
  }, [id]);

  return {
    addiction,
    elapsed,
    moneySaved,
    handleReset,
    handleDelete,
  };
};
