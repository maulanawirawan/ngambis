import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { BookStar } from "@/components/illustrations/book-star";

export default async function HomePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/today");
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-canvas p-8">
      <div className="max-w-md text-center">
        <BookStar className="mx-auto mb-8 h-20 w-20 text-coral" />

        <h1 className="font-display text-5xl font-bold text-ink">ngambis.</h1>
        <p className="mt-4 text-xl text-ink/60">Santai, tapi serius.</p>

        <p className="mt-8 text-ink/70">
          Private accountability dan planning workspace untuk kamu dan circle-mu.
          Report progres harian, atur jadwal, dan saling dukung tanpa tekanan.
        </p>

        <div className="mt-10 space-y-3">
          <Link
            href="/signup"
            className="focus-ring block w-full rounded-pill bg-ink py-4 font-medium text-paper transition-colors hover:bg-ink/90"
          >
            Mulai Sekarang
          </Link>
          <Link
            href="/login"
            className="focus-ring block w-full rounded-pill border border-clay py-4 font-medium text-ink transition-colors hover:bg-clay/20"
          >
            Sudah Punya Akun
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-4 text-sm text-ink/50">
          <div>
            <p className="font-medium text-ink">Private</p>
            <p>Kontrol penuh privasi</p>
          </div>
          <div>
            <p className="font-medium text-ink">Circle</p>
            <p>Akuntabilitas bersama</p>
          </div>
          <div>
            <p className="font-medium text-ink">Fokus</p>
            <p>Timer yang akurat</p>
          </div>
        </div>
      </div>
    </div>
  );
}
