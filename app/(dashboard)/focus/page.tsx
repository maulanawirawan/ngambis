import { createClient } from "@/lib/supabase/server";
import { FocusView } from "@/components/focus/focus-view";

export default async function FocusPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Fetch active focus session
  const { data: activeSession } = await supabase
    .from("focus_sessions")
    .select("*, planning_card:planning_cards(*), schedule_item:schedule_items(*)")
    .eq("owner_id", user.id)
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch recent sessions
  const { data: recentSessions } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("owner_id", user.id)
    .not("ended_at", "is", null)
    .order("started_at", { ascending: false })
    .limit(10);

  // Fetch cards for linking
  const { data: cards } = await supabase
    .from("planning_cards")
    .select("id, title")
    .eq("owner_id", user.id)
    .is("completed_at", null)
    .is("archived_at", null);

  // Fetch today's schedule
  const today = new Date().toISOString().split("T")[0];
  const { data: scheduleItems } = await supabase
    .from("schedule_items")
    .select("id, title")
    .eq("owner_id", user.id)
    .eq("schedule_date", today)
    .is("completed_at", null);

  // Fetch circle memberships
  const { data: memberships } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const circleIds = memberships?.map((m) => m.circle_id) || [];

  return (
    <FocusView
      user={user}
      activeSession={activeSession}
      recentSessions={recentSessions || []}
      cards={cards || []}
      scheduleItems={scheduleItems || []}
      circleIds={circleIds}
    />
  );
}
