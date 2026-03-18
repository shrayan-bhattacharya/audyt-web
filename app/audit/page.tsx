"use client";

import { useState, useEffect, useRef, useCallback, DragEvent } from "react";
import {
  startAudit,
  getAuditStatus,
  getReportTxt,
  getReportCsv,
  type JobResponse,
  type ClaimResult,
  type AuditResults,
  type Verdict,
  type Confidence,
} from "@/lib/api";

type AuditState = "upload" | "processing" | "results";
type ReportMode = "paste" | "file";

// ── Root page ──────────────────────────────────────────────────────────────────

export default function AuditPage() {
  const [auditState, setAuditState] = useState<AuditState>("upload");

  // Upload state
  const [sourceFiles, setSourceFiles] = useState<File[]>([]);
  const [reportMode, setReportMode] = useState<ReportMode>("paste");
  const [reportText, setReportText] = useState("");
  const [reportFile, setReportFile] = useState<File | null>(null);
  const [context, setContext] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Processing state
  const [jobId, setJobId] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<JobResponse | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const startTimeRef = useRef<number>(0);

  // Results state
  const [results, setResults] = useState<AuditResults | null>(null);
  const [jobTime, setJobTime] = useState<number>(0);

  // ── Submit ───────────────────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const resp = await startAudit(
        sourceFiles,
        reportMode === "file" ? (reportFile ?? undefined) : undefined,
        reportMode === "paste" ? reportText : undefined,
        context || undefined
      );
      setJobId(resp.job_id);
      setElapsed(0);
      startTimeRef.current = Date.now();
      setAuditState("processing");
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Failed to start audit");
    } finally {
      setIsSubmitting(false);
    }
  }, [sourceFiles, reportMode, reportFile, reportText, context]);

  // ── Polling ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (auditState !== "processing" || !jobId) return;

    let stopped = false;

    // Elapsed timer
    const timer = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 500);

    // Poll
    const poll = async () => {
      if (stopped) return;
      try {
        const status = await getAuditStatus(jobId);
        setJobStatus(status);
        if (status.status === "complete" && status.results) {
          setResults(status.results);
          setJobTime(Math.floor((Date.now() - startTimeRef.current) / 1000));
          setAuditState("results");
          stopped = true;
        } else if (status.status === "failed") {
          setSubmitError(status.error ?? "Audit failed");
          setAuditState("upload");
          stopped = true;
        } else {
          setTimeout(poll, 2000);
        }
      } catch {
        setTimeout(poll, 2000);
      }
    };

    poll();

    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [auditState, jobId]);

  // ── Reset ────────────────────────────────────────────────────────────────────

  const handleReset = () => {
    setAuditState("upload");
    setSourceFiles([]);
    setReportText("");
    setReportFile(null);
    setContext("");
    setJobId(null);
    setJobStatus(null);
    setResults(null);
    setSubmitError(null);
    setElapsed(0);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  if (auditState === "upload") {
    return (
      <UploadView
        sourceFiles={sourceFiles}
        setSourceFiles={setSourceFiles}
        reportMode={reportMode}
        setReportMode={setReportMode}
        reportText={reportText}
        setReportText={setReportText}
        reportFile={reportFile}
        setReportFile={setReportFile}
        context={context}
        setContext={setContext}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={submitError}
      />
    );
  }

  if (auditState === "processing") {
    return (
      <ProcessingView
        jobStatus={jobStatus}
        elapsed={elapsed}
      />
    );
  }

  return (
    <ResultsView
      results={results!}
      jobTime={jobTime}
      jobId={jobId!}
      onReset={handleReset}
    />
  );
}

// ── STATE 1: Upload ────────────────────────────────────────────────────────────

