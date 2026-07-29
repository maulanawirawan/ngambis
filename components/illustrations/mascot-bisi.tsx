import { cn } from "@/lib/utils/cn";
import type { CheckInState } from "@/types";
import { Flame, Coffee, Waves, Moon, Smile } from "lucide-react";

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
    <div
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-clay/40 bg-paper px-4 py-3 shadow-md transition-all duration-300 hover:scale-105 shrink-0",
        isFire && "border-coral/40 bg-coral/10 text-coral shadow-coral/10",
        isRelaxed && "border-moss/40 bg-moss/10 text-moss shadow-moss/10",
        isWaves && "border-cobalt/40 bg-cobalt/10 text-cobalt shadow-cobalt/10",
        isSleepy && "border-plum/40 bg-plum/10 text-plum shadow-plum/10",
        className
      )}
    >
      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl font-bold shadow-inner transition-colors",
          isFire && "bg-coral text-paper",
          isRelaxed && "bg-moss text-paper",
          isWaves && "bg-cobalt text-paper",
          isSleepy && "bg-plum text-paper",
          !isFire && !isRelaxed && !isWaves && !isSleepy && "bg-ink text-paper"
        )}
      >
        {isFire && <Flame className="h-7 w-7 animate-bounce shrink-0" />}
        {isRelaxed && <Coffee className="h-7 w-7 shrink-0" />}
        {isWaves && <Waves className="h-7 w-7 shrink-0" />}
        {isSleepy && <Moon className="h-7 w-7 shrink-0" />}
        {!isFire && !isRelaxed && !isWaves && !isSleepy && <Smile className="h-7 w-7 shrink-0" />}
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-bold tracking-wider uppercase opacity-60">
          Status Mode
        </span>
        <span className="font-display text-sm font-extrabold tracking-tight">
          {isFire && "🔥 SIAP GAS!"}
          {isRelaxed && "🌿 SANTAI DULU"}
          {isWaves && "🌊 AGAK PENUH"}
          {isSleepy && "🌙 SEDANG OFF"}
          {!isFire && !isRelaxed && !isWaves && !isSleepy && "✨ MODE ANGBIS"}
        </span>
      </div>
    </div>
  );
}
