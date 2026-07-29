"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils/cn";
import type { StudyReport, FocusSession } from "@/types";

interface CalendarHeatmapProps {
  reports: StudyReport[];
  focusSessions: FocusSession[];
}

export function CalendarHeatmap({ reports, focusSessions }: CalendarHeatmapProps) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  // Get days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  // Create activity map
  const activityMap = useMemo(() => {
    const map = new Map<string, number>();

    reports.forEach((report) => {
      const date = report.report_date;
      map.set(date, (map.get(date) || 0) + 1);
    });

    focusSessions.forEach((session) => {
      const date = session.started_at.split("T")[0];
      map.set(date, (map.get(date) || 0) + 1);
    });

    return map;
  }, [reports, focusSessions]);

  // Generate calendar cells
  const cells = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    cells.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day).toISOString().split("T")[0];
    cells.push({ day, date, count: activityMap.get(date) || 0 });
  }

  const monthName = now.toLocaleDateString("id-ID", { month: "long" });

  return (
    <div className="rounded-card bg-paper p-4">
      <h3 className="mb-4 font-display text-lg font-semibold text-ink">
        Aktivitas {monthName}
      </h3>

      <div className="grid grid-cols-7 gap-1">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day} className="p-1 text-center text-xs text-ink/40">
            {day}
          </div>
        ))}

        {cells.map((cell, i) => (
          <div
            key={i}
            className={cn(
              "aspect-square rounded-sm p-1 text-center text-xs",
              cell
                ? cell.count > 0
                  ? cell.count > 2
                    ? "bg-coral text-paper"
                    : cell.count > 1
                      ? "bg-coral/60 text-paper"
                      : "bg-coral/30 text-ink"
                  : "bg-clay/20 text-ink/60"
                : ""
            )}
            title={cell ? `${cell.day} ${monthName}: ${cell.count} aktivitas` : undefined}
          >
            {cell?.day}
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-end gap-2 text-xs text-ink/50">
        <span>Sedikit</span>
        <div className="flex gap-1">
          <div className="h-3 w-3 rounded-sm bg-clay/20" />
          <div className="h-3 w-3 rounded-sm bg-coral/30" />
          <div className="h-3 w-3 rounded-sm bg-coral/60" />
          <div className="h-3 w-3 rounded-sm bg-coral" />
        </div>
        <span>Banyak</span>
      </div>
    </div>
  );
}
