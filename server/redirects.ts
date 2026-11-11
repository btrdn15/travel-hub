import type { Express } from "express";
import { resolveLegacyRedirect } from "@shared/site-routes";

/**
 * Хуучин URL-ууд (/tours/:slug, /book, /gallery, /comic, хуучин slug) → 301.
 * Хайлтын системийн индекс болон хуучин линкүүд эвдрэхгүй.
 */
export function registerLegacyRedirects(app: Express) {
  app.use((req, res, next) => {
    if (req.method !== "GET" && req.method !== "HEAD") return next();
    if (req.path.startsWith("/api/")) return next();

    const qIndex = req.originalUrl.indexOf("?");
    const search = qIndex >= 0 ? req.originalUrl.slice(qIndex) : "";
    const target = resolveLegacyRedirect(req.path, search);
    if (!target) return next();

    return res.redirect(301, target);
  });
}
