"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils/cn";
import { BookStar } from "@/components/illustrations/book-star";
import type { Circle, Profile } from "@/types";
import type { User } from "@supabase/supabase-js";

interface HeaderProps {
  user: User;
  profile: Profile | null;
  circles: Circle[];
  activeCircle: Circle | null;
  onMenuClick: () => void;
}

export function Header({
  user,
  profile,
  circles,
  activeCircle,
  onMenuClick,
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-40 border-b border-clay/30 bg-canvas/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/today"
          className="focus-ring flex items-center gap-2 rounded-lg px-2 py-1"
        >
          <BookStar className="h-6 w-6 text-coral" />
          <span className="font-display text-lg font-bold text-ink">
            ngambis.
          </span>
        </Link>

        {/* Circle selector */}
        {activeCircle && (
          <div className="hidden items-center gap-2 md:flex">
            <span
              className={cn(
                "inline-block h-2 w-2 rounded-full",
                activeCircle.accent === "coral" && "bg-coral",
                activeCircle.accent === "moss" && "bg-moss",
                activeCircle.accent === "cobalt" && "bg-cobalt",
                activeCircle.accent === "butter" && "bg-butter",
                activeCircle.accent === "plum" && "bg-plum"
              )}
            />
            <span className="text-sm font-medium text-ink">
              {activeCircle.name}
            </span>
          </div>
        )}

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="focus-ring flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-clay/20"
            aria-expanded={isMenuOpen}
            aria-haspopup="true"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-sm font-medium text-paper">
              {profile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
            </div>
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-card border border-clay/30 bg-paper py-2 shadow-lg">
                <div className="border-b border-clay/20 px-4 py-2">
                  <p className="text-sm font-medium text-ink">
                    {profile?.display_name || "User"}
                  </p>
                  <p className="text-xs text-ink/60">@{profile?.username}</p>
                </div>
                <Link
                  href="/settings"
                  className="block px-4 py-2 text-sm text-ink transition-colors hover:bg-clay/10"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Pengaturan
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-coral transition-colors hover:bg-coral/10"
                >
                  Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
