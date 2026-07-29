"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

interface QuickReportProps {
  circleId: string | undefined;
}

export function QuickReport({ circleId }: QuickReportProps) {
  const router = useRouter();
  const [topic, setTopic] = useState("");
  const [progress, setProgress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!circleId) return;

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sesi habis. Silakan masuk lagi.");
      setLoading(false);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    const { error: insertError } = await supabase.from("study_reports").insert({
      circle_id: circleId,
      owner_id: user.id,
      report_date: today,
      topic,
      progress,
      visibility: "circle",
    });

    if (insertError) {
      setError("Belum kesimpan. Coba sekali lagi.");
      setLoading(false);
      return;
    }

    router.refresh();
  }

  if (!circleId) {
    return (
      <div className="text-center text-ink/60">
        <p>Buat atau gabung circle dulu untuk mulai report.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="font-display text-xl font-semibold text-ink">
        Report cepat
      </h2>

      {error && (
        <div className="rounded-input bg-coral/10 px-4 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="quick-topic" className="mb-1 block text-sm text-ink/60">
          Topik
        </label>
        <input
          id="quick-topic"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          required
          placeholder="Apa yang kamu kerjakan?"
          className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2 text-ink placeholder:text-ink/40"
        />
      </div>

      <div>
        <label htmlFor="quick-progress" className="mb-1 block text-sm text-ink/60">
          Progres
        </label>
        <textarea
          id="quick-progress"
          value={progress}
          onChange={(e) => setProgress(e.target.value)}
          required
          rows={2}
          placeholder="Ceritakan singkat progresmu..."
          className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2 text-ink placeholder:text-ink/40"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="focus-ring w-full rounded-pill bg-ink py-2 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
      >
        {loading ? "Menyimpan..." : "Simpan report"}
      </button>
    </form>
  );
}
