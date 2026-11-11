import { Check } from "lucide-react";
import { useLang } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { PageShell } from "@/components/page-shell";
import { brand } from "@/lib/brand";

/**
 * About Us.
 * TODO(content): компанийн танилцуулга, бодит багийн гишүүд, үйл ажиллагааны зарчим
 * (technical brief §2). 2027 баримтад текст байхгүй тул зохиогоогүй.
 * Одоогоор зөвхөн баримтын HOME хэсгийн өгүүлбэрүүдийг харуулна.
 */
export default function AboutPage() {
  const { lang } = useLang();
  const c = SITE_COPY[lang];

  return (
    <PageShell title={c.about.title}>
      <p className="text-base leading-relaxed text-stone-700">{c.home.intro}</p>
      <ul className="mt-6 space-y-3">
        {c.home.whyItems.map((item) => (
          <li key={item} className="flex items-start gap-3 text-stone-800">
            <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: brand.gold }} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <p className="mt-10 rounded-xl border border-dashed border-stone-300 bg-white p-5 text-sm text-stone-600" data-todo="content">
        {c.about.placeholder}
      </p>
    </PageShell>
  );
}
