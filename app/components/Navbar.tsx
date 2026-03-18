import Link from "next/link";

export default function Navbar() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1E3A5F]/50 bg-[#0A1628]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 select-none">
          <HexIcon />
          <span className="text-white font-bold tracking-tight text-lg">Audyt</span>
          <span className="text-[#06B6D4] font-bold tracking-tight text-lg">.ai</span>
        </Link>

        <Link
          href="/audit"
          className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors"
        >
          Run an audit
        </Link>
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
