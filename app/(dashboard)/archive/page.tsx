import { createClient } from "@/lib/supabase/server";
import { ArchiveView } from "@/components/archive/archive-view";

export default async function ArchivePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  // Get current month range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startDate = startOfMonth.toISOString().split("T")[0];
  const endDate = endOfMonth.toISOString().split("T")[0];

  // Fetch reports
  const { data: reports } = await supabase
    .from("study_reports")
    .select("*, owner:profiles(*), reactions:report_reactions(*), comments:report_comments(*)")
    .eq("owner_id", user.id)
    .gte("report_date", startDate)
    .lte("report_date", endDate)
    .order("report_date", { ascending: false });

  // Fetch completed cards
  const { data: completedCards } = await supabase
    .from("planning_cards")
    .select("*, stage:board_stages(name)")
    .eq("owner_id", user.id)
    .not("completed_at", "is", null)
    .gte("completed_at", startDate)
    .lte("completed_at", endDate)
    .order("completed_at", { ascending: false });

  // Fetch focus sessions
  const { data: focusSessions } = await supabase
    .from("focus_sessions")
    .select("*")
    .eq("owner_id", user.id)
    .gte("started_at", startDate)
    .lte("started_at", endDate)
    .order("started_at", { ascending: false });

  // Fetch commitments
  const { data: commitments } = await supabase
    .from("commitments")
    .select("*, linked_cards:commitment_links(planning_card:planning_cards(*))")
    .eq("owner_id", user.id)
    .gte("due_on", startDate)
    .lte("due_on", endDate);

  return (
    <ArchiveView
      user={user}
      reports={reports || []}
      completedCards={completedCards || []}
      focusSessions={focusSessions || []}
      commitments={commitments || []}
      currentMonth={now}
    />
  );
}
