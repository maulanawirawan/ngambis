"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { DateWheel } from "@/components/rhythm/date-wheel";
import { DaypartLane } from "@/components/rhythm/daypart-lane";
import { ScheduleForm } from "@/components/rhythm/schedule-form";
import type { ScheduleItem, Daypart } from "@/types";
import type { User } from "@supabase/supabase-js";

interface RhythmViewProps {
  user: User;
  scheduleItems: ScheduleItem[];
  cards: { id: string; title: string; stage: { name: string } | null }[];
  circleIds: string[];
  weekStart: Date;
}

const DAYPARTS: { value: Daypart; label: string; time: string }[] = [
  { value: "pagi", label: "Pagi", time: "05:00 - 11:00" },
  { value: "siang", label: "Siang", time: "11:00 - 15:00" },
  { value: "sore", label: "Sore", time: "15:00 - 19:00" },
  { value: "malam", label: "Malam", time: "19:00 - 23:00" },
];

export function RhythmView({
  user,
  scheduleItems: initialItems,
  cards,
  circleIds,
  weekStart,
}: RhythmViewProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const selectedDateStr = selectedDate.toISOString().split("T")[0];

  // Group items by daypart for selected date
  const itemsByDaypart = useMemo(() => {
    const grouped: Record<Daypart, ScheduleItem[]> = {
      pagi: [],
      siang: [],
      sore: [],
      malam: [],
    };

    initialItems
      .filter((item) => item.schedule_date === selectedDateStr)
      .forEach((item) => {
        grouped[item.daypart].push(item);
      });

    return grouped;
  }, [initialItems, selectedDateStr]);

  async function handleMoveItem(itemId: string, newDaypart: Daypart) {
    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("schedule_items")
      .update({ daypart: newDaypart })
      .eq("id", itemId);

    if (updateError) {
      setError("Gagal memindahkan. Coba lagi.");
      setTimeout(() => setError(null), 3000);
    } else {
      router.refresh();
    }
  }

  async function handleCompleteItem(itemId: string) {
    const supabase = createClient();
    await supabase
      .from("schedule_items")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", itemId);
    router.refresh();
  }

  async function handleDeleteItem(itemId: string) {
    if (!confirm("Hapus jadwal ini?")) return;

    const supabase = createClient();
    await supabase.from("schedule_items").delete().eq("id", itemId);
    router.refresh();
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Rhythm</h1>
          <p className="text-sm text-ink/60">
            {selectedDate.toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </p>
        </div>
        <button
          onClick={() => {
            setEditingItem(null);
            setIsFormOpen(true);
          }}
          className="focus-ring rounded-pill bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink/90"
        >
          + Jadwal baru
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-input bg-coral/10 px-4 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Date wheel */}
      <div className="mb-6">
        <DateWheel
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          weekStart={weekStart}
        />
      </div>

      {/* Daypart lanes */}
      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-custom">
        {DAYPARTS.map((daypart) => (
          <DaypartLane
            key={daypart.value}
            daypart={daypart}
            items={itemsByDaypart[daypart.value]}
            onMoveItem={handleMoveItem}
            onCompleteItem={handleCompleteItem}
            onEditItem={(item: ScheduleItem) => {
              setEditingItem(item);
              setIsFormOpen(true);
            }}
            onDeleteItem={handleDeleteItem}
          />
        ))}
      </div>

      {/* Schedule form modal */}
      {isFormOpen && (
        <ScheduleForm
          circleId={circleIds[0]}
          date={selectedDateStr}
          cards={cards}
          editingItem={editingItem}
          onClose={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
}
