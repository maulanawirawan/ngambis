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

  // Get days in current month, previous month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInPrevMonth = new Date(year, month, 0).getDate();

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

  const monthNamesID = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun", 
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];
  const fullMonthNamesID = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // Generate complete calendar grid cells (42 cells = 6 rows x 7 days)
  const cells: Array<{
    day: number;
    monthLabel: string | null;
    fullDateLabel: string;
    dateStr: string;
    count: number;
    isCurrentMonth: boolean;
  }> = [];

  const prevMonthIdx = (month - 1 + 12) % 12;
  const prevYear = month === 0 ? year - 1 : year;

  // Previous month trailing days
  for (let i = firstDayOfWeek - 1; i >= 0; i--) {
    const prevDay = daysInPrevMonth - i;
    const prevDate = new Date(prevYear, prevMonthIdx, prevDay);
    const dateStr = prevDate.toISOString().split("T")[0];
    cells.push({
      day: prevDay,
      monthLabel: monthNamesID[prevMonthIdx],
      fullDateLabel: `${prevDay} ${fullMonthNamesID[prevMonthIdx]} ${prevYear}`,
      dateStr,
      count: activityMap.get(dateStr) || 0,
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = new Date(year, month, day).toISOString().split("T")[0];
    cells.push({
      day,
      monthLabel: null,
      fullDateLabel: `${day} ${fullMonthNamesID[month]} ${year}`,
      dateStr,
      count: activityMap.get(dateStr) || 0,
      isCurrentMonth: true,
    });
  }

  // Next month leading days
  const remainingCells = (7 - (cells.length % 7)) % 7;
  const nextMonthIdx = (month + 1) % 12;
  const nextYear = month === 11 ? year + 1 : year;

  for (let day = 1; day <= remainingCells; day++) {
    const nextDate = new Date(nextYear, nextMonthIdx, day);
    const dateStr = nextDate.toISOString().split("T")[0];
    cells.push({
      day,
      monthLabel: monthNamesID[nextMonthIdx],
      fullDateLabel: `${day} ${fullMonthNamesID[nextMonthIdx]} ${nextYear}`,
      dateStr,
      count: activityMap.get(dateStr) || 0,
      isCurrentMonth: false,
    });
  }

  const monthName = now.toLocaleDateString("id-ID", { month: "long", year: "numeric" });

  return (
    <div className="rounded-2xl border border-clay/30 bg-paper p-6 shadow-sm">
      <h3 className="mb-4 font-display text-xl font-bold text-ink">
        Aktivitas {monthName}
      </h3>

      <div className="grid grid-cols-7 gap-1.5">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((day) => (
          <div key={day} className="p-1 text-center font-display text-xs font-semibold text-ink/50">
            {day}
          </div>
        ))}

        {cells.map((cell, i) => (
          <div
            key={`${cell.dateStr}-${i}`}
            className={cn(
              "aspect-square flex flex-col items-center justify-center rounded-xl p-1 text-center font-mono text-xs transition-all shadow-xs",
              !cell.isCurrentMonth
                ? "bg-clay/10 text-ink/40 border border-dashed border-clay/30 hover:bg-clay/20"
                : cell.count > 0
                  ? cell.count > 2
                    ? "bg-coral text-paper font-bold shadow-sm"
                    : cell.count > 1
                      ? "bg-coral/70 text-paper font-bold"
                      : "bg-coral/30 text-ink font-semibold"
                  : "bg-clay/20 text-ink/80 hover:bg-clay/30 font-medium"
            )}
            title={`${cell.fullDateLabel}: ${cell.count} aktivitas`}
          >
            <span className="font-semibold text-xs leading-none">{cell.day}</span>
            {cell.monthLabel && (
              <span className="mt-0.5 text-[9px] font-extrabold uppercase tracking-tight opacity-75 leading-none">
                {cell.monthLabel}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 text-xs font-medium text-ink/60">
        <span>Sedikit</span>
        <div className="flex gap-1.5">
          <div className="h-3.5 w-3.5 rounded-md bg-clay/20" />
          <div className="h-3.5 w-3.5 rounded-md bg-coral/30" />
          <div className="h-3.5 w-3.5 rounded-md bg-coral/70" />
          <div className="h-3.5 w-3.5 rounded-md bg-coral" />
        </div>
        <span>Banyak</span>
      </div>
    </div>
  );
}
