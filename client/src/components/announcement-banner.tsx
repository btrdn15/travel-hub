import { Link } from "wouter";
import { useLang } from "@/lib/lang";
import { brand } from "@/lib/brand";
import { getWebsiteCopy } from "@/data/website-content";

/** Fixed navbar + announcement banner — home hero top padding */
export const SITE_HOME_WITH_BANNER_OFFSET = "pt-[6.5rem] sm:pt-[7.5rem]";

const NAVBAR_TOP = "top-[4.25rem] sm:top-[5.25rem]";

function MarqueeItem({
  text,
  href,
  separator,
}: {
  text: string;
  href?: string;
  separator: string;
}) {
  const inner = (
    <span className="inline-flex items-center gap-3 px-6">
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
    </span>
  );

  if (href?.startsWith("/")) {
    return <Link href={href}>{inner}</Link>;
  }
  if (href) {
    return (
      <a href={href} className="hover:opacity-90">
        {inner}
      </a>
    );
  }
  return inner;
}

export function AnnouncementBanner() {
  const { lang } = useLang();
  const items = getWebsiteCopy(lang).announcementMarquee;
  if (!items?.length) return null;

  const separator = "◆";
  const track = items.map((item, i) => (
    <MarqueeItem key={`${item.text}-${i}`} text={item.text} href={item.href} separator={separator} />
  ));

  return (
    <div
      className={`fixed left-0 right-0 z-40 ${NAVBAR_TOP} overflow-hidden border-b`}
      style={{
        backgroundColor: brand.forest,
        borderColor: `${brand.gold}40`,
      }}
      data-testid="announcement-banner"
    >
      <div className="flex h-9 items-center">
        <div className="flex w-max animate-marquee motion-reduce:animate-none whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.14em] text-white/95 sm:text-xs sm:tracking-[0.18em]">
          {track}
          {track}
        </div>
      </div>
    </div>
  );
}
