import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { InviteAccept } from "@/components/invite/invite-accept";

interface InvitePageProps {
  params: Promise<{ token: string }>;
}

export default async function InvitePage({ params }: InvitePageProps) {
  const { token } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/invite/${token}`)}`);
  }

  return <InviteAccept token={token} />;
}
