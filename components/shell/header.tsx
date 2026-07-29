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

import { Bell, Settings, LogOut, User as UserIcon } from "lucide-react";

export function Header({
  user,
  profile,
  circles: _circles,
  activeCircle,
  onMenuClick: _onMenuClick,
}: HeaderProps) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const initialLetter =
    profile?.display_name?.[0]?.toUpperCase() ||
    user.email?.[0]?.toUpperCase() ||
    "U";

  return (
    <header className="sticky top-0 z-40 border-b border-clay/30 bg-canvas/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href="/today"
          className="focus-ring flex items-center gap-2.5 rounded-xl px-2 py-1 transition-transform hover:scale-105"
        >
          <BookStar className="h-7 w-7 text-coral shrink-0" />
          <span className="font-display text-xl font-bold tracking-tight text-ink">
            ngambis.
          </span>
        </Link>

        {/* Circle selector badge */}
        {activeCircle && (
          <div className="hidden items-center gap-2 rounded-full border border-clay/40 bg-paper px-3 py-1 shadow-xs md:flex">
            <span
              className={cn(
                "inline-block h-2.5 w-2.5 rounded-full shrink-0",
                activeCircle.accent === "coral" && "bg-coral",
                activeCircle.accent === "moss" && "bg-moss",
                activeCircle.accent === "cobalt" && "bg-cobalt",
                activeCircle.accent === "butter" && "bg-butter",
                activeCircle.accent === "plum" && "bg-plum"
              )}
            />
            <span className="text-xs font-semibold text-ink">
              {activeCircle.name}
            </span>
          </div>
        )}

        {/* User area */}
        <div className="flex items-center gap-3">
          {/* User menu dropdown toggle */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="focus-ring flex items-center gap-2.5 rounded-full p-1 transition-colors hover:bg-clay/20"
              aria-expanded={isMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink font-display text-base font-bold text-paper shadow-sm ring-2 ring-clay/40">
                {initialLetter}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-xs font-semibold text-ink leading-tight">
                  {profile?.display_name || "User"}
                </p>
                <p className="text-[11px] text-ink/50 leading-tight">
                  @{profile?.username || "user"}
                </p>
              </div>
            </button>

            {isMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-2xl border border-clay/40 bg-paper p-2 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="border-b border-clay/20 px-3 py-2.5">
                    <p className="font-display font-semibold text-ink">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs text-ink/50 truncate">
                      {profile?.username ? `@${profile.username}` : user.email}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/settings"
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-ink transition-colors hover:bg-clay/20"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Settings className="h-4 w-4 text-ink/70" />
                      <span>Pengaturan</span>
                    </Link>

                    <button
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-sm text-coral transition-colors hover:bg-coral/10 font-medium"
                    >
                      <LogOut className="h-4 w-4 text-coral" />
                      <span>Keluar</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
