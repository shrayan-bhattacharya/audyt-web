"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, signup } from "@/lib/api";

type Tab = "signin" | "create";

export default function LoginPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (tab === "signin") {
        await login(email, password);
      } else {
        await signup(email, password);
      }
      router.push("/dashboard");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : tab === "signin"
          ? "Those credentials do not match our records."
          : "Could not create account. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0A1628] pt-14 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-[#0F1F3C] rounded-2xl border border-[#1E3A5F] p-8">
          <div className="flex items-center justify-center gap-1 mb-8">
            <span className="text-white font-bold text-xl">Audyt</span>
            <span className="text-[#06B6D4] font-bold text-xl">.ai</span>
          </div>

          <div className="flex rounded-lg bg-[#0A1628] border border-[#1E3A5F] p-1 mb-8">
            <button
              onClick={() => { setTab("signin"); setError(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === "signin"
                  ? "bg-[#1E3A5F] text-white"
                  : "text-[#4A6580] hover:text-white"
              }`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setTab("create"); setError(null); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition-colors ${
                tab === "create"
                  ? "bg-[#1E3A5F] text-white"
                  : "text-[#4A6580] hover:text-white"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#93B5CC] mb-1.5">
                Work email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0A1628] border border-[#1E3A5F] text-white placeholder-[#4A6580] text-sm focus:outline-none focus:border-[#06B6D4] transition-colors"
                placeholder="you@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#93B5CC] mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg bg-[#0A1628] border border-[#1E3A5F] text-white placeholder-[#4A6580] text-sm focus:outline-none focus:border-[#06B6D4] transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-xs text-[#EF4444]">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-lg bg-[#06B6D4] hover:bg-[#0891B2] text-[#0A1628] font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait..."
                : tab === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-[#4A6580] mt-6">
          Just want to try it? Run an audit without an account.{" "}
          <Link href="/audit" className="text-[#06B6D4] hover:underline">
            Go to audit
          </Link>
        </p>
      </div>
    </main>
  );
}
