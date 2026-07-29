"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { BookStar } from "@/components/illustrations/book-star";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (!email) {
      setError("Masukkan email kamu ya.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/settings`,
    });

    if (resetError) {
      setError("Gagal mengirim email reset. Pastikan email terdaftar.");
    } else {
      setMessage("Link reset password telah dikirim ke email kamu!");
    }
    setLoading(false);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-sm">
        <div className="mb-13 text-center">
          <BookStar className="mx-auto mb-8 h-16 w-16 text-coral" />
          <h1 className="font-display text-4xl font-bold text-ink">ngambis.</h1>
          <p className="mt-5 text-ink/60">Lupa Password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
              {error}
            </div>
          )}
          {message && (
            <div className="rounded-input bg-moss/10 px-4 py-3 text-sm text-moss">
              {message}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              autoComplete="email"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
              placeholder="kamu@contoh.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full rounded-pill bg-ink py-3 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {loading ? "Mengirim..." : "Kirim Link Reset"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-ink/60">
          <Link href="/login" className="hover:text-coral focus-ring rounded font-medium text-coral">
            Kembali ke Login
          </Link>
        </div>
      </div>
    </div>
  );
}
