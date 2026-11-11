/**
 * script/render-check.ts-ээс vite ssrLoadModule-аар ачаалагдана.
 * Хуудсыг тухайн URL дээр server талд render хийж HTML буцаана.
 */
import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { LangProvider } from "@/lib/lang";
import HomePage from "@/pages/home";
import TourDetailPage from "@/pages/tour-detail";
import BookingPage from "@/pages/booking";
import GalleryPage from "@/pages/gallery";
import ComicPage from "@/pages/comic";
import NotFound from "@/pages/not-found";

export const PAGES: Record<string, ComponentType> = {
  home: HomePage,
  tour: TourDetailPage,
  contact: BookingPage,
  gallery: GalleryPage,
  comic: ComicPage,
  notFound: NotFound,
};

export function render(pageKey: string, path: string): string {
  const Page = PAGES[pageKey];
  if (!Page) throw new Error(`Unknown page key: ${pageKey}`);
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Router ssrPath={path}>
            <LangProvider>
              <Page />
            </LangProvider>
          </Router>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>,
  );
}
