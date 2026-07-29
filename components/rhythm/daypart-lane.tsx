"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  useDroppable,
  useDraggable,
} from "@dnd-kit/core";
import { cn } from "@/lib/utils/cn";
import type { ScheduleItem, Daypart } from "@/types";

interface DaypartLaneProps {
  daypart: { value: Daypart; label: string; time: string };
  items: ScheduleItem[];
  onMoveItem: (itemId: string, newDaypart: Daypart) => void;
  onCompleteItem: (itemId: string) => void;
  onEditItem: (item: ScheduleItem) => void;
  onDeleteItem: (itemId: string) => void;
}

export function DaypartLane({
  daypart,
  items,
  onMoveItem,
  onCompleteItem,
  onEditItem,
  onDeleteItem,
}: DaypartLaneProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: daypart.value,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "rounded-card border-2 border-dashed p-4 transition-colors",
        isOver ? "border-coral bg-coral/10" : "border-clay/40 bg-paper"
      )}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold text-ink">
            {daypart.label}
          </h3>
          <p className="text-xs text-ink/50">{daypart.time}</p>
        </div>
        <span className="rounded-pill bg-clay/30 px-2 py-0.5 text-xs text-ink/60">
          {items.length}
        </span>
      </div>

      <div className="space-y-2">
        {items.length === 0 ? (
          <p className="py-4 text-center text-sm text-ink/40">
            Belum ada jadwal {daypart.label.toLowerCase()}
          </p>
        ) : (
          items.map((item) => (
            <ScheduleItemCard
              key={item.id}
              item={item}
              onComplete={() => onCompleteItem(item.id)}
              onEdit={() => onEditItem(item)}
              onDelete={() => onDeleteItem(item.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

interface ScheduleItemCardProps {
  item: ScheduleItem;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ScheduleItemCard({
  item,
  onComplete,
  onEdit,
  onDelete,
}: ScheduleItemCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({
    id: item.id,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const isCompleted = !!item.completed_at;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group relative rounded-input border border-clay/50 bg-paper p-3 transition-all",
        isDragging && "opacity-50 shadow-lg",
        isCompleted && "opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {item.start_time && (
              <span className="font-mono text-sm text-ink/60">
                {item.start_time.slice(0, 5)}
              </span>
            )}
            <h4
              className={cn(
                "font-medium text-ink",
                isCompleted && "line-through"
              )}
            >
              {item.title}
            </h4>
          </div>
          {item.planning_card && (
            <p className="mt-1 text-xs text-ink/50">
              📋 {item.planning_card.title}
            </p>
          )}
          {item.is_locked && (
            <span className="mt-1 inline-block text-xs text-coral">
              🔒 Private
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            className="focus-ring rounded-full p-1 text-ink/40 opacity-0 transition-all hover:bg-clay/20 hover:text-ink group-hover:opacity-100"
            aria-label="Menu"
          >
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="6" r="2" />
              <circle cx="12" cy="12" r="2" />
              <circle cx="12" cy="18" r="2" />
            </svg>
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-20 mt-1 w-32 rounded-input border border-clay/30 bg-paper py-1 shadow-lg">
                {!isCompleted && (
                  <button
                    onClick={() => {
                      onComplete();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-3 py-1.5 text-left text-sm text-ink hover:bg-clay/10"
                  >
                    Selesai
                  </button>
                )}
                <button
                  onClick={() => {
                    onEdit();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-ink hover:bg-clay/10"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    onDelete();
                    setIsMenuOpen(false);
                  }}
                  className="w-full px-3 py-1.5 text-left text-sm text-coral hover:bg-coral/10"
                >
                  Hapus
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
