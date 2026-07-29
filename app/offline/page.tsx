"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (isOnline) {
    window.location.href = "/";
    return null;
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas p-8">
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-clay/30">
          <svg
            className="h-8 w-8 text-ink/60"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>
        <h1 className="font-display text-2xl font-bold text-ink">
          Kamu sedang offline
        </h1>
        <p className="mt-2 text-ink/60">
          Cek koneksi internetmu dan coba lagi.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-pill bg-ink px-6 py-3 font-medium text-paper transition-colors hover:bg-ink/90"
        >
          Coba Lagi
        </Link>
      </div>
    </div>
  );
}
