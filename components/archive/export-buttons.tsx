"use client";

import { useState } from "react";
import type { StudyReport, FocusSession, PlanningCard } from "@/types";

interface ExportButtonsProps {
  reports: StudyReport[];
  focusSessions: FocusSession[];
  completedCards: PlanningCard[];
}

export function ExportButtons({
  reports,
  focusSessions,
  completedCards,
}: ExportButtonsProps) {
  const [isOpen, setIsOpen] = useState(false);

  function exportReportsCSV() {
    const headers = ["Tanggal", "Topik", "Progres", "Pembelajaran", "Blocker", "Langkah Selanjutnya", "Durasi (menit)"];
    const rows = reports.map((r) => [
      r.report_date,
      `"${r.topic.replace(/"/g, '""')}"`,
      `"${r.progress.replace(/"/g, '""')}"`,
      r.learning ? `"${r.learning.replace(/"/g, '""')}"` : "",
      r.blocker ? `"${r.blocker.replace(/"/g, '""')}"` : "",
      r.next_step ? `"${r.next_step.replace(/"/g, '""')}"` : "",
      r.duration_minutes || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    downloadFile(csv, "ngambis-reports.csv", "text/csv");
  }

  function exportAllJSON() {
    const data = {
      exported_at: new Date().toISOString(),
      reports,
      focus_sessions: focusSessions,
      completed_cards: completedCards,
    };
    downloadFile(JSON.stringify(data, null, 2), "ngambis-export.json", "application/json");
  }

  function downloadFile(content: string, filename: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus-ring rounded-pill border border-clay px-4 py-2 text-sm text-ink transition-colors hover:bg-clay/20"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        Export
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-card border border-clay/30 bg-paper py-2 shadow-lg">
            <button
              onClick={exportReportsCSV}
              className="w-full px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-clay/10"
            >
              Reports (CSV)
            </button>
            <button
              onClick={exportAllJSON}
              className="w-full px-4 py-2 text-left text-sm text-ink transition-colors hover:bg-clay/10"
            >
              Semua data (JSON)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
