import { motion, useReducedMotion } from "framer-motion";
import { useId } from "react";

export type TrophyShape = "circle" | "heptagon" | "diamond" | "pentagon" | "hexagon" | "star8";

interface TrophyUnlockProps {
  shape: TrophyShape;
  numeral: string;
  title: string;
  subtitle: string;
  emoji?: string;
  onClose: () => void;
}

interface ShapeElementProps {
  shape: TrophyShape;
  id?: string;
  className?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
}

const pointsByShape: Record<Exclude<TrophyShape, "circle">, string> = {
  heptagon: "100,12 169,45 186,120 138,180 62,180 14,120 31,45",
  diamond: "100,10 190,100 100,190 10,100",
  pentagon: "100,12 184,73 152,176 48,176 16,73",
  hexagon: "100,12 176,56 176,144 100,188 24,144 24,56",
  star8: "100,12 120,64 174,26 136,80 188,100 136,120 174,174 120,136 100,188 80,136 26,174 64,120 12,100 64,80 26,26 80,64",
};

const ShapeElement = ({ shape, id, className, fill, stroke, strokeWidth }: ShapeElementProps) => {
  const sharedProps = {
    id,
    className,
    fill,
    stroke,
    strokeWidth,
    strokeLinejoin: "round" as const,
  };

  if (shape === "circle") {
    return <circle {...sharedProps} cx="100" cy="100" r="82" />;
  }

  return <polygon {...sharedProps} points={pointsByShape[shape]} />;
};

export const TrophyUnlock = ({ shape, numeral, title, subtitle, emoji, onClose }: TrophyUnlockProps) => {
  const reduceMotion = useReducedMotion();
  const generatedId = useId().replace(/:/g, "");
  const gradientId = `trophy-gradient-${generatedId}`;
  const clipId = `trophy-clip-${generatedId}`;
  const glowId = `trophy-glow-${generatedId}`;
  const titleId = `trophy-title-${generatedId}`;

  const overlayAnimation = reduceMotion
    ? { opacity: 1 }
    : {
        opacity: 1,
        x: [0, 0, -1.5, 1.5, -1, 1, 0],
        transition: { opacity: { duration: 0.24 }, x: { delay: 1.02, duration: 0.12, ease: "easeOut" } },
      };

  const medalAnimation = reduceMotion
    ? { opacity: 1, scale: 1, filter: "blur(0px)" }
    : {
        opacity: 1,
        scale: [0.2, 1.12, 1],
        filter: ["blur(10px)", "blur(1px)", "blur(0px)"],
        transition: {
          duration: 1.05,
          times: [0, 0.76, 1],
          ease: [0.18, 0.72, 0.2, 1],
        },
      };

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      className="fixed inset-0 z-50 flex min-h-screen items-center justify-center overflow-hidden bg-[rgba(18,14,32,0.85)] px-5 py-8 text-white backdrop-blur-sm"
      initial={{ opacity: 0, x: 0 }}
      animate={overlayAnimation}
      exit={{ opacity: 0 }}
    >
      <motion.div
        aria-hidden="true"
        className="absolute h-[22rem] w-[22rem] rounded-full bg-[#7B61FF]/35 blur-3xl sm:h-[34rem] sm:w-[34rem]"
        initial={{ opacity: 0.2, scale: 0.72 }}
        animate={
          reduceMotion
            ? { opacity: 0.34, scale: 1 }
            : {
                opacity: [0.2, 0.78, 0.34],
                scale: [0.72, 1.25, 1],
                transition: { delay: 0.95, duration: 0.55, ease: "easeOut" },
              }
        }
      />

      <div className="relative flex w-full max-w-lg flex-col items-center text-center">
        <motion.div
          className="relative h-56 w-56 drop-shadow-[0_32px_70px_rgba(123,97,255,0.45)] sm:h-64 sm:w-64"
          initial={{ opacity: 0, scale: reduceMotion ? 0.96 : 0.2, filter: reduceMotion ? "blur(0px)" : "blur(10px)" }}
          animate={medalAnimation}
        >
          <svg className="h-full w-full overflow-visible" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <linearGradient id={gradientId} x1="38" y1="20" x2="164" y2="178" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#B9A6FF" />
                <stop offset="0.52" stopColor="#7B61FF" />
                <stop offset="1" stopColor="#5B43D6" />
              </linearGradient>
              <filter id={glowId} x="-35%" y="-35%" width="170%" height="170%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feColorMatrix
                  in="blur"
                  type="matrix"
                  values="0.62 0 0 0 0.48 0 0.53 0 0 0.38 0 0 1 0 1 0 0 0 0.75 0"
                  result="violetGlow"
                />
                <feMerge>
                  <feMergeNode in="violetGlow" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <clipPath id={clipId}>
                <ShapeElement shape={shape} />
              </clipPath>
            </defs>

            <ShapeElement shape={shape} fill={`url(#${gradientId})`} stroke="#C9BBFF" strokeWidth={4} />
            <ShapeElement shape={shape} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={1.2} />

            {emoji && (
              <text
                x="100"
                y="113"
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="86"
                opacity="0.12"
                filter={`url(#${glowId})`}
              >
                {emoji}
              </text>
            )}

            <motion.text
              x="100"
              y="109"
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize="46"
              fontWeight="800"
              letterSpacing="0.07em"
              filter={`url(#${glowId})`}
              initial={{ opacity: 0.82 }}
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : {
                      opacity: [0.82, 1, 1],
                      textShadow: [
                        "0 0 0 rgba(201,187,255,0)",
                        "0 0 22px rgba(201,187,255,0.95)",
                        "0 0 10px rgba(157,135,255,0.55)",
                      ],
                      transition: { delay: 1.13, duration: 0.82, ease: "easeOut" },
                    }
              }
            >
              {numeral}
            </motion.text>

            <g clipPath={`url(#${clipId})`}>
              <motion.rect
                x="-70"
                y="-20"
                width="34"
                height="245"
                fill="rgba(255,255,255,0.72)"
                transform="rotate(18 100 100)"
                initial={{ x: -90, opacity: 0 }}
                animate={
                  reduceMotion
                    ? { opacity: 0 }
                    : {
                        x: 300,
                        opacity: [0, 0.58, 0],
                        transition: { delay: 1.32, duration: 0.62, ease: "easeInOut" },
                      }
                }
              />
            </g>
          </svg>
        </motion.div>

        <motion.div
          className="mt-8 space-y-3"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0.12 : 1.52, duration: 0.52, ease: "easeOut" }}
        >
          <h2 id={titleId} className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            {title}
          </h2>
          <motion.p
            className="text-sm font-medium tracking-[0.22em] text-[#C9BBFF] sm:text-base"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ delay: reduceMotion ? 0.18 : 1.64, duration: 0.5, ease: "easeOut" }}
          >
            {subtitle}
          </motion.p>
        </motion.div>

        <motion.button
          type="button"
          onClick={onClose}
          className="mt-10 rounded-full border border-[#C9BBFF]/70 bg-white/10 px-7 py-3 text-sm font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(123,97,255,0.28)] backdrop-blur transition hover:bg-white/18 focus:outline-none focus:ring-2 focus:ring-[#C9BBFF] focus:ring-offset-2 focus:ring-offset-[#120E20]"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 10 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0.24 : 1.92, duration: 0.42, ease: "easeOut" }}
        >
          Continuer
        </motion.button>
      </div>
    </motion.div>
  );
};

export default TrophyUnlock;
