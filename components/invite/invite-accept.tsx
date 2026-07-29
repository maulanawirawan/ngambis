"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { BookStar } from "@/components/illustrations/book-star";

interface InviteAcceptProps {
  token: string;
}

const INVITE_ERRORS: Record<string, string> = {
  authentication_required: "Sesi habis. Silakan masuk lagi.",
  invite_invalid: "Invite tidak valid.",
  invite_revoked: "Invite ini sudah dicabut.",
  invite_expired: "Invite ini sudah kedaluwarsa.",
  invite_exhausted: "Invite ini sudah mencapai batas penggunaan.",
};

export function InviteAccept({ token }: InviteAcceptProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAccept() {
    setLoading(true);
    setError(null);

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
          : "Belum bisa bergabung. Coba sekali lagi."
      );
      setLoading(false);
      return;
    }

    router.push("/circle");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-sm text-center">
        <BookStar className="mx-auto mb-6 h-16 w-16 text-coral" />
        <h1 className="font-display text-2xl font-bold text-ink">
          Undangan circle
        </h1>
        <p className="mt-2 text-ink/60">
          Terima undangan untuk bergabung dan mulai berbagi progres.
        </p>

        {error && (
          <div role="alert" className="mt-4 rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="focus-ring w-full rounded-pill bg-ink py-3 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {loading ? "Bergabung..." : "Terima Undangan"}
          </button>
          <Link
            href="/today"
            className="focus-ring block w-full rounded-pill border border-clay py-3 font-medium text-ink transition-colors hover:bg-clay/20"
          >
            Nanti saja
          </Link>
        </div>
      </div>
    </div>
  );
}
