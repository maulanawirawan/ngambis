import { createClient } from "@/lib/supabase/server";
import { CircleView } from "@/components/circle/circle-view";

export default async function CirclePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user's circles with member info
  const { data: memberships } = await supabase
    .from("circle_members")
    .select("circle_id, role, circles(*)")
    .eq("user_id", user.id)
    .eq("status", "active");

  const circles = (memberships?.map((m) => ({
    ...m.circles,
    user_role: m.role,
  })).filter(Boolean) || []) as unknown as import("@/types").Circle[];

  const activeCircle = circles[0] || null;

  // Fetch members of active circle
  let members: import("@/types").CircleMember[] = [];
  let invites: import("@/types").CircleInvite[] = [];
  let pendingInvitations: import("@/types").CircleInvitationRequest[] = [];

  if (activeCircle) {
    const { data: circleMembers } = await supabase
      .from("circle_members")
      .select("*, profile:profiles(*)")
      .eq("circle_id", activeCircle.id)
      .eq("status", "active");

    members = (circleMembers || []) as unknown as import("@/types").CircleMember[];

    // Fetch invites if user is admin
    const userRole = memberships?.find((m) => m.circle_id === activeCircle.id)?.role;
    if (userRole === "owner" || userRole === "admin") {
      const { data: circleInvites } = await supabase
        .from("circle_invites")
        .select("*")
        .eq("circle_id", activeCircle.id)
        .is("revoked_at", null)
        .order("created_at", { ascending: false });

      invites = (circleInvites || []) as unknown as import("@/types").CircleInvite[];

      const { data: invitationRequests } = await supabase
        .from("circle_invitation_requests")
        .select("*, invited_user:profiles(*)")
        .eq("circle_id", activeCircle.id)
        .eq("status", "pending");

      pendingInvitations = (invitationRequests || []) as unknown as import("@/types").CircleInvitationRequest[];
    }
  }

  return (
    <CircleView
      user={user}
      circles={circles}
      activeCircle={activeCircle}
      members={members}
      invites={invites}
      pendingInvitations={pendingInvitations}
    />
  );
}
