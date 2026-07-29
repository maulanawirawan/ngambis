"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import { motion, useMotionValue, useTransform, animate } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { BookStar } from "@/components/illustrations/book-star";
import { FlameStreak } from "@/components/illustrations/flame-streak";
import { MoonFocus } from "@/components/illustrations/moon-focus";
import { ReportReceipt } from "@/components/illustrations/report-receipt";
import { OrbitPeople } from "@/components/illustrations/orbit-people";

const ICONS = {
  book: BookStar,
  flame: FlameStreak,
  moon: MoonFocus,
  receipt: ReportReceipt,
  orbit: OrbitPeople,
} as const;

interface OrbitDockProps {
  items: readonly { href: string; label: string; icon: keyof typeof ICONS }[];
  activeIndex: number;
}

export function OrbitDock({ items, activeIndex }: OrbitDockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const [dragStart, setDragStart] = useState(0);

  const handleDragStart = useCallback(() => {
    setIsDragging(true);
    setDragStart(x.get());
  }, [x]);

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    const currentX = x.get();
    const itemWidth = 80;
    const targetIndex = Math.round(-currentX / itemWidth);
    const clampedIndex = Math.max(0, Math.min(items.length - 1, targetIndex));
    
    animate(x, -clampedIndex * itemWidth, {
      type: "spring",
      stiffness: 300,
      damping: 30,
    });
  }, [x, items.length]);

  const activeItem = items[activeIndex];

  return (
    <>
      {/* Screen reader fallback */}
      <nav className="sr-only" aria-label="Navigasi utama">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Visual dock */}
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-4 md:pb-6"
        role="navigation"
        aria-label="Navigasi utama"
      >
        <div className="relative">
          {/* Orbit arc background */}
          <div className="absolute -top-8 left-1/2 h-32 w-64 -translate-x-1/2 overflow-hidden">
            <div className="absolute bottom-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full border-2 border-clay/20" />
          </div>

          {/* Active indicator */}
          <motion.div
            className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-pill bg-coral"
            layoutId="active-indicator"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />

          {/* Items */}
          <div className="relative flex items-end gap-1">
            {items.map((item, index) => {
              const Icon = ICONS[item.icon];
              const isActive = index === activeIndex;
              const distance = Math.abs(index - activeIndex);
              const scale = isActive ? 1 : Math.max(0.7, 1 - distance * 0.15);
              const opacity = isActive ? 1 : Math.max(0.4, 1 - distance * 0.2);
              const yOffset = isActive ? -8 : distance * 4;

              return (
                <motion.div
                  key={item.href}
                  initial={false}
                  animate={{
                    scale,
                    opacity,
                    y: yOffset,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "focus-ring group flex flex-col items-center gap-1 rounded-card p-3 transition-colors",
                      isActive
                        ? "bg-ink text-paper"
                        : "bg-paper/60 text-ink/60 hover:bg-paper hover:text-ink"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-transform",
                        isActive && "scale-110"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium",
                        isActive ? "text-paper" : "text-ink/60"
                      )}
                    >
                      {item.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Drag hint */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[10px] text-ink/30">
            geser atau klik
          </div>
        </div>
      </div>
    </>
  );
}
