"use client";

import { useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

interface DateWheelProps {
  selectedDate: Date;
  onSelect: (date: Date) => void;
  weekStart: Date;
}

export function DateWheel({ selectedDate, onSelect, weekStart }: DateWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  // Generate 7 days from week start
  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(weekStart);
    date.setDate(weekStart.getDate() + i);
    return date;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    // Scroll selected date into view
    selectedRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  }, [selectedDate]);

  return (
    <div
      ref={containerRef}
      className="flex gap-2 overflow-x-auto pb-2 scrollbar-custom"
      role="listbox"
      aria-label="Pilih tanggal"
    >
      {days.map((date) => {
        const isSelected =
          date.toDateString() === selectedDate.toDateString();
        const isToday = date.toDateString() === today.toDateString();
        const isPast = date < today;

        return (
          <button
            key={date.toISOString()}
            ref={isSelected ? selectedRef : null}
            onClick={() => onSelect(date)}
            role="option"
            aria-selected={isSelected}
            className={cn(
              "focus-ring flex min-w-[72px] flex-col items-center rounded-card p-3 transition-all",
              isSelected
                ? "bg-ink text-paper"
                : isToday
                  ? "bg-coral/20 text-ink"
                  : isPast
                    ? "bg-clay/20 text-ink/50"
                    : "bg-paper text-ink hover:bg-clay/30"
            )}
          >
            <span className="text-xs uppercase">
              {date.toLocaleDateString("id-ID", { weekday: "short" })}
            </span>
            <span
              className={cn(
                "mt-1 font-mono text-xl font-bold",
                isToday && !isSelected && "text-coral"
              )}
            >
              {date.getDate()}
            </span>
            <span className="text-xs">
              {date.toLocaleDateString("id-ID", { month: "short" })}
            </span>
          </button>
        );
      })}
    </div>
  );
}
