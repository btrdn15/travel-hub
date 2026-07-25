#!/usr/bin/env python3
"""Copy and enhance bird gallery images for the Шувуудын section."""

from __future__ import annotations

import glob
import os
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SRC_DIR = Path(
    os.environ.get(
        "BIRD_SRC_DIR",
        "/Users/khulan/.cursor/projects/Users-khulan-Downloads-Travel-Hub/assets",
    )
)
OUT_DIR = ROOT / "attached_assets" / "gallery" / "birds"
MANIFEST = ROOT / "script" / "bird-gallery-manifest.txt"
MAX_EDGE = 1600
JPEG_QUALITY = 92


def enhance_image(image: Image.Image) -> Image.Image:
    image = ImageOps.exif_transpose(image)
    if image.mode != "RGB":
        image = image.convert("RGB")

    image = ImageOps.autocontrast(image, cutoff=1)

    w, h = image.size
    longest = max(w, h)
    if longest > MAX_EDGE:
        scale = MAX_EDGE / longest
        image = image.resize((int(w * scale), int(h * scale)), Image.Resampling.LANCZOS)

    image = ImageEnhance.Sharpness(image).enhance(1.35)
    image = ImageEnhance.Contrast(image).enhance(1.12)
    image = ImageEnhance.Color(image).enhance(1.08)
    image = ImageEnhance.Brightness(image).enhance(1.03)
    return image


def load_manifest() -> list[str]:
    if not MANIFEST.exists():
        raise SystemExit(f"Manifest not found: {MANIFEST}")
    names: list[str] = []
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        name = line.strip()
        if name:
            names.append(name)
    return names


def resolve_source(name: str) -> Path | None:
    direct = SRC_DIR / name
    if direct.exists():
        return direct
    uid = name.rsplit("-", 5)[-1].removesuffix(".png")
    matches = sorted(SRC_DIR.glob(f"*{uid}.png"))
    return matches[0] if matches else None


def main() -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    names = load_manifest()
    processed = 0

    for index, name in enumerate(names, start=1):
        src = resolve_source(name)
        if src is None:
            print(f"SKIP missing: {name}")
            continue

        out = OUT_DIR / f"birds-{index:03d}.jpg"
        with Image.open(src) as raw:
            enhanced = enhance_image(raw)
            enhanced.save(out, format="JPEG", quality=JPEG_QUALITY, optimize=True)
        processed += 1
        print(f"OK {index:03d}: {src.name} -> {out.name}")

    print(f"Done: {processed}/{len(names)} images -> {OUT_DIR}")


if __name__ == "__main__":
    main()
