import { cn } from "@/lib/utils/cn";
import type { CheckInState } from "@/types";

interface MascotBisiProps {
  className?: string;
  mood?: "happy" | "sleepy" | "excited" | CheckInState;
}

export function MascotBisi({ className, mood = "happy" }: MascotBisiProps) {
  const isFire = mood === "siap_gas" || mood === "excited";
  const isRelaxed = mood === "santai_dulu";
  const isWaves = mood === "agak_penuh";
  const isSleepy = mood === "sedang_off" || mood === "sleepy";

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-14 w-14 transition-transform duration-300 hover:scale-110"
        aria-hidden="true"
      >
        {/* Fire Aura Effect */}
        {isFire && (
          <path
            d="M32 6c4 6 10 8 10 16 0 9-7 14-10 14s-10-5-10-14c0-8 6-10 10-16z"
            fill="#F16F5C"
            opacity="0.25"
            className="animate-pulse"
          />
        )}

        {/* Waves Aura Effect */}
        {isWaves && (
          <path
            d="M16 48c4-2 8-2 12 0s8 2 12 0 8-2 12 0"
            stroke="#5B84B1"
            strokeWidth="3"
            strokeLinecap="round"
            opacity="0.5"
          />
        )}

        {/* Mascot Body */}
        <ellipse
          cx="32"
          cy="36"
          rx="16"
          ry="14"
          stroke="currentColor"
          strokeWidth="2.5"
          className={cn(
            isFire && "text-coral",
            isRelaxed && "text-moss",
            isWaves && "text-cobalt",
            isSleepy && "text-ink/60"
          )}
          fill="none"
        />

        {/* Eyes */}
        {isFire && (
          <>
            <circle cx="26" cy="32" r="2.5" fill="#F16F5C" />
            <circle cx="38" cy="32" r="2.5" fill="#F16F5C" />
            <circle cx="27" cy="31" r="1" fill="white" />
            <circle cx="39" cy="31" r="1" fill="white" />
          </>
        )}

        {isRelaxed && (
          <>
            <path d="M23 32c1.5-2 4.5-2 6 0" stroke="#5A7A5A" strokeWidth="2" strokeLinecap="round" fill="none" />
            <path d="M35 32c1.5-2 4.5-2 6 0" stroke="#5A7A5A" strokeWidth="2" strokeLinecap="round" fill="none" />
          </>
        )}

        {isWaves && (
          <>
            <circle cx="26" cy="32" r="2" fill="#5B84B1" />
            <circle cx="38" cy="32" r="2" fill="#5B84B1" />
          </>
        )}

        {isSleepy && (
          <>
            <line x1="23" y1="32" x2="29" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            <line x1="35" y1="32" x2="41" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {!isFire && !isRelaxed && !isWaves && !isSleepy && (
          <>
            <circle cx="26" cy="32" r="2" fill="currentColor" />
            <circle cx="38" cy="32" r="2" fill="currentColor" />
          </>
        )}

        {/* Mouth */}
        {isFire && (
          <path
            d="M25 38c2 4 5 5 7 5s5-1 7-5"
            stroke="#F16F5C"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {isRelaxed && (
          <path
            d="M26 39c2 2 4 2 6 2s4 0 6-2"
            stroke="#5A7A5A"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {isWaves && (
          <line x1="28" y1="40" x2="36" y2="40" stroke="#5B84B1" strokeWidth="2" strokeLinecap="round" />
        )}

        {isSleepy && (
          <path d="M28 40c2 1 4 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
        )}

        {!isFire && !isRelaxed && !isWaves && !isSleepy && (
          <path
            d="M26 40c2 2 4 3 6 3s4-1 6-3"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {/* Crown Elements */}
        {isFire && (
          <path
            d="M32 20c-3-4-2-8 0-11 2 3 5 4 2 8"
            fill="#F16F5C"
            className="animate-bounce"
          />
        )}

        {isRelaxed && (
          <path
            d="M32 22v-6m0 0c-3 0-5-3-5-5m5 5c3 0 5-3 5-5"
            stroke="#5A7A5A"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {isWaves && (
          <path
            d="M26 16c2-2 4 0 6-2s4 0 6 2"
            stroke="#5B84B1"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        )}

        {isSleepy && (
          <path
            d="M36 12c2-1 3-3 2-5-2 1-3 3-2 5z"
            fill="#F3C363"
          />
        )}
      </svg>
    </div>
  );
}
