import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { setAdminLocalSession, useAuth } from "@/lib/auth";
import { brand } from "@/lib/brand";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
type AdminSlot = "ont1" | "ont2" | "ont3";

type AdminLoginPageProps = {
  slot: AdminSlot;
};

export default function AdminLoginPage({ slot }: AdminLoginPageProps) {
  const { refreshAuth } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.head.removeChild(meta);
    };
  }, []);

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const res = await apiRequest("POST", "/api/auth/login", { slot, password });
      const data = (await res.json()) as { token?: string };
      setAdminLocalSession(slot, data.token);
      await refreshAuth();
      try {
        localStorage.setItem("olon-nuur-lang", "mn");
      } catch {
        // ignore
      }
      // Session cookie бүрэн идэвхжсний дараа хуудас дахин ачаална
      window.location.href = "/";
      return;
    } catch {
      setError("Invalid password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.cream, color: brand.forest }}>
      <SiteNavbar />
      <main className={`${SITE_NAVBAR_OFFSET} flex items-center justify-center px-4 py-16`}>
        <form
          onSubmit={onSubmit}
          className="w-full max-w-sm rounded border bg-white p-8 shadow-sm"
          style={{ borderColor: `${brand.forest}18` }}
        >
          <h1 className="mb-6 text-center font-serif text-xl uppercase tracking-[0.12em]">
            Team access
          </h1>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-widest text-stone-500">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-4 w-full rounded border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{ borderColor: `${brand.forest}25` }}
            autoComplete="current-password"
            required
          />
          {error ? <p className="mb-4 text-sm text-rose-600">{error}</p> : null}
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded px-4 py-2.5 text-xs font-bold uppercase tracking-[0.15em] text-white disabled:opacity-60"
            style={{ backgroundColor: brand.forest }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </main>
    </div>
  );
}