function UploadView({
  sourceFiles,
  setSourceFiles,
  reportMode,
  setReportMode,
  reportText,
  setReportText,
  reportFile,
  setReportFile,
  context,
  setContext,
  onSubmit,
  isSubmitting,
  error,
}: {
  sourceFiles: File[];
  setSourceFiles: (f: File[]) => void;
  reportMode: ReportMode;
  setReportMode: (m: ReportMode) => void;
  reportText: string;
  setReportText: (t: string) => void;
  reportFile: File | null;
  setReportFile: (f: File | null) => void;
  context: string;
  setContext: (c: string) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  error: string | null;
}) {
  const [dragOver, setDragOver] = useState(false);
  const sourceInputRef = useRef<HTMLInputElement>(null);
  const reportInputRef = useRef<HTMLInputElement>(null);

  const ACCEPTED = ".pdf,.docx,.xlsx,.xls,.txt";

  const addFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const next = [...sourceFiles];
    Array.from(incoming).forEach((f) => {
      if (!next.find((x) => x.name === f.name && x.size === f.size)) {
        next.push(f);
      }
    });
    setSourceFiles(next);
  };

  const removeSource = (idx: number) =>
    setSourceFiles(sourceFiles.filter((_, i) => i !== idx));

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const hasReport =
    reportMode === "paste" ? reportText.trim().length > 0 : reportFile !== null;
  const canSubmit = sourceFiles.length > 0 && hasReport && !isSubmitting;

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-14">
      <div className="mx-auto max-w-3xl px-4 py-12">
        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-[#0A1628] tracking-tight">
            New audit
          </h1>
          <p className="text-sm text-[#64748B] mt-1">
            Upload your source documents and the AI-generated report to verify.
          </p>
        </div>

        <div className="space-y-5">
          {/* ── Source documents ── */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-[#0A1628] text-sm">
                  Source documents
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  The ground-truth files the AI report was based on — PDF, DOCX,
                  XLSX, TXT
                </p>
              </div>
              {sourceFiles.length > 0 && (
                <span className="text-xs text-[#06B6D4] font-medium">
                  {sourceFiles.length} file{sourceFiles.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>

            {/* Drop zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={onDrop}
              onClick={() => sourceInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-150 ${
                dragOver
                  ? "border-[#06B6D4] bg-[#06B6D4]/5"
                  : "border-[#CBD5E1] hover:border-[#06B6D4]/60 hover:bg-[#F0F9FF]"
              }`}
            >
              <input
                ref={sourceInputRef}
                type="file"
                multiple
                accept={ACCEPTED}
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />
              <UploadIcon className="w-8 h-8 mx-auto mb-3 text-[#94A3B8]" />
              <p className="text-sm text-[#475569] font-medium">
                Drop files here, or{" "}
                <span className="text-[#06B6D4]">browse</span>
              </p>
              <p className="text-xs text-[#94A3B8] mt-1">
                PDF, DOCX, XLSX, XLS, TXT — multiple files accepted
              </p>
            </div>

            {/* File list */}
            {sourceFiles.length > 0 && (
              <ul className="mt-3 space-y-2">
                {sourceFiles.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-3 p-2.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]"
                  >
                    <FileTypeIcon name={f.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1E293B] font-medium truncate">
                        {f.name}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {formatBytes(f.size)}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSource(i);
                      }}
                      className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1"
                      aria-label="Remove file"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── AI-generated report ── */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <div className="mb-4">
              <h2 className="font-semibold text-[#0A1628] text-sm">
                AI-generated report
              </h2>
              <p className="text-xs text-[#64748B] mt-0.5">
                The report to verify — paste the text or upload a file
              </p>
            </div>

            {/* Tab toggle */}
            <div className="flex gap-1 p-1 bg-[#F1F5F9] rounded-lg mb-4 w-fit">
              {(["paste", "file"] as ReportMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setReportMode(m)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-150 ${
                    reportMode === m
                      ? "bg-white text-[#0A1628] shadow-sm"
                      : "text-[#64748B] hover:text-[#0A1628]"
                  }`}
                >
                  {m === "paste" ? "Paste text" : "Upload file"}
                </button>
              ))}
            </div>

            {reportMode === "paste" ? (
              <textarea
                value={reportText}
                onChange={(e) => setReportText(e.target.value)}
                placeholder="Paste the AI-generated report here..."
                rows={10}
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-3 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] resize-y transition-colors"
              />
            ) : (
              <div>
                <input
                  ref={reportInputRef}
                  type="file"
                  accept={ACCEPTED}
                  className="hidden"
                  onChange={(e) =>
                    setReportFile(e.target.files?.[0] ?? null)
                  }
                />
                {reportFile ? (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                    <FileTypeIcon name={reportFile.name} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#1E293B] font-medium truncate">
                        {reportFile.name}
                      </p>
                      <p className="text-xs text-[#94A3B8]">
                        {formatBytes(reportFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setReportFile(null)}
                      className="text-[#94A3B8] hover:text-[#EF4444] transition-colors p-1"
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => reportInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-[#CBD5E1] rounded-lg p-6 text-center hover:border-[#06B6D4]/60 hover:bg-[#F0F9FF] transition-colors duration-150"
                  >
                    <UploadIcon className="w-6 h-6 mx-auto mb-2 text-[#94A3B8]" />
                    <p className="text-sm text-[#475569] font-medium">
                      Click to browse
                    </p>
                    <p className="text-xs text-[#94A3B8] mt-0.5">
                      PDF, DOCX, XLSX, TXT
                    </p>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ── Source context ── */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6">
            <div className="mb-3">
              <h2 className="font-semibold text-[#0A1628] text-sm">
                Source context
              </h2>
            </div>
            <textarea
              rows={3}
              value={context}
              onChange={(e) => setContext(e.target.value)}
              placeholder="What should we know about these documents? Date range, subject matter, known limitations, anything that helps."
              className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3.5 py-2.5 text-sm text-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/30 focus:border-[#06B6D4] transition-colors resize-none"
            />
            <p className="text-xs text-[#94A3B8] mt-2">
              No context? No problem. We will work with what you upload.
            </p>
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-start gap-3 p-4 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
              <AlertIcon className="w-4 h-4 text-[#EF4444] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#DC2626]">{error}</p>
            </div>
          )}

          {/* ── Submit ── */}
          <div className="flex items-center justify-between pt-1">
            <p className="text-xs text-[#94A3B8]">
              {!sourceFiles.length
                ? "Add at least one source document to begin"
                : !hasReport
                ? "Add the AI report to verify"
                : "Ready to run"}
            </p>
            <button
              onClick={onSubmit}
              disabled={!canSubmit}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] disabled:bg-[#CBD5E1] disabled:cursor-not-allowed text-[#0A1628] disabled:text-[#94A3B8] font-semibold text-sm transition-colors duration-150"
            >
              {isSubmitting ? (
                <>
                  <SpinnerIcon className="w-4 h-4 animate-spin" />
                  Starting...
                </>
              ) : (
                <>
                  <RunIcon className="w-4 h-4" />
                  Run audit
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── STATE 2: Processing ────────────────────────────────────────────────────────

function ProcessingView({
  jobStatus,
  elapsed,
}: {
  jobStatus: JobResponse | null;
  elapsed: number;
}) {
  const progress = jobStatus?.progress;
  const stage = progress?.stage ?? "queued";
  const claimsDone = progress?.claims_done ?? 0;
  const claimsTotal = progress?.claims_total ?? 0;

  const stageLabel: Record<string, string> = {
    queued: "Queued — starting shortly...",
    parsing_sources: "Parsing source documents...",
    embedding: "Building knowledge index...",
    extracting_claims: "Extracting claims from report...",
    verifying_claims:
      claimsTotal > 0
        ? `Verifying claim ${claimsDone + 1} of ${claimsTotal}...`
        : "Verifying claims...",
  };

  const pct =
    stage === "verifying_claims" && claimsTotal > 0
      ? Math.round((claimsDone / claimsTotal) * 100)
      : stage === "extracting_claims"
      ? 55
      : stage === "embedding"
      ? 35
      : stage === "parsing_sources"
      ? 15
      : 5;

  return (
    <main className="hero-grid min-h-screen pt-14 flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-6 py-12 text-center">
        {/* Animated hex */}
        <div className="relative inline-flex mb-8">
          <div className="absolute inset-0 rounded-full bg-[#06B6D4]/20 animate-ping" />
          <div className="relative w-16 h-16 rounded-full bg-[#0F1F3C] border border-[#1E3A5F] flex items-center justify-center">
            <HexSpinner />
          </div>
        </div>

        <h2 className="text-xl font-semibold text-white mb-2">
          Running audit
        </h2>
        <p className="text-[#7FA8C4] text-sm mb-8">
          {stageLabel[stage] ?? stage}
        </p>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="h-1.5 bg-[#1E3A5F] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#06B6D4] rounded-full transition-all duration-700 ease-out"
              style={{ width: `${pct}%` }}
            />
          </div>
          {stage === "verifying_claims" && claimsTotal > 0 && (
            <p className="text-xs text-[#4A6580] mt-2">
              {claimsDone} / {claimsTotal} claims verified
            </p>
          )}
        </div>

        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 flex-wrap">
          {[
            { key: "parsing_sources", label: "Parse" },
            { key: "embedding", label: "Index" },
            { key: "extracting_claims", label: "Extract" },
            { key: "verifying_claims", label: "Verify" },
          ].map(({ key, label }, i, arr) => {
            const stageOrder = [
              "parsing_sources",
              "embedding",
              "extracting_claims",
              "verifying_claims",
            ];
            const currentIdx = stageOrder.indexOf(stage);
            const thisIdx = stageOrder.indexOf(key);
            const done = thisIdx < currentIdx;
            const active = thisIdx === currentIdx;

            return (
              <div key={key} className="flex items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                      done
                        ? "bg-[#10B981]"
                        : active
                        ? "bg-[#06B6D4] animate-pulse"
                        : "bg-[#1E3A5F]"
                    }`}
                  />
                  <span
                    className={`text-xs transition-colors duration-300 ${
                      done
                        ? "text-[#10B981]"
                        : active
                        ? "text-[#06B6D4]"
                        : "text-[#4A6580]"
                    }`}
                  >
                    {label}
                  </span>
                </div>
                {i < arr.length - 1 && (
                  <span className="text-[#1E3A5F] text-xs">›</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Elapsed */}
        <p className="text-xs text-[#4A6580] mt-6">
          {elapsed}s elapsed
        </p>
      </div>
    </main>
  );
}

// ── STATE 3: Results ───────────────────────────────────────────────────────────

function ResultsView({
  results,
  jobTime,
  jobId,
  onReset,
}: {
  results: AuditResults;
  jobTime: number;
  jobId: string;
  onReset: () => void;
}) {
  const { summary, claims } = results;
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  const toggle = (n: number) =>
    setExpanded((prev) => {
      const s = new Set(prev);
      s.has(n) ? s.delete(n) : s.add(n);
      return s;
    });

  const downloadTxt = async () => {
    const text = await getReportTxt(jobId);
    triggerDownload(text, "audit-report.txt", "text/plain");
  };

  const downloadCsv = async () => {
    const csv = await getReportCsv(jobId);
    triggerDownload(csv, "audit-report.csv", "text/csv");
  };

  const accuracyColor =
    summary.accuracy_rate >= 85
      ? "text-[#10B981]"
      : summary.accuracy_rate >= 60
      ? "text-[#F59E0B]"
      : "text-[#EF4444]";

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-14">
      {/* ── Sticky summary bar ── */}
      <div className="sticky top-14 z-40 bg-[#0A1628] border-b border-[#1E3A5F]">
        <div className="mx-auto max-w-4xl px-4 py-3">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Title */}
            <div className="flex items-center gap-2 mr-2">
              <CheckCircleIcon className="w-4 h-4 text-[#10B981]" />
              <span className="text-sm font-semibold text-white">
                Audit complete
              </span>
            </div>

            <span className="text-[#1E3A5F] hidden sm:inline">|</span>

            {/* Stats */}
            <span className="text-xs text-[#7FA8C4]">
              {summary.total_claims} claims
            </span>
            <span className="text-xs font-medium text-[#10B981]">
              ✓ {summary.correct_count} correct
            </span>
            <span className="text-xs font-medium text-[#EF4444]">
              ✗ {summary.incorrect_count} incorrect
            </span>
            <span className="text-xs font-medium text-[#F59E0B]">
              ? {summary.unverifiable_count} unverifiable
            </span>

            <span className="text-[#1E3A5F] hidden sm:inline">|</span>

            <span className={`text-xs font-bold ${accuracyColor}`}>
              {Math.round(summary.accuracy_rate)}% accuracy
            </span>

            <span className="text-xs text-[#4A6580] ml-auto">
              {jobTime}s
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {/* ── Action bar ── */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#0A1628] tracking-tight">
              Audit results
            </h1>
            <p className="text-sm text-[#64748B] mt-0.5">
              {summary.total_claims} claims verified · trust score{" "}
              <span className={accuracyColor}>
                {summary.trust_score.toFixed(2)}
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <DownloadButton onClick={downloadTxt} label="TXT report" />
            <DownloadButton onClick={downloadCsv} label="CSV report" />
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors duration-150"
            >
              <RunIcon className="w-3.5 h-3.5" />
              New audit
            </button>
          </div>
        </div>

        {/* ── Claims list ── */}
        <div className="space-y-3">
          {claims.map((claim) => (
            <ClaimCard
              key={claim.claim_number}
              claim={claim}
              isExpanded={expanded.has(claim.claim_number)}
              onToggle={() => toggle(claim.claim_number)}
            />
          ))}
        </div>

        {/* ── Bottom actions ── */}
        <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#64748B]">
            {summary.high_confidence_count} high-confidence verdict
            {summary.high_confidence_count !== 1 ? "s" : ""}
          </p>
          <div className="flex items-center gap-2">
            <DownloadButton onClick={downloadTxt} label="Download TXT" />
            <DownloadButton onClick={downloadCsv} label="Download CSV" />
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors duration-150"
            >
              Run another audit
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

// ── Claim card ─────────────────────────────────────────────────────────────────

function ClaimCard({
  claim,
  isExpanded,
  onToggle,
}: {
  claim: ClaimResult;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const vc = verdictConfig(claim.verdict);
  const confColor = confidenceColor(claim.confidence);
  const hasDetails =
    !!claim.source_says || !!claim.explanation || claim.explanation.length > 0;

  return (
    <div
      className={`bg-white rounded-xl border transition-colors duration-150 ${vc.borderColor} overflow-hidden`}
    >
      {/* Main row */}
      <div className="flex items-start gap-3 p-4">
        {/* Verdict badge */}
        <div
          className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold ${vc.badgeBg} ${vc.badgeText}`}
        >
          {vc.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Verdict + confidence + number */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-bold ${vc.badgeText}`}>
              {claim.verdict}
            </span>
            {claim.confidence !== "NONE" && (
              <span className={`text-xs ${confColor}`}>
                · {claim.confidence}
              </span>
            )}
            <span className="text-xs text-[#CBD5E1] ml-auto">
              #{claim.claim_number}
            </span>
          </div>

          {/* Claim text */}
          <p className="text-sm text-[#1E293B] leading-relaxed">
            {claim.claim}
          </p>

          {/* Source says (INCORRECT) */}
          {claim.source_says && (
            <div className="mt-2 px-3 py-2 rounded-lg bg-[#FEF2F2] border border-[#FECACA]">
              <p className="text-xs text-[#DC2626] font-medium mb-0.5">
                Source says:
              </p>
              <p className="text-xs text-[#7F1D1D] leading-relaxed">
                {claim.source_says}
              </p>
            </div>
          )}

          {/* Citation */}
          <div className="mt-2 flex items-center gap-1.5">
            {claim.citation ? (
              <>
                <CitationIcon className="w-3 h-3 text-[#94A3B8] flex-shrink-0" />
                <p className="text-xs text-[#64748B] font-mono">
                  {claim.citation}
                </p>
              </>
            ) : (
              <p className="text-xs text-[#94A3B8]">
                → No supporting source found
              </p>
            )}
          </div>
        </div>

        {/* Expand toggle */}
        {hasDetails && (
          <button
            onClick={onToggle}
            className="flex-shrink-0 p-1 rounded text-[#94A3B8] hover:text-[#475569] hover:bg-[#F1F5F9] transition-colors"
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronIcon
              className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </button>
        )}
      </div>

      {/* Expanded explanation */}
      {isExpanded && hasDetails && (
        <div className="px-4 pb-4 border-t border-[#F1F5F9]">
          <div className="mt-3 p-3 rounded-lg bg-[#F8FAFC]">
            <p className="text-xs font-medium text-[#475569] mb-1">
              Explanation
            </p>
            <p className="text-xs text-[#64748B] leading-relaxed">
              {claim.explanation}
            </p>
            {claim.distance != null && (
              <p className="text-xs text-[#94A3B8] mt-2">
                Semantic distance: {claim.distance.toFixed(3)} · Checked{" "}
                {claim.sources_checked} source
                {claim.sources_checked !== 1 ? "s" : ""}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────────────────────────

function DownloadButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1] text-[#475569] font-medium text-sm transition-colors duration-150"
    >
      <DownloadIcon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function verdictConfig(verdict: Verdict) {
  return {
    CORRECT: {
      icon: "✓",
      badgeBg: "bg-[#10B981]/12",
      badgeText: "text-[#059669]",
      borderColor: "border-[#D1FAE5]",
    },
    INCORRECT: {
      icon: "✗",
      badgeBg: "bg-[#EF4444]/12",
      badgeText: "text-[#DC2626]",
      borderColor: "border-[#FECACA]",
    },
    UNVERIFIABLE: {
      icon: "?",
      badgeBg: "bg-[#F59E0B]/12",
      badgeText: "text-[#D97706]",
      borderColor: "border-[#FDE68A]",
    },
  }[verdict];
}

function confidenceColor(confidence: Confidence) {
  return {
    HIGH: "text-[#059669]",
    MEDIUM: "text-[#7FA8C4]",
    LOW: "text-[#94A3B8]",
    NONE: "text-[#94A3B8]",
  }[confidence];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function triggerDownload(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Icons ──────────────────────────────────────────────────────────────────────

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

function RunIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
    </svg>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

function AlertIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
  );
}

function CitationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
  );
}

function FileTypeIcon({ name }: { name: string }) {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const color =
    ext === "pdf"
      ? "text-[#EF4444]"
      : ext === "xlsx" || ext === "xls"
      ? "text-[#10B981]"
      : ext === "docx"
      ? "text-[#3B82F6]"
      : "text-[#94A3B8]";
  return (
    <svg className={`w-8 h-8 flex-shrink-0 ${color}`} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function HexSpinner() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="animate-spin" style={{ animationDuration: "2s" }}>
      <path d="M12 2L21.196 7V17L12 22L2.804 17V7L12 2Z" stroke="#06B6D4" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 6L17 9V15L12 18L7 15V9L12 6Z" fill="#06B6D4" fillOpacity="0.4" />
    </svg>
  );
}
