import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useLang, LANG_ORDER, LANG_LABELS, type Lang } from "@/lib/lang";
import { getWebsiteCopy } from "@/data/website-content";
import { brand } from "@/lib/brand";
import { tours } from "@/data/tours";
import { localize } from "@/lib/localize";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, Globe, ArrowLeft, X, ChevronDown, Check } from "lucide-react";
import olonNuurLogo from "@assets/olon_nuur_travel_logo.png";

function LangSwitcher({
  className = "",
  onSelect,
}: {
  className?: string;
  onSelect?: () => void;
}) {
  const { lang, setLang } = useLang();

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
          aria-label="Хэл солих"
          data-testid="button-lang-switch"
        >
          <Globe className="h-4 w-4 shrink-0 opacity-70" />
          <span>{LANG_LABELS[lang]}</span>
          <ChevronDown className="h-3.5 w-3.5 shrink-0 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[10rem]">
        {LANG_ORDER.map((code) => (
          <DropdownMenuItem
            key={code}
            onClick={() => pick(code)}
            className="flex cursor-pointer items-center justify-between gap-3"
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

export function SiteNavbar({ backLink }: SiteNavbarProps) {
  const { lang } = useLang();
  const [location] = useLocation();
  const t = getWebsiteCopy(lang);
  const [mobileNav, setMobileNav] = useState(false);

  const onHome = location === "/";
  const anchor = (hash: string) => (onHome ? hash : `/${hash}`);

  const navLinks = [
    { href: "/", label: t.navHome, isHome: true },
    { href: anchor("#tours"), label: t.navJourneys, hasExpeditions: true },
    { href: anchor("#why"), label: t.navAbout },
    { href: anchor("#gallery"), label: t.navGallery },
    { href: anchor("#brochure"), label: t.navBlog },
    { href: anchor("#contact"), label: t.navContact },
  ];

  const closeMobile = () => setMobileNav(false);

  const navLinkClass = (active: boolean) =>
    `relative text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:opacity-80 ${
      active ? "" : ""
    }`;

  return (
    <header
      className="fixed top-0 z-50 w-full border-b shadow-sm"
      style={{ backgroundColor: brand.white, borderColor: `${brand.forest}12` }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4">
        <Link href="/" className="flex min-w-0 shrink-0 items-center gap-2.5 sm:gap-3">
          <img
            src={olonNuurLogo}
            alt="Olon Nuur Travel"
            className="h-11 w-11 shrink-0 rounded-full object-cover object-top sm:h-12 sm:w-12"
          />
          <div className="hidden min-w-0 sm:block">
            <div
              className="font-serif text-sm font-semibold uppercase tracking-[0.15em] sm:text-base"
              style={{ color: brand.forest }}
            >
              Olon Nuur
            </div>
            <div
              className="text-[9px] font-semibold uppercase tracking-[0.35em] sm:text-[10px]"
              style={{ color: brand.gold }}
            >
              Travel
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-5 lg:flex lg:gap-7 xl:gap-9">
          {navLinks.map((link) => {
            const active = link.isHome && onHome;
            if (link.hasExpeditions) {
              return (
                <DropdownMenu key={link.href}>
                  <DropdownMenuTrigger
                    className={`${navLinkClass(false)} flex items-center gap-1 outline-none`}
                    style={{ color: brand.forest }}
                  >
                    {link.label}
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="min-w-[14rem]">
                    {tours.map((tour) => (
                      <DropdownMenuItem key={tour.slug} asChild>
                        <Link
                          href={`/tours/${tour.slug}`}
                          className="cursor-pointer"
                        >
                          {localize(tour.hero.title, lang)}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuItem asChild>
                      <a href={link.href} className="cursor-pointer font-semibold">
                        {t.navJourneys}
                      </a>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              );
            }
            return (
              <a
                key={link.href}
                href={link.href}
                className={navLinkClass(!!active)}
                style={{ color: active ? brand.gold : brand.forest }}
              >
                {link.label}
                {active && (
                  <span
                    className="absolute -bottom-1 left-0 right-0 mx-auto h-px w-full max-w-[2rem]"
                    style={{ backgroundColor: brand.gold }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          <LangSwitcher className="hidden sm:flex" />
          {backLink && (
            <Link
              href={backLink.href}
              className="hidden items-center gap-1 rounded border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-colors hover:opacity-80 lg:inline-flex lg:text-xs"
              style={{ borderColor: `${brand.forest}30`, color: brand.forest }}
            >
              <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
              <span className="max-w-[120px] truncate">{backLink.label}</span>
            </Link>
          )}
          <Link
            href="/book"
            className="hidden rounded px-4 py-2 text-[11px] font-bold uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90 sm:inline-flex sm:px-5 sm:py-2.5 sm:text-xs"
            style={{ backgroundColor: brand.forest }}
          >
            {t.bookNow}
          </Link>
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded lg:hidden"
            style={{ color: brand.forest }}
            onClick={() => setMobileNav(!mobileNav)}
            aria-label={mobileNav ? "Цэс хаах" : "Цэс нээх"}
            aria-expanded={mobileNav}
          >
            {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileNav && (
        <nav
          className="max-h-[min(75dvh,32rem)] overflow-y-auto border-t px-4 py-4 lg:hidden"
          style={{ borderColor: `${brand.forest}12`, backgroundColor: brand.white }}
        >
          <div className="mb-3 sm:hidden">
            <LangSwitcher onSelect={closeMobile} />
          </div>
          <div className="flex flex-col gap-0.5 text-sm" style={{ color: brand.forest }}>
            {backLink && (
              <Link
                href={backLink.href}
                className="rounded px-2 py-3 font-semibold uppercase tracking-wide hover:opacity-70"
                onClick={closeMobile}
              >
                <span className="inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  {backLink.label}
                </span>
              </Link>
            )}
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded px-2 py-3 text-xs font-semibold uppercase tracking-[0.15em] hover:opacity-70"
                onClick={closeMobile}
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/book"
              className="mt-2 rounded px-2 py-3 text-center text-xs font-bold uppercase tracking-[0.15em] text-white"
              style={{ backgroundColor: brand.forest }}
              onClick={closeMobile}
            >
              {t.bookNow}
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}

export const SITE_NAVBAR_OFFSET = "pt-[4.25rem] sm:pt-[5.25rem]";
