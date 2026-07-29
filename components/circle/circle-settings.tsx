"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { Circle, Accent } from "@/types";

interface CircleSettingsProps {
  circle: Circle;
  isOwner: boolean;
  memberCount: number;
}

const ACCENTS: { value: Accent; label: string; class: string }[] = [
  { value: "coral", label: "Coral", class: "bg-coral" },
  { value: "moss", label: "Moss", class: "bg-moss" },
  { value: "cobalt", label: "Cobalt", class: "bg-cobalt" },
  { value: "butter", label: "Butter", class: "bg-butter" },
  { value: "plum", label: "Plum", class: "bg-plum" },
];

export function CircleSettings({ circle, isOwner, memberCount }: CircleSettingsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accent, setAccent] = useState<Accent>(circle.accent);
  const [confirmDelete, setConfirmDelete] = useState("");

  async function handleUpdate(updates: Partial<Circle>) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("circles")
      .update(updates)
      .eq("id", circle.id);

    if (updateError) {
      setError("Gagal menyimpan. Coba lagi.");
    } else {
      router.refresh();
    }

    setLoading(false);
  }

  async function handleDeleteCircle() {
    if (confirmDelete !== circle.name) return;
    if (!confirm("YAKIN? Semua data circle akan dihapus permanen!")) return;

    setLoading(true);
    const supabase = createClient();

    await supabase.from("circles").delete().eq("id", circle.id);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Basic settings */}
      <div className="rounded-card bg-paper p-4">
        <h3 className="mb-4 font-display text-lg font-semibold text-ink">
          Pengaturan Dasar
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-ink/60">Nama Circle</label>
            <input
              type="text"
              defaultValue={circle.name}
              onBlur={(e) => handleUpdate({ name: e.target.value })}
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2 text-ink"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink/60">Accent</label>
            <div className="flex gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => {
                    setAccent(a.value);
                    handleUpdate({ accent: a.value });
                  }}
                  className={cn(
                    "focus-ring h-10 w-10 rounded-full transition-all",
                    a.class,
                    accent === a.value
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-paper"
                      : "opacity-60 hover:opacity-100"
                  )}
                  aria-label={a.label}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy defaults */}
      <div className="rounded-card bg-paper p-4">
        <h3 className="mb-4 font-display text-lg font-semibold text-ink">
          Default Privasi
        </h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-ink/60">
              Planning card default
            </label>
            <select
              value={circle.default_planning_visibility}
              onChange={(e) =>
                handleUpdate({ default_planning_visibility: e.target.value as "private" | "circle" })
              }
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2 text-ink"
            >
              <option value="private">Private</option>
              <option value="circle">Circle</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink/60">
              Schedule item default
            </label>
            <select
              value={circle.default_schedule_visibility}
              onChange={(e) =>
                handleUpdate({ default_schedule_visibility: e.target.value as "private" | "circle" })
              }
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-2 text-ink"
            >
              <option value="private">Private</option>
              <option value="circle">Circle</option>
            </select>
          </div>
        </div>
      </div>

      {/* Danger zone */}
      {isOwner && (
        <div className="rounded-card border-2 border-coral/50 bg-coral/5 p-4">
          <h3 className="mb-2 font-display text-lg font-semibold text-coral">
            Danger Zone
          </h3>
          <p className="mb-4 text-sm text-ink/60">
            Menghapus circle akan menghapus semua data termasuk board, report, dan
            jadwal semua member. Tindakan ini tidak bisa dibatalkan.
          </p>

          <div className="space-y-3">
            <div>
              <label className="mb-2 block text-sm text-ink/60">
                Ketik nama circle untuk konfirmasi: <strong>{circle.name}</strong>
              </label>
              <input
                type="text"
                value={confirmDelete}
                onChange={(e) => setConfirmDelete(e.target.value)}
                placeholder={circle.name}
                className="focus-ring w-full rounded-input border border-coral/50 bg-paper px-4 py-2 text-ink"
              />
            </div>

            <button
              onClick={handleDeleteCircle}
              disabled={confirmDelete !== circle.name || loading || memberCount > 1}
              className="focus-ring rounded-pill bg-coral px-4 py-2 font-medium text-paper transition-colors hover:bg-coral/90 disabled:opacity-50"
            >
              {memberCount > 1
                ? "Keluarkan semua member dulu"
                : loading
                  ? "Menghapus..."
                  : "Hapus Circle"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
