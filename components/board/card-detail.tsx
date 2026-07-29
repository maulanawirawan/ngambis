"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { VisibilitySelector } from "@/components/privacy/visibility-selector";
import type { PlanningCard, Profile, Visibility } from "@/types";

interface CardDetailProps {
  card: PlanningCard;
  members: Profile[];
  onClose: () => void;
}

export function CardDetail({ card, members, onClose }: CardDetailProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibility, setVisibility] = useState<Visibility>(card.visibility);
  const [isLocked, setIsLocked] = useState(card.is_locked);
  const [newChecklistItem, setNewChecklistItem] = useState("");

  async function handleUpdate(updates: Partial<PlanningCard>) {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("planning_cards")
      .update(updates)
      .eq("id", card.id);

    if (updateError) {
      setError("Gagal menyimpan. Coba lagi.");
    } else {
      router.refresh();
    }

    setLoading(false);
  }

  async function handleAddChecklist(e: React.FormEvent) {
    e.preventDefault();
    if (!newChecklistItem.trim()) return;

    const supabase = createClient();
    const maxPosition = Math.max(
      ...(card.checklists?.map((c) => c.position) || [-1])
    );

    await supabase.from("card_checklists").insert({
      card_id: card.id,
      body: newChecklistItem,
      position: maxPosition + 1,
    });

    setNewChecklistItem("");
    router.refresh();
  }

  async function handleToggleChecklist(checklistId: string, isDone: boolean) {
    const supabase = createClient();
    await supabase
      .from("card_checklists")
      .update({ is_done: isDone })
      .eq("id", checklistId);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Hapus card ini?")) return;

    const supabase = createClient();
    await supabase.from("planning_cards").delete().eq("id", card.id);
    router.refresh();
    onClose();
  }

  async function handleComplete() {
    const supabase = createClient();
    await supabase
      .from("planning_cards")
      .update({ completed_at: new Date().toISOString() })
      .eq("id", card.id);
    router.refresh();
  }

  return (
    <div className="fixed inset-y-0 right-0 z-[100] w-full max-w-md bg-paper shadow-2xl border-l border-clay/40">
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-clay/30 p-4">
          <h2 className="font-display text-xl font-bold text-ink">Detail Card</h2>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 scrollbar-custom">
          {error && (
            <div className="mb-4 rounded-input bg-coral/10 px-4 py-2 text-sm text-coral">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="mb-4">
            <label className="mb-1 block text-sm text-ink/60">Judul</label>
            <input
              type="text"
              defaultValue={card.title}
              onBlur={(e) => handleUpdate({ title: e.target.value })}
              className="focus-ring w-full rounded-input border border-clay bg-paper px-3 py-2 font-medium text-ink"
            />
          </div>

          {/* Description */}
          <div className="mb-4">
            <label className="mb-1 block text-sm text-ink/60">Deskripsi</label>
            <textarea
              defaultValue={card.description || ""}
              onBlur={(e) => handleUpdate({ description: e.target.value })}
              rows={3}
              className="focus-ring w-full rounded-input border border-clay bg-paper px-3 py-2 text-ink"
            />
          </div>

          {/* Checklist */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-ink/60">Checklist</label>
            <div className="space-y-2">
              {card.checklists?.map((item) => (
                <label
                  key={item.id}
                  className="flex items-center gap-2 rounded-input bg-clay/20 p-2"
                >
                  <input
                    type="checkbox"
                    checked={item.is_done}
                    onChange={(e) => handleToggleChecklist(item.id, e.target.checked)}
                    className="h-4 w-4 rounded border-clay text-coral focus:ring-coral"
                  />
                  <span className={cn(item.is_done && "line-through text-ink/50")}>
                    {item.body}
                  </span>
                </label>
              ))}
            </div>
            <form onSubmit={handleAddChecklist} className="mt-2 flex gap-2">
              <input
                type="text"
                value={newChecklistItem}
                onChange={(e) => setNewChecklistItem(e.target.value)}
                placeholder="Tambah item..."
                className="focus-ring flex-1 rounded-input border border-clay bg-paper px-3 py-1.5 text-sm"
              />
              <button
                type="submit"
                className="focus-ring rounded-pill bg-ink px-3 py-1.5 text-sm text-paper"
              >
                +
              </button>
            </form>
          </div>

          {/* Meta */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-sm text-ink/60">Label</label>
              <input
                type="text"
                defaultValue={card.label || ""}
                onBlur={(e) => handleUpdate({ label: e.target.value })}
                placeholder="Label..."
                className="focus-ring w-full rounded-input border border-clay bg-paper px-3 py-1.5 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-ink/60">Estimasi (menit)</label>
              <input
                type="number"
                defaultValue={card.estimated_minutes || ""}
                onBlur={(e) =>
                  handleUpdate({ estimated_minutes: e.target.value ? parseInt(e.target.value) : null })
                }
                placeholder="60"
                className="focus-ring w-full rounded-input border border-clay bg-paper px-3 py-1.5 text-sm"
              />
            </div>
          </div>

          {/* Due date */}
          <div className="mb-4">
            <label className="mb-1 block text-sm text-ink/60">Deadline</label>
            <input
              type="datetime-local"
              defaultValue={card.due_at?.slice(0, 16) || ""}
              onChange={(e) =>
                handleUpdate({ due_at: e.target.value ? new Date(e.target.value).toISOString() : null })
              }
              className="focus-ring w-full rounded-input border border-clay bg-paper px-3 py-1.5 text-sm"
            />
          </div>

          {/* Visibility */}
          <div className="mb-4">
            <label className="mb-2 block text-sm text-ink/60">Privasi</label>
            <VisibilitySelector
              value={visibility}
              onChange={(v) => {
                setVisibility(v);
                handleUpdate({ visibility: v });
              }}
            />
          </div>

          {/* Lock */}
          <div className="mb-4 flex items-center justify-between rounded-input bg-clay/20 p-3">
            <div>
              <p className="font-medium text-ink">Kunci card</p>
              <p className="text-xs text-ink/60">
                {isLocked ? "Cuma kamu yang bisa lihat" : "Sesuai pengaturan privasi"}
              </p>
            </div>
            <button
              onClick={() => {
                setIsLocked(!isLocked);
                handleUpdate({ is_locked: !isLocked });
              }}
              className={cn(
                "focus-ring relative h-6 w-11 rounded-full transition-colors",
                isLocked ? "bg-coral" : "bg-clay"
              )}
              role="switch"
              aria-checked={isLocked}
            >
              <span
                className={cn(
                  "absolute top-1 h-4 w-4 rounded-full bg-paper transition-transform",
                  isLocked ? "left-6" : "left-1"
                )}
              />
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div className="border-t border-clay/30 p-4">
          <div className="flex gap-2">
            {!card.completed_at && (
              <button
                onClick={handleComplete}
                disabled={loading}
                className="focus-ring flex-1 rounded-pill bg-moss py-2 font-medium text-paper transition-colors hover:bg-moss/90"
              >
                Tandai selesai
              </button>
            )}
            <button
              onClick={handleDelete}
              disabled={loading}
              className="focus-ring rounded-pill border border-coral px-4 py-2 text-coral transition-colors hover:bg-coral/10"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
