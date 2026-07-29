"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Nudge } from "@/types";

interface NudgeListProps {
  nudges: Nudge[];
}

export function NudgeList({ nudges }: NudgeListProps) {
  const router = useRouter();
  const [dismissing, setDismissing] = useState<string | null>(null);

  async function handleDismiss(nudgeId: string) {
    setDismissing(nudgeId);
    const supabase = createClient();

    await supabase
      .from("nudges")
      .update({ dismissed_at: new Date().toISOString() })
      .eq("id", nudgeId);

    router.refresh();
  }

  return (
    <div className="mt-3 space-y-3">
      {nudges.map((nudge) => (
        <div
          key={nudge.id}
          className="flex items-start justify-between rounded-input bg-clay/20 p-3"
        >
          <div>
            <p className="text-sm font-medium text-ink">
              {nudge.sender?.display_name}
            </p>
            <p className="text-sm text-ink/70">{nudge.body}</p>
          </div>
          <button
            onClick={() => handleDismiss(nudge.id)}
            disabled={dismissing === nudge.id}
            className="focus-ring rounded-full p-1 text-ink/40 transition-colors hover:text-ink"
            aria-label="Dismiss nudge"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
