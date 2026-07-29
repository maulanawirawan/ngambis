"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { VisibilitySelector } from "@/components/privacy/visibility-selector";
import type { Visibility } from "@/types";

interface ReportFormProps {
  circleId: string | undefined;
  onClose: () => void;
}

export function ReportForm({ circleId, onClose }: ReportFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>("circle");

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

      const today = new Date().toISOString().split("T")[0];

      const { error: insertError } = await supabase.from("study_reports").insert({
        circle_id: circleId || null,
        owner_id: user.id,
        report_date: today,
        topic: formData.get("topic") as string,
        progress: formData.get("progress") as string,
        learning: (formData.get("learning") as string) || null,
        blocker: (formData.get("blocker") as string) || null,
        next_step: (formData.get("next_step") as string) || null,
        duration_minutes: formData.get("duration")
          ? parseInt(formData.get("duration") as string)
          : null,
        mood: (formData.get("mood") as string) || null,
        visibility: circleId ? visibility : "private",
      });

      if (insertError) {
        setError(insertError.message || "Belum kesimpan. Coba sekali lagi.");
        return;
      }

      router.refresh();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Gagal menyimpan report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center bg-ink/60 p-4 backdrop-blur-md animate-in fade-in duration-200 md:items-center">
      <div className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-hero bg-paper p-6 scrollbar-custom">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">
            Report hari ini
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
            <label htmlFor="topic" className="mb-2 block text-sm font-medium text-ink">
              Topik *
            </label>
            <input
              id="topic"
              name="topic"
              type="text"
              required
              placeholder="Apa yang kamu kerjakan hari ini?"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div>
            <label htmlFor="progress" className="mb-2 block text-sm font-medium text-ink">
              Progres *
            </label>
            <textarea
              id="progress"
              name="progress"
              required
              rows={3}
              placeholder="Ceritakan progresmu..."
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div>
            <label htmlFor="learning" className="mb-2 block text-sm font-medium text-ink">
              Yang dipelajari
            </label>
            <textarea
              id="learning"
              name="learning"
              rows={2}
              placeholder="Ada insight baru?"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div>
            <label htmlFor="blocker" className="mb-2 block text-sm font-medium text-ink">
              Blocker
            </label>
            <textarea
              id="blocker"
              name="blocker"
              rows={2}
              placeholder="Ada yang menghambat?"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div>
            <label htmlFor="next_step" className="mb-2 block text-sm font-medium text-ink">
              Langkah selanjutnya
            </label>
            <textarea
              id="next_step"
              name="next_step"
              rows={2}
              placeholder="Apa rencanamu besok?"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="duration" className="mb-2 block text-sm font-medium text-ink">
                Durasi (menit)
              </label>
              <input
                id="duration"
                name="duration"
                type="number"
                min="1"
                placeholder="60"
                className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
              />
            </div>
            <div>
              <label htmlFor="mood" className="mb-2 block text-sm font-medium text-ink">
                Mood
              </label>
              <input
                id="mood"
                name="mood"
                type="text"
                placeholder="🎯"
                className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
              />
            </div>
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
