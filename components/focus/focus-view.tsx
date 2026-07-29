"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { MoonFocus } from "@/components/illustrations/moon-focus";
import type { FocusSession, FocusOutcome } from "@/types";
import type { User } from "@supabase/supabase-js";

interface FocusViewProps {
  user: User;
  activeSession: FocusSession | null;
  recentSessions: FocusSession[];
  cards: { id: string; title: string }[];
  scheduleItems: { id: string; title: string }[];
  circleIds: string[];
}

const PRESETS = [25, 45, 60];

export function FocusView({
  user,
  activeSession: initialActiveSession,
  recentSessions,
  cards,
  scheduleItems,
  circleIds,
}: FocusViewProps) {
  const router = useRouter();
  const [activeSession, setActiveSession] = useState(initialActiveSession);
  const [elapsed, setElapsed] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(25);
  const [customMinutes, setCustomMinutes] = useState("");
  const [selectedCard, setSelectedCard] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Timestamp-based timer
  useEffect(() => {
    if (activeSession && !activeSession.ended_at) {
      setIsRunning(true);
      const startTime = new Date(activeSession.started_at).getTime();

      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const elapsedSeconds = Math.floor((now - startTime) / 1000);
        setElapsed(elapsedSeconds);
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [activeSession]);

  async function startSession() {
    const supabase = createClient();
    const duration = customMinutes ? parseInt(customMinutes) : selectedPreset;

    const { data, error } = await supabase
      .from("focus_sessions")
      .insert({
        circle_id: circleIds[0],
        owner_id: user.id,
        planning_card_id: selectedCard || null,
        schedule_item_id: selectedSchedule || null,
        started_at: new Date().toISOString(),
        duration_seconds: 0,
        visibility: "private",
      })
      .select()
      .single();

    if (!error && data) {
      setActiveSession(data);
      setIsRunning(true);
    }
  }

  async function endSession(outcome: FocusOutcome) {
    if (!activeSession) return;

    const supabase = createClient();
    const endedAt = new Date();
    const startedAt = new Date(activeSession.started_at);
    const durationSeconds = Math.floor(
      (endedAt.getTime() - startedAt.getTime()) / 1000
    );

    await supabase
      .from("focus_sessions")
      .update({
        ended_at: endedAt.toISOString(),
        duration_seconds: durationSeconds,
        outcome,
      })
      .eq("id", activeSession.id);

    setActiveSession(null);
    setIsRunning(false);
    setElapsed(0);
    router.refresh();
  }

  async function cancelSession() {
    if (!activeSession) return;
    if (!confirm("Batalkan sesi fokus ini?")) return;

    const supabase = createClient();
    await supabase.from("focus_sessions").delete().eq("id", activeSession.id);

    setActiveSession(null);
    setIsRunning(false);
    setElapsed(0);
    router.refresh();
  }

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const targetMinutes = customMinutes ? parseInt(customMinutes) : selectedPreset;
  const progress = targetMinutes > 0 ? (minutes / targetMinutes) * 100 : 0;

  return (
    <div className="flex h-full flex-col items-center justify-center">
      {activeSession ? (
        /* Active session view */
        <div className="text-center">
          <MoonFocus className="mx-auto mb-8 h-24 w-24 text-coral" />

          {/* Timer display */}
          <div className="mb-8">
            <p className="font-mono text-6xl font-bold text-ink">
              {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </p>
            <p className="mt-2 text-ink/60">
              Target: {targetMinutes} menit
            </p>
          </div>

          {/* Progress ring */}
          <div className="relative mx-auto mb-8 h-48 w-48">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#D7C7B9"
                strokeWidth="8"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#F16F5C"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - progress / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
          </div>

          {/* Linked item */}
          {(activeSession as any).planning_card && (
            <p className="mb-4 text-ink/60">
              📋 {(activeSession as any).planning_card?.title}
            </p>
          )}
          {(activeSession as any).schedule_item && (
            <p className="mb-4 text-ink/60">
              📅 {(activeSession as any).schedule_item?.title}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-3">
            <button
              onClick={() => endSession("selesai")}
              className="focus-ring rounded-pill bg-moss px-6 py-3 font-medium text-paper transition-colors hover:bg-moss/90"
            >
              Selesai
            </button>
            <button
              onClick={() => endSession("lanjut_nanti")}
              className="focus-ring rounded-pill bg-butter px-6 py-3 font-medium text-ink transition-colors hover:bg-butter/90"
            >
              Lanjut nanti
            </button>
            <button
              onClick={() => endSession("blocker")}
              className="focus-ring rounded-pill bg-coral px-6 py-3 font-medium text-paper transition-colors hover:bg-coral/90"
            >
              Blocker
            </button>
          </div>

          <button
            onClick={cancelSession}
            className="mt-4 text-sm text-ink/40 hover:text-ink"
          >
            Batalkan sesi
          </button>
        </div>
      ) : (
        /* Start session view */
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <MoonFocus className="mx-auto mb-4 h-16 w-16 text-coral" />
            <h1 className="font-display text-2xl font-bold text-ink">
              Focus Session
            </h1>
            <p className="mt-2 text-ink/60">
              Fokus tanpa distraksi. Timer akurat meski tab sleep.
            </p>
          </div>

          {/* Preset selection */}
          <div className="mb-6">
            <label className="mb-3 block text-sm font-medium text-ink">
              Durasi
            </label>
            <div className="grid grid-cols-4 gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setCustomMinutes("");
                  }}
                  className={cn(
                    "focus-ring rounded-input border p-3 text-center font-mono transition-all",
                    selectedPreset === preset && !customMinutes
                      ? "border-ink bg-ink text-paper"
                      : "border-clay bg-paper text-ink hover:border-ink/30"
                  )}
                >
                  {preset}m
                </button>
              ))}
              <input
                type="number"
                placeholder="Custom"
                value={customMinutes}
                onChange={(e) => {
                  setCustomMinutes(e.target.value);
                  setSelectedPreset(0);
                }}
                className={cn(
                  "focus-ring rounded-input border p-3 text-center font-mono transition-all",
                  customMinutes
                    ? "border-ink bg-ink text-paper"
                    : "border-clay bg-paper text-ink"
                )}
              />
            </div>
          </div>

          {/* Link to card */}
          {cards.length > 0 && (
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-ink">
                Link ke card (opsional)
              </label>
              <select
                value={selectedCard}
                onChange={(e) => setSelectedCard(e.target.value)}
                className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink"
              >
                <option value="">Tidak ada</option>
                {cards.map((card) => (
                  <option key={card.id} value={card.id}>
                    {card.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Link to schedule */}
          {scheduleItems.length > 0 && (
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-ink">
                Link ke jadwal (opsional)
              </label>
              <select
                value={selectedSchedule}
                onChange={(e) => setSelectedSchedule(e.target.value)}
                className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink"
              >
                <option value="">Tidak ada</option>
                {scheduleItems.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            onClick={startSession}
            disabled={!selectedPreset && !customMinutes}
            className="focus-ring w-full rounded-pill bg-ink py-4 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            Mulai Fokus
          </button>

          {/* Recent sessions */}
          {recentSessions.length > 0 && (
            <div className="mt-8">
              <h3 className="mb-3 text-sm font-medium text-ink/60">
                Sesi terakhir
              </h3>
              <div className="space-y-2">
                {recentSessions.slice(0, 3).map((session) => (
                  <div
                    key={session.id}
                    className="flex items-center justify-between rounded-input bg-paper p-3 text-sm"
                  >
                    <span className="font-mono text-ink">
                      {Math.floor(session.duration_seconds / 60)}m
                    </span>
                    <span className="text-ink/50">
                      {new Date(session.started_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
