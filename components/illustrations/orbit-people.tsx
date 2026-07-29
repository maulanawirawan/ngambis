import { cn } from "@/lib/utils/cn";

interface OrbitPeopleProps {
  className?: string;
}

export function OrbitPeople({ className }: OrbitPeopleProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* Center person */}
      <circle cx="32" cy="28" r="6" stroke="currentColor" strokeWidth="2.5" fill="none" />
      <path
        d="M22 44c0-6 4-10 10-10s10 4 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      {/* Orbiting person 1 */}
      <circle cx="14" cy="20" r="4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
      <circle cx="50" cy="20" r="4" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Orbit rings */}
      <ellipse
        cx="32"
        cy="32"
        rx="22"
        ry="14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="3 3"
        fill="none"
        opacity="0.4"
      />
      {/* Small dots */}
      <circle cx="14" cy="44" r="2" fill="currentColor" opacity="0.4" />
      <circle cx="50" cy="44" r="2" fill="currentColor" opacity="0.4" />
    </svg>
  );
}
