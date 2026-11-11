import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLang, usePaths, LANG_LABELS, type Lang } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { brand } from "@/lib/brand";
import { tours } from "@/data/tours";
import { localize } from "@/lib/localize";
import type { PageKey } from "@shared/site-routes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Globe, ArrowLeft, X, ChevronDown, Check } from "lucide-react";
import olonNuurLogo from "@assets/olon_nuur_travel_logo.png";

function LangSwitcher({ className = "", onSelect }: { className?: string; onSelect?: () => void }) {
  const { lang, setLang, availableLangs } = useLang();
  const label = SITE_COPY[lang].nav.langSwitch;

  const pick = (code: Lang) => {
    setLang(code);
    onSelect?.();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={`flex items-center gap-1 rounded px-2 py-1.5 text-xs font-medium transition-colors sm:gap-1.5 sm:text-sm ${className}`}
          style={{ color: brand.forest }}
          aria-label={label}
          data-testid="button-lang-switch"
        >
          <Globe className="h-4 w-4 shrink-0 opacity-70" />
          <span>{LANG_LABELS[lang]}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {availableLangs.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => pick(code)}
            className="flex cursor-pointer items-center justify-between gap-3"
            lang={code}
          >
            <span>{LANG_LABELS[code]}</span>
            {lang === code && <Check className="h-4 w-4" style={{ color: brand.gold }} />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export type SiteNavbarProps = {
  backLink?: { href: string; label: string };
};

/** Баримтын MENU: Home | Tours | 2027 Departures | About Us | Travel Information | FAQ | Contact */
const MENU: PageKey[] = ["home", "tours", "departures", "about", "travelInfo", "faq", "contact"];

export function SiteNavbar({ backLink }: SiteNavbarProps) {
  const { lang } = useLang();
  const paths = usePaths();
  const [location] = useLocation();
  const nav = SITE_COPY[lang].nav;
  const [mobileNav, setMobileNav] = useState(false);

  const labelFor: Record<PageKey, string> = {
    home: nav.home,
    tours: nav.tours,
    departures: nav.departures,
    about: nav.about,
    travelInfo: nav.travelInfo,
    faq: nav.faq,
    contact: nav.contact,
    privacy: "",
    gallery: nav.gallery,
    comic: nav.comic,
  };

  const isActive = (page: PageKey) => {
    const href = paths.page(page);
    if (page === "home") return location === "/" || location === href || `${location}/` === href;
    return location === href || location.startsWith(`${href}/`);
  };

  const closeMobile = () => setMobileNav(false);

  const usesLatinNavStyle = lang === "en" || lang === "ja";
  const navLinkClass = usesLatinNavStyle
    ? "relative text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors hover:opacity-80"
    : "relative text-[13px] font-semibold tracking-normal transition-colors hover:opacity-80";
  const mobileNavLinkClass = usesLatinNavStyle
    ? "rounded px-2 py-3 text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-70"
    : "rounded px-2 py-3 text-sm font-semibold tracking-normal hover:opacity-70";
  const ctaClass = usesLatinNavStyle
    ? "hidden rounded px-4 py-2 text-[11px] font-bold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90 sm:inline-flex sm:py-2.5 sm:text-xs"
    : "hidden rounded px-4 py-2 text-[13px] font-bold tracking-normal text-white transition-opacity hover:opacity-90 sm:inline-flex sm:py-2.5 sm:text-sm";

  return (
    <header
      className="fixed top-0 z-50 w-full border-b shadow-sm"
      style={{ backgroundColor: brand.white, borderColor: `${brand.forest}12` }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link href={paths.page("home")} className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
          <img
            src={olonNuurLogo}
            alt="Olon Nuur Travel"
            className="h-11 w-11 shrink-0 rounded-full object-cover object-top sm:h-12 sm:w-12"
          />
          <div className="hidden min-w-0 sm:block">
            <div className="font-serif text-sm font-semibold uppercase tracking-[0.15em] sm:text-base" style={{ color: brand.forest }}>
              Olon Nuur
            </div>
            <div className="text-[9px] font-semibold uppercase tracking-[0.35em] sm:text-[10px]" style={{ color: brand.gold }}>
              Travel
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 xl:flex" aria-label="Main">
          {MENU.map((page) => {
            const active = isActive(page);
            const style = { color: active ? brand.gold : brand.forest };
            if (page === "tours") {
              return (
                <DropdownMenu key={page}>
                  <DropdownMenuTrigger className={`${navLinkClass} flex items-center gap-1 outline-none`} style={style}>
                    {labelFor.tours}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-[16rem]">
                    {tours.map((tour) => (
                      <DropdownMenuItem key={tour.slug} asChild>
                        <Link href={paths.tour(tour.slug)} className="cursor-pointer">
                          {localize(tour.hero.title, lang)}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <Link href={paths.page("tours")} className="cursor-pointer font-semibold">
                        {labelFor.tours}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <Link
                key={page}
                href={paths.page(page)}
                className={navLinkClass}
                style={style}
                aria-current={active ? "page" : undefined}
              >
                {labelFor[page]}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LangSwitcher className="hidden sm:flex" />
          {backLink && (
            <Link
              href={backLink.href}
              className="hidden items-center gap-1 rounded border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors hover:opacity-80 2xl:inline-flex 2xl:text-xs"
              style={{ borderColor: `${brand.forest}30`, color: brand.forest }}
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="max-w-[120px] truncate">{backLink.label}</span>
            </Link>
          )}
          <Link href={paths.contact()} className={ctaClass} style={{ backgroundColor: brand.forest }}>
            {nav.requestTour}
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded xl:hidden"
            style={{ color: brand.forest }}
            onClick={() => setMobileNav(!mobileNav)}
            aria-label={mobileNav ? nav.menuClose : nav.menuOpen}
            aria-expanded={mobileNav}
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileNav && (
        <nav
          className="max-h-[min(75dvh,36rem)] overflow-y-auto border-t px-4 py-4 xl:hidden"
          style={{ borderColor: `${brand.forest}12`, backgroundColor: brand.white }}
          aria-label="Main"
        >
          <div className="mb-3 sm:hidden">
            <LangSwitcher onSelect={closeMobile} />
          </div>
          <div className="flex flex-col gap-0.5" style={{ color: brand.forest }}>
            {backLink && (
              <Link href={backLink.href} className={mobileNavLinkClass} onClick={closeMobile}>
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {backLink.label}
                </span>
              </Link>
            )}
            {MENU.map((page) => (
              <Link
                key={page}
                href={paths.page(page)}
                className={mobileNavLinkClass}
                onClick={closeMobile}
                aria-current={isActive(page) ? "page" : undefined}
              >
                {labelFor[page]}
              </Link>
            ))}
            <Link
              href={paths.contact()}
              className={`mt-2 text-center text-white ${mobileNavLinkClass} font-bold`}
              style={{ backgroundColor: brand.forest }}
              onClick={closeMobile}
            >
              {nav.requestTour}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export const SITE_NAVBAR_OFFSET = "pt-[4.25rem] sm:pt-[5.25rem]";
