"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import type { Accent } from "@/types";

interface CreateCircleFormProps {
  onClose: () => void;
}

const ACCENTS: { value: Accent; label: string; class: string }[] = [
  { value: "coral", label: "Coral", class: "bg-coral" },
  { value: "moss", label: "Moss", class: "bg-moss" },
  { value: "cobalt", label: "Cobalt", class: "bg-cobalt" },
  { value: "butter", label: "Butter", class: "bg-butter" },
  { value: "plum", label: "Plum", class: "bg-plum" },
];

export function CreateCircleForm({ onClose }: CreateCircleFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accent, setAccent] = useState<Accent>("coral");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Sesi habis. Silakan masuk lagi.");
      setLoading(false);
      return;
    }

    // Ensure profile row exists for current user
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!existingProfile) {
      await supabase.from("profiles").upsert({
        id: user.id,
        username: user.user_metadata?.username || `user_${user.id.slice(0, 8)}`,
        display_name: user.user_metadata?.display_name || "User",
      });
    }

    // Generate slug
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    // Create circle
    const { data: circle, error: createError } = await supabase
      .from("circles")
      .insert({
        name,
        slug: `${slug}-${Date.now().toString(36)}`,
        accent,
        created_by: user.id,
      })
      .select()
      .single();

    if (createError) {
      setError(createError.message || "Gagal membuat circle. Coba lagi.");
      setLoading(false);
      return;
    }

    // Add creator as owner
    const { error: memberError } = await supabase.from("circle_members").insert({
      circle_id: circle.id,
      user_id: user.id,
      role: "owner",
      status: "active",
    });

    if (memberError) {
      setError(memberError.message || "Gagal menambahkan member.");
      setLoading(false);
      return;
    }

    router.refresh();
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/60 p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-hero bg-paper p-6">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-ink">
            Circle Baru
          </h2>
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

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="rounded-input bg-coral/10 px-4 py-3 text-sm text-coral">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">
              Nama Circle *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Contoh: Tim Belajar, Project X"
              className="focus-ring w-full rounded-input border border-clay bg-paper px-4 py-3 text-ink placeholder:text-ink/40"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-ink">
              Pilih accent
            </label>
            <div className="flex gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.value}
                  type="button"
                  onClick={() => setAccent(a.value)}
                  className={cn(
                    "focus-ring h-10 w-10 rounded-full transition-all",
                    a.class,
                    accent === a.value
                      ? "ring-2 ring-ink ring-offset-2 ring-offset-paper"
                      : "opacity-60 hover:opacity-100"
                  )}
                  aria-label={a.label}
                  aria-pressed={accent === a.value}
                />
              ))}
            </div>
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
              className="focus-ring flex-1 rounded-pill bg-ink py-3 font-medium text-paper transition-colors hover:bg-ink/90 disabled:opacity-50"
            >
              {loading ? "Membuat..." : "Buat Circle"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
