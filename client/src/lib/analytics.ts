declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

const GA_ID = "G-HZX3Y1P3SC";

export function trackPageView(path: string) {
  if (typeof window.gtag !== "function") return;
  window.gtag("config", GA_ID, { page_path: path });
}
