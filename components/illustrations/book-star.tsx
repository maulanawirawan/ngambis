import { cn } from "@/lib/utils/cn";

interface BookStarProps {
  className?: string;
}

export function BookStar({ className }: BookStarProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* Book */}
      <rect
        x="12"
        y="16"
        width="28"
        height="36"
        rx="3"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      <line
        x1="20"
        y1="26"
        x2="34"
        y2="26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="32"
        x2="30"
        y2="32"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Star */}
      <path
        d="M46 12l1.5 3.5L51 17l-3.5 1.5L46 22l-1.5-3.5L41 17l3.5-1.5L46 12z"
        fill="currentColor"
      />
      <path
        d="M52 20l1 2.5 2.5 1-2.5 1-1 2.5-1-2.5-2.5-1 2.5-1 1-2.5z"
        fill="currentColor"
        opacity="0.6"
      />
    </svg>
  );
}
