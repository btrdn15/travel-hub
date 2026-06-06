import { Link } from "wouter";
import { useLang, type Lang } from "@/lib/lang";
import { localize } from "@/lib/localize";
import { brand } from "@/lib/brand";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
import { tours, type Tour } from "@/data/tours";
import {
  CONTACT,
  JOURNEY_SLUG_ORDER,
  getTourMarketingTitle,
  getWebsiteCopy,
} from "@/data/website-content";
import {
  Phone,
  Mail,
  Instagram,
  Globe2,
  ArrowRight,
  Camera,
  Fish,
  Mountain,
  Shield,
  Users,
  UserCheck,
  Leaf,
  Car,
  Tent,
  Crosshair,
} from "lucide-react";
import brochureMn from "@assets/brochure-mn.png";
import brochureKo from "@assets/brochure-ko.png";
import brochureEn from "@assets/brochure-en.png";
import olonNuurLogo from "@assets/olon_nuur_travel_logo.png";
import heroCover from "@assets/hero-cover.png";
import nomadicCultureHero from "@assets/nomadic-culture-hero-1920.jpg";
import freshwaterFishingHero from "@assets/freshwater-fishing-hero-1920.jpg";
import birdPhotographyHero from "@assets/bird-photography-hero-1920.jpg";

const TOUR_ICONS = {
  "bird-photography": Camera,
  "arburd-gobi": Tent,
  "kherlen-fishing": Fish,
  "winter-hunting": Crosshair,
} as const;

const WHY_ICONS = {
  experts: UserCheck,
  groups: Users,
  safety: Shield,
  comfort: Car,
  responsible: Leaf,
  memories: Camera,
} as const;

function brochureImage(lang: Lang) {
  if (lang === "mn") return brochureMn;
  if (lang === "ko") return brochureKo;
  return brochureEn;
}

function getOrderedTours(): Tour[] {
  const bySlug = Object.fromEntries(tours.map((tour) => [tour.slug, tour]));
  return JOURNEY_SLUG_ORDER.map((slug) => bySlug[slug]).filter((t): t is Tour => Boolean(t));
}

function tourCardImage(tour: Tour): string {
  return tour.hero.imageHd ?? tour.hero.image;
}

function SectionOrnament() {
  return (
    <div className="mb-4 flex items-center justify-center gap-3">
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: brand.gold }} />
      <span
        className="inline-block h-2 w-2 rotate-45 border"
        style={{ borderColor: brand.gold }}
        aria-hidden
      />
      <span className="h-px w-12 sm:w-16" style={{ backgroundColor: brand.gold }} />
    </div>
  );
}

