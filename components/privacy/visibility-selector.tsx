"use client";

import { cn } from "@/lib/utils/cn";
import type { Visibility } from "@/types";

interface VisibilitySelectorProps {
  value: Visibility;
  onChange: (value: Visibility) => void;
  disabled?: boolean;
}

const OPTIONS: { value: Visibility; label: string; description: string }[] = [
  {
    value: "private",
    label: "Private",
    description: "Cuma kamu yang bisa lihat",
  },
  {
    value: "circle",
    label: "Circle",
    description: "Dibagikan ke circle",
  },
  {
    value: "selected_members",
    label: "Terpilih",
    description: "Pilih member tertentu",
  },
];

export function VisibilitySelector({
  value,
  onChange,
  disabled,
}: VisibilitySelectorProps) {
  return (
    <div className="grid grid-cols-3 gap-2" role="radiogroup">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          disabled={disabled}
          className={cn(
            "focus-ring flex flex-col items-center rounded-input border p-3 text-center transition-all",
            value === option.value
              ? "border-ink bg-ink text-paper"
              : "border-clay bg-paper text-ink hover:border-ink/30"
          )}
        >
          <span className="text-sm font-medium">{option.label}</span>
          <span
            className={cn(
              "mt-1 text-xs",
              value === option.value ? "text-paper/70" : "text-ink/50"
            )}
          >
            {option.description}
          </span>
        </button>
      ))}
    </div>
  );
}
