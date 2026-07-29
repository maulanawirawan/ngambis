import { cn } from "@/lib/utils/cn";

interface MascotBisiProps {
  className?: string;
  mood?: "happy" | "sleepy" | "excited";
}

export function MascotBisi({ className, mood = "happy" }: MascotBisiProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-12 w-12", className)}
      aria-hidden="true"
    >
      {/* Body - small seed/dot shape */}
      <ellipse
        cx="32"
        cy="36"
        rx="16"
        ry="14"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Eyes */}
      {mood === "happy" && (
        <>
          <circle cx="26" cy="32" r="2" fill="currentColor" />
          <circle cx="38" cy="32" r="2" fill="currentColor" />
        </>
      )}
      {mood === "sleepy" && (
        <>
          <line x1="24" y1="32" x2="28" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <line x1="36" y1="32" x2="40" y2="32" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      {mood === "excited" && (
        <>
          <circle cx="26" cy="32" r="2.5" fill="currentColor" />
          <circle cx="38" cy="32" r="2.5" fill="currentColor" />
          <circle cx="26" cy="32" r="1" fill="white" />
          <circle cx="38" cy="32" r="1" fill="white" />
        </>
      )}
      {/* Mouth */}
      {mood === "happy" && (
        <path
          d="M26 40c2 2 4 3 6 3s4-1 6-3"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mood === "sleepy" && (
        <line x1="28" y1="42" x2="36" y2="42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      )}
      {mood === "excited" && (
        <path
          d="M26 38c2 3 4 5 6 5s4-2 6-5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {/* Sprout on top */}
      <path
        d="M32 22v-6m0 0c-2 0-4-2-4-4m4 4c2 0 4-2 4-4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
