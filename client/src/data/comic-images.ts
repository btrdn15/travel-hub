export type ComicImage = {
  src: string;
  alt: string;
};

const episodeModules = {
  "episode-01": import.meta.glob("@assets/comic/episode-01/page-*.jpg", {
    eager: true,
    import: "default",
  }) as Record<string, string>,
  "episode-02": import.meta.glob("@assets/comic/episode-02/page-*.jpg", {
    eager: true,
    import: "default",
  }) as Record<string, string>,
  "episode-03": import.meta.glob("@assets/comic/episode-03/page-*.jpg", {
    eager: true,
    import: "default",
  }) as Record<string, string>,
  "episode-04": import.meta.glob("@assets/comic/episode-04/page-*.jpg", {
    eager: true,
    import: "default",
  }) as Record<string, string>,
};

function loadEpisode(id: string, episodeNumber: number): ComicImage[] {
  const modules = episodeModules[id as keyof typeof episodeModules] ?? {};
  return Object.keys(modules)
    .sort()
    .map((path, index) => ({
      src: modules[path],
      alt: `Episode ${episodeNumber} — ${index + 1}`,
    }));
}

const COMIC_IMAGES: Record<string, ComicImage[]> = {
  "episode-01": loadEpisode("episode-01", 1),
  "episode-02": loadEpisode("episode-02", 2),
  "episode-03": loadEpisode("episode-03", 3),
  "episode-04": loadEpisode("episode-04", 4),
};

export function getComicImages(episodeId: string): ComicImage[] {
  return COMIC_IMAGES[episodeId] ?? [];
}
