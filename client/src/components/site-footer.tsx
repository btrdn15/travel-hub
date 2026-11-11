import { Link } from "wouter";
import { Instagram, Mail, Phone, Globe2 } from "lucide-react";
import { useLang, usePaths } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { CONTACT } from "@/data/website-content";
import { brand } from "@/lib/brand";
import olonNuurLogo from "@assets/olon_nuur_travel_logo.png";

/** Нийтлэг footer: холбоо барих (баримтын CONTACT), цэс, нөхцөл, нууцлал, social */
export function SiteFooter() {
  const { lang } = useLang();
  const paths = usePaths();
  const c = SITE_COPY[lang];

  const links = [
    { href: paths.page("tours"), label: c.nav.tours },
    { href: paths.page("departures"), label: c.nav.departures },
    { href: paths.page("about"), label: c.nav.about },
    { href: paths.page("travelInfo"), label: c.nav.travelInfo },
    { href: paths.page("faq"), label: c.nav.faq },
    { href: paths.page("contact"), label: c.nav.contact },
    { href: paths.page("gallery"), label: c.nav.gallery },
    { href: paths.page("comic"), label: c.nav.comic },
  ];

  return (
    <footer style={{ backgroundColor: brand.forestDark }} className="text-white/80">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-3">
        <div>
          <Link href={paths.page("home")} className="inline-flex items-center gap-2.5">
            <img src={olonNuurLogo} alt="" className="h-9 w-9 rounded-full object-cover object-top" aria-hidden />
            <span className="font-serif text-sm uppercase tracking-[0.12em] text-white">Olon Nuur Travel</span>
          </Link>
          <ul className="mt-5 space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Globe2 className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              <a href={CONTACT.websiteUrl} className="hover:text-white">{CONTACT.website}</a>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              <a href={`mailto:${CONTACT.email}`} className="hover:text-white">{CONTACT.email}</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              <span>
                {CONTACT.phones.map((p, i) => (
                  <span key={p}>
                    {i > 0 && " / "}
                    <a href={CONTACT.phoneHref[i]} className="hover:text-white">{p}</a>
                  </span>
                ))}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Instagram className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
              <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="hover:text-white">
                {CONTACT.instagram}
              </a>
            </li>
          </ul>
        </div>

        <nav className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm" aria-label="Footer">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex flex-col gap-2 text-sm md:items-end">
          <Link href={paths.page("faq")} className="hover:text-white">{c.footer.terms}</Link>
          <Link href={paths.page("privacy")} className="hover:text-white">{c.footer.privacy}</Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} Olon Nuur Travel LLC. {c.footer.rights}
      </div>
    </footer>
  );
}
