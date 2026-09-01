import nomadic01 from "@assets/gallery/nomadic/nomadic-01.png";
import nomadic02 from "@assets/gallery/nomadic/nomadic-02.png";
import nomadic03 from "@assets/gallery/nomadic/nomadic-03.png";
import nomadic04 from "@assets/gallery/nomadic/nomadic-04.png";
import nomadic05 from "@assets/gallery/nomadic/nomadic-05.png";
import nomadic06 from "@assets/gallery/nomadic/nomadic-06.png";
import nomadic07 from "@assets/gallery/nomadic/nomadic-07.png";
import nomadic08 from "@assets/gallery/nomadic/nomadic-08.png";
import nomadic09 from "@assets/gallery/nomadic/nomadic-09.png";
import nomadic10 from "@assets/gallery/nomadic/nomadic-10.png";
import nomadic12 from "@assets/gallery/nomadic/nomadic-12.png";
import nomadic13 from "@assets/gallery/nomadic/nomadic-13.png";
import nomadic14 from "@assets/gallery/nomadic/nomadic-14.png";
import nomadic15 from "@assets/gallery/nomadic/nomadic-15.png";
import nomadic16 from "@assets/gallery/nomadic/nomadic-16.png";
import nomadic17 from "@assets/gallery/nomadic/nomadic-17.png";

export type GalleryImage = {
  src: string;
  alt: string;
};

const birdModules = import.meta.glob("@assets/gallery/birds/birds-*.jpg", {
  eager: true,
  import: "default",
}) as Record<string, string>;

const birds: GalleryImage[] = Object.keys(birdModules)
  .sort()
  .map((path, index) => ({
    src: birdModules[path],
    alt: `Шувуудын ${index + 1}`,
  }));

export const GALLERY_IMAGES: Record<string, GalleryImage[]> = {
  birds,
  nomadic: [
    { src: nomadic01, alt: "Нүүдэлчин ахуй 1" },
    { src: nomadic02, alt: "Нүүдэлчин ахуй 2" },
    { src: nomadic03, alt: "Нүүдэлчин ахуй 3" },
    { src: nomadic04, alt: "Нүүдэлчин ахуй 4" },
    { src: nomadic05, alt: "Нүүдэлчин ахуй 5" },
    { src: nomadic06, alt: "Нүүдэлчин ахуй 6" },
    { src: nomadic07, alt: "Нүүдэлчин ахуй 7" },
    { src: nomadic08, alt: "Нүүдэлчин ахуй 8" },
    { src: nomadic09, alt: "Нүүдэлчин ахуй 9" },
    { src: nomadic10, alt: "Нүүдэлчин ахуй 10" },
    { src: nomadic12, alt: "Нүүдэлчин ахуй 12" },
    { src: nomadic13, alt: "Нүүдэлчин ахуй 13" },
    { src: nomadic14, alt: "Нүүдэлчин ахуй 14" },
    { src: nomadic15, alt: "Нүүдэлчин ахуй 15" },
    { src: nomadic16, alt: "Нүүдэлчин ахуй 16" },
    { src: nomadic17, alt: "Нүүдэлчин ахуй 17" },
  ],
  nature: [],
};

export function getGalleryImages(categoryId: string): GalleryImage[] {
  return GALLERY_IMAGES[categoryId] ?? [];
}
