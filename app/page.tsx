import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <HowItWorks />
      <LiveExample />
      <TryIt />
      <Footer />
    </main>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="hero-grid min-h-screen pt-14 flex items-center">
      <div className="mx-auto max-w-5xl px-6 py-28 w-full">
        <div className="max-w-3xl">
          <h1 className="text-5xl lg:text-6xl font-bold text-white leading-[1.1] tracking-tight mb-6">
            Your AI reports are wrong{" "}
            <span className="text-[#06B6D4]">more than you think.</span>
          </h1>

          <p className="text-xl text-[#93B5CC] leading-relaxed mb-4 max-w-2xl">
            Audyt reads your source documents and checks every factual claim in
            your AI-generated report.
          </p>
          <p className="text-xl text-[#93B5CC] leading-relaxed mb-12 max-w-2xl">
            You get a precise audit showing what is right, what is wrong, and
            exactly where the source says otherwise.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-base transition-colors duration-150"
            >
              Run an audit
              <ArrowRight />
            </Link>
            <a
              href="#example"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#1E3A5F] text-[#93B5CC] hover:border-[#06B6D4]/50 hover:text-white font-semibold text-base transition-colors duration-150"
            >
              See an example
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── How It Works ──────────────────────────────────────────────────────────────

function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl mb-16">
          <h2 className="text-3xl font-bold text-[#0A1628] tracking-tight mb-4">
            How it works
          </h2>
          <p className="text-lg text-[#475569] leading-relaxed">
            When an AI writes a report, it does not flag uncertainty. It states
            numbers, cites trends, and draws conclusions with the same confident
            tone whether it is right or wrong. Audyt sits between your AI output
            and your audience.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <Step
            number="01"
            title="Upload your documents"
            description="Add the source files the AI report was based on. PDF, DOCX, XLSX, and TXT are all supported."
          />
          <Step
            number="02"
            title="Submit the report"
            description="Paste the AI-generated text or upload the file. Every factual claim is extracted and queued for verification."
          />
          <Step
            number="03"
            title="Review the verdicts"
            description="Each claim is marked correct, incorrect, or unverifiable, with the exact source passage cited."
          />
        </div>
      </div>
    </section>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center">
        <span className="text-sm font-bold text-[#06B6D4]">{number}</span>
      </div>
      <div>
        <h3 className="font-semibold text-[#0A1628] mb-2">{title}</h3>
        <p className="text-sm text-[#64748B] leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

// ── Live Example ──────────────────────────────────────────────────────────────

function LiveExample() {
  return (
    <section id="example" className="py-24 bg-[#0A1628]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="mb-12">
          <p className="text-xs font-semibold tracking-widest text-[#06B6D4] uppercase mb-3">
            From a real audit
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-3">
            An AI analyzed Dollar General FY2021 to FY2023 data.
          </h2>
          <p className="text-lg text-[#7FA8C4]">
            Here is what Audyt found in under 60 seconds.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <EvidenceCard
            title="New stores opened"
            claim="AI said 1,250"
            source="Source says 987"
            verdict="INCORRECT"
          />
          <EvidenceCard
            title="Total locations"
            claim="AI said 21,000"
            source="Source says 19,986"
            verdict="INCORRECT"
          />
          <EvidenceCard
            title="Same-store sales growth"
            claim="AI said +2.5%"
            source="Source says +0.2%"
            verdict="INCORRECT"
          />
        </div>

        <div className="pt-8 border-t border-[#1E3A5F]">
          <p className="text-[#7FA8C4]">
            9 out of 11 factual claims were wrong.{" "}
            <span className="text-[#EF4444] font-semibold">Trust score: 14.3%.</span>
          </p>
        </div>
      </div>
    </section>
  );
}

function EvidenceCard({
  title,
  claim,
  source,
  verdict,
}: {
  title: string;
  claim: string;
  source: string;
  verdict: string;
}) {
  return (
    <div className="rounded-xl border border-[#1E3A5F] bg-[#0F1F3C] p-6">
      <div className="flex items-start justify-between mb-4">
        <p className="text-xs font-semibold text-[#4A6580] uppercase tracking-wider">
          {title}
        </p>
        <span className="text-xs font-bold text-[#EF4444] bg-[#EF4444]/10 px-2 py-0.5 rounded">
          {verdict}
        </span>
      </div>
      <p className="text-sm text-[#7FA8C4] mb-2">{claim}</p>
      <p className="text-sm font-semibold text-[#EF4444]">{source}</p>
    </div>
  );
}

// ── Try It ────────────────────────────────────────────────────────────────────

function TryIt() {
  return (
    <section className="py-24 bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h2 className="text-2xl font-bold text-[#0A1628] tracking-tight mb-3">
              Try it on your own documents.
            </h2>
            <p className="text-[#475569] leading-relaxed">
              Upload your source files and paste the AI report. No account
              needed. Results in under a minute.
            </p>
          </div>
          <Link
            href="/audit"
            className="flex-shrink-0 inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-base transition-colors duration-150"
          >
            Run an audit
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0A1628] border-t border-[#1E3A5F]">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-start justify-between gap-10 mb-10">

          {/* Brand */}
          <div className="max-w-xs">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-white font-bold text-lg">Audyt</span>
              <span className="text-[#06B6D4] font-bold text-lg">.ai</span>
            </div>
            <p className="text-sm text-[#4A6580] leading-relaxed">
              Fact-check AI-generated reports against your source documents.
              Know what holds up before it leaves your desk.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-16">
            <div>
              <p className="text-xs font-semibold text-[#7FA8C4] uppercase tracking-widest mb-4">
                Product
              </p>
              <div className="space-y-3">
                <div>
                  <Link
                    href="/audit"
                    className="text-sm text-[#4A6580] hover:text-white transition-colors"
                  >
                    Run an audit
                  </Link>
                </div>
                <div>
                  <a
                    href="#example"
                    className="text-sm text-[#4A6580] hover:text-white transition-colors"
                  >
                    See an example
                  </a>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-[#7FA8C4] uppercase tracking-widest mb-4">
                Contact
              </p>
              <div className="space-y-3">
                <div>
                  <a
                    href="mailto:hello@audyt.ai"
                    className="text-sm text-[#4A6580] hover:text-white transition-colors"
                  >
                    hello@audyt.ai
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1E3A5F] flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#4A6580]">
            &copy; 2026 Audyt.ai. All rights reserved.
          </p>
          <p className="text-xs text-[#4A6580]">
            Independent. Not affiliated with any AI provider.
          </p>
        </div>
      </div>
    </footer>
  );
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function ArrowRight() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  );
}
