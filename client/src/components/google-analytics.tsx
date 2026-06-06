import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackPageView } from "@/lib/analytics";

/** SPA route өөрчлөгдөх бүрт GA4 page_view илгээнэ */
export function GoogleAnalytics() {
  const [location] = useLocation();

  useEffect(() => {
    trackPageView(location + window.location.search);
  }, [location]);

  return null;
}
