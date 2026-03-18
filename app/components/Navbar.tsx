"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getStoredToken, getMe, clearToken } from "@/lib/api";

export default function Navbar() {
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      setReady(true);
      return;
    }
    getMe(token)
      .then((e) => setEmail(e))
      .catch(() => clearToken())
      .finally(() => setReady(true));
  }, []);

  const signOut = () => {
    clearToken();
    window.location.href = "/";
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1E3A5F]/50 bg-[#0A1628]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 select-none"
        >
          <HexIcon />
          <span className="text-white font-bold tracking-tight text-lg">Audyt</span>
          <span className="text-[#06B6D4] font-bold tracking-tight text-lg">.ai</span>
        </Link>

        {ready && (
          <div className="flex items-center gap-4">
            {email ? (
              <>
                <span className="hidden sm:block text-sm text-[#7FA8C4]">{email}</span>
                <Link
                  href="/dashboard"
                  className="text-sm text-[#7FA8C4] hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-[#7FA8C4] hover:text-white transition-colors"
                >
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm text-[#7FA8C4] hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="#waitlist"
                  className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors"
                >
                  Get early access
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

function HexIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2L21.196 7V17L12 22L2.804 17V7L12 2Z" fill="#06B6D4" fillOpacity="0.9" />
      <path d="M12 6L17 9V15L12 18L7 15V9L12 6Z" fill="#0A1628" />
    </svg>
  );
}
