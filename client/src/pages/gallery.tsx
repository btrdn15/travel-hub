import { useState } from "react";
import { Link } from "wouter";
import { useLang } from "@/lib/lang";
import { brand } from "@/lib/brand";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
import { getGalleryImages } from "@/data/gallery-images";
import { getWebsiteCopy } from "@/data/website-content";
import olonNuurLogo from "@assets/olon_nuur_travel_logo.png";

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

export default function GalleryPage() {
  const { lang } = useLang();
  const tr = getWebsiteCopy(lang);
  const [activeId, setActiveId] = useState(tr.galleryCategories[0]?.id ?? "birds");
  const activeCategory = tr.galleryCategories.find((c) => c.id === activeId);
  const images = activeCategory ? getGalleryImages(activeCategory.id) : [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: brand.cream, color: brand.forest }}>
      <SiteNavbar />
      <main className={SITE_NAVBAR_OFFSET}>
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 md:py-28">
          <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <SectionOrnament />
            <h1 className="font-serif text-2xl uppercase tracking-[0.12em] sm:text-3xl md:text-4xl">
              {tr.galleryTitle}
            </h1>
          </div>

          <nav
            className="mx-auto mb-12 flex max-w-4xl items-center justify-center gap-6 border-b pb-5 sm:mb-16 sm:gap-10 md:gap-14"
            style={{ borderColor: `${brand.forest}12` }}
            aria-label={tr.galleryTitle}
          >
            {tr.galleryCategories.map((category) => {
              const active = category.id === activeId;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setActiveId(category.id)}
                  className="relative shrink-0 text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors hover:opacity-80 sm:text-[11px] sm:tracking-[0.2em]"
                  style={{ color: active ? brand.gold : brand.forest }}
                  aria-current={active ? "page" : undefined}
                >
                  {category.title}
                  {active && (
                    <span
                      className="absolute -bottom-5 left-0 right-0 mx-auto h-px w-full max-w-[2rem]"
                      style={{ backgroundColor: brand.gold }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {activeCategory && (
            <section id={activeCategory.id} className="mx-auto w-full max-w-md sm:max-w-lg">
              <div className="flex flex-col gap-3 sm:gap-4" aria-label={activeCategory.title}>
                {images.map((image, index) => (
                  <div
                    key={`${activeCategory.id}-${index}`}
                    className="aspect-[3/4] w-full overflow-hidden"
                  >
                    <img
                      src={image.src}
                      alt={image.alt}
                      loading={index < 3 ? "eager" : "lazy"}
                      decoding="async"
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

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
            <p className="text-center text-[10px] text-white/40 md:text-right">{tr.copyright}</p>
          </div>
        </footer>
      </main>
    </div>
  );
}
