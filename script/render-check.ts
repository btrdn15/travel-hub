/**
 * Хуудсуудыг бүх хэл дээр server талд render хийж crash болон
 * `localize` warning (дутуу LocalizedString) байгаа эсэхийг шалгана.
 *
 *   npm run check:render
 *
 * Browser шаардлагагүй. useEffect ажиллахгүй тул зөвхөн render-ийн алдааг барина.
 */
import path from "node:path";
import { createServer } from "vite";
import { SITE_LANGS, TOURS_2027 } from "../shared/tours-2027";

type Case = { page: string; path: string; expect?: (html: string) => string | null };

const root = path.resolve(import.meta.dirname, "..");

function cases(): Case[] {
  const out: Case[] = [];
  for (const lang of SITE_LANGS) {
    out.push({ page: "home", path: `/${lang}/` });
    out.push({ page: "contact", path: `/${lang}/contact` });
    out.push({ page: "gallery", path: `/${lang}/gallery` });
    out.push({ page: "comic", path: `/${lang}/comic` });
    for (const tour of TOURS_2027) {
      out.push({
        page: "tour",
        path: `/${lang}/tours/${tour.slug}`,
        expect: (html) => {
          if (tour.status === "info_only" && /\$\d/.test(html)) return "info-only tour shows a $ price";
          if (/₩|KRW/.test(html)) return "KRW visible";
          return null;
        },
      });
    }
  }
  out.push({ page: "home", path: "/" });
  return out;
}

async function main() {
  const vite = await createServer({
    root: path.join(root, "client"),
    configFile: path.join(root, "vite.config.ts"),
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
    logLevel: "error",
  });

  const warnings: string[] = [];
  const origWarn = console.warn;
  const origError = console.error;
  let current = "";
  console.warn = (...args: unknown[]) => {
    warnings.push(`${current}: ${String(args[0])}`);
  };
  console.error = (...args: unknown[]) => {
    const msg = String(args[0]);
    // React SSR-д useLayoutEffect анхааруулга — алдаа биш
    if (msg.includes("useLayoutEffect does nothing on the server")) return;
    const rest = args.slice(1).map(String);
    const formatted = msg.replace(/%s/g, () => rest.shift() ?? "");
    warnings.push(`${current}: [error] ${formatted.split("\n")[0]}`);
  };

  const failures: string[] = [];
  let ok = 0;
  try {
    const mod = await vite.ssrLoadModule(path.join(root, "script/render-check-entry.tsx"));
    for (const c of cases()) {
      current = c.path;
      try {
        const html: string = mod.render(c.page, c.path);
        const problem = c.expect?.(html) ?? null;
        if (problem) failures.push(`${c.path}: ${problem}`);
        else ok++;
      } catch (err) {
        failures.push(`${c.path}: CRASH ${(err as Error).message}`);
      }
    }
  } finally {
    console.warn = origWarn;
    console.error = origError;
    await vite.close();
  }

  console.log(`rendered OK: ${ok}`);
  for (const w of warnings) console.log(`WARN  ${w}`);
  for (const f of failures) console.log(`FAIL  ${f}`);
  process.exit(failures.length || warnings.length ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
