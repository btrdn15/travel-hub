import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LangProvider } from "@/lib/lang";
import HomePage from "@/pages/home";
import TourDetailPage from "@/pages/tour-detail";
import BookingPage from "@/pages/booking";
import NotFound from "@/pages/not-found";
import { FloatingSocialLinks } from "@/components/floating-chat";
import { GoogleAnalytics } from "@/components/google-analytics";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/tours/:slug" component={TourDetailPage} />
      <Route path="/book" component={BookingPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LangProvider>
          <GoogleAnalytics />
          <Toaster />
          <Router />
          <FloatingSocialLinks />
        </LangProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
