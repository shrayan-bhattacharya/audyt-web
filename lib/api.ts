const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

// ── Types ─────────────────────────────────────────────────────────────────────

export type JobStatus = "queued" | "processing" | "complete" | "failed";
export type Verdict = "CORRECT" | "INCORRECT" | "UNVERIFIABLE";
export type Confidence = "HIGH" | "MEDIUM" | "LOW" | "NONE";

export interface StartAuditResponse {
  job_id: string;
  status: string;
}

export interface ClaimResult {
  claim_number: number;
  claim: string;
  verdict: Verdict;
  confidence: Confidence;
  citation: string | null;
  explanation: string;
  source_says: string | null;
  distance: number | null;
  sources_checked: number;
}

export interface AuditSummary {
  total_claims: number;
  correct_count: number;
  incorrect_count: number;
  unverifiable_count: number;
  accuracy_rate: number;
  trust_score: number;
  high_confidence_count: number;
}

export interface AuditResults {
  summary: AuditSummary;
  claims: ClaimResult[];
}

export interface JobProgress {
  stage: string;
  claims_done: number;
  claims_total: number;
}

export interface JobResponse {
  job_id: string;
  status: JobStatus;
  progress: JobProgress | null;
  results: AuditResults | null;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function startAudit(
  sourceFiles: File[],
  reportFile?: File,
  reportText?: string,
  context?: string
): Promise<StartAuditResponse> {
  const form = new FormData();
  sourceFiles.forEach((f) => form.append("source_files", f));
  if (reportFile) form.append("report_file", reportFile);
  if (reportText) form.append("report_text", reportText);
  if (context) form.append("context", context);

  const res = await fetch(`${API_URL}/api/v1/audit`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    throw new Error(err.detail ?? "Failed to start audit");
  }
  return res.json();
}

export async function getAuditStatus(jobId: string): Promise<JobResponse> {
  const res = await fetch(`${API_URL}/api/v1/audit/${jobId}`);
  if (!res.ok) throw new Error(`Job not found: ${jobId}`);
  return res.json();
}

export async function getReportTxt(jobId: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/audit/${jobId}/report/txt`);
  if (!res.ok) throw new Error("Report not ready");
  return res.text();
}

export async function getReportCsv(jobId: string): Promise<string> {
  const res = await fetch(`${API_URL}/api/v1/audit/${jobId}/report/csv`);
  if (!res.ok) throw new Error("Report not ready");
  return res.text();
}
