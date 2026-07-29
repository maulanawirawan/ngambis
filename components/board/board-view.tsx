"use client";

import { useState, useCallback, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils/cn";
import { StageColumn } from "@/components/board/stage-column";
import { CardItem } from "@/components/board/card-item";
import { CardDetail } from "@/components/board/card-detail";
import { BoardMinimap } from "@/components/board/board-minimap";
import type { PlanningBoard, PlanningCard, Profile, BoardStage } from "@/types";
import type { User } from "@supabase/supabase-js";

interface BoardViewProps {
  user: User;
  boards: PlanningBoard[];
  members: Profile[];
  circleIds: string[];
}

export function BoardView({ user, boards: initialBoards, members, circleIds }: BoardViewProps) {
  const router = useRouter();
  const [boards, setBoards] = useState(initialBoards);
  const [activeBoard, setActiveBoard] = useState<PlanningBoard | null>(
    initialBoards[0] || null
  );
  const [selectedCard, setSelectedCard] = useState<PlanningCard | null>(null);
  const [activeDragCard, setActiveDragCard] = useState<PlanningCard | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const card = findCard(active.id as string);
    if (card) {
      setActiveDragCard(card);
    }
  }, []);

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const activeCard = findCard(activeId);
    if (!activeCard) return;

    // Find which stage the over element belongs to
    const overStageId = findStageId(overId);
    if (!overStageId || overStageId === activeCard.stage_id) return;

    // Optimistically update UI
    setBoards((prev) => {
      return prev.map((board) => {
        if (board.id !== activeBoard?.id) return board;

        return {
          ...board,
          stages: board.stages?.map((stage) => {
            if (stage.id === activeCard.stage_id) {
              return {
                ...stage,
                cards: stage.cards?.filter((c) => c.id !== activeId),
              };
            }
            if (stage.id === overStageId) {
              const newCards = [...(stage.cards || [])];
              const overIndex = newCards.findIndex((c) => c.id === overId);
              const insertIndex = overIndex >= 0 ? overIndex : newCards.length;
              newCards.splice(insertIndex, 0, { ...activeCard, stage_id: overStageId });
              return { ...stage, cards: newCards };
            }
            return stage;
          }),
        };
      });
    });
  }, [activeBoard?.id]);

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveDragCard(null);

      if (!over || !activeBoard) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      const activeCard = findCard(activeId);
      if (!activeCard) return;

      const overStageId = findStageId(overId);
      const overCard = findCard(overId);

      let newStageId = activeCard.stage_id;
      let newPosition = activeCard.position;

      if (overStageId && overStageId !== activeCard.stage_id) {
        // Moved to different stage
        newStageId = overStageId;
        const stageCards = activeBoard.stages?.find((s) => s.id === overStageId)?.cards || [];
        newPosition = stageCards.length;
      } else if (overCard && overCard.id !== activeCard.id) {
        // Reordered within same stage
        newPosition = overCard.position;
      }

      // Save to database
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("planning_cards")
        .update({
          stage_id: newStageId,
          position: newPosition,
        })
        .eq("id", activeId);

      if (updateError) {
        // Rollback on error
        setBoards(initialBoards);
        setError("Gagal memindahkan card. Coba lagi.");
        setTimeout(() => setError(null), 3000);
      } else {
        router.refresh();
      }
    },
    [activeBoard, initialBoards, router]
  );

  function findCard(cardId: string): PlanningCard | null {
    for (const board of boards) {
      for (const stage of board.stages || []) {
        const card = stage.cards?.find((c) => c.id === cardId);
        if (card) return card;
      }
    }
    return null;
  }

  function findStageId(elementId: string): string | null {
    // Check if element is a stage
    for (const board of boards) {
      for (const stage of board.stages || []) {
        if (stage.id === elementId) return stage.id;
      }
    }
    // Check if element is a card
    const card = findCard(elementId);
    return card?.stage_id || null;
  }

  useEffect(() => {
    setBoards(initialBoards);
    if (initialBoards.length > 0) {
      setActiveBoard((prev) => prev || initialBoards[0]);
    }
  }, [initialBoards]);

  const [creatingBoard, setCreatingBoard] = useState(false);

  async function handleCreateBoard() {
    setCreatingBoard(true);
    setError(null);

    try {
      const supabase = createClient();
      let targetCircleId = circleIds[0];

      // If user doesn't have a circle yet, create a default personal circle first
      if (!targetCircleId) {
        targetCircleId = crypto.randomUUID();
        const displayName = user.user_metadata?.display_name || user.email?.split("@")[0] || "Saya";
        const slugBase = displayName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

        const { error: circleErr } = await supabase.from("circles").insert({
          id: targetCircleId,
          name: `Circle ${displayName}`,
          slug: `${slugBase}-${Date.now().toString(36)}`,
          accent: "#F16F5C",
          created_by: user.id,
        });

        if (circleErr) {
          setError(circleErr.message || "Gagal membuat circle dasar.");
          return;
        }

        // Add creator as owner
        await supabase.from("circle_members").insert({
          circle_id: targetCircleId,
          user_id: user.id,
          role: "owner",
          status: "active",
        });
      }

      const boardId = crypto.randomUUID();

      const { error: insertError } = await supabase.from("planning_boards").insert({
        id: boardId,
        circle_id: targetCircleId,
        owner_id: user.id,
        name: "Board Utama",
        visibility: "circle",
      });

      if (insertError) {
        setError(insertError.message || "Gagal membuat board. Coba lagi.");
        return;
      }

      // Create default stages
      const defaultStages = [
        { id: crypto.randomUUID(), name: "Kepikiran", position: 0 },
        { id: crypto.randomUUID(), name: "Siap Digarap", position: 1 },
        { id: crypto.randomUUID(), name: "Lagi Jalan", position: 2 },
        { id: crypto.randomUUID(), name: "Tinggal Poles", position: 3 },
        { id: crypto.randomUUID(), name: "Beres", position: 4 },
      ];

      const { error: stageError } = await supabase.from("board_stages").insert(
        defaultStages.map((s) => ({
          board_id: boardId,
          ...s,
        }))
      );

      if (stageError) {
        setError(stageError.message || "Gagal membuat stage.");
        return;
      }

      // Optimistically show board on UI immediately
      const newBoard: PlanningBoard = {
        id: boardId,
        circle_id: targetCircleId,
        owner_id: user.id,
        name: "Board Utama",
        visibility: "circle",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        stages: defaultStages.map((s) => ({
          id: s.id,
          board_id: boardId,
          name: s.name,
          position: s.position,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          cards: [],
        })),
      };

      setBoards([newBoard]);
      setActiveBoard(newBoard);
      router.refresh();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan.");
    } finally {
      setCreatingBoard(false);
    }
  }

  if (!activeBoard) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
        {error && (
          <div className="mb-2 max-w-sm rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}
        <p className="font-display text-lg font-semibold text-ink">
          Belum ada board. Buat yang pertama yuk!
        </p>
        <button
          onClick={handleCreateBoard}
          disabled={creatingBoard}
          className="focus-ring rounded-pill bg-ink px-8 py-3.5 font-medium text-paper transition-all hover:bg-ink/90 disabled:opacity-50 shadow-md"
        >
          {creatingBoard ? "Membuat Board..." : "Buat Board Utama"}
        </button>
      </div>
    );
  }

  const stages = activeBoard.stages?.sort((a, b) => a.position - b.position) || [];
  const stageIds = stages.map((s) => s.id);

  return (
    <div className="flex h-full flex-col">
      {/* Board header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            {activeBoard.name}
          </h1>
          <p className="text-sm text-ink/60">
            {stages.length} stage · {stages.reduce((acc, s) => acc + (s.cards?.length || 0), 0)} cards
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.refresh()}
            className="focus-ring rounded-pill border border-clay px-4 py-2 text-sm text-ink transition-colors hover:bg-clay/20"
          >
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-4 rounded-input bg-coral/10 px-4 py-2 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Board content */}
      <div className="relative flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex h-full gap-4 overflow-x-auto pb-4 scrollbar-custom">
            <SortableContext items={stageIds} strategy={horizontalListSortingStrategy}>
              {stages.map((stage) => (
                <StageColumn
                  key={stage.id}
                  stage={stage}
                  members={members}
                  onCardClick={setSelectedCard}
                />
              ))}
            </SortableContext>
          </div>

          <DragOverlay>
            {activeDragCard ? (
              <div className="w-64 rotate-3 opacity-90">
                <CardItem card={activeDragCard} members={members} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Mini-map */}
        <BoardMinimap stages={stages} activeStageId={null} />
      </div>

      {/* Card detail drawer */}
      {selectedCard && (
        <CardDetail
          card={selectedCard}
          members={members}
          onClose={() => setSelectedCard(null)}
        />
      )}
    </div>
  );
}
