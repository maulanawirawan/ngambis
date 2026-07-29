import { useRef, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, animate } from "motion/react";
import { cn } from "@/lib/utils/cn";
import { Sun, Kanban, CalendarClock, Archive, Users } from "lucide-react";

const ICONS = {
  book: Sun,
  flame: Kanban,
  moon: CalendarClock,
  receipt: Archive,
  orbit: Users,
} as const;

interface OrbitDockProps {
  items: readonly { href: string; label: string; icon: keyof typeof ICONS }[];
  activeIndex: number;
}

export function OrbitDock({ items, activeIndex }: OrbitDockProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [optimisticIndex, setOptimisticIndex] = useState(activeIndex);

  useEffect(() => {
    setOptimisticIndex(activeIndex);
  }, [activeIndex]);

  const handleTabClick = (index: number, href: string) => {
    setOptimisticIndex(index);
    router.push(href);
  };

  const handlePanEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -40 && optimisticIndex < items.length - 1) {
      const nextIdx = optimisticIndex + 1;
      setOptimisticIndex(nextIdx);
      router.push(items[nextIdx].href);
    } else if (info.offset.x > 40 && optimisticIndex > 0) {
      const prevIdx = optimisticIndex - 1;
      setOptimisticIndex(prevIdx);
      router.push(items[prevIdx].href);
    }
  };

  return (
    <>
      {/* Screen reader fallback */}
      <nav className="sr-only" aria-label="Navigasi utama">
        <ul>
          {items.map((item) => (
            <li key={item.href}>
              <Link href={item.href} prefetch={true}>{item.label}</Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Visual dock */}
      <div
        ref={containerRef}
        className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-3 md:pb-5 pointer-events-none"
        role="navigation"
        aria-label="Navigasi utama"
      >
        <motion.div
          className="relative pointer-events-auto touch-pan-x"
          onPanEnd={handlePanEnd}
        >
          {/* Active indicator */}
          <motion.div
            className="absolute -top-1.5 left-1/2 h-1 w-8 -translate-x-1/2 rounded-pill bg-coral shadow-xs"
            layoutId="active-indicator"
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />

          {/* Items */}
          <div className="relative flex items-end gap-1.5 p-1">
            {items.map((item, index) => {
              const Icon = ICONS[item.icon];
              const isActive = index === optimisticIndex;
              const distance = Math.abs(index - optimisticIndex);
              const scale = isActive ? 1.05 : Math.max(0.85, 1 - distance * 0.1);
              const opacity = isActive ? 1 : Math.max(0.6, 1 - distance * 0.15);
              const yOffset = isActive ? -6 : distance * 2;

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
                    stiffness: 400,
                    damping: 35,
                  }}
                >
                  <Link
                    href={item.href}
                    prefetch={true}
                    onClick={(e) => {
                      e.preventDefault();
                      handleTabClick(index, item.href);
                    }}
                    className={cn(
                      "focus-ring group flex flex-col items-center gap-1 rounded-2xl px-3.5 py-2.5 transition-all shadow-sm active:scale-95",
                      isActive
                        ? "bg-ink text-paper shadow-md"
                        : "bg-paper/90 text-ink/70 hover:bg-paper hover:text-ink backdrop-blur-md"
                    )}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-transform shrink-0",
                        isActive && "scale-110"
                      )}
                    />
                    <span
                      className={cn(
                        "text-[11px] font-semibold tracking-tight",
                        isActive ? "text-paper" : "text-ink/70"
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
          <div className="pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 text-[9px] font-medium tracking-wide text-ink/40">
            geser atau klik
          </div>
        </motion.div>
      </div>
    </>
  );
}
