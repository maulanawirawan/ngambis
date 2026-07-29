"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { MascotBisi } from "@/components/illustrations/mascot-bisi";
import { ReportForm } from "@/components/reports/report-form";
import { QuickReport } from "@/components/today/quick-report";
import { CheckInSelector } from "@/components/today/check-in-selector";
import { NudgeList } from "@/components/today/nudge-list";
import type {
  StudyReport,
  CheckIn,
  ScheduleItem,
  Commitment,
  Nudge,
} from "@/types";
import type { User } from "@supabase/supabase-js";

interface TodayViewProps {
  user: User;
  report: StudyReport | null;
  checkIns: CheckIn[];
  nextSchedule: ScheduleItem | null;
  commitment: Commitment | null;
  totalFocusSeconds: number;
  nudges: Nudge[];
  circleIds: string[];
}

export function TodayView({
  user,
  report,
  checkIns,
  nextSchedule,
  commitment,
  totalFocusSeconds,
  nudges,
  circleIds,
}: TodayViewProps) {
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const greeting = getGreeting();
  const displayName = user.user_metadata?.display_name || "kamu";

  const focusMinutes = Math.floor(totalFocusSeconds / 60);
  const focusHours = Math.floor(focusMinutes / 60);
  const focusDisplay =
    focusHours > 0 ? `${focusHours}j ${focusMinutes % 60}m` : `${focusMinutes}m`;

  return (
    <div className="flex h-full flex-col gap-5 md:flex-row md:gap-8">
      {/* Main panel - 61.8% */}
      <div className="golden-main flex flex-col gap-5 overflow-y-auto scrollbar-custom">
        {/* Greeting */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-hero bg-paper p-8"
        >
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-display text-4xl font-bold text-ink">
                {greeting}, {displayName}.
              </h1>
              <p className="mt-2 text-ink/60">
                {report
                  ? "Progresmu hari ini sudah tercatat."
                  : "Belum ada yang ambis hari ini."}
              </p>
            </div>
            <MascotBisi mood={report ? "excited" : "happy"} className="text-coral" />
          </div>

          {/* Check-in selector */}
          <div className="mt-8">
            <CheckInSelector circleIds={circleIds} />
          </div>
        </motion.section>

        {/* Quick report */}
        {!report && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-card bg-paper p-6"
          >
            <QuickReport circleId={circleIds[0]} />
          </motion.section>
        )}

        {/* Report status */}
        {report && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-card bg-paper p-6"
          >
            <h2 className="font-display text-xl font-semibold text-ink">
              Report hari ini
            </h2>
            <div className="mt-4 space-y-3">
              <div>
                <span className="text-sm text-ink/50">Topik</span>
                <p className="font-medium text-ink">{report.topic}</p>
              </div>
              <div>
                <span className="text-sm text-ink/50">Progres</span>
                <p className="text-ink">{report.progress}</p>
              </div>
              {report.duration_minutes && (
                <div>
                  <span className="text-sm text-ink/50">Durasi</span>
                  <p className="font-mono text-ink">{report.duration_minutes} menit</p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Circle check-ins */}
        {checkIns.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-card bg-paper p-6"
          >
            <h2 className="font-display text-xl font-semibold text-ink">
              Circle hari ini
            </h2>
            <div className="mt-4 flex flex-wrap gap-3">
              {checkIns.map((checkIn) => (
                <div
                  key={checkIn.id}
                  className="flex items-center gap-2 rounded-pill bg-clay/20 px-3 py-1.5"
                >
                  <span className="text-sm font-medium text-ink">
                    {checkIn.owner?.display_name}
                  </span>
                  <span className="text-xs text-ink/60">
                    {getCheckInLabel(checkIn.state)}
                  </span>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Side panel - 38.2% */}
      <div className="golden-side flex flex-col gap-5 overflow-y-auto scrollbar-custom">
        {/* Focus total */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-card bg-ink p-6 text-paper"
        >
          <h2 className="font-display text-lg font-semibold">Fokus hari ini</h2>
          <p className="mt-2 font-mono text-3xl font-bold">{focusDisplay}</p>
          <p className="mt-1 text-sm text-paper/60">
            {focusMinutes > 0 ? "Mantap, teruskan!" : "Belum ada sesi fokus"}
          </p>
        </motion.section>

        {/* Next schedule */}
        {nextSchedule && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-card bg-paper p-6"
          >
            <h2 className="font-display text-lg font-semibold text-ink">
              Selanjutnya
            </h2>
            <div className="mt-3">
              <p className="font-medium text-ink">{nextSchedule.title}</p>
              <p className="mt-1 text-sm text-ink/60">
                {formatScheduleTime(nextSchedule)}
              </p>
            </div>
          </motion.section>
        )}

        {/* Active commitment */}
        {commitment && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="rounded-card bg-paper p-6"
          >
            <h2 className="font-display text-lg font-semibold text-ink">
              Komitmen aktif
            </h2>
            <div className="mt-3">
              <p className="font-medium text-ink">{commitment.title}</p>
              <p className="mt-1 text-sm text-ink/60">
                Deadline: {formatDate(commitment.due_on)}
              </p>
              {commitment.progress !== undefined && (
                <div className="mt-3">
                  <div className="h-2 overflow-hidden rounded-pill bg-clay/30">
                    <div
                      className="h-full rounded-pill bg-coral transition-all"
                      style={{ width: `${commitment.progress}%` }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-ink/50">
                    {commitment.progress}% selesai
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* Nudges */}
        {nudges.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-card bg-paper p-6"
          >
            <h2 className="font-display text-lg font-semibold text-ink">
              Nudge untukmu
            </h2>
            <NudgeList nudges={nudges} />
          </motion.section>
        )}

        {/* Quick actions */}
        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3"
        >
          <button
            onClick={() => setIsReportFormOpen(true)}
            className="focus-ring flex-1 rounded-pill bg-coral py-3 font-medium text-paper transition-colors hover:bg-coral/90"
          >
            report aja
          </button>
        </motion.section>
      </div>

      {/* Report form modal */}
      {isReportFormOpen && (
        <ReportForm
          circleId={circleIds[0]}
          onClose={() => setIsReportFormOpen(false)}
        />
      )}
    </div>
  );
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat pagi";
  if (hour < 15) return "Selamat siang";
  if (hour < 19) return "Selamat sore";
  return "Selamat malam";
}

function getCheckInLabel(state: string) {
  const labels: Record<string, string> = {
    siap_gas: "siap gas",
    santai_dulu: "santai dulu",
    agak_penuh: "agak penuh",
    sedang_off: "sedang off",
  };
  return labels[state] || state;
}

function formatScheduleTime(schedule: ScheduleItem) {
  const date = new Date(schedule.schedule_date);
  const today = new Date();
  const isToday = date.toDateString() === today.toDateString();
  const dayLabel = isToday
    ? "Hari ini"
    : date.toLocaleDateString("id-ID", { weekday: "long" });

  if (schedule.start_time) {
    return `${dayLabel}, ${schedule.start_time.slice(0, 5)}`;
  }

  const daypartLabels: Record<string, string> = {
    pagi: "pagi",
    siang: "siang",
    sore: "sore",
    malam: "malam",
  };

  return `${dayLabel}, ${daypartLabels[schedule.daypart] || schedule.daypart}`;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  });
}
