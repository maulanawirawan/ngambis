"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { cn } from "@/lib/utils/cn";
import { CardItem } from "@/components/board/card-item";
import type { BoardStage, PlanningCard, Profile } from "@/types";

interface StageColumnProps {
  stage: BoardStage;
  members: Profile[];
  onCardClick: (card: PlanningCard) => void;
}

export function StageColumn({ stage, members, onCardClick }: StageColumnProps) {
  const router = useRouter();
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [stageName, setStageName] = useState(stage.name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stage.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const cards = stage.cards?.sort((a, b) => a.position - b.position) || [];
  const cardIds = cards.map((c) => c.id);

  async function handleAddCard(e: React.FormEvent) {
    e.preventDefault();
    if (!newCardTitle.trim()) return;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const maxPosition = Math.max(...cards.map((c) => c.position), -1);

    await supabase.from("planning_cards").insert({
      board_id: stage.board_id,
      stage_id: stage.id,
      owner_id: user.id,
      title: newCardTitle,
      position: maxPosition + 1,
      visibility: "private",
    });

    setNewCardTitle("");
    setIsAddingCard(false);
    router.refresh();
  }

  async function handleUpdateStageName() {
    if (!stageName.trim() || stageName === stage.name) {
      setIsEditing(false);
      setStageName(stage.name);
      return;
    }

    const supabase = createClient();
    await supabase
      .from("board_stages")
      .update({ name: stageName })
      .eq("id", stage.id);

    setIsEditing(false);
    router.refresh();
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex h-full w-72 flex-shrink-0 flex-col rounded-card bg-clay/20 p-3",
        isDragging && "opacity-50"
      )}
    >
      {/* Stage header */}
      <div
        {...attributes}
        {...listeners}
        className="mb-3 flex cursor-grab items-center justify-between active:cursor-grabbing"
      >
        {isEditing ? (
          <input
            type="text"
            value={stageName}
            onChange={(e) => setStageName(e.target.value)}
            onBlur={handleUpdateStageName}
            onKeyDown={(e) => e.key === "Enter" && handleUpdateStageName()}
            autoFocus
            className="focus-ring flex-1 rounded-input border border-clay bg-paper px-2 py-1 text-sm font-medium"
          />
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="focus-ring flex-1 rounded px-2 py-1 text-left font-medium text-ink hover:bg-clay/30"
          >
            {stage.name}
          </button>
        )}
        <span className="ml-2 rounded-pill bg-clay/40 px-2 py-0.5 text-xs text-ink/60">
          {cards.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 space-y-2 overflow-y-auto scrollbar-custom">
        <SortableContext items={cardIds} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <CardItem
              key={card.id}
              card={card}
              members={members}
              onClick={() => onCardClick(card)}
            />
          ))}
        </SortableContext>

        {cards.length === 0 && (
          <div className="rounded-input border-2 border-dashed border-clay/40 p-4 text-center text-sm text-ink/40">
            Belum ada card
          </div>
        )}
      </div>

      {/* Add card */}
      {isAddingCard ? (
        <form onSubmit={handleAddCard} className="mt-3">
          <input
            type="text"
            value={newCardTitle}
            onChange={(e) => setNewCardTitle(e.target.value)}
            placeholder="Judul card..."
            autoFocus
            className="focus-ring w-full rounded-input border border-clay bg-paper px-3 py-2 text-sm"
          />
          <div className="mt-2 flex gap-2">
            <button
              type="submit"
              className="focus-ring flex-1 rounded-pill bg-ink py-1.5 text-sm text-paper"
            >
              Tambah
            </button>
            <button
              type="button"
              onClick={() => setIsAddingCard(false)}
              className="focus-ring rounded-pill border border-clay px-3 py-1.5 text-sm text-ink"
            >
              Batal
            </button>
          </div>
        </form>
      ) : (
        <button
          onClick={() => setIsAddingCard(true)}
          className="focus-ring mt-3 w-full rounded-pill border border-dashed border-clay py-2 text-sm text-ink/60 transition-colors hover:border-ink/30 hover:text-ink"
        >
          + Tambah card
        </button>
      )}
    </div>
  );
}
