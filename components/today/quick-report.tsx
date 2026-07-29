"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { BookStar } from "@/components/illustrations/book-star";

interface QuickReportProps {
  circleId: string | undefined;
}

export function QuickReport({ circleId }: QuickReportProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
        topic: topic.trim(),
        progress: progress.trim(),
        visibility: circleId ? "circle" : "private",
      });

      if (insertError) {
        setError(insertError.message || "Belum kesimpan. Coba sekali lagi.");
        return;
      }

      setTopic("");
      setProgress("");
      setShowSuccessModal(true);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat menyimpan report.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-display text-xl font-semibold text-ink">
          Report cepat
        </h2>

        {error && (
          <div className="rounded-input bg-coral/10 px-4 py-2.5 text-sm text-coral">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="quick-topic" className="mb-1 block text-sm text-ink/60">
            Topik *
          </label>
          <input
            id="quick-topic"
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
            placeholder="Apa yang kamu kerjakan?"
            className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2.5 text-ink placeholder:text-ink/40"
          />
        </div>

        <div>
          <label htmlFor="quick-progress" className="mb-1 block text-sm text-ink/60">
            Progres *
          </label>
          <textarea
            id="quick-progress"
            value={progress}
            onChange={(e) => setProgress(e.target.value)}
            required
            rows={2}
            placeholder="Ceritakan singkat progresmu..."
            className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2.5 text-ink placeholder:text-ink/40"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="focus-ring w-full rounded-pill bg-ink py-3 font-medium text-paper transition-all hover:bg-ink/90 disabled:opacity-50 shadow-sm"
        >
          {loading ? "Menyimpan..." : "Simpan report"}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-sm rounded-2xl border border-clay/40 bg-paper p-6 shadow-2xl text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-moss/20 text-moss">
              <BookStar className="h-8 w-8 text-moss" />
            </div>
            <h3 className="font-display text-2xl font-bold text-ink">
              Report Tersimpan! 🎯
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/70">
              Mantap! Progres kamu hari ini sudah berhasil tercatat secara otomatis.
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="mt-6 focus-ring w-full rounded-pill bg-ink py-3 font-medium text-paper transition-all hover:bg-ink/90 shadow-md"
            >
              Mantap, Lanjutkan!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
