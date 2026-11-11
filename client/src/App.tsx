import type { ComponentType } from "react";
import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { LangProvider } from "@/lib/lang";
import { isSiteLang } from "@shared/tours-2027";
import { resolveLegacyRedirect } from "@shared/site-routes";
import AdminLoginPage from "@/pages/admin-login";
import HomePage from "@/pages/home";
import TourDetailPage from "@/pages/tour-detail";
import BookingPage from "@/pages/booking";
import GalleryPage from "@/pages/gallery";
import ComicPage from "@/pages/comic";
import NotFound from "@/pages/not-found";
import ToursPage from "@/pages/tours";
import DeparturesPage from "@/pages/departures";
import AboutPage from "@/pages/about";
import TravelInfoPage from "@/pages/travel-info";
import FaqPage from "@/pages/faq";
import PrivacyPage from "@/pages/privacy";
import { FloatingSocialLinks } from "@/components/floating-chat";
import { GoogleAnalytics } from "@/components/google-analytics";

/** /:lang/... — хэлний код буруу бол 404 */
function langRoute(Page: ComponentType) {
  return function LangGuard({ params }: { params: { lang?: string } }) {
    return isSiteLang(params.lang) ? <Page /> : <NotFound />;
  };
}

// Module түвшинд нэг удаа үүсгэнэ (render бүрт шинэ компонент үүсгэвэл хуудас дахин mount болно)
const LANG_PAGES = (
  [
    ["/:lang/tours/:slug", TourDetailPage],
    ["/:lang/tours", ToursPage],
    ["/:lang/departures", DeparturesPage],
    ["/:lang/about", AboutPage],
    ["/:lang/travel-information", TravelInfoPage],
    ["/:lang/faq", FaqPage],
    ["/:lang/privacy", PrivacyPage],
    ["/:lang/contact", BookingPage],
    ["/:lang/gallery", GalleryPage],
    ["/:lang/comic", ComicPage],
    ["/:lang", HomePage],
  ] as Array<[string, ComponentType]>
).map(([path, Page]) => [path, langRoute(Page)] as const);

function Router() {
  const [location] = useLocation();

  // Хуучин хэлгүй URL, хуучин slug → шинэ хаяг (server тал 301 хийдэг; энэ нь SPA доторх навигацид)
  const legacy = resolveLegacyRedirect(location, window.location.search);
  if (legacy) return <Redirect to={legacy} replace />;

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/ont1">{() => <AdminLoginPage slot="ont1" />}</Route>
      <Route path="/ont2">{() => <AdminLoginPage slot="ont2" />}</Route>
      <Route path="/ont3">{() => <AdminLoginPage slot="ont3" />}</Route>
      <Route path="/on1">{() => <AdminLoginPage slot="ont1" />}</Route>
      <Route path="/on2">{() => <AdminLoginPage slot="ont2" />}</Route>
      <Route path="/on3">{() => <AdminLoginPage slot="ont3" />}</Route>
      {LANG_PAGES.map(([path, Guarded]) => (
        <Route key={path} path={path} component={Guarded} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <LangProvider>
            <GoogleAnalytics />
            <Toaster />
            <Router />
            <FloatingSocialLinks />
          </LangProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
