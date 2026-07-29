"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { CreateCircleForm } from "@/components/circle/create-circle-form";
import { InviteManager } from "@/components/circle/invite-manager";
import { MemberList } from "@/components/circle/member-list";
import { CircleSettings } from "@/components/circle/circle-settings";
import type { Circle, CircleMember, CircleInvite, CircleInvitationRequest, Accent } from "@/types";
import type { User } from "@supabase/supabase-js";

interface CircleViewProps {
  user: User;
  circles: (Circle & { user_role?: string })[];
  activeCircle: Circle | null;
  members: CircleMember[];
  invites: CircleInvite[];
  pendingInvitations: CircleInvitationRequest[];
}

type Tab = "overview" | "members" | "invite" | "settings";

const ACCENT_COLORS: Record<Accent, string> = {
  coral: "bg-coral",
  moss: "bg-moss",
  cobalt: "bg-cobalt",
  butter: "bg-butter",
  plum: "bg-plum",
};

export function CircleView({
  user,
  circles,
  activeCircle,
  members,
  invites,
  pendingInvitations,
}: CircleViewProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const userRole = activeCircle
    ? circles.find((c) => c.id === activeCircle.id)?.user_role
    : null;
  const isAdmin = userRole === "owner" || userRole === "admin";
  const isOwner = userRole === "owner";

  const tabs: { id: Tab; label: string; adminOnly?: boolean }[] = [
    { id: "overview", label: "Overview" },
    { id: "members", label: "Member" },
    { id: "invite", label: "Invite", adminOnly: true },
    { id: "settings", label: "Pengaturan", adminOnly: true },
  ];

  async function handleSwitchCircle(_circleId: string) {
    // In a real app, you'd store the active circle in user preferences
    // For now, just refresh to show the selected circle's data
    router.refresh();
  }

  if (circles.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-6">
        <div className="text-center">
          <h1 className="font-display text-2xl font-bold text-ink">
            Belum ada circle
          </h1>
          <p className="mt-2 text-ink/60">
            Circle adalah tempat kamu dan teman-temanmu berbagi progres.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="focus-ring rounded-pill bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Buat Circle Pertama
        </button>

        {isCreateOpen && (
          <CreateCircleForm onClose={() => setIsCreateOpen(false)} />
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-12 w-12 items-center justify-center rounded-card text-paper",
              ACCENT_COLORS[activeCircle?.accent || "coral"]
            )}
          >
            <span className="font-display text-xl font-bold">
              {activeCircle?.name[0].toUpperCase()}
            </span>
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-ink">
              {activeCircle?.name}
            </h1>
            <p className="text-sm text-ink/60">
              {members.length} member · {userRole}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {circles.length > 1 && (
            <select
              value={activeCircle?.id}
              onChange={(e) => handleSwitchCircle(e.target.value)}
              className="focus-ring rounded-input border border-clay bg-paper px-3 py-2 text-sm text-ink"
            >
              {circles.map((circle) => (
                <option key={circle.id} value={circle.id}>
                  {circle.name}
                </option>
              ))}
            </select>
          )}
          <button
            onClick={() => setIsCreateOpen(true)}
            className="focus-ring rounded-pill border border-clay px-4 py-2 text-sm text-ink transition-colors hover:bg-clay/20"
          >
            + Circle baru
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto scrollbar-custom">
        {tabs
          .filter((tab) => !tab.adminOnly || isAdmin)
          .map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "focus-ring rounded-pill px-4 py-2 text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-ink text-paper"
                  : "bg-paper text-ink/60 hover:bg-clay/30 hover:text-ink"
              )}
            >
              {tab.label}
            </button>
          ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-custom">
        {activeTab === "overview" && activeCircle && (
          <div className="space-y-6">
            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="rounded-card bg-paper p-4">
                <p className="font-mono text-2xl font-bold text-ink">
                  {members.length}
                </p>
                <p className="text-sm text-ink/60">Member aktif</p>
              </div>
              <div className="rounded-card bg-paper p-4">
                <p className="font-mono text-2xl font-bold text-ink">
                  {invites.length}
                </p>
                <p className="text-sm text-ink/60">Invite aktif</p>
              </div>
              <div className="rounded-card bg-paper p-4">
                <p className="font-mono text-2xl font-bold text-ink">
                  {pendingInvitations.length}
                </p>
                <p className="text-sm text-ink/60">Menunggu</p>
              </div>
              <div className="rounded-card bg-paper p-4">
                <p className="font-mono text-2xl font-bold text-ink capitalize">
                  {activeCircle.accent}
                </p>
                <p className="text-sm text-ink/60">Accent</p>
              </div>
            </div>

            {/* Pending invitations */}
            {pendingInvitations.length > 0 && (
              <div className="rounded-card bg-paper p-4">
                <h3 className="mb-3 font-display text-lg font-semibold text-ink">
                  Menunggu konfirmasi
                </h3>
                <div className="space-y-2">
                  {pendingInvitations.map((inv) => (
                    <div
                      key={inv.id}
                      className="flex items-center justify-between rounded-input bg-clay/20 p-3"
                    >
                      <span className="text-ink">
                        Undangan untuk {(inv as CircleInvitationRequest & { invited_user?: { display_name?: string } }).invited_user?.display_name || "user"}
                      </span>
                      <span className="text-xs text-ink/50">
                        {new Date(inv.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Privacy info */}
            <div className="rounded-card bg-paper p-4">
              <h3 className="mb-3 font-display text-lg font-semibold text-ink">
                Default privasi
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink/60">Planning card</span>
                  <span className="font-medium text-ink capitalize">
                    {activeCircle.default_planning_visibility}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink/60">Schedule item</span>
                  <span className="font-medium text-ink capitalize">
                    {activeCircle.default_schedule_visibility}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && activeCircle && (
          <MemberList
            members={members}
            currentUserId={user.id}
            isAdmin={isAdmin}
            isOwner={isOwner}
            circleId={activeCircle.id}
          />
        )}

        {activeTab === "invite" && activeCircle && isAdmin && (
          <InviteManager
            circle={activeCircle}
            invites={invites}
            pendingInvitations={pendingInvitations}
          />
        )}

        {activeTab === "settings" && activeCircle && isAdmin && (
          <CircleSettings
            circle={activeCircle}
            isOwner={isOwner}
            memberCount={members.length}
          />
        )}
      </div>

      {/* Create circle modal */}
      {isCreateOpen && (
        <CreateCircleForm onClose={() => setIsCreateOpen(false)} />
      )}
    </div>
  );
}
