"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { Circle, CircleInvite, CircleInvitationRequest, Profile } from "@/types";

interface InviteManagerProps {
  circle: Circle;
  invites: CircleInvite[];
  pendingInvitations: CircleInvitationRequest[];
}

export function InviteManager({
  circle,
  invites,
  pendingInvitations: _pendingInvitations,
}: InviteManagerProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [usernameSearch, setUsernameSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [searching, setSearching] = useState(false);

  async function handleCreateInvite() {
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Generate token
    const token = crypto.randomUUID();
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const tokenHash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry

    const { error: inviteError } = await supabase.from("circle_invites").insert({
      circle_id: circle.id,
      token_hash: tokenHash,
      created_by: user.id,
      expires_at: expiresAt.toISOString(),
      max_uses: 10,
    });

    if (inviteError) {
      setError("Gagal membuat invite. Coba lagi.");
    } else {
      // Show the raw token to user (only time it's visible)
      const inviteUrl = `${window.location.origin}/invite/${token}`;
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(inviteUrl);
    }

    setLoading(false);
    router.refresh();
  }

  async function handleRevokeInvite(inviteId: string) {
    if (!confirm("Cabut invite ini?")) return;

    const supabase = createClient();
    await supabase
      .from("circle_invites")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", inviteId);

    router.refresh();
  }

  async function handleSearchUsername() {
    if (!usernameSearch.trim()) return;

    setSearching(true);
    const supabase = createClient();

    // Search by exact username or prefix (limited)
    const { data } = await supabase
      .from("profiles")
      .select("id, username, display_name")
      .ilike("username", `${usernameSearch}%`)
      .limit(5);

    setSearchResults(data || []);
    setSearching(false);
  }

  async function handleInviteUser(userId: string) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase.from("circle_invitation_requests").insert({
      circle_id: circle.id,
      invited_user_id: userId,
      invited_by: user.id,
    });

    setUsernameSearch("");
    setSearchResults([]);
    router.refresh();
  }

  function copyToClipboard(text: string, id: string) {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
          {error}
        </div>
      )}

      {/* Create invite link */}
      <div className="rounded-card bg-paper p-4">
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          Buat Invite Link
        </h3>
        <p className="mb-4 text-sm text-ink/60">
          Link ini berlaku 7 hari dan bisa dipakai maksimal 10 kali.
        </p>
        <button
          onClick={handleCreateInvite}
          disabled={loading}
          className="focus-ring rounded-pill bg-ink px-4 py-2 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
        >
          {loading ? "Membuat..." : "Buat Link Baru"}
        </button>

        {copied && copied.startsWith("http") && (
          <div className="mt-4 rounded-input bg-moss/20 p-3">
            <p className="text-sm text-moss">
              Link tersalin ke clipboard! Bagikan ke temanmu.
            </p>
            <p className="mt-1 break-all font-mono text-xs text-ink/60">{copied}</p>
          </div>
        )}
      </div>

      {/* Active invites */}
      {invites.length > 0 && (
        <div className="rounded-card bg-paper p-4">
          <h3 className="mb-3 font-display text-lg font-semibold text-ink">
            Invite Aktif
          </h3>
          <div className="space-y-2">
            {invites.map((invite) => {
              const isExpired = new Date(invite.expires_at) < new Date();
              const isMaxed = invite.used_count >= invite.max_uses;

              return (
                <div
                  key={invite.id}
                  className={cn(
                    "flex items-center justify-between rounded-input p-3",
                    isExpired || isMaxed ? "bg-clay/20 opacity-60" : "bg-clay/20"
                  )}
                >
                  <div>
                    <p className="text-sm text-ink">
                      {invite.used_count}/{invite.max_uses} dipakai
                    </p>
                    <p className="text-xs text-ink/50">
                      Expires: {new Date(invite.expires_at).toLocaleDateString("id-ID")}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {!isExpired && !isMaxed && (
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `${window.location.origin}/invite/${invite.id}`,
                            invite.id
                          )
                        }
                        className="focus-ring rounded-pill border border-clay px-3 py-1 text-xs text-ink hover:bg-clay/30"
                      >
                        {copied === invite.id ? "Tersalin!" : "Salin"}
                      </button>
                    )}
                    <button
                      onClick={() => handleRevokeInvite(invite.id)}
                      className="focus-ring rounded-pill border border-coral px-3 py-1 text-xs text-coral hover:bg-coral/10"
                    >
                      Cabut
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Invite by username */}
      <div className="rounded-card bg-paper p-4">
        <h3 className="mb-3 font-display text-lg font-semibold text-ink">
          Invite via Username
        </h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={usernameSearch}
            onChange={(e) => setUsernameSearch(e.target.value)}
            placeholder="Cari username..."
            className="focus-ring flex-1 rounded-input border border-clay bg-paper px-4 py-2 text-ink placeholder:text-ink/40"
            onKeyDown={(e) => e.key === "Enter" && handleSearchUsername()}
          />
          <button
            onClick={handleSearchUsername}
            disabled={searching}
            className="focus-ring rounded-pill bg-ink px-4 py-2 text-paper hover:bg-ink/90 disabled:opacity-50"
          >
            {searching ? "..." : "Cari"}
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="mt-3 space-y-2">
            {searchResults.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-input bg-clay/20 p-3"
              >
                <div>
                  <p className="font-medium text-ink">{user.display_name}</p>
                  <p className="text-sm text-ink/60">@{user.username}</p>
                </div>
                <button
                  onClick={() => handleInviteUser(user.id)}
                  className="focus-ring rounded-pill bg-ink px-3 py-1 text-sm text-paper hover:bg-ink/90"
                >
                  Invite
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
