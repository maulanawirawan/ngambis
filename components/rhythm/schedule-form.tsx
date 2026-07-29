"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { VisibilitySelector } from "@/components/privacy/visibility-selector";
import type { ScheduleItem, Daypart, Visibility } from "@/types";

interface ScheduleFormProps {
  circleId: string | undefined;
  date: string;
  cards: { id: string; title: string }[];
  editingItem: ScheduleItem | null;
  onClose: () => void;
}

const DAYPARTS: { value: Daypart; label: string }[] = [
  { value: "pagi", label: "Pagi" },
  { value: "siang", label: "Siang" },
  { value: "sore", label: "Sore" },
  { value: "malam", label: "Malam" },
];

export function ScheduleForm({
  circleId,
  date,
  cards,
  editingItem,
  onClose,
}: ScheduleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>(
    editingItem?.visibility || "private"
  );
  const [daypart, setDaypart] = useState<Daypart>(
    editingItem?.daypart || "pagi"
  );
  const [recurrence, setRecurrence] = useState(
    editingItem?.recurrence_rule || "none"
  );

  // Realtime default time computation
  const getInitialTime = () => {
    if (editingItem?.start_time) {
      return { start: editingItem.start_time.slice(0, 5), end: editingItem.end_time?.slice(0, 5) || "" };
    }
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const nextH = String((now.getHours() + 1) % 24).padStart(2, "0");
    return { start: `${h}:${m}`, end: `${nextH}:${m}` };
  };

  const initialTimes = getInitialTime();
  const [startTime, setStartTime] = useState(initialTimes.start);
  const [endTime, setEndTime] = useState(initialTimes.end);

  const getDaypartFromTime = (timeStr: string): Daypart => {
    const hour = parseInt(timeStr.split(":")[0], 10);
    if (isNaN(hour)) return "pagi";
    if (hour >= 5 && hour < 11) return "pagi";
    if (hour >= 11 && hour < 15) return "siang";
    if (hour >= 15 && hour < 19) return "sore";
    return "malam";
  };

  // Sync daypart when startTime changes
  const handleStartTimeChange = (newTime: string) => {
    setStartTime(newTime);
    if (newTime) {
      setDaypart(getDaypartFromTime(newTime));
    }
  };

  // Sync startTime & endTime when daypart pill is clicked
  const handleDaypartClick = (dp: Daypart) => {
    setDaypart(dp);
    const daypartDefaults: Record<Daypart, { start: string; end: string }> = {
      pagi: { start: "08:00", end: "09:00" },
      siang: { start: "13:00", end: "14:00" },
      sore: { start: "16:00", end: "17:00" },
      malam: { start: "20:00", end: "21:00" },
    };
    const def = daypartDefaults[dp];
    if (def) {
      setStartTime(def.start);
      setEndTime(def.end);
    }
  };

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError("Sesi habis. Silakan masuk lagi.");
        return;
      }

      const data = {
        circle_id: circleId || null,
        owner_id: user.id,
        title: (formData.get("title") as string).trim(),
        description: (formData.get("description") as string)?.trim() || null,
        schedule_date: date,
        start_time: startTime || null,
        end_time: endTime || null,
        daypart,
        recurrence_rule: recurrence === "none" ? null : recurrence,
        planning_card_id: (formData.get("card_id") as string) || null,
        visibility: circleId ? visibility : "private",
      };

      let result;
      if (editingItem) {
        result = await supabase
          .from("schedule_items")
          .update(data)
          .eq("id", editingItem.id);
      } else {
        result = await supabase.from("schedule_items").insert(data);
      }

      if (result.error) {
        setError(result.error.message || "Belum kesimpan. Coba sekali lagi.");
        return;
      }

      router.refresh();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan jadwal.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-md animate-in fade-in duration-200 md:items-center">
      <div className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-hero bg-paper p-6 scrollbar-custom">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">
            {editingItem ? "Edit Jadwal" : "Jadwal Baru"}
          </h2>
          <button
            onClick={onClose}
            className="focus-ring rounded-full p-2 text-ink/40 transition-colors hover:bg-clay/20 hover:text-ink"
            aria-label="Tutup"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="mb-2 block text-sm font-medium text-ink">
              Judul *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              defaultValue={editingItem?.title}
              placeholder="Apa yang mau dikerjakan?"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-ink">
              Deskripsi
            </label>
            <textarea
              id="description"
              name="description"
              rows={2}
              defaultValue={editingItem?.description || ""}
              placeholder="Detail tambahan..."
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Waktu *
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DAYPARTS.map((dp) => (
                <button
                  key={dp.value}
                  type="button"
                  onClick={() => handleDaypartClick(dp.value)}
                  className={cn(
                    "focus-ring rounded-input border p-2 text-center text-sm transition-all",
                    daypart === dp.value
                      ? "border-ink bg-ink text-paper"
                      : "border-clay bg-paper text-ink hover:border-ink/30"
                  )}
                >
                  {dp.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time" className="mb-2 block text-sm font-medium text-ink">
                Jam mulai
              </label>
              <input
                id="start_time"
                name="start_time"
                type="time"
                value={startTime}
                onChange={(e) => handleStartTimeChange(e.target.value)}
                className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink"
              />
            </div>
            <div>
              <label htmlFor="end_time" className="mb-2 block text-sm font-medium text-ink">
                Jam selesai
              </label>
              <input
                id="end_time"
                name="end_time"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink"
              />
            </div>
          </div>

          <div>
            <label htmlFor="card_id" className="mb-2 block text-sm font-medium text-ink">
              Link ke card
            </label>
            <select
              id="card_id"
              name="card_id"
              defaultValue={editingItem?.planning_card_id || ""}
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

          <div>
            <label htmlFor="recurrence" className="mb-2 block text-sm font-medium text-ink">
              Ulangi
            </label>
            <select
              id="recurrence"
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value)}
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink"
            >
              <option value="none">Tidak berulang</option>
              <option value="daily">Setiap hari</option>
              <option value="weekly">Setiap minggu</option>
              <option value="weekdays">Hari kerja</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Siapa yang bisa lihat?
            </label>
            <VisibilitySelector value={visibility} onChange={setVisibility} />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="focus-ring flex-1 rounded-pill border border-clay py-3 font-medium text-ink transition-colors hover:bg-clay/20"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="focus-ring flex-1 rounded-pill bg-ink py-3 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
