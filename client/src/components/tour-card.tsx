import { Link } from "wouter";
import { ArrowRight, Clock, MapPin, Users } from "lucide-react";
import { useLang, usePaths } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import type { Tour } from "@/data/tours";
import { localize } from "@/lib/localize";
import { brand } from "@/lib/brand";
import { PRICE_ON_REQUEST, formatUsd, getFromPriceUsd, getTour2027 } from "@shared/tours-2027";

/**
 * Аяллын карт: зураг, нэр, хугацаа, хүний тоо, байршил/улирал,
 * хамгийн бага үнэ ("from $X"). Hunting (info_only) дээр "Price on request".
 */
export function TourCard({ tour }: { tour: Tour }) {
  const { lang } = useLang();
  const paths = usePaths();
  const copy = SITE_COPY[lang].tours;
  const catalog = getTour2027(tour.slug);
  const fromPrice = getFromPriceUsd(tour.slug);
  const title = localize(tour.hero.title, lang);

  return (
    <Link href={paths.tour(tour.slug)} className="group block h-full" data-testid={`tour-card-${tour.slug}`}>
      <article className="flex h-full flex-col overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm transition-shadow group-hover:shadow-md">
        <div className="aspect-[4/3] overflow-hidden bg-stone-200">
          <img
            src={tour.hero.imageHd ?? tour.hero.image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            style={tour.hero.imageObjectPosition ? { objectPosition: tour.hero.imageObjectPosition } : undefined}
          />
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="font-serif text-lg leading-snug" style={{ color: brand.forest }}>
            {title}
          </h3>
          <ul className="mt-3 space-y-1.5 text-sm" style={{ color: brand.textMuted }}>
            <li className="flex items-center gap-2">
              <Clock className="h-4 w-4 shrink-0" aria-hidden />
              {localize(tour.overview.duration, lang)}
            </li>
            <li className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" aria-hidden />
              {localize(tour.overview.groupSize, lang)}
            </li>
            {catalog && (
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                {catalog.tagline[lang]}
              </li>
            )}
          </ul>
          <div className="mt-auto pt-5">
            {fromPrice !== null ? (
              <p className="text-base font-semibold" style={{ color: brand.forest }}>
                {copy.fromPrice(formatUsd(fromPrice))}{" "}
                <span className="text-xs font-normal" style={{ color: brand.textMuted }}>
                  {copy.perPerson}
                </span>
              </p>
            ) : (
              <>
                <p className="text-base font-semibold" style={{ color: brand.forest }}>
                  {PRICE_ON_REQUEST[lang]}
                </p>
                {catalog?.status === "info_only" && (
                  <p className="mt-1 text-xs font-medium text-amber-800">{copy.infoOnly}</p>
                )}
              </>
            )}
            <span
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] transition-all group-hover:gap-2.5"
              style={{ color: brand.gold }}
            >
              {copy.details}
              <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
}
