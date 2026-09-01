import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { LangProvider } from "@/lib/lang";
import AdminLoginPage from "@/pages/admin-login";
import HomePage from "@/pages/home";
import TourDetailPage from "@/pages/tour-detail";
import BookingPage from "@/pages/booking";
import GalleryPage from "@/pages/gallery";
import ComicPage from "@/pages/comic";
import NotFound from "@/pages/not-found";
import { FloatingSocialLinks } from "@/components/floating-chat";
import { GoogleAnalytics } from "@/components/google-analytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/tours/:slug" component={TourDetailPage} />
      <Route path="/book" component={BookingPage} />
      <Route path="/gallery" component={GalleryPage} />
      <Route path="/comic" component={ComicPage} />
      <Route path="/ont1">{() => <AdminLoginPage slot="ont1" />}</Route>
      <Route path="/ont2">{() => <AdminLoginPage slot="ont2" />}</Route>
      <Route path="/ont3">{() => <AdminLoginPage slot="ont3" />}</Route>
      <Route path="/on1">{() => <AdminLoginPage slot="ont1" />}</Route>
      <Route path="/on2">{() => <AdminLoginPage slot="ont2" />}</Route>
      <Route path="/on3">{() => <AdminLoginPage slot="ont3" />}</Route>
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
