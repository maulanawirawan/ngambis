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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!circleId) return;

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sesi habis. Silakan masuk lagi.");
      setLoading(false);
      return;
    }

    const data = {
      circle_id: circleId,
      owner_id: user.id,
      title: formData.get("title") as string,
      description: formData.get("description") as string || null,
      schedule_date: date,
      start_time: formData.get("start_time") as string || null,
      end_time: formData.get("end_time") as string || null,
      daypart,
      recurrence_rule: recurrence === "none" ? null : recurrence,
      planning_card_id: formData.get("card_id") as string || null,
      visibility,
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
      setError("Belum kesimpan. Coba sekali lagi.");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-4 md:items-center">
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
                  onClick={() => setDaypart(dp.value)}
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
                defaultValue={editingItem?.start_time || ""}
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
                defaultValue={editingItem?.end_time || ""}
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
