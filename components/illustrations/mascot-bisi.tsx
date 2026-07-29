import { cn } from "@/lib/utils/cn";
import type { CheckInState } from "@/types";

interface MascotBisiProps {
  className?: string;
  mood?: "happy" | "sleepy" | "excited" | CheckInState | null;
}

export function MascotBisi({ className, mood = "happy" }: MascotBisiProps) {
  const isFire = mood === "siap_gas" || mood === "excited";
  const isRelaxed = mood === "santai_dulu";
  const isWaves = mood === "agak_penuh";
  const isSleepy = mood === "sedang_off" || mood === "sleepy";

  return (
    <div className={cn("relative flex items-center justify-center p-2", className)}>
      <svg
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="h-16 w-16 transition-transform duration-300 hover:scale-110 drop-shadow-md"
        aria-hidden="true"
      >
        {/* Soft Background Glow Aura */}
        <circle
          cx="40"
          cy="42"
          r="26"
          className={cn(
            isFire && "fill-coral/20",
            isRelaxed && "fill-moss/20",
            isWaves && "fill-cobalt/20",
            isSleepy && "fill-plum/20",
            !isFire && !isRelaxed && !isWaves && !isSleepy && "fill-butter/30"
          )}
        />

        {/* Cute Mascot Body (Chubby Bean Shape) */}
        <path
          d="M40 18c-15 0-24 10-24 24 0 13 9 22 24 22s24-9 24-22c0-14-9-24-24-24z"
          fill="#FFF9F5"
          stroke="#211D1E"
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        {/* Blushing Cheeks (Pink Dots) */}
        <ellipse cx="26" cy="46" rx="4" ry="2.5" fill="#F16F5C" opacity="0.4" />
        <ellipse cx="54" cy="46" rx="4" ry="2.5" fill="#F16F5C" opacity="0.4" />

        {/* Dynamic Cute Accessories & Expressions */}
        {/* 1. SIAP GAS (Flame Hat & Sparkling Eyes) */}
        {isFire && (
          <>
            {/* Flame Top */}
            <path
              d="M40 4c4 5 10 7 10 14 0 7-6 10-10 10s-10-3-10-10c0-7 6-9 10-14z"
              fill="#F16F5C"
              stroke="#211D1E"
              strokeWidth="2.5"
              className="animate-pulse"
            />
            {/* Big Shiny Eyes */}
            <circle cx="30" cy="40" r="3.5" fill="#211D1E" />
            <circle cx="50" cy="40" r="3.5" fill="#211D1E" />
            <circle cx="31.5" cy="38.5" r="1.5" fill="#FFFFFF" />
            <circle cx="51.5" cy="38.5" r="1.5" fill="#FFFFFF" />
            {/* Cute Happy Mouth */}
            <path
              d="M32 46c3 4 13 4 16 0"
              stroke="#211D1E"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {/* 2. SANTAI DULU (Cool Glasses & Leaf Sprout) */}
        {isRelaxed && (
          <>
            {/* Leaf Sprout */}
            <path
              d="M40 18v-8m0 0c-4 0-8-4-8-7m8 7c4 0 8-4 8-7"
              stroke="#5A7A5A"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Cool Sunglasses */}
            <rect x="22" y="35" width="14" height="9" rx="3" fill="#211D1E" />
            <rect x="44" y="35" width="14" height="9" rx="3" fill="#211D1E" />
            <line x1="36" y1="39" x2="44" y2="39" stroke="#211D1E" strokeWidth="3" />
            {/* Cool Smile */}
            <path
              d="M34 49c2 2 8 2 12-1"
              stroke="#211D1E"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}

        {/* 3. AGAK PENUH (Water Crown & Focused Eyes) */}
        {isWaves && (
          <>
            {/* Water Crown */}
            <path
              d="M30 12c0-3 10-8 10-8s10 5 10 8a10 10 0 0 1-20 0z"
              fill="#5B84B1"
              stroke="#211D1E"
              strokeWidth="2.5"
            />
            {/* Concentrated Eyes */}
            <circle cx="30" cy="40" r="3" fill="#211D1E" />
            <circle cx="50" cy="40" r="3" fill="#211D1E" />
            {/* Small Concentrated Mouth */}
            <ellipse cx="40" cy="48" rx="3" ry="2" fill="#211D1E" />
          </>
        )}

        {/* 4. SEDANG OFF (Night Sleeping Cap & Closed Eyes Zzz) */}
        {isSleepy && (
          <>
            {/* Night Cap */}
            <path
              d="M26 22c8-8 20-8 26-2 3 3 5 10 2 13L26 22z"
              fill="#83627C"
              stroke="#211D1E"
              strokeWidth="2.5"
            />
            <circle cx="54" cy="33" r="3.5" fill="#F3C363" stroke="#211D1E" strokeWidth="2" />
            {/* Sleeping Eyes (curved lines) */}
            <path d="M26 40c2 2 5 2 7 0" stroke="#211D1E" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M47 40c2 2 5 2 7 0" stroke="#211D1E" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Sleeping Mouth */}
            <line x1="37" y1="48" x2="43" y2="48" stroke="#211D1E" strokeWidth="3" strokeLinecap="round" />
            {/* Zzz Text */}
            <text x="60" y="24" fill="#83627C" fontSize="12" fontWeight="bold">Z</text>
            <text x="68" y="16" fill="#83627C" fontSize="9" fontWeight="bold">z</text>
          </>
        )}

        {/* DEFAULT / HAPPY */}
        {!isFire && !isRelaxed && !isWaves && !isSleepy && (
          <>
            {/* Sprout */}
            <path
              d="M40 18v-8m0 0c-4 0-8-4-8-7m8 7c4 0 8-4 8-7"
              stroke="#F16F5C"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            {/* Happy Eyes */}
            <circle cx="30" cy="40" r="3" fill="#211D1E" />
            <circle cx="50" cy="40" r="3" fill="#211D1E" />
            {/* Smile */}
            <path
              d="M32 46c3 3 13 3 16 0"
              stroke="#211D1E"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </>
        )}
      </svg>
    </div>
  );
}
