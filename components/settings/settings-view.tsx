"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Profile } from "@/types";
import type { User } from "@supabase/supabase-js";

interface SettingsViewProps {
  user: User;
  profile: Profile | null;
}

export function SettingsView({ user, profile }: SettingsViewProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleUpdateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        display_name: formData.get("display_name") as string,
        timezone: formData.get("timezone") as string,
      })
      .eq("id", user.id);

    if (updateError) {
      setError("Gagal menyimpan. Coba lagi.");
    } else {
      setSuccess(true);
      router.refresh();
    }

    setLoading(false);
  }

  async function handleExportData() {
    const supabase = createClient();

    // Fetch all user data
    const [reports, cards, sessions, commitments, checkIns] = await Promise.all([
      supabase.from("study_reports").select("*").eq("owner_id", user.id),
      supabase.from("planning_cards").select("*").eq("owner_id", user.id),
      supabase.from("focus_sessions").select("*").eq("owner_id", user.id),
      supabase.from("commitments").select("*").eq("owner_id", user.id),
      supabase.from("check_ins").select("*").eq("owner_id", user.id),
    ]);

    const data = {
      exported_at: new Date().toISOString(),
      profile,
      reports: reports.data,
      planning_cards: cards.data,
      focus_sessions: sessions.data,
      commitments: commitments.data,
      check_ins: checkIns.data,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ngambis-data-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteAccount() {
    const confirmation = prompt(
      "Ketik HAPUS untuk menghapus akun permanen:"
    );
    if (confirmation !== "HAPUS") return;

    // Note: In production, this should be handled by a server action
    // that properly cleans up all user data
    alert("Fitur hapus akun memerlukan konfirmasi admin. Silakan hubungi support.");
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-8 font-display text-2xl font-bold text-ink">
        Pengaturan
      </h1>

      {error && (
        <div className="mb-6 rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 rounded-input bg-moss/20 px-4 py-3 text-sm text-moss">
          Tersimpan!
        </div>
      )}

      {/* Profile settings */}
      <section className="mb-8 rounded-card bg-paper p-6">
        <h2 className="mb-4 font-display text-lg font-semibold text-ink">
          Profil
        </h2>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm text-ink/60">Email</label>
            <input
              type="email"
              value={user.email || ""}
              disabled
              className="w-full rounded-input border border-clay bg-clay/20 px-4 py-3 text-ink/60"
            />
            <p className="mt-1 text-xs text-ink/40">Email tidak bisa diubah</p>
          </div>

          <div>
            <label className="mb-2 block text-sm text-ink/60">Username</label>
            <input
              type="text"
              value={profile?.username || ""}
              disabled
              className="w-full rounded-input border border-clay bg-clay/20 px-4 py-3 text-ink/60"
            />
            <p className="mt-1 text-xs text-ink/40">Username tidak bisa diubah</p>
          </div>

          <div>
            <label htmlFor="display_name" className="mb-2 block text-sm text-ink/60">
              Nama tampilan
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              defaultValue={profile?.display_name || ""}
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink"
            />
          </div>

          <div>
            <label htmlFor="timezone" className="mb-2 block text-sm text-ink/60">
              Zona waktu
            </label>
            <select
              id="timezone"
              name="timezone"
              defaultValue={profile?.timezone || "Asia/Jakarta"}
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink"
            >
              <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
              <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
              <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring rounded-pill bg-ink px-6 py-2 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </section>

      {/* Data export */}
      <section className="mb-8 rounded-card bg-paper p-6">
        <h2 className="mb-2 font-display text-lg font-semibold text-ink">
          Data Kamu
        </h2>
        <p className="mb-4 text-sm text-ink/60">
          Download semua data kamu dalam format JSON.
        </p>
        <button
          onClick={handleExportData}
          className="focus-ring rounded-pill border border-clay px-4 py-2 text-ink transition-colors hover:bg-clay/20"
        >
          Export Data
        </button>
      </section>

      {/* Danger zone */}
      <section className="rounded-card border-2 border-coral/50 bg-coral/5 p-6">
        <h2 className="mb-2 font-display text-lg font-semibold text-coral">
          Hapus Akun
        </h2>
        <p className="mb-4 text-sm text-ink/60">
          Menghapus akun akan menghapus semua data kamu secara permanen. Tindakan
          ini tidak bisa dibatalkan.
        </p>
        <button
          onClick={handleDeleteAccount}
          className="focus-ring rounded-pill bg-coral px-4 py-2 font-medium text-paper transition-colors hover:bg-coral/90"
        >
          Hapus Akun
        </button>
      </section>
    </div>
  );
}
