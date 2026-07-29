"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signInSchema, type SignInInput } from "@/lib/validation/auth";
import { BookStar } from "@/components/illustrations/book-star";

import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    const result = signInSchema.safeParse(rawData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email: result.data.email,
      password: result.data.password,
    });

    if (authError) {
      setError(authError.message || "Email atau password salah. Coba lagi ya.");
      setLoading(false);
      return;
    }

    router.push("/today");
    router.refresh();
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas p-8">
      <div className="w-full max-w-sm">
        <div className="mb-13 text-center">
          <BookStar className="mx-auto mb-8 h-16 w-16 text-coral" />
          <h1 className="font-display text-4xl font-bold text-ink">ngambis.</h1>
          <p className="mt-5 text-ink/60">Santai, tapi serius.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
              placeholder="kamu@contoh.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-ink">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                className="focus-ring w-full rounded-input border border-clay bg-paper py-3 pl-4 pr-12 text-ink placeholder:text-ink/40"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 flex h-9 w-9 items-center justify-center rounded-full text-ink/60 transition-colors hover:bg-clay/20 hover:text-ink focus:outline-none"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5 shrink-0" />
                ) : (
                  <Eye className="h-5 w-5 shrink-0" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="focus-ring w-full rounded-pill bg-ink py-3 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
          >
            {loading ? "Tunggu sebentar..." : "Masuk"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-ink/60">
          <Link href="/forgot-password" className="hover:text-coral focus-ring rounded">
            Lupa password?
          </Link>
          <span className="mx-2">·</span>
          <Link href="/signup" className="hover:text-coral focus-ring rounded">
            Belum punya akun
          </Link>
        </div>
      </div>
    </div>
  );
}
