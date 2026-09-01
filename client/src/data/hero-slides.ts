const slideModules = import.meta.glob("@assets/hero/hero-slide-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

export const HERO_SLIDES: string[] = Object.keys(slideModules)
  .sort()
  .map((path) => slideModules[path]);

export const HERO_SLIDE_INTERVAL_MS = 3000;
