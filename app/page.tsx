import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <TrustBar />
      <UseCases />
      <Footer />
    </main>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero-grid min-h-screen pt-14 flex items-center">
      <div className="mx-auto max-w-6xl px-6 py-24 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E3A5F] bg-[#0F1F3C] text-[#06B6D4] text-xs font-medium mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06B6D4] animate-pulse" />
              Now in beta — free to use
            </div>

            <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
              Every claim,{" "}
              <span className="text-[#06B6D4]">verified.</span>
            </h1>

            <p className="text-lg text-[#93B5CC] leading-relaxed mb-10 max-w-xl">
              Upload your source documents, paste the AI-generated report — Audyt
              checks every factual claim and returns{" "}
              <span className="text-white font-medium">
                CORRECT / INCORRECT / UNVERIFIABLE
              </span>{" "}
              verdicts with exact citations to page, sheet, and row.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-base transition-colors duration-150"
              >
                Start auditing
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                  />
                </svg>
              </Link>
              <span className="text-sm text-[#4A6580]">
                No account required
              </span>
            </div>
          </div>

          {/* Right — audit results mockup */}
          <div className="hidden lg:block">
            <AuditMockup />
          </div>
        </div>
      </div>
    </section>
  );
}

function AuditMockup() {
  return (
    <div className="relative">
      {/* Glow */}
      <div className="absolute inset-0 bg-[#06B6D4]/5 rounded-2xl blur-3xl" />

      <div className="relative rounded-xl border border-[#1E3A5F] bg-[#0F1F3C] overflow-hidden shadow-2xl">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1E3A5F] bg-[#0A1628]">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]/60" />
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]/60" />
            <div className="w-3 h-3 rounded-full bg-[#10B981]/60" />
          </div>
          <span className="ml-2 text-xs text-[#4A6580] font-mono">
            Audit results: NovaTech_FY2023.pdf
          </span>
          <div className="ml-auto flex items-center gap-1.5 text-xs text-[#10B981]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
            Complete
          </div>
        </div>

        {/* Summary bar */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-b border-[#1E3A5F]/60 bg-[#0A1628]/50 text-xs">
          <span className="text-[#7FA8C4]">10 claims</span>
          <span className="text-[#1E3A5F]">·</span>
          <span className="text-[#10B981] font-medium">7 correct</span>
          <span className="text-[#1E3A5F]">·</span>
          <span className="text-[#EF4444] font-medium">2 incorrect</span>
          <span className="text-[#1E3A5F]">·</span>
          <span className="text-[#F59E0B] font-medium">1 unverifiable</span>
          <span className="ml-auto text-[#4A6580]">31s</span>
        </div>

        {/* Claims */}
        <div className="divide-y divide-[#1E3A5F]/40">
          <MockClaim
            verdict="CORRECT"
            confidence="HIGH"
            claim="Total revenue of $8.4B for fiscal year 2023"
            citation="annual_report.pdf, Page 3"
          />
          <MockClaim
            verdict="INCORRECT"
            confidence="MEDIUM"
            claim='Operated 412 data centers across 28 countries'
            citation="annual_report.pdf, Page 8"
            sourceSays="342 data centers"
          />
          <MockClaim
            verdict="CORRECT"
            confidence="MEDIUM"
            claim="Cloud division generated $3.9B, up 31% YoY"
            citation="annual_report.pdf, Page 12"
          />
          <MockClaim
            verdict="UNVERIFIABLE"
            confidence="NONE"
            claim="CEO announced expansion into Canada by 2025"
            citation={null}
          />
        </div>
      </div>
    </div>
  );
}

function MockClaim({
  verdict,
  confidence,
  claim,
  citation,
  sourceSays,
}: {
  verdict: "CORRECT" | "INCORRECT" | "UNVERIFIABLE";
  confidence: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  claim: string;
  citation: string | null;
  sourceSays?: string;
}) {
  const config = {
    CORRECT: {
      icon: "✓",
      bg: "bg-[#10B981]/10",
      text: "text-[#10B981]",
      border: "border-[#10B981]/20",
    },
    INCORRECT: {
      icon: "✗",
      bg: "bg-[#EF4444]/10",
      text: "text-[#EF4444]",
      border: "border-[#EF4444]/20",
    },
    UNVERIFIABLE: {
      icon: "?",
      bg: "bg-[#F59E0B]/10",
      text: "text-[#F59E0B]",
      border: "border-[#F59E0B]/20",
    },
  }[verdict];

  const confColor = {
    HIGH: "text-[#10B981]",
    MEDIUM: "text-[#7FA8C4]",
    LOW: "text-[#4A6580]",
    NONE: "text-[#4A6580]",
  }[confidence];

  return (
    <div className="px-4 py-3">
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 ${config.bg} ${config.text}`}
        >
          {config.icon}
        </span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-semibold ${config.text}`}>
              {verdict}
            </span>
            {confidence !== "NONE" && (
              <span className={`text-xs ${confColor}`}>· {confidence}</span>
            )}
          </div>
          <p className="text-sm text-[#CBD5E1] leading-snug">{claim}</p>
          {sourceSays && (
            <p className="text-xs text-[#EF4444]/80 mt-1">
              Source says: {sourceSays}
            </p>
          )}
          {citation ? (
            <p className="text-xs text-[#4A6580] mt-1">→ {citation}</p>
          ) : (
            <p className="text-xs text-[#4A6580] mt-1">
              → No supporting source found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Upload your source documents",
      description:
        "Drop in PDFs, Excel spreadsheets, Word docs, or plain text files — the ground-truth sources your AI report was based on.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
    {
      number: "02",
      title: "Paste or upload the AI report",
      description:
        "Copy in the AI-generated text, or upload the document directly. Audyt extracts every verifiable factual claim automatically.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
          />
        </svg>
      ),
    },
    {
      number: "03",
      title: "Get verdicts with exact citations",
      description:
        "Every claim comes back CORRECT, INCORRECT, or UNVERIFIABLE — with the exact source quoted and a citation to the specific page, sheet, or row.",
      icon: (
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section id="how-it-works" className="py-28 bg-white">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-[#4A6580] text-lg max-w-xl mx-auto">
            Three steps from document to verified results.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-[#06B6D4]/30 to-transparent" />

          {steps.map((step, i) => (
            <div key={i} className="relative flex flex-col items-center text-center">
              {/* Step number + icon */}
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#06B6D4]">
                  {step.icon}
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-[#0A1628] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-[#0A1628] mb-3">
                {step.title}
              </h3>
              <p className="text-[#4A6580] text-sm leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Trust Bar ─────────────────────────────────────────────────────────────────

function TrustBar() {
  const stats = [
    {
      value: "94%",
      label: "Verdict accuracy",
      sub: "on financial report benchmarks",
    },
    {
      value: "<40s",
      label: "Per audit",
      sub: "for a 10-claim report end-to-end",
    },
    {
      value: "4",
      label: "Source formats",
      sub: "PDF, Excel, Word, plain text",
    },
    {
      value: "Exact",
      label: "Citations",
      sub: "page number, sheet name, row number",
    },
  ];

  return (
    <section className="py-20 bg-[#0A1628] border-y border-[#1E3A5F]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[#1E3A5F]">
          {stats.map((s, i) => (
            <div key={i} className="text-center lg:px-8">
              <div className="text-4xl font-bold text-[#06B6D4] mb-1">
                {s.value}
              </div>
              <div className="text-white font-semibold text-sm mb-1">
                {s.label}
              </div>
              <div className="text-[#4A6580] text-xs leading-relaxed">
                {s.sub}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Use Cases ─────────────────────────────────────────────────────────────────

function UseCases() {
  const cases = [
    {
      icon: "📊",
      title: "Consulting & advisory firms",
      description:
        "Verify AI-assisted client deliverables before they go out the door. Catch wrong numbers and fabricated citations before they erode trust.",
    },
    {
      icon: "⚖️",
      title: "Compliance & legal teams",
      description:
        "Audit AI-generated regulatory filings and compliance documents. Know exactly which claims are supported and which aren't.",
    },
    {
      icon: "🤖",
      title: "AI product teams",
      description:
        "Benchmark your model's factual accuracy against ground-truth documents. Use the results to fine-tune prompts and RAG pipelines.",
    },
    {
      icon: "✍️",
      title: "Research & content teams",
      description:
        "Verify AI-written articles and research summaries against primary sources. Ship confident, credible content — every time.",
    },
  ];

  return (
    <section id="use-cases" className="py-28 bg-[#F8FAFC]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-[#0A1628] tracking-tight mb-4">
            Built for teams that can&apos;t afford mistakes
          </h2>
          <p className="text-[#4A6580] text-lg max-w-xl mx-auto">
            Wherever AI-generated content gets reviewed against real sources,
            Audyt makes the verification rigorous and reproducible.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {cases.map((c, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-[#E2E8F0] p-6 hover:border-[#06B6D4]/40 hover:shadow-sm transition-all duration-200"
            >
              <div className="text-3xl mb-4">{c.icon}</div>
              <h3 className="font-semibold text-[#0A1628] mb-3 leading-snug">
                {c.title}
              </h3>
              <p className="text-sm text-[#64748B] leading-relaxed">
                {c.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="py-12 bg-[#0A1628] border-t border-[#1E3A5F]">
      <div className="mx-auto max-w-6xl px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-white font-semibold">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L21.196 7V17L12 22L2.804 17V7L12 2Z"
              fill="#06B6D4"
              fillOpacity="0.9"
            />
          </svg>
          <span>Audyt.ai</span>
          <span className="text-[#4A6580] font-normal ml-1">
            © 2026
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-[#4A6580]">
          <span>Built by Shrayan Bhattacharya</span>
          <a
            href="https://github.com/shrayan-bhattacharya/-verifyai-detector"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
