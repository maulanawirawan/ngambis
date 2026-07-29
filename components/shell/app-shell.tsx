"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { OrbitDock } from "@/components/orbit-dock/orbit-dock";
import { Header } from "@/components/shell/header";
import { cn } from "@/lib/utils/cn";
import type { Circle, Profile } from "@/types";
import type { User } from "@supabase/supabase-js";

interface AppShellProps {
  user: User;
  profile: Profile | null;
  circles: Circle[];
  activeCircle: Circle | null;
  children: React.ReactNode;
}

const NAV_ITEMS = [
  { href: "/today", label: "Today", icon: "book" },
  { href: "/board", label: "Board", icon: "flame" },
  { href: "/rhythm", label: "Rhythm", icon: "moon" },
  { href: "/archive", label: "Archive", icon: "receipt" },
  { href: "/circle", label: "Circle", icon: "orbit" },
] as const;

export function AppShell({
  user,
  profile,
  circles,
  activeCircle,
  children,
}: AppShellProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    pathname.startsWith(item.href)
  );

  return (
    <div className="flex min-h-dvh flex-col bg-canvas">
      {/* Header */}
      <Header
        user={user}
        profile={profile}
        circles={circles}
        activeCircle={activeCircle}
        onMenuClick={() => setIsDrawerOpen(true)}
      />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto h-full max-w-7xl px-4 pb-44 pt-4 md:px-8 md:pb-36">
          {children}
        </div>
      </main>

      {/* Half-Orbit Dock */}
      <OrbitDock
        items={NAV_ITEMS}
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
      />
    </div>
  );
}
