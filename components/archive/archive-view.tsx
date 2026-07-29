"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils/cn";
import { CalendarHeatmap } from "@/components/archive/calendar-heatmap";
import { ExportButtons } from "@/components/archive/export-buttons";
import type { StudyReport, PlanningCard, FocusSession, Commitment } from "@/types";
import type { User } from "@supabase/supabase-js";

interface ExtendedPlanningCard extends PlanningCard {
  stage?: { name: string } | null;
}

// Dynamic import for chart
const InsightsChart = dynamic<{ reports: StudyReport[]; focusSessions: FocusSession[]; completedCards: PlanningCard[] }>(
  () => import("@/components/charts/insights-chart").then((m) => m.InsightsChart),
  { ssr: false, loading: () => <div className="h-64 animate-pulse rounded-card bg-clay/20" /> }
);

interface ArchiveViewProps {
  user: User;
  reports: StudyReport[];
  completedCards: ExtendedPlanningCard[];
  focusSessions: FocusSession[];
  commitments: Commitment[];
  currentMonth: Date;
}

type Tab = "reports" | "cards" | "focus" | "commitments" | "insights";

export function ArchiveView({
  user,
  reports,
  completedCards,
  focusSessions,
  commitments,
  currentMonth,
}: ArchiveViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("reports");
  const [searchQuery, setSearchQuery] = useState("");

  // Calculate stats
  const stats = useMemo(() => {
    const totalFocusMinutes = focusSessions.reduce(
      (acc, s) => acc + Math.floor(s.duration_seconds / 60),
      0
    );
    const completedCommitments = commitments.filter((c) => c.completed_at).length;

    return {
      totalReports: reports.length,
      totalCardsCompleted: completedCards.length,
      totalFocusMinutes,
      completedCommitments,
      totalCommitments: commitments.length,
    };
  }, [reports, completedCards, focusSessions, commitments]);

  // Filter reports by search
  const filteredReports = useMemo(() => {
    if (!searchQuery) return reports;
    const query = searchQuery.toLowerCase();
    return reports.filter(
      (r) =>
        r.topic.toLowerCase().includes(query) ||
        r.progress.toLowerCase().includes(query)
    );
  }, [reports, searchQuery]);

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: "reports", label: "Report", count: reports.length },
    { id: "cards", label: "Cards", count: completedCards.length },
    { id: "focus", label: "Fokus", count: focusSessions.length },
    { id: "commitments", label: "Komitmen", count: commitments.length },
    { id: "insights", label: "Insights" },
  ];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Archive</h1>
          <p className="text-sm text-ink/60">
            {currentMonth.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
          </p>
        </div>
        <ExportButtons
          reports={reports}
          focusSessions={focusSessions}
          completedCards={completedCards}
        />
      </div>

      {/* Stats summary */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-card bg-paper p-4">
          <p className="font-mono text-2xl font-bold text-ink">{stats.totalReports}</p>
          <p className="text-sm text-ink/60">Report</p>
        </div>
        <div className="rounded-card bg-paper p-4">
          <p className="font-mono text-2xl font-bold text-ink">{stats.totalCardsCompleted}</p>
          <p className="text-sm text-ink/60">Card selesai</p>
        </div>
        <div className="rounded-card bg-paper p-4">
          <p className="font-mono text-2xl font-bold text-ink">{stats.totalFocusMinutes}m</p>
          <p className="text-sm text-ink/60">Total fokus</p>
        </div>
        <div className="rounded-card bg-paper p-4">
          <p className="font-mono text-2xl font-bold text-ink">
            {stats.completedCommitments}/{stats.totalCommitments}
          </p>
          <p className="text-sm text-ink/60">Komitmen</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex gap-1 overflow-x-auto scrollbar-custom">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "focus-ring flex items-center gap-2 rounded-pill px-4 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-ink text-paper"
                : "bg-paper text-ink/60 hover:bg-clay/30 hover:text-ink"
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={cn(
                  "rounded-pill px-1.5 py-0.5 text-xs",
                  activeTab === tab.id ? "bg-paper/20" : "bg-clay/40"
                )}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {activeTab === "reports" && (
          <div className="space-y-3">
            {/* Search */}
            <input
              type="search"
              placeholder="Cari report..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2 text-ink placeholder:text-ink/40"
            />

            {filteredReports.length === 0 ? (
              <div className="rounded-card bg-paper p-8 text-center text-ink/60">
                {searchQuery ? "Tidak ada hasil." : "Belum ada report bulan ini."}
              </div>
            ) : (
              filteredReports.map((report) => (
                <div key={report.id} className="rounded-card bg-paper p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-ink">{report.topic}</p>
                      <p className="mt-1 text-sm text-ink/70">{report.progress}</p>
                      <p className="mt-2 text-xs text-ink/50">
                        {new Date(report.report_date).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                        {report.duration_minutes && ` · ${report.duration_minutes}m`}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-ink/40">
                      {report.reactions && report.reactions.length > 0 && (
                        <span>{report.reactions.length} reaksi</span>
                      )}
                      {report.comments && report.comments.length > 0 && (
                        <span>{report.comments.length} komentar</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "cards" && (
          <div className="space-y-3">
            {completedCards.length === 0 ? (
              <div className="rounded-card bg-paper p-8 text-center text-ink/60">
                Belum ada card yang selesai bulan ini.
              </div>
            ) : (
              completedCards.map((card) => (
                <div key={card.id} className="rounded-card bg-paper p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">{card.title}</p>
                      <p className="text-sm text-ink/50">
                        {(card as any).stage?.name} · Selesai{" "}
                        {new Date(card.completed_at!).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    <span className="rounded-pill bg-moss/20 px-2 py-1 text-xs text-moss">
                      Selesai
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "focus" && (
          <div className="space-y-3">
            {focusSessions.length === 0 ? (
              <div className="rounded-card bg-paper p-8 text-center text-ink/60">
                Belum ada sesi fokus bulan ini.
              </div>
            ) : (
              focusSessions.map((session) => (
                <div key={session.id} className="rounded-card bg-paper p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono font-medium text-ink">
                        {Math.floor(session.duration_seconds / 60)} menit
                      </p>
                      <p className="text-sm text-ink/50">
                        {new Date(session.started_at).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    {session.outcome && (
                      <span
                        className={cn(
                          "rounded-pill px-2 py-1 text-xs",
                          session.outcome === "selesai"
                            ? "bg-moss/20 text-moss"
                            : session.outcome === "lanjut_nanti"
                              ? "bg-butter/20 text-butter"
                              : "bg-coral/20 text-coral"
                        )}
                      >
                        {session.outcome === "selesai"
                          ? "Selesai"
                          : session.outcome === "lanjut_nanti"
                            ? "Lanjut nanti"
                            : "Blocker"}
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "commitments" && (
          <div className="space-y-3">
            {commitments.length === 0 ? (
              <div className="rounded-card bg-paper p-8 text-center text-ink/60">
                Belum ada komitmen bulan ini.
              </div>
            ) : (
              commitments.map((commitment) => (
                <div key={commitment.id} className="rounded-card bg-paper p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-ink">{commitment.title}</p>
                      <p className="text-sm text-ink/50">
                        Deadline:{" "}
                        {new Date(commitment.due_on).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                        })}
                      </p>
                    </div>
                    {commitment.completed_at ? (
                      <span className="rounded-pill bg-moss/20 px-2 py-1 text-xs text-moss">
                        Tercapai
                      </span>
                    ) : (
                      <span className="rounded-pill bg-clay/40 px-2 py-1 text-xs text-ink/60">
                        Berjalan
                      </span>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6">
            <CalendarHeatmap reports={reports} focusSessions={focusSessions} />
            <InsightsChart
              reports={reports}
              focusSessions={focusSessions}
              completedCards={completedCards}
            />
          </div>
        )}
      </div>
    </div>
  );
}
