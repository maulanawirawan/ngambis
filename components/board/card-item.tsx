"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils/cn";
import type { PlanningCard, Profile } from "@/types";

interface CardItemProps {
  card: PlanningCard;
  members: Profile[];
  onClick?: () => void;
}

const PAPER_VARIANTS = {
  default: "bg-paper",
  lined: "bg-paper bg-[repeating-linear-gradient(transparent,transparent_23px,#D7C7B9_23px,#D7C7B9_24px)]",
  grid: "bg-paper bg-[linear-gradient(#D7C7B9_1px,transparent_1px),linear-gradient(90deg,#D7C7B9_1px,transparent_1px)] bg-[size:20px_20px]",
  dot: "bg-paper bg-[radial-gradient(#D7C7B9_1px,transparent_1px)] bg-[size:16px_16px]",
};

export function CardItem({ card, members, onClick }: CardItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const completedChecklists = card.checklists?.filter((c) => c.is_done).length || 0;
  const totalChecklists = card.checklists?.length || 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "cursor-grab rounded-input border border-clay/50 p-3 shadow-sm transition-all hover:shadow-md active:cursor-grabbing",
        PAPER_VARIANTS[card.paper_variant],
        isDragging && "opacity-50 shadow-lg",
        card.is_locked && "border-coral/50"
      )}
    >
      {/* Card header */}
      <div className="mb-2 flex items-start justify-between gap-2">
        <h3 className="font-medium text-ink line-clamp-2">{card.title}</h3>
        {card.is_locked && (
          <svg
            className="h-4 w-4 flex-shrink-0 text-coral"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-label="Private"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        )}
      </div>

      {/* Card meta */}
      <div className="flex flex-wrap items-center gap-2 text-xs text-ink/60">
        {card.label && (
          <span className="rounded-pill bg-clay/40 px-2 py-0.5">{card.label}</span>
        )}
        {card.due_at && (
          <span className={cn(
            "rounded-pill px-2 py-0.5",
            new Date(card.due_at) < new Date() ? "bg-coral/20 text-coral" : "bg-clay/40"
          )}>
            {new Date(card.due_at).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </span>
        )}
        {card.estimated_minutes && (
          <span className="font-mono">{card.estimated_minutes}m</span>
        )}
      </div>

      {/* Progress indicators */}
      {(totalChecklists > 0 || (card.assignees && card.assignees.length > 0)) && (
        <div className="mt-3 flex items-center justify-between">
          {totalChecklists > 0 && (
            <div className="flex items-center gap-1">
              <div className="h-1.5 w-12 overflow-hidden rounded-pill bg-clay/40">
                <div
                  className="h-full rounded-pill bg-moss transition-all"
                  style={{ width: `${(completedChecklists / totalChecklists) * 100}%` }}
                />
              </div>
              <span className="text-xs text-ink/50">
                {completedChecklists}/{totalChecklists}
              </span>
            </div>
          )}
          {card.assignees && card.assignees.length > 0 && (
            <div className="flex -space-x-1">
              {card.assignees.slice(0, 3).map((assignee) => (
                <div
                  key={assignee.user_id}
                  className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-paper bg-clay text-xs font-medium text-ink"
                  title={assignee.user?.display_name || undefined}
                >
                  {assignee.user?.display_name?.[0]?.toUpperCase()}
                </div>
              ))}
              {card.assignees.length > 3 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-paper bg-clay text-xs text-ink/60">
                  +{card.assignees.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
