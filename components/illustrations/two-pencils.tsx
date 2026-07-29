import { cn } from "@/lib/utils/cn";

interface TwoPencilsProps {
  className?: string;
}

export function TwoPencils({ className }: TwoPencilsProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* Pencil 1 */}
      <rect
        x="18"
        y="12"
        width="8"
        height="40"
        rx="1"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(-15 22 32)"
      />
      <path
        d="M18 12l4-8 4 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        transform="rotate(-15 22 32)"
      />
      {/* Pencil 2 */}
      <rect
        x="38"
        y="12"
        width="8"
        height="40"
        rx="1"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
        transform="rotate(15 42 32)"
      />
      <path
        d="M38 12l4-8 4 8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        transform="rotate(15 42 32)"
      />
      {/* Cross lines */}
      <line x1="24" y1="28" x2="40" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
      <line x1="26" y1="36" x2="38" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
