import { Link } from "wouter";
import { useLang } from "@/lib/lang";
import { brand } from "@/lib/brand";
import { getWebsiteCopy } from "@/data/website-content";

/** Fixed navbar + announcement banner — home hero top padding */
export const SITE_HOME_WITH_BANNER_OFFSET = "pt-[6.5rem] sm:pt-[7.5rem]";

const NAVBAR_TOP = "top-[4.25rem] sm:top-[5.25rem]";

/** JS bundle-д шууд — production дээр хуучин CSS үлдсэн ч урсана */
const MARQUEE_STYLE = `
@keyframes on-announcement-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.on-announcement-marquee-track {
  display: flex;
  width: max-content;
  animation: on-announcement-marquee 40s linear infinite;
  will-change: transform;
}
@media (prefers-reduced-motion: reduce) {
  .on-announcement-marquee-track { animation: none; }
}
`;

function MarqueeItem({
  text,
  href,
  separator,
}: {
  text: string;
  href?: string;
  separator: string;
}) {
  const content = (
    <>
      <span
        className="h-1 w-1 shrink-0 rotate-45"
        style={{ backgroundColor: brand.gold }}
        aria-hidden
      />
      {href ? (
        <span className="underline decoration-white/30 underline-offset-2 transition-colors hover:text-[#f0d9a8]">
          {text}
        </span>
      ) : (
        <span>{text}</span>
      )}
      <span className="text-white/35" aria-hidden>
        {separator}
      </span>
    </>
  );

  const className = "inline-flex shrink-0 items-center gap-3 px-6";

  if (href?.startsWith("/")) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={`${className} hover:opacity-90`}>
        {content}
      </a>
    );
  }
  return <span className={className}>{content}</span>;
}

function MarqueeTrack({ items, separator }: { items: { text: string; href?: string }[]; separator: string }) {
  const repeated = [...items, ...items, ...items, ...items];
  return (
    <div className="announcement-marquee-group flex shrink-0 items-center">
      {repeated.map((item, i) => (
        <MarqueeItem
          key={`${item.text}-${i}`}
          text={item.text}
          href={item.href}
          separator={separator}
        />
      ))}
    </div>
  );
}

export function AnnouncementBanner() {
  const { lang } = useLang();
  const items = getWebsiteCopy(lang).announcementMarquee;
  if (!items?.length) return null;

  const separator = "◆";

  return (
    <>
      <style>{MARQUEE_STYLE}</style>
      <div
        className={`fixed left-0 right-0 z-40 ${NAVBAR_TOP} overflow-hidden border-b`}
        style={{
          backgroundColor: brand.forest,
          borderColor: `${brand.gold}40`,
        }}
        data-testid="announcement-banner"
      >
        <div className="flex h-9 items-center">
          <div className="on-announcement-marquee-track flex whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-white/95 sm:text-xs sm:tracking-[0.18em]">
            <MarqueeTrack items={items} separator={separator} />
            <div aria-hidden>
              <MarqueeTrack items={items} separator={separator} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
