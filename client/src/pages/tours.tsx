import { useState } from "react";
import { useLang } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { PageShell } from "@/components/page-shell";
import { TourCard } from "@/components/tour-card";
import { toursInCatalogOrder } from "@/data/tours";
import { TOURS_2027, getTour2027, type SeasonTag } from "@shared/tours-2027";
import { brand } from "@/lib/brand";

type SeasonFilter = "all" | SeasonTag;
type DurationFilter = "all" | number;

const DURATIONS = Array.from(new Set(TOURS_2027.map((t) => t.days))).sort((a, b) => a - b);

function FilterGroup<T extends string | number>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: Array<{ value: T; label: string }>;
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <fieldset className="flex flex-wrap items-center gap-2">
      <legend className="mb-2 w-full text-xs font-semibold uppercase tracking-[0.15em] text-stone-500">{label}</legend>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={String(o.value)}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            className="rounded-full border px-4 py-1.5 text-sm transition-colors"
            style={
              active
                ? { backgroundColor: brand.forest, borderColor: brand.forest, color: brand.white }
                : { borderColor: "#d6d3d1", color: brand.forest, backgroundColor: brand.white }
            }
          >
            {o.label}
          </button>
        );
      })}
    </fieldset>
  );
}

export default function ToursPage() {
  const { lang } = useLang();
  const c = SITE_COPY[lang].tours;
  const [season, setSeason] = useState<SeasonFilter>("all");
  const [duration, setDuration] = useState<DurationFilter>("all");

  const list = toursInCatalogOrder().filter((tour) => {
    const cat = getTour2027(tour.slug);
    if (!cat) return false;
    if (season !== "all" && !cat.seasons.includes(season)) return false;
    if (duration !== "all" && cat.days !== duration) return false;
    return true;
  });

  return (
    <PageShell title={c.title} wide>
      <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:gap-10">
        <FilterGroup<SeasonFilter>
          label={c.filterSeason}
          value={season}
          onChange={setSeason}
          options={[
            { value: "all", label: c.all },
            { value: "summer", label: c.summer },
            { value: "winter", label: c.winter },
          ]}
        />
        <FilterGroup<DurationFilter>
          label={c.filterDuration}
          value={duration}
          onChange={setDuration}
          options={[{ value: "all", label: c.all }, ...DURATIONS.map((d) => ({ value: d, label: c.days(d) }))]}
        />
      </div>

      {list.length === 0 ? (
        <p className="text-stone-600">{c.noResults}</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {list.map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
