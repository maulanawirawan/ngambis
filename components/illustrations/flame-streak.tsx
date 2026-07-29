import { cn } from "@/lib/utils/cn";

interface FlameStreakProps {
  className?: string;
}

export function FlameStreak({ className }: FlameStreakProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* Tilted flame */}
      <path
        d="M32 8c-4 8-12 12-12 24 0 8 6 14 12 14s12-6 12-14c0-12-8-16-12-24z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(15 32 32)"
      />
      {/* Inner flame */}
      <path
        d="M32 20c-2 4-6 6-6 12 0 4 3 7 6 7s6-3 6-7c0-6-4-8-6-12z"
        fill="currentColor"
        opacity="0.4"
        transform="rotate(15 32 32)"
      />
      {/* Streak lines */}
      <line x1="12" y1="20" x2="20" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="34" x2="18" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="14" y1="48" x2="22" y2="44" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
