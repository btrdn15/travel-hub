import { Link } from "wouter";
import { Calendar } from "lucide-react";
import { useLang, usePaths } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { PageShell } from "@/components/page-shell";
import { formatDepartureRange } from "@/lib/format";
import { TOURS_2027 } from "@shared/tours-2027";
import { brand } from "@/lib/brand";

/** 2027 Departures: зөвхөн баталгаажсан фото аяллын 2 огноо; бусад нь "dates on request" */
export default function DeparturesPage() {
  const { lang } = useLang();
  const paths = usePaths();
  const c = SITE_COPY[lang].departures;
  const fixed = TOURS_2027.filter((t) => t.fixedDepartures?.length);
  const others = TOURS_2027.filter((t) => !t.fixedDepartures?.length);

  return (
    <PageShell title={c.title}>
      <p className="mb-10 text-base leading-relaxed text-stone-700">{c.text}</p>

      {fixed.map((tour) => (
        <section key={tour.slug} className="mb-10">
          <h2 className="mb-1 text-xl font-semibold" style={{ color: brand.forest }}>
            <Link href={paths.tour(tour.slug)} className="hover:underline">{tour.name[lang]}</Link>
          </h2>
          <p className="mb-4 text-sm text-stone-500">{c.photographyLabel}</p>
          <ul className="grid gap-3 sm:grid-cols-2">
            {tour.fixedDepartures!.map((d) => (
              <li key={d.start} className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white p-4">
                <Calendar className="h-5 w-5 shrink-0" style={{ color: brand.gold }} aria-hidden />
                <span className="font-semibold text-stone-900">{formatDepartureRange(d, lang)}</span>
              </li>
            ))}
          </ul>
          <Link
            href={paths.contact(tour.slug)}
            className="mt-4 inline-flex px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white"
            style={{ backgroundColor: brand.forest }}
          >
            {SITE_COPY[lang].nav.requestTour}
          </Link>
        </section>
      ))}

      <section>
        <h2 className="mb-4 text-xl font-semibold" style={{ color: brand.forest }}>{c.otherTours}</h2>
        <ul className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {others.map((tour) => (
            <li key={tour.slug} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between">
              <Link href={paths.tour(tour.slug)} className="font-medium text-stone-900 hover:underline">
                {tour.name[lang]}
              </Link>
              <span className="text-sm text-stone-600">{c.datesOnRequest}</span>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
