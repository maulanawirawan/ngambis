import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/shell/app-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch user's circles
  const { data: memberships } = await supabase
    .from("circle_members")
    .select("circle_id, role, circles(*)")
    .eq("user_id", user.id)
    .eq("status", "active");

  const circles = (memberships?.map((m) => m.circles).filter(Boolean) || []) as unknown as import("@/types").Circle[];
  const activeCircle = circles[0] || null;

  return (
    <AppShell
      user={user}
      profile={profile}
      circles={circles}
      activeCircle={activeCircle}
    >
      {children}
    </AppShell>
  );
}