function SectionHeading({
  title,
  subtitle,
  light,
}: {
  title: string;
  subtitle?: string;
  light?: boolean;
}) {
  return (
    <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
      <SectionOrnament />
      <h2
        className="font-serif text-2xl uppercase tracking-[0.12em] sm:text-3xl md:text-4xl"
        style={{ color: light ? brand.white : brand.forest }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed sm:text-base"
          style={{ color: light ? "rgba(255,255,255,0.75)" : brand.textMuted }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

function HeroSection() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);

  return (
    <section className={`relative flex min-h-[100dvh] items-center overflow-hidden ${SITE_NAVBAR_OFFSET}`}>
      <img
        src={heroCover}
        alt=""
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover object-[72%_42%] sm:object-[68%_40%] md:object-[65%_38%]"
        data-testid="img-hero-bg"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(26,46,36,0.9) 0%, rgba(26,46,36,0.5) 38%, rgba(26,46,36,0.08) 72%, transparent 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 sm:py-28 md:py-32">
        <div className="max-w-xl text-white">
          {tr.heroTag ? (
            <p className="mb-4 text-xs uppercase tracking-[0.25em] sm:text-sm" style={{ color: brand.gold }}>
              {tr.heroTag}
            </p>
          ) : null}
          <h1
            className="font-serif text-4xl leading-[1.08] sm:text-5xl md:text-6xl lg:text-[4.25rem]"
            data-testid="text-hero-title"
          >
            {tr.heroTitle}
            {tr.heroTitleLine2 ? (
              <>
                <br />
                {tr.heroTitleLine2}
              </>
            ) : null}
          </h1>
          {tr.heroDesc ? (
            <p className="mt-5 max-w-md text-sm leading-7 text-white/85 sm:mt-6 sm:text-base sm:leading-8">
              {tr.heroDesc}
            </p>
          ) : null}
          <a
            href="#tours"
            className="mt-8 inline-flex items-center gap-2 border px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10 sm:mt-10 sm:text-sm"
            style={{ borderColor: "rgba(255,255,255,0.65)" }}
          >
            {tr.exploreJourneys}
          </a>
        </div>
      </div>
    </section>
  );
}

function ToursSection() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);

  return (
    <section
      id="tours"
      className="scroll-mt-20 px-4 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20 md:py-28"
      style={{ backgroundColor: brand.cream }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={tr.journeysTitle} subtitle={tr.journeysSubtitle} />

        <div className="grid gap-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-6">
          {getOrderedTours().map((tour) => {
            const Icon = TOUR_ICONS[tour.slug as keyof typeof TOUR_ICONS] ?? Mountain;
            const isComingSoon = tour.status === "coming_soon" || tour.days.length === 0;
            const displayTitle = (
              getTourMarketingTitle(tour.slug, lang) ?? localize(tour.hero.title, lang)
            ).toUpperCase();
            const imgSrc = tourCardImage(tour);

            const card = (
              <article className="group flex h-full flex-col text-center">
                <div className="relative mx-auto mb-10 w-full max-w-[280px] sm:max-w-none">
                  <div className="overflow-hidden shadow-md">
                    <img
                      src={imgSrc}
                      alt=""
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div
                    className="absolute -bottom-6 left-1/2 flex h-[3.25rem] w-[3.25rem] -translate-x-1/2 items-center justify-center rounded-full border-4 shadow-md"
                    style={{
                      backgroundColor: brand.forest,
                      borderColor: brand.cream,
                      color: brand.gold,
                    }}
                  >
                    <Icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                </div>
                <h3
                  className="font-serif text-base leading-snug tracking-[0.06em] sm:text-lg"
                  style={{ color: brand.forest }}
                >
                  {displayTitle}
                </h3>
                <p
                  className="mx-auto mt-3 max-w-[16rem] flex-1 text-xs leading-6 sm:text-sm"
                  style={{ color: brand.textMuted }}
                >
                  {localize(tour.description, lang)}
                </p>
                {!isComingSoon && (
                  <span
                    className="mt-5 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all group-hover:gap-2.5"
                    style={{ color: brand.gold }}
                  >
                    {tr.learnMore}
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                )}
                {isComingSoon && (
                  <span
                    className="mt-5 inline-flex items-center justify-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.2em] transition-all group-hover:gap-2.5"
                    style={{ color: brand.gold }}
                  >
                    {tour.comingSoon ? tr.learnMore : tr.comingSoon}
                    {tour.comingSoon ? <ArrowRight className="h-3.5 w-3.5" /> : null}
                  </span>
                )}
              </article>
            );

            const tourHref =
              !isComingSoon || tour.comingSoon ? `/tours/${tour.slug}` : null;

            return tourHref ? (
              <Link key={tour.slug} href={tourHref} className="block h-full">
                {card}
              </Link>
            ) : (
              <div key={tour.slug}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function WhySection() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);

  return (
    <section
      id="why"
      className="scroll-mt-20 px-4 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20 md:py-28"
      style={{ backgroundColor: brand.forest }}
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,1fr)_1.4fr] lg:gap-16 lg:items-start">
        <div className="text-white lg:sticky lg:top-28">
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl md:text-[2.5rem] md:leading-[1.15]">
            {tr.whyTravelTitle}
          </h2>
          <p className="mt-6 max-w-md text-sm leading-7 text-white/75 sm:text-base">
            {tr.whyTravelDesc}
          </p>
          <a
            href="#brochure"
            className="mt-8 inline-flex border px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.2em] transition-colors hover:bg-white/5"
            style={{ borderColor: brand.gold, color: brand.gold }}
          >
            {tr.aboutUsBtn}
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-3">
          {tr.whyItems.map(([key, title, text]) => {
            const Icon = WHY_ICONS[key as keyof typeof WHY_ICONS] ?? Shield;
            return (
              <div key={key}>
                <Icon className="h-6 w-6" style={{ color: brand.gold }} strokeWidth={1.5} />
                <h3 className="mt-4 font-serif text-lg uppercase tracking-[0.08em] text-white sm:text-xl">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-6 text-white/70 sm:text-sm">{text}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function GallerySection() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);
  const ordered = getOrderedTours();
  const galleryImages = [
    heroCover,
    ordered[0]?.hero.imageHd ?? ordered[0]?.hero.image,
    nomadicCultureHero,
    ordered[1]?.hero.imageHd ?? ordered[1]?.hero.image,
    birdPhotographyHero,
    freshwaterFishingHero,
  ];

  return (
    <section
      id="gallery"
      className="scroll-mt-20 px-4 py-16 sm:scroll-mt-24 sm:px-6 sm:py-20 md:py-28"
      style={{ backgroundColor: brand.cream }}
    >
      <div className="mx-auto max-w-7xl">
        <SectionHeading title={tr.galleryTitle} />

        <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-6">
          {galleryImages.map((src, i) => (
            <div
              key={i}
              className="group relative aspect-square overflow-hidden sm:aspect-[4/5]"
            >
              <img
                src={src}
                alt={tr.galleryItems[i] ?? ""}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrochureSection() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);
  const src = brochureImage(lang);

  return (
    <section
      id="brochure"
      className="scroll-mt-20 border-t px-4 py-14 sm:px-6 sm:py-20"
      style={{ backgroundColor: brand.cream, borderColor: `${brand.forest}10` }}
    >
      <div className="mx-auto max-w-4xl">
        <SectionHeading title={tr.brochureTitle} subtitle={tr.brochureDesc} />
        <div className="overflow-hidden bg-white shadow-md ring-1 ring-black/5">
          <div className="p-3 sm:p-6 md:p-8" style={{ backgroundColor: brand.cream }}>
            <img
              key={lang}
              src={src}
              alt={tr.brochureTitle}
              className="mx-auto h-auto w-full max-w-3xl"
              data-testid="img-brochure"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function FooterCtaSection() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);

  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden sm:scroll-mt-24">
      <img
        src={nomadicCultureHero}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        aria-hidden
      />
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(18,28,24,0.82)" }} />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 sm:py-20 md:grid-cols-2 md:py-24 lg:gap-20">
        <div className="text-white">
          <h2 className="font-serif text-3xl leading-tight sm:text-4xl md:text-[2.35rem]">
            {tr.footerReady}
          </h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/75 sm:text-base">
            {tr.footerContactIntro}
          </p>
          <Link
            href="/book"
            className="mt-8 inline-flex border px-7 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-white transition-colors hover:bg-white/10 sm:text-sm"
            style={{ borderColor: "rgba(255,255,255,0.55)" }}
          >
            {tr.contactUsBtn}
          </Link>
        </div>

        <div className="space-y-5 text-sm text-white/90">
          <div className="flex items-start gap-4" data-testid="link-phone">
            <Phone className="mt-0.5 h-5 w-5 shrink-0" style={{ color: brand.gold }} />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {tr.phoneLabel}
              </div>
              {CONTACT.phones.map((phone, idx) => (
                <a
                  key={phone}
                  href={CONTACT.phoneHref[idx]}
                  className="mt-1 block hover:opacity-80"
                  style={{ color: brand.goldLight }}
                >
                  {phone}
                </a>
              ))}
            </div>
          </div>
          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-start gap-4 hover:opacity-90"
            data-testid="link-email"
          >
            <Mail className="mt-0.5 h-5 w-5 shrink-0" style={{ color: brand.gold }} />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {tr.emailLabel}
              </div>
              <span className="mt-1 block" style={{ color: brand.goldLight }}>
                {CONTACT.email}
              </span>
            </div>
          </a>
          <a
            href={CONTACT.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 hover:opacity-90"
          >
            <Globe2 className="mt-0.5 h-5 w-5 shrink-0" style={{ color: brand.gold }} />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {tr.websiteLabel}
              </div>
              <span className="mt-1 block" style={{ color: brand.goldLight }}>
                {CONTACT.website}
              </span>
            </div>
          </a>
          <a
            href={CONTACT.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-4 hover:opacity-90"
            data-testid="link-instagram"
          >
            <Instagram className="mt-0.5 h-5 w-5 shrink-0" style={{ color: brand.gold }} />
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
                {tr.instaLabel}
              </div>
              <span className="mt-1 block" style={{ color: brand.goldLight }}>
                {CONTACT.instagram}
              </span>
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);
  const footerLinks = [
    { href: "/", label: tr.navHome },
    { href: "#tours", label: tr.navJourneys },
    { href: "#why", label: tr.navAbout },
    { href: "#gallery", label: tr.navGallery },
    { href: "#contact", label: tr.navContact },
  ];

  return (
    <footer style={{ backgroundColor: brand.forestDark }}>
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 py-7 sm:px-6 md:flex-row">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <img
            src={olonNuurLogo}
            alt=""
            className="h-9 w-9 rounded-full object-cover object-top"
            aria-hidden
          />
          <span className="font-serif text-xs uppercase tracking-[0.12em] text-white/80">
            Olon Nuur Travel
          </span>
        </Link>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-[10px] font-semibold uppercase tracking-[0.15em] text-white/45 transition-colors hover:text-white/80"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <p className="text-center text-[10px] text-white/40 md:text-right">{tr.copyright}</p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.cream, color: brand.forest }}>
      <SiteNavbar />
      <main>
        <HeroSection />
        <ToursSection />
        <WhySection />
        <GallerySection />
        <BrochureSection />
        <FooterCtaSection />
        <SiteFooter />
      </main>
    </div>
  );
}
