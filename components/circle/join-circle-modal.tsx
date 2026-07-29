"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Link2 } from "lucide-react";

interface JoinCircleModalProps {
  onClose: () => void;
}

const INVITE_ERRORS: Record<string, string> = {
  authentication_required: "Sesi habis. Silakan masuk lagi.",
  invite_invalid: "Link atau Kode Invite tidak valid.",
  invite_revoked: "Invite ini sudah dicabut.",
  invite_expired: "Invite ini sudah kedaluwarsa.",
  invite_exhausted: "Invite ini sudah mencapai batas penggunaan.",
};

export function JoinCircleModal({ onClose }: JoinCircleModalProps) {
  const router = useRouter();
  const [inviteInput, setInviteInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!inviteInput.trim()) return;

    setLoading(true);
    setError(null);

    // Extract token from full URL or direct token string
    const raw = inviteInput.trim();
    let token = raw;
    if (raw.includes("/invite/")) {
      token = raw.split("/invite/").pop()?.split("?")[0] || raw;
    }

    const supabase = createClient();
    const { error: consumeError } = await supabase.rpc("consume_circle_invite", {
      p_token: token,
    });

    if (consumeError) {
      const matchedCode = Object.keys(INVITE_ERRORS).find((code) =>
        consumeError.message.includes(code)
      );
      setError(
        matchedCode
          ? INVITE_ERRORS[matchedCode]
          : consumeError.message || "Gagal bergabung ke circle. Coba periksa kembali link invite kamu."
      );
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
    setTimeout(() => {
      router.refresh();
      onClose();
    }, 1500);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-2xl border border-clay/40 bg-paper p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-coral/20 text-coral">
              <Link2 className="h-5 w-5 shrink-0" />
            </div>
            <h2 className="font-display text-xl font-bold text-ink">
              Gabung via Link Invite
            </h2>
          </div>
          <button
            onClick={onClose}
            className="focus-ring rounded-full p-2 text-ink/40 transition-colors hover:bg-clay/20 hover:text-ink"
            aria-label="Tutup"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {success ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-moss/20 text-moss">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-lg font-bold text-ink">Berhasil Bergabung! 🎉</h3>
            <p className="mt-1 text-sm text-ink/60">Mengarahkan ke circle kamu...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="invite-input" className="mb-2 block text-sm font-medium text-ink">
                Link / Kode Invite *
              </label>
              <input
                id="invite-input"
                type="text"
                value={inviteInput}
                onChange={(e) => setInviteInput(e.target.value)}
                required
                placeholder="Contoh: https://ngambis.vercel.app/invite/abc123"
                className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
              />
              <p className="mt-1.5 text-xs text-ink/50">
                Tempel link atau kode unik undangan circle dari temanmu.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="focus-ring flex-1 rounded-pill border border-clay py-3 font-medium text-ink transition-colors hover:bg-clay/20"
              >
                Batal
              </button>
              <button
                type="submit"
                disabled={loading}
                className="focus-ring flex-1 rounded-pill bg-ink py-3 font-medium text-paper transition-all hover:bg-ink/90 disabled:opacity-50"
              >
                {loading ? "Bergabung..." : "Gabung Circle"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
