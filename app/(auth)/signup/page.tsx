"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { signUpSchema, type SignUpInput } from "@/lib/validation/auth";
import { BookStar } from "@/components/illustrations/book-star";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const rawData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      username: formData.get("username") as string,
      display_name: formData.get("display_name") as string,
    };

    const result = signUpSchema.safeParse(rawData);
    if (!result.success) {
      setError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    const supabase = createClient();

    // Check username availability
    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", result.data.username)
      .single();

    if (existingUser) {
      setError("Username sudah dipakai. Coba yang lain ya.");
      setLoading(false);
      return;
    }

    const { data: signUpData, error: authError } = await supabase.auth.signUp({
      email: result.data.email,
      password: result.data.password,
      options: {
        data: {
          username: result.data.username,
          display_name: result.data.display_name,
        },
      },
    });

    if (authError) {
      setError(authError.message || "Gagal membuat akun. Coba lagi ya.");
      setLoading(false);
      return;
    }

    if (signUpData?.user && !signUpData?.session) {
      setError(null);
      setRegisteredEmail(result.data.email);
      setShowSuccessModal(true);
      setLoading(false);
      return;
    }

    router.push("/today");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-dvh items-center justify-center bg-canvas p-8">
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
            <label htmlFor="display_name" className="mb-2 block text-sm font-medium text-ink">
              Nama
            </label>
            <input
              id="display_name"
              name="display_name"
              type="text"
              required
              autoComplete="name"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
              placeholder="Nama kamu"
            />
          </div>

          <div>
            <label htmlFor="username" className="mb-2 block text-sm font-medium text-ink">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              required
              autoComplete="username"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
              placeholder="username_unik"
            />
            <p className="mt-1 text-xs text-ink/50">Huruf kecil, angka, dan underscore saja.</p>
          </div>

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
                autoComplete="new-password"
                className="focus-ring w-full rounded-input border border-clay bg-paper py-3 pl-4 pr-12 text-ink placeholder:text-ink/40"
                placeholder="Minimal 8 karakter"
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
            {loading ? "Tunggu sebentar..." : "Buat Akun"}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-ink/60">
          <span>Sudah punya akun?</span>
          <Link href="/login" className="ml-1 hover:text-coral focus-ring rounded font-medium text-coral">
            Masuk di sini
          </Link>
        </div>
      </div>

      {/* Custom Aesthetic Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl border border-clay/50 bg-paper p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-moss/20 text-moss">
              <BookStar className="h-8 w-8 text-moss" />
            </div>
            <h3 className="text-center font-display text-2xl font-bold text-ink">
              Akun Berhasil Dibuat! 🎉
            </h3>
            <p className="mt-3 text-center text-sm leading-relaxed text-ink/70">
              Silakan cek email <span className="font-semibold text-ink">{registeredEmail}</span> untuk mengonfirmasi pendaftaran akun kamu, atau langsung masuk jika konfirmasi sudah selesai.
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push("/login")}
                className="focus-ring w-full rounded-pill bg-ink py-3 font-medium text-paper transition-all hover:bg-ink/90 shadow-md"
              >
                Mengerti, Lanjut ke Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
