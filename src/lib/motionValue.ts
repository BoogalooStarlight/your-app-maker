import { useRef } from "react";

type MotionValue = {
  get: () => number;
  set: (next: number) => void;
};

type AnimateOptions = {
  duration?: number;
  ease?: [number, number, number, number] | string;
  onUpdate?: (latest: number) => void;
};

type AnimationControls = {
  stop: () => void;
};

export const useMotionValue = (initialValue: number): MotionValue => {
  const valueRef = useRef(initialValue);

  return {
    get: () => valueRef.current,
    set: (next: number) => {
      valueRef.current = next;
    },
  };
};

export const animate = (motionValue: MotionValue, to: number, options: AnimateOptions = {}): AnimationControls => {
  const from = motionValue.get();
  const durationMs = Math.max((options.duration ?? 1) * 1000, 1);
  const start = performance.now();
  let frame = 0;

  const cubicOut = (t: number) => 1 - Math.pow(1 - t, 3);

  const step = (now: number) => {
    const t = Math.min((now - start) / durationMs, 1);
    const easedT = typeof options.ease === "string" && options.ease === "linear" ? t : cubicOut(t);
    const latest = from + (to - from) * easedT;

    motionValue.set(latest);
    options.onUpdate?.(latest);

    if (t < 1) {
      frame = requestAnimationFrame(step);
    }
  };

  frame = requestAnimationFrame(step);

  return {
    stop: () => {
      cancelAnimationFrame(frame);
    },
  };
};
