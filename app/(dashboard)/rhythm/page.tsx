import { createClient } from "@/lib/supabase/server";
import { RhythmView } from "@/components/rhythm/rhythm-view";

export default async function RhythmPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get date range (current week)
  const today = new Date();
  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);

  const startDate = startOfWeek.toISOString().split("T")[0];
  const endDate = endOfWeek.toISOString().split("T")[0];

  // Fetch schedule items
  const { data: scheduleItems } = await supabase
    .from("schedule_items")
    .select("*, planning_card:planning_cards(*), owner:profiles(*)")
    .gte("schedule_date", startDate)
    .lte("schedule_date", endDate)
    .order("schedule_date", { ascending: true });

  // Fetch planning cards for linking
  const { data: cards } = await supabase
    .from("planning_cards")
    .select("id, title, stage:board_stages(name)")
    .is("completed_at", null)
    .is("archived_at", null);

  // Fetch circle memberships
  const { data: memberships } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const circleIds = memberships?.map((m) => m.circle_id) || [];

  return (
    <RhythmView
      user={user}
      scheduleItems={scheduleItems || []}
      cards={(cards || []) as unknown as { id: string; title: string; stage: { name: string } | null }[]}
      circleIds={circleIds}
      weekStart={startOfWeek}
    />
  );
}
