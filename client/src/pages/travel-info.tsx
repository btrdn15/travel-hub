import { useLang } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { PageShell, TextSection } from "@/components/page-shell";

/** Travel Information: Travel Safety + Pre-departure Information (баримтаас) */
export default function TravelInfoPage() {
  const { lang } = useLang();
  const c = SITE_COPY[lang].travelInfo;
  return (
    <PageShell title={c.title}>
      <TextSection title={c.safetyTitle}>
        <p>{c.safety}</p>
      </TextSection>
      <TextSection title={c.preDepartureTitle}>
        <p>{c.preDeparture}</p>
      </TextSection>
    </PageShell>
  );
}
