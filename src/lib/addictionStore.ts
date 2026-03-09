export type AddictionType = "smoking" | "alcohol" | "drugs" | "balloons" | "behavioral";

export interface SmokingConfig {
  cigarettesPerDay: number;
  pricePerPack: number;
}

export interface AlcoholConfig {
  drinksPerDay: number;
  pricePerDrink: number;
}

export interface DrugsConfig {
  usesPerDay?: number;
  spendPerDay?: number;
}

export interface BalloonsConfig {
  balloonsPerDay?: number;
  pricePerBalloon?: number;
}

export interface BehavioralConfig {
  sessionPerDay: number;
  minutesPerSession: number;
}

export type AddictionConfig = SmokingConfig | AlcoholConfig | DrugsConfig | BalloonsConfig | BehavioralConfig;

interface AddictionBase {
  id: string;
  name: string;
  startDate: string;
  isActive: boolean;
}

export type Addiction =
  | (AddictionBase & { type: "smoking"; config: SmokingConfig })
  | (AddictionBase & { type: "alcohol"; config: AlcoholConfig })
  | (AddictionBase & { type: "drugs"; config: DrugsConfig })
  | (AddictionBase & { type: "balloons"; config: BalloonsConfig })
  | (AddictionBase & { type: "behavioral"; config: BehavioralConfig });

const STORAGE_KEY = "rive_addictions";

const hasStorage = (): boolean => typeof window !== "undefined" && !!window.localStorage;

const _load = (): Addiction[] => {
  if (!hasStorage()) return [];

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as Addiction[];
  } catch {
    return [];
  }
};

const _save = (items: Addiction[]): void => {
  if (!hasStorage()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const createId = (): string => {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `add_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
};

export const getAllAddictions = (): Addiction[] => _load();

export const getAddictionById = (id: string): Addiction | undefined => {
  const items = _load();
  return items.find((item) => item.id === id);
};

export const addAddiction = (addiction: Omit<Addiction, "id">): Addiction => {
  const items = _load();
  const created: Addiction = {
    ...addiction,
    id: createId(),
  };

  items.push(created);
  _save(items);
  return created;
};

export const updateAddiction = (id: string, updates: Partial<Addiction>): Addiction | undefined => {
  const items = _load();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  const current = items[index];
  const { id: _ignoredId, ...safeUpdates } = updates;

  const updated: Addiction = {
    ...current,
    ...safeUpdates,
    id: current.id,
  } as Addiction;

  items[index] = updated;
  _save(items);
  return updated;
};

export const deleteAddiction = (id: string): boolean => {
  const items = _load();
  const next = items.filter((item) => item.id !== id);
  if (next.length === items.length) return false;

  _save(next);
  return true;
};

export const resetAddiction = (id: string): Addiction | undefined => {
  const items = _load();
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return undefined;

  const updated: Addiction = {
    ...items[index],
    startDate: new Date().toISOString(),
  };

  items[index] = updated;
  _save(items);
  return updated;
};
