import { cn } from "@/lib/utils/cn";

interface MoonFocusProps {
  className?: string;
}

export function MoonFocus({ className }: MoonFocusProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* Moon */}
      <circle
        cx="32"
        cy="32"
        r="18"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Craters */}
      <circle cx="26" cy="28" r="3" fill="currentColor" opacity="0.3" />
      <circle cx="38" cy="36" r="2" fill="currentColor" opacity="0.3" />
      <circle cx="30" cy="40" r="1.5" fill="currentColor" opacity="0.3" />
      {/* Focus ring */}
      <circle
        cx="32"
        cy="32"
        r="24"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        fill="none"
        opacity="0.5"
      />
      {/* Small star */}
      <path
        d="M50 18l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z"
        fill="currentColor"
      />
    </svg>
  );
}
