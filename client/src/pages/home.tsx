import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Calendar, Check, ArrowRight } from "lucide-react";
import { useLang, usePaths } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { brand } from "@/lib/brand";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import { TourCard } from "@/components/tour-card";
import { toursInCatalogOrder } from "@/data/tours";
import { HERO_SLIDES, HERO_SLIDE_INTERVAL_MS } from "@/data/hero-slides";
import { HIGH_FETCH_PRIORITY } from "@/lib/utils";
import { formatDepartureRange } from "@/lib/format";
import { getTour2027 } from "@shared/tours-2027";

/**
 * Нүүр хуудас — brief §3-ийн дараалал:
 * Hero → 5 аяллын карт → Why us → 2027 оны аялал → How it works → Footer.
 * Хуурамч үнэлгээ, од, статистик, QR код байхгүй. Review хэсэг Phase 2.
 */

function SectionHeading({ title, light }: { title: string; light?: boolean }) {
  return (
    <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
      <div className="mb-4 flex items-center justify-center gap-3" aria-hidden>
        <span className="h-px w-12 sm:w-16" style={{ backgroundColor: brand.gold }} />
        <span className="inline-block h-2 w-2 rotate-45 border" style={{ borderColor: brand.gold }} />
        <span className="h-px w-12 sm:w-16" style={{ backgroundColor: brand.gold }} />
      </div>
      <h2
        className="font-serif text-2xl uppercase tracking-[0.1em] sm:text-3xl md:text-4xl"
        style={{ color: light ? brand.white : brand.forest }}
      >
        {title}
      </h2>
    </div>
  );
}

function HeroSection() {
  const { lang } = useLang();
  const paths = usePaths();
  const c = SITE_COPY[lang];
  const [activeSlide, setActiveSlide] = useState(0);

  useEffect(() => {
    if (HERO_SLIDES.length <= 1) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % HERO_SLIDES.length);
    }, HERO_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <section className={`relative flex min-h-[88dvh] items-center overflow-hidden ${SITE_NAVBAR_OFFSET}`}>
      <div className="absolute inset-0" aria-hidden>
        {HERO_SLIDES.map((src, index) => (
          <img
            key={src}
            src={src}
            alt=""
            {...(index === 0 ? HIGH_FETCH_PRIORITY : {})}
            loading={index === 0 ? "eager" : "lazy"}
            decoding="async"
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-1000 ease-in-out ${
              index === activeSlide ? "opacity-100" : "opacity-0"
            }`}
            data-testid={index === 0 ? "img-hero-bg" : undefined}
          />
        ))}
      </div>
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(26,46,36,0.92) 0%, rgba(26,46,36,0.6) 45%, rgba(26,46,36,0.15) 80%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-20 sm:px-6 sm:py-24">
        <div className="max-w-xl text-white">
          <h1 className="font-serif text-4xl leading-[1.08] sm:text-5xl md:text-6xl" data-testid="text-hero-title">
            {c.home.heroTitle}
          </h1>
          {c.home.heroSubtitle && (
            <p className="mt-3 font-serif text-xl sm:text-2xl" style={{ color: brand.goldLight }}>
              {c.home.heroSubtitle}
            </p>
          )}
          <p className="mt-5 text-sm leading-7 text-white/90 sm:text-base sm:leading-8">{c.home.intro}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href={paths.page("tours")}
              className="inline-flex items-center justify-center gap-2 border px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-white/10 sm:text-sm"
              style={{ borderColor: "rgba(255,255,255,0.7)" }}
            >
              {c.nav.exploreTours}
            </Link>
            <Link
              href={paths.contact()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] transition-opacity hover:opacity-90 sm:text-sm"
              style={{ backgroundColor: brand.gold, color: brand.forestDark }}
            >
              {c.nav.requestTour}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ToursSection() {
  const { lang } = useLang();
  const c = SITE_COPY[lang];
  return (
    <section id="tours" className="scroll-mt-24 px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: brand.cream }}>
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={c.home.toursTitle} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {toursInCatalogOrder().map((tour) => (
            <TourCard key={tour.slug} tour={tour} />
          ))}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const { lang } = useLang();
  const c = SITE_COPY[lang];
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: brand.forest }}>
      <div className="mx-auto max-w-4xl">
        <SectionHeading title={c.home.whyTitle} light />
        <ul className="grid gap-4 sm:grid-cols-2">
          {c.home.whyItems.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-white/90 sm:text-base">
              <Check className="mt-0.5 h-5 w-5 shrink-0" style={{ color: brand.gold }} aria-hidden />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function DeparturesSection() {
  const { lang } = useLang();
  const paths = usePaths();
  const c = SITE_COPY[lang];
  const photo = getTour2027("wildlife-photography");
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-20" style={{ backgroundColor: brand.cream }}>
      <div className="mx-auto max-w-4xl text-center">
        <SectionHeading title={c.home.departuresTitle} />
        {photo?.fixedDepartures && (
          <div className="mb-6">
            <p className="mb-3 font-semibold" style={{ color: brand.forest }}>{photo.name[lang]}</p>
            <ul className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              {photo.fixedDepartures.map((d) => (
                <li
                  key={d.start}
                  className="inline-flex items-center gap-2 rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800"
                >
                  <Calendar className="h-4 w-4" style={{ color: brand.gold }} aria-hidden />
                  {formatDepartureRange(d, lang)}
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-sm text-stone-600">
          {c.departures.otherTours}: {c.departures.datesOnRequest}
        </p>
        <Link
          href={paths.page("departures")}
          className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-[0.15em]"
          style={{ color: brand.gold }}
        >
          {c.nav.departures}
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </div>
    </section>
  );
}

function HowItWorksSection() {
  const { lang } = useLang();
  const paths = usePaths();
  const c = SITE_COPY[lang];
  return (
    <section className="border-t border-stone-200 bg-white px-4 py-16 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHeading title={c.home.howTitle} />
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {c.home.howSteps.map((step, i) => (
            <li key={step} className="rounded-xl border border-stone-200 p-4 text-center">
              <span
                className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                style={{ backgroundColor: brand.forest }}
              >
                {i + 1}
              </span>
              <span className="text-sm font-medium text-stone-800">{step}</span>
            </li>
          ))}
        </ol>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm leading-relaxed text-stone-600">{c.home.highlights}</p>
        <div className="mt-8 text-center">
          <Link
            href={paths.contact()}
            className="inline-flex px-7 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-opacity hover:opacity-90 sm:text-sm"
            style={{ backgroundColor: brand.forest }}
          >
            {c.nav.requestTour}
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.cream }}>
      <SiteNavbar />
      <main>
        <HeroSection />
        <ToursSection />
        <WhySection />
        <DeparturesSection />
        <HowItWorksSection />
      </main>
      <SiteFooter />
    </div>
  );
}
