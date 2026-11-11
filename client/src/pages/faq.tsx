import { useLang } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { PageShell, TextSection } from "@/components/page-shell";
import { brand } from "@/lib/brand";

/** FAQ / Booking Terms: Booking, Payment, Cancellation, FAQ (баримтаас) */
export default function FaqPage() {
  const { lang } = useLang();
  const c = SITE_COPY[lang].faq;
  return (
    <PageShell title={c.title}>
      <TextSection title={c.bookingTitle}>
        <p>{c.booking}</p>
      </TextSection>
      <TextSection title={c.paymentTitle}>
        <p>{c.payment}</p>
      </TextSection>
      <TextSection title={c.cancellationTitle}>
        <p>{c.cancellation}</p>
      </TextSection>
      <TextSection title={c.faqTitle}>
        <dl className="divide-y divide-stone-200 rounded-xl border border-stone-200 bg-white">
          {c.items.map((item) => (
            <div key={item.q} className="p-4">
              <dt className="font-semibold" style={{ color: brand.forest }}>{item.q}</dt>
              <dd className="mt-1 text-stone-700">{item.a}</dd>
            </div>
          ))}
        </dl>
      </TextSection>
    </PageShell>
  );
}
