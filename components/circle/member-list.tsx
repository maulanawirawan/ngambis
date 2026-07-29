"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { CircleMember } from "@/types";

interface MemberListProps {
  members: CircleMember[];
  currentUserId: string;
  isAdmin: boolean;
  isOwner: boolean;
  circleId: string;
}

export function MemberList({
  members,
  currentUserId,
  isAdmin,
  isOwner,
  circleId,
}: MemberListProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleChangeRole(memberId: string, newRole: string) {
    if (!isOwner) return;

    setLoading(memberId);
    const supabase = createClient();

    await supabase
      .from("circle_members")
      .update({ role: newRole as "admin" | "member" })
      .eq("circle_id", circleId)
      .eq("user_id", memberId);

    router.refresh();
    setLoading(null);
  }

  async function handleRemoveMember(memberId: string) {
    if (!isAdmin) return;
    if (!confirm("Keluarkan member ini dari circle?")) return;

    setLoading(memberId);
    const supabase = createClient();

    await supabase
      .from("circle_members")
      .update({ status: "left" })
      .eq("circle_id", circleId)
      .eq("user_id", memberId);

    router.refresh();
    setLoading(null);
  }

  async function handleLeaveCircle() {
    if (!confirm("Yakin mau keluar dari circle ini?")) return;

    setLoading(currentUserId);
    const supabase = createClient();

    await supabase
      .from("circle_members")
      .update({ status: "left" })
      .eq("circle_id", circleId)
      .eq("user_id", currentUserId);

    router.refresh();
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isCurrentUser = member.user_id === currentUserId;
        const isMemberOwner = member.role === "owner";
        const canManage =
          (isOwner && !isCurrentUser && !isMemberOwner) ||
          (isAdmin && !isCurrentUser && member.role === "member");

        return (
          <div
            key={member.user_id}
            className="flex items-center justify-between rounded-card bg-paper p-4"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-clay text-sm font-medium text-ink">
                {member.profile?.display_name?.[0]?.toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-medium text-ink">
                  {member.profile?.display_name || "User"}
                  {isCurrentUser && (
                    <span className="ml-2 text-xs text-ink/50">(kamu)</span>
                  )}
                </p>
                <p className="text-sm text-ink/60">
                  @{member.profile?.username}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "rounded-pill px-2 py-1 text-xs font-medium",
                  member.role === "owner"
                    ? "bg-coral/20 text-coral"
                    : member.role === "admin"
                      ? "bg-cobalt/20 text-cobalt"
                      : "bg-clay/40 text-ink/60"
                )}
              >
                {member.role}
              </span>

              {canManage && (
                <div className="flex gap-1">
                  {isOwner && (
                    <select
                      value={member.role}
                      onChange={(e) => handleChangeRole(member.user_id, e.target.value)}
                      disabled={loading === member.user_id}
                      className="focus-ring rounded-input border border-clay bg-paper px-2 py-1 text-xs"
                    >
                      <option value="member">member</option>
                      <option value="admin">admin</option>
                    </select>
                  )}
                  <button
                    onClick={() => handleRemoveMember(member.user_id)}
                    disabled={loading === member.user_id}
                    className="focus-ring rounded-pill border border-coral px-2 py-1 text-xs text-coral hover:bg-coral/10"
                  >
                    Keluarkan
                  </button>
                </div>
              )}

              {isCurrentUser && !isMemberOwner && (
                <button
                  onClick={handleLeaveCircle}
                  disabled={loading === currentUserId}
                  className="focus-ring rounded-pill border border-coral px-2 py-1 text-xs text-coral hover:bg-coral/10"
                >
                  Keluar
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
