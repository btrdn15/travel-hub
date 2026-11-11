import type { ReactNode } from "react";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { brand } from "@/lib/brand";

/** Текст хуудсуудын нийтлэг бүтэц: navbar + гарчиг + агуулга + footer */
export function PageShell({ title, children, wide }: { title: string; children: ReactNode; wide?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col" style={{ backgroundColor: brand.cream }}>
      <SiteNavbar />
      <main className={`flex-1 ${SITE_NAVBAR_OFFSET}`}>
        <div className={`mx-auto px-4 py-10 sm:px-6 sm:py-14 ${wide ? "max-w-7xl" : "max-w-3xl"}`}>
          <h1 className="font-serif text-3xl sm:text-4xl" style={{ color: brand.forest }}>
            {title}
          </h1>
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

export function TextSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="mb-3 text-xl font-semibold sm:text-2xl" style={{ color: brand.forest }}>
        {title}
      </h2>
      <div className="space-y-3 text-base leading-relaxed text-stone-700">{children}</div>
    </section>
  );
}
