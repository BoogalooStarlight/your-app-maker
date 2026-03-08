export interface SmokingMetrics {
  totalMinutes: number;
  totalDays: number;
  cigarettesAvoided: number;
  moneySaved: number;
  lungHealth: number;
  progressPercent: number;
}

const SAFE_DEFAULTS: SmokingMetrics = {
  totalMinutes: 0,
  totalDays: 0,
  cigarettesAvoided: 0,
  moneySaved: 0,
  lungHealth: 5,
  progressPercent: 0,
};

export const getSmokingMetrics = (): SmokingMetrics => {
  if (typeof window === "undefined") return SAFE_DEFAULTS;

  const raw = window.localStorage.getItem("smokingTrackerData");
  if (!raw) return SAFE_DEFAULTS;

  try {
    const data = JSON.parse(raw);
    const quitDate = new Date(data.quitDate);

    if (Number.isNaN(quitDate.getTime())) return SAFE_DEFAULTS;

    const totalMinutes = Math.max(0, Math.floor((Date.now() - quitDate.getTime()) / (1000 * 60)));
    const totalDays = Math.max(0, Math.floor(totalMinutes / (60 * 24)));

    const cigarettesPerDay = Number(data.cigarettesPerDay) || 0;
    const packPrice = Number(data.packPrice ?? data.pricePerPack) || 0;

    const cigarettesAvoided = Math.floor((totalMinutes / (60 * 24)) * cigarettesPerDay);
    const moneySaved = (cigarettesAvoided / 20) * packPrice;
    const lungHealth = Math.min(100, Math.max(5, Math.round((totalDays / 365) * 100)));

    return {
      totalMinutes,
      totalDays,
      cigarettesAvoided,
      moneySaved,
      lungHealth,
      progressPercent: Math.min(100, Math.round((totalDays / 365) * 100)),
    };
  } catch {
    return SAFE_DEFAULTS;
  }
};
