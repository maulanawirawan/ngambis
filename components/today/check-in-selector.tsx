"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { CheckInState } from "@/types";

const CHECK_IN_OPTIONS: { value: CheckInState; label: string; emoji: string }[] = [
  { value: "siap_gas", label: "siap gas", emoji: "🔥" },
  { value: "santai_dulu", label: "santai dulu", emoji: "🌿" },
  { value: "agak_penuh", label: "agak penuh", emoji: "🌊" },
  { value: "sedang_off", label: "sedang off", emoji: "🌙" },
];

interface CheckInSelectorProps {
  circleIds: string[];
  onStateChange?: (state: CheckInState) => void;
}

export function CheckInSelector({ circleIds, onStateChange }: CheckInSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<CheckInState | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function fetchTodayCheckIn() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("check_ins")
        .select("state")
        .eq("owner_id", user.id)
        .eq("check_in_date", today)
        .single();

      if (data) {
        const state = data.state as CheckInState;
        setSelected(state);
        setSaved(true);
        onStateChange?.(state);
      }
    }

    fetchTodayCheckIn();
  }, [circleIds, onStateChange]);

  async function handleSelect(state: CheckInState) {
    setLoading(true);
    setSelected(state);
    onStateChange?.(state);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { error } = await supabase.from("check_ins").upsert(
      {
        circle_id: circleIds[0] || null,
        owner_id: user.id,
        check_in_date: today,
        state,
        visibility: circleIds.length > 0 ? "circle" : "private",
      },
      { onConflict: "owner_id,check_in_date" }
    );

    if (!error) {
      setSaved(true);
      router.refresh();
    }

    setLoading(false);
  }

  return (
    <div>
      <p className="mb-3 text-sm text-ink/60">Gimana hari ini?</p>
      <div className="flex flex-wrap gap-2">
        {CHECK_IN_OPTIONS.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            disabled={loading}
            className={cn(
              "focus-ring flex items-center gap-2 rounded-pill px-4 py-2 text-sm transition-all",
              selected === option.value
                ? "bg-ink text-paper"
                : "bg-clay/20 text-ink hover:bg-clay/40"
            )}
          >
            <span>{option.emoji}</span>
            <span>{option.label}</span>
          </button>
        ))}
      </div>
      {saved && (
        <p className="mt-2 text-xs text-ink/50">Tersimpan. Semangat!</p>
      )}
    </div>
  );
}
