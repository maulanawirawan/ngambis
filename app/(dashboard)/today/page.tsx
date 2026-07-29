import { createClient } from "@/lib/supabase/server";
import { TodayView } from "@/components/today/today-view";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const today = new Date().toISOString().split("T")[0];

  // Fetch today's report
  const { data: report } = await supabase
    .from("study_reports")
    .select("*, owner:profiles(*)")
    .eq("owner_id", user.id)
    .eq("report_date", today)
    .single();

  // Fetch circle members' check-ins
  const { data: memberships } = await supabase
    .from("circle_members")
    .select("circle_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const circleIds = memberships?.map((m) => m.circle_id) || [];

  const { data: checkIns } = await supabase
    .from("check_ins")
    .select("*, owner:profiles(*)")
    .in("circle_id", circleIds)
    .eq("check_in_date", today)
    .eq("visibility", "circle");

  // Fetch next schedule item
  const { data: nextSchedule } = await supabase
    .from("schedule_items")
    .select("*, planning_card:planning_cards(*)")
    .eq("owner_id", user.id)
    .gte("schedule_date", today)
    .order("schedule_date", { ascending: true })
    .order("start_time", { ascending: true })
    .limit(1)
    .single();

  // Fetch active commitment
  const { data: commitment } = await supabase
    .from("commitments")
    .select("*, linked_cards:commitment_links(planning_card:planning_cards(*))")
    .eq("owner_id", user.id)
    .is("completed_at", null)
    .gte("due_on", today)
    .order("due_on", { ascending: true })
    .limit(1)
    .single();

  // Fetch today's focus total
  const { data: focusSessions } = await supabase
    .from("focus_sessions")
    .select("duration_seconds")
    .eq("owner_id", user.id)
    .gte("started_at", `${today}T00:00:00`)
    .lte("started_at", `${today}T23:59:59`);

  const totalFocusSeconds = focusSessions?.reduce(
    (acc, s) => acc + s.duration_seconds,
    0
  ) || 0;

  // Fetch recent nudges
  const { data: nudges } = await supabase
    .from("nudges")
    .select("*, sender:profiles(*)")
    .eq("recipient_id", user.id)
    .is("dismissed_at", null)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <TodayView
      user={user}
      report={report}
      checkIns={checkIns || []}
      nextSchedule={nextSchedule}
      commitment={commitment}
      totalFocusSeconds={totalFocusSeconds}
      nudges={nudges || []}
      circleIds={circleIds}
    />
  );
}
