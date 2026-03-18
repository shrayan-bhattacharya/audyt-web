import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Audyt.ai — AI Report Verification",
  description:
    "Catch AI hallucinations before they reach your clients. Upload source documents, paste the AI report — get claim-by-claim verdicts with exact citations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}

function Header() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1E3A5F]/50 bg-[#0A1628]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-white font-semibold tracking-tight text-lg select-none"
        >
          <HexIcon />
          <span>Audyt.ai</span>
        </Link>

        <div className="flex items-center gap-6">
          <nav className="hidden sm:flex items-center gap-6 text-sm text-[#7FA8C4]">
            <Link
              href="#how-it-works"
              className="hover:text-white transition-colors duration-150"
            >
              How it works
            </Link>
            <Link
              href="#use-cases"
              className="hover:text-white transition-colors duration-150"
            >
              Use cases
            </Link>
          </nav>
          <Link
            href="/audit"
            className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors duration-150"
          >
            Start auditing
          </Link>
        </div>
      </div>
    </header>
  );
}

function HexIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2L21.196 7V17L12 22L2.804 17V7L12 2Z"
        fill="#06B6D4"
        fillOpacity="0.9"
      />
      <path
        d="M12 6L17 9V15L12 18L7 15V9L12 6Z"
        fill="#0A1628"
      />
    </svg>
  );
}
