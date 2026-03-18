import Link from "next/link";

export default function LandingPage() {
  return (
    <main>
      <Hero />
      <TrustBar />
      <ProblemSection />
      <RealCatches />
      <WaitlistSection />
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

          <p className="text-xl text-[#93B5CC] leading-relaxed mb-10 max-w-2xl">
            Audyt reads your source documents and checks every claim in your
            AI-generated report. You get a precise audit showing what is right,
            what is wrong, and exactly where the source says otherwise.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-16">
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-base transition-colors duration-150"
            >
              Run an audit
              <ArrowRight />
            </Link>
            <a
              href="#demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#1E3A5F] text-[#93B5CC] hover:border-[#06B6D4]/50 hover:text-white font-semibold text-base transition-colors duration-150"
            >
              See it in action
            </a>
          </div>

          <div className="grid grid-cols-3 gap-8 max-w-lg">
            <div>
              <div className="text-4xl font-bold text-white tracking-tight">94%</div>
              <div className="text-sm text-[#4A6580] mt-1">verdict accuracy</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white tracking-tight">31s</div>
              <div className="text-sm text-[#4A6580] mt-1">average audit time</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-white tracking-tight">Zero</div>
              <div className="text-sm text-[#4A6580] mt-1">hallucinations slipped through</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Trust Bar ─────────────────────────────────────────────────────────────────

function TrustBar() {
  const sectors = [
    { icon: <ConsultingIcon />, label: "Management Consulting" },
    { icon: <FinanceIcon />, label: "Financial Services" },
    { icon: <LegalIcon />, label: "Legal" },
    { icon: <HealthIcon />, label: "Healthcare" },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-center text-lg font-semibold text-[#0A1628] mb-12">
          Built for work where being wrong has consequences.
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {sectors.map((s) => (
            <div key={s.label} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#06B6D4]">
                {s.icon}
              </div>
              <span className="text-sm font-medium text-[#0A1628] text-center">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Problem Section ───────────────────────────────────────────────────────────

function ProblemSection() {
  return (
    <section id="demo" className="py-28 bg-[#F8FAFC]">
      <div className="mx-auto max-w-5xl px-6">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold tracking-widest text-[#06B6D4] uppercase mb-4">
            Why it exists
          </p>
          <h2 className="text-4xl font-bold text-[#0A1628] tracking-tight leading-tight mb-8">
            AI models hallucinate. Most teams find out too late.
          </h2>

          <p className="text-lg text-[#4A6580] leading-relaxed mb-6">
            When an AI writes a report, it does not flag uncertainty. It states
            numbers, cites trends, and draws conclusions with the same confident
            tone, whether it is right or wrong. By the time someone catches an
            error, it is already in a client deck.
          </p>
          <p className="text-lg text-[#4A6580] leading-relaxed mb-16">
            Audyt sits between your AI output and your audience. Every factual
            claim gets checked against your actual source files. Before it leaves
            your desk, you know exactly what holds up and what does not.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-0 max-w-2xl">
          <StepBox
            number="01"
            label="Upload"
            description="Source documents and AI report"
            isLast={false}
          />
          <StepBox
            number="02"
            label="Verify"
            description="Every claim checked against sources"
            isLast={false}
          />
          <StepBox
            number="03"
            label="Report"
            description="Verdicts with exact citations"
            isLast={true}
          />
        </div>
      </div>
    </section>
  );
}

function StepBox({
  number,
  label,
  description,
  isLast,
}: {
  number: string;
  label: string;
  description: string;
  isLast: boolean;
}) {
  return (
    <div className="relative flex items-start gap-4 p-6 bg-white border border-[#E2E8F0] first:rounded-l-xl last:rounded-r-xl">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#06B6D4]/10 border border-[#06B6D4]/30 flex items-center justify-center">
        <span className="text-xs font-bold text-[#06B6D4]">{number}</span>
      </div>
      <div>
        <div className="font-semibold text-[#0A1628] text-sm mb-1">{label}</div>
        <div className="text-xs text-[#64748B]">{description}</div>
      </div>
      {!isLast && (
        <div className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10 w-6 h-6 rounded-full bg-white border border-[#E2E8F0] items-center justify-center">
          <svg className="w-3 h-3 text-[#06B6D4]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        </div>
      )}
    </div>
  );
}

// ── Real Catches Section ──────────────────────────────────────────────────────

function RealCatches() {
  return (
    <section className="py-28 bg-[#0A1628]">
      <div className="mx-auto max-w-5xl px-6">
        <p className="text-xs font-semibold tracking-widest text-[#06B6D4] uppercase mb-4">
          From a real audit
        </p>
        <h2 className="text-4xl font-bold text-white tracking-tight leading-tight mb-3">
          This is what we found in 31 seconds.
        </h2>
        <p className="text-lg text-[#7FA8C4] mb-12">
          An AI agent analyzed Dollar General FY2021 to FY2023 data. Here is what it got wrong.
        </p>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          <EvidenceCard
            title="New stores opened"
            aiSaid="AI said 1,250"
            sourceSaid="Source said 987"
          />
          <EvidenceCard
            title="Total locations"
            aiSaid="AI said 21,000"
            sourceSaid="Source said 19,986"
          />
          <EvidenceCard
            title="Same-store sales growth"
            aiSaid="AI said +2.5%"
            sourceSaid="Source said +0.2%"
          />
        </div>

        <p className="text-center text-[#7FA8C4] text-base">
          9 out of 11 factual claims were wrong. Trust score: 14.3%.
        </p>
      </div>
    </section>
  );
}

function EvidenceCard({
  title,
  aiSaid,
  sourceSaid,
}: {
  title: string;
  aiSaid: string;
  sourceSaid: string;
}) {
  return (
    <div className="rounded-xl border border-[#1E3A5F] bg-[#0F1F3C] p-6">
      <p className="text-xs font-semibold text-[#4A6580] uppercase tracking-wider mb-4">{title}</p>
      <p className="text-sm text-[#7FA8C4] mb-2">{aiSaid}</p>
      <p className="text-sm font-semibold text-[#EF4444]">{sourceSaid}</p>
    </div>
  );
}

// ── Waitlist Section ──────────────────────────────────────────────────────────

function WaitlistSection() {
  return (
    <section id="waitlist" className="py-28 bg-white">
      <div className="mx-auto max-w-2xl px-6 text-center">
        <h2 className="text-4xl font-bold text-[#0A1628] tracking-tight mb-4">
          We are in early access.
        </h2>
        <p className="text-lg text-[#4A6580] leading-relaxed mb-12">
          A free tier is coming. Five audits a month, no credit card required.
          Leave your email and we will reach out when it is ready.
        </p>
        <iframe
          src="TALLY_EMBED_URL"
          width="100%"
          height="180"
          style={{ border: "none", background: "transparent" }}
          title="Early access waitlist"
        />
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-[#0A1628] border-t border-[#1E3A5F]">
      <div className="mx-auto max-w-5xl px-6 py-16">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          <div className="md:col-span-1">
            <div className="flex items-center gap-1.5 mb-3">
              <span className="text-white font-bold text-lg">Audyt</span>
              <span className="text-[#06B6D4] font-bold text-lg">.ai</span>
            </div>
            <p className="text-sm text-[#4A6580] mb-2">Verify AI output. Protect your work.</p>
            <p className="text-sm text-[#4A6580]">2026 Audyt.ai</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#7FA8C4] uppercase tracking-widest mb-4">Product</p>
            <div className="space-y-3">
              <div><Link href="/audit" className="text-sm text-[#4A6580] hover:text-white transition-colors">Try the beta</Link></div>
              <div><Link href="/dashboard" className="text-sm text-[#4A6580] hover:text-white transition-colors">Dashboard</Link></div>
              <div><a href="#waitlist" className="text-sm text-[#4A6580] hover:text-white transition-colors">Early access</a></div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-[#7FA8C4] uppercase tracking-widest mb-4">Company</p>
            <div className="space-y-3">
              <div><a href="#" className="text-sm text-[#4A6580] hover:text-white transition-colors">About</a></div>
              <div><a href="#" className="text-sm text-[#4A6580] hover:text-white transition-colors">Security</a></div>
              <div><a href="mailto:hello@audyt.ai" className="text-sm text-[#4A6580] hover:text-white transition-colors">Contact</a></div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-[#1E3A5F] text-center">
          <p className="text-xs text-[#4A6580]">
            Audyt.ai is independent and not affiliated with any AI provider.
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

function ConsultingIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
    </svg>
  );
}

function FinanceIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75" />
    </svg>
  );
}

function LegalIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 01-2.031.352 5.988 5.988 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z" />
    </svg>
  );
}

function HealthIcon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
  );
}
