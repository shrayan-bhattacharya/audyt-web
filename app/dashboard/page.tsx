"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getStoredToken,
  getMe,
  getHistory,
  getReportTxt,
  getReportCsv,
  clearToken,
  type AuditHistoryItem,
} from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [history, setHistory] = useState<AuditHistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (!token) {
      router.replace("/login");
      return;
    }
    Promise.all([getMe(token), getHistory(token)])
      .then(([e, h]) => {
        setEmail(e);
        setHistory([...h].reverse());
      })
      .catch(() => {
        clearToken();
        router.replace("/login");
      })
      .finally(() => setLoading(false));
  }, [router]);

  const signOut = () => {
    clearToken();
    router.push("/");
  };

  const download = async (jobId: string, type: "txt" | "csv") => {
    const content =
      type === "txt" ? await getReportTxt(jobId) : await getReportCsv(jobId);
    const blob = new Blob([content], {
      type: type === "txt" ? "text/plain" : "text/csv",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit_${jobId}.${type}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8FAFC] pt-14 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[#06B6D4] border-t-transparent animate-spin" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8FAFC] pt-14">
      <header className="bg-white border-b border-[#E2E8F0] sticky top-14 z-40">
        <div className="mx-auto max-w-6xl px-6 h-14 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-1"
          >
            <span className="text-[#0A1628] font-bold">Audyt</span>
            <span className="text-[#06B6D4] font-bold">.ai</span>
          </Link>
          {email && (
            <span className="hidden sm:block text-sm text-[#64748B]">{email}</span>
          )}
          <div className="flex items-center gap-4">
            <Link
              href="/audit"
              className="inline-flex items-center px-4 py-1.5 rounded-md bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors"
            >
              New audit
            </Link>
            <button
              onClick={signOut}
              className="text-sm text-[#64748B] hover:text-[#0A1628] transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="text-2xl font-bold text-[#0A1628] tracking-tight mb-8">
          Audit History
        </h1>

        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-[#64748B] mb-6">You have not run any audits yet.</p>
            <Link
              href="/audit"
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors"
            >
              Run your first audit
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-[#E2E8F0] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Source
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Claims
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Correct
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Incorrect
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Unverifiable
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                    Accuracy
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1F5F9]">
                {history.map((item) => {
                  const acc = Math.round(item.accuracy_rate);
                  const accColor =
                    acc >= 70
                      ? "text-[#10B981]"
                      : acc >= 40
                      ? "text-[#F59E0B]"
                      : "text-[#EF4444]";
                  const date = new Date(item.timestamp).toLocaleString(
                    undefined,
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  );
                  const source =
                    item.filename_hints.length > 0
                      ? item.filename_hints[0]
                      : item.job_id.slice(0, 8);

                  return (
                    <tr
                      key={item.job_id}
                      className="hover:bg-[#F8FAFC] transition-colors"
                    >
                      <td className="px-5 py-4 text-[#475569] whitespace-nowrap">
                        {date}
                      </td>
                      <td className="px-5 py-4 text-[#0A1628] font-medium max-w-[180px] truncate">
                        {source}
                      </td>
                      <td className="px-5 py-4 text-right text-[#475569]">
                        {item.total_claims}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-[#10B981]">
                        {item.correct}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-[#EF4444]">
                        {item.incorrect}
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-[#F59E0B]">
                        {item.unverifiable}
                      </td>
                      <td className={`px-5 py-4 text-right font-semibold ${accColor}`}>
                        {acc}%
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => download(item.job_id, "txt")}
                            className="px-2.5 py-1 rounded text-xs font-medium border border-[#E2E8F0] text-[#475569] hover:border-[#06B6D4] hover:text-[#06B6D4] transition-colors"
                          >
                            TXT
                          </button>
                          <button
                            onClick={() => download(item.job_id, "csv")}
                            className="px-2.5 py-1 rounded text-xs font-medium border border-[#E2E8F0] text-[#475569] hover:border-[#06B6D4] hover:text-[#06B6D4] transition-colors"
                          >
                            CSV
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
