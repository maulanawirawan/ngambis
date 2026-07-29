import { createClient } from "@/lib/supabase/server";
import { BoardView } from "@/components/board/board-view";

export default async function BoardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch user's boards
  const { data: boards } = await supabase
    .from("planning_boards")
    .select("*, stages:board_stages(*, cards:planning_cards(*, owner:profiles(*), assignees:card_assignees(user:profiles(*)), checklists:card_checklists(*)))")
    .order("created_at", { ascending: true });

  // Fetch circle members for assignee selection
  const { data: memberships } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const circleIds = memberships?.map((m) => m.circle_id) || [];

  const { data: members } = await supabase
    .from("circle_members")
    .select("user_id, profile:profiles(*)")
    .in("circle_id", circleIds)
    .eq("status", "active");

  return (
    <BoardView
      user={user}
      boards={boards || []}
      members={(members?.map((m) => m.profile).filter(Boolean) || []) as unknown as import("@/types").Profile[]}
      circleIds={circleIds}
    />
  );
}
