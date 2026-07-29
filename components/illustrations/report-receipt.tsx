import { cn } from "@/lib/utils/cn";

interface ReportReceiptProps {
  className?: string;
}

export function ReportReceipt({ className }: ReportReceiptProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      {/* Receipt body */}
      <path
        d="M16 8h32v48l-4-3-4 3-4-3-4 3-4-3-4 3-4-3-4 3V8z"
        stroke="currentColor"
        strokeWidth="2.5"
        fill="none"
      />
      {/* Lines */}
      <line x1="22" y1="20" x2="42" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="28" x2="38" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="22" y1="36" x2="40" y2="36" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      {/* Checkmark */}
      <path
        d="M26 44l4 4 8-8"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
