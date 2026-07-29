"use client";

import { cn } from "@/lib/utils/cn";
import type { BoardStage } from "@/types";

interface BoardMinimapProps {
  stages: BoardStage[];
  activeStageId: string | null;
}

export function BoardMinimap({ stages, activeStageId }: BoardMinimapProps) {
  const totalCards = stages.reduce((acc, s) => acc + (s.cards?.length || 0), 0);

  return (
    <div className="absolute bottom-0 left-0 right-0 border-t border-clay/30 bg-canvas/80 p-2 backdrop-blur-sm">
      <div className="flex items-center justify-center gap-1">
        {stages.map((stage) => {
          const cardCount = stage.cards?.length || 0;
          const width = totalCards > 0 ? (cardCount / totalCards) * 100 : 20;

          return (
            <div
              key={stage.id}
              className={cn(
                "h-1.5 rounded-pill transition-all",
                activeStageId === stage.id ? "bg-coral" : "bg-clay/60"
              )}
              style={{ width: `${Math.max(width, 10)}%` }}
              title={`${stage.name}: ${cardCount} cards`}
            />
          );
        })}
      </div>
    </div>
  );
}
