import { useEffect } from "react";
import { Link, Redirect, useRoute } from "wouter";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
import { SiteFooter } from "@/components/site-footer";
import {
  AlertTriangle,
  ArrowLeft,
  BedDouble,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Tent,
  Users,
  Utensils,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HIGH_FETCH_PRIORITY } from "@/lib/utils";
import { useLang, usePaths, type Lang } from "@/lib/lang";
import { getTourBySlug, type LocalizedString } from "@/data/tours";
import { localize, localizeScheduleTime } from "@/lib/localize";
import { formatDepartureRange, formatTravelers } from "@/lib/format";
import {
  DEPOSIT_RATE,
  BALANCE_RATE,
  ESTIMATE_DISCLAIMER,
  PRICE_ON_REQUEST,
  formatUsd,
  getTour2027,
  isPriced,
  resolveTourSlug,
} from "@shared/tours-2027";
import { CONTACT } from "@/data/website-content";
import NotFound from "@/pages/not-found";

const t = (str: LocalizedString | undefined, lang: Lang) => localize(str, lang);

function TourHeroPicture({
  src,
  srcHd,
  srcWebp,
  alt,
  objectPosition = "center 40%",
  objectScale,
}: {
  src: string;
  srcHd?: string;
  srcWebp?: string;
  alt: string;
  objectPosition?: string;
  objectScale?: number;
}) {
  const hd = srcHd ?? src;
  const imgClassName = "h-full w-full object-cover brightness-[1.04] saturate-[1.06]";
  const imgStyle: React.CSSProperties = {
    objectPosition,
    ...(objectScale
      ? { transform: `scale(${objectScale}) translateY(4%)`, transformOrigin: "center top" }
      : {}),
  };

  if (srcWebp) {
    return (
      <picture className="absolute inset-0 block h-full w-full overflow-hidden">
        <source type="image/webp" srcSet={`${srcWebp} 1920w`} sizes="100vw" />
        <source type="image/jpeg" srcSet={`${hd} 1920w`} sizes="100vw" />
        <img src={hd} alt={alt} decoding="async" {...HIGH_FETCH_PRIORITY} className={imgClassName} style={imgStyle} />
      </picture>
    );
  }
  return <img src={hd} alt={alt} decoding="async" {...HIGH_FETCH_PRIORITY} className={imgClassName} style={imgStyle} />;
}

const labels = {
  en: {
    back: "All tours",
    duration: "Duration",
    groupSize: "Group size",
    crew: "Team",
    route: "Route / area",
    accommodation: "Accommodation",
    schedule: "Itinerary",
    itineraryPending: "Detailed day-by-day itinerary available on request.",
    overnight: "Overnight",
    meals: "Meals",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    special: "Special meal",
    logistics: "Logistics",
    pricing: "Prices (USD per person)",
    travelers: "Travelers",
    perPerson: "Per person",
    paymentTerms: `${DEPOSIT_RATE * 100}% deposit confirms an accepted booking; ${BALANCE_RATE * 100}% balance is paid after arrival in Mongolia, before tour start.`,
    termsLink: "Payment & cancellation terms",
    departures: "2027 departures",
    included: "Included",
    excluded: "Not included",
    notices: "Please note",
    requestTour: "Request a Tour",
    requestInfo: "Request Information",
    ctaHint: "Send us your preferred dates and number of travelers. We reply within 24 hours.",
  },
  ko: {
    back: "전체 여행 상품",
    duration: "기간",
    groupSize: "인원",
    crew: "구성",
    route: "경로 / 지역",
    accommodation: "숙박",
    schedule: "일정",
    itineraryPending: "자세한 일별 일정은 문의 시 안내해 드립니다.",
    overnight: "숙박",
    meals: "식사",
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    special: "특별 식사",
    logistics: "투어 운영",
    pricing: "요금 (1인당 USD)",
    travelers: "인원",
    perPerson: "1인당",
    paymentTerms: `예약 승인 후 총 여행비의 ${DEPOSIT_RATE * 100}%를 예약금으로 납부하며, 잔금 ${BALANCE_RATE * 100}%는 몽골 도착 후 여행 시작 전에 완납합니다.`,
    termsLink: "결제 및 취소 규정",
    departures: "2027 출발 일정",
    included: "포함 사항",
    excluded: "불포함 사항",
    notices: "안내 사항",
    requestTour: "여행 문의",
    requestInfo: "정보 문의",
    ctaHint: "희망 날짜와 인원을 보내 주세요. 24시간 이내에 답변드립니다.",
  },
  mn: {
    back: "Бүх аялал",
    duration: "Хугацаа",
    groupSize: "Хүний тоо",
    crew: "Баг",
    route: "Маршрут / бүс",
    accommodation: "Байрлах",
    schedule: "Хөтөлбөр",
    itineraryPending: "Өдөрчилсөн дэлгэрэнгүй хөтөлбөрийг хүсэлтээр илгээнэ.",
    overnight: "Хонох газар",
    meals: "Хоол",
    breakfast: "Өглөө",
    lunch: "Өдөр",
    dinner: "Орой",
    special: "Тусгай хоол",
    logistics: "Зохион байгуулалт",
    pricing: "Үнэ (нэг хүний USD)",
    travelers: "Хүн",
    perPerson: "Нэг хүний",
    paymentTerms: `Захиалгыг ${DEPOSIT_RATE * 100}%-ийн урьдчилгаагаар баталгаажуулна. Үлдэгдэл ${BALANCE_RATE * 100}%-ийг Монголд ирсний дараа, аялал эхлэхээс өмнө төлнө.`,
    termsLink: "Төлбөр, цуцлалтын нөхцөл",
    departures: "2027 оны аяллын огноо",
    included: "Багтсан",
    excluded: "Багтаагүй",
    notices: "Анхааруулга",
    requestTour: "Аялал хүсэх",
    requestInfo: "Мэдээлэл хүсэх",
    ctaHint: "Хүссэн огноо, хүний тоогоо илгээнэ үү. 24 цагийн дотор хариулна.",
  },
  ja: {
    back: "すべてのツアー",
    duration: "期間",
    groupSize: "人数",
    crew: "スタッフ",
    route: "ルート / エリア",
    accommodation: "宿泊",
    schedule: "日程",
    itineraryPending: "詳しい日程はお問い合わせ時にご案内します。",
    overnight: "宿泊",
    meals: "食事",
    breakfast: "朝食",
    lunch: "昼食",
    dinner: "夕食",
    special: "特別食",
    logistics: "運営体制",
    pricing: "料金（1名あたりUSD）",
    travelers: "人数",
    perPerson: "1名あたり",
    paymentTerms: `予約承認後、ご旅行代金の${DEPOSIT_RATE * 100}%をデポジットとしてお支払いいただき、残金${BALANCE_RATE * 100}%はモンゴル到着後、ツアー開始前にお支払いいただきます。`,
    termsLink: "お支払い・キャンセル規定",
    departures: "2027年の出発日",
    included: "含まれるもの",
    excluded: "含まれないもの",
    notices: "ご注意",
    requestTour: "ツアーを問い合わせる",
    requestInfo: "情報を問い合わせる",
    ctaHint: "ご希望の日程と人数をお送りください。24時間以内にご返信します。",
  },
} as const satisfies Record<Lang, Record<string, string>>;

function SectionTitle({ icon: Icon, children }: { icon: typeof Clock; children: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
        <Icon className="h-5 w-5 text-amber-700" />
      </div>
      <h2 className="text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">{children}</h2>
    </div>
  );
}

export default function TourDetailPage() {
  const [, params] = useRoute<{ lang: string; slug: string }>("/:lang/tours/:slug");
  const { lang } = useLang();
  const paths = usePaths();
  const rawSlug = params?.slug ?? "";
  const slug = resolveTourSlug(rawSlug);
  const tour = slug ? getTourBySlug(slug) : undefined;
  const catalog = slug ? getTour2027(slug) : undefined;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [rawSlug]);

  if (slug && slug !== rawSlug) return <Redirect to={paths.tour(slug)} replace />;
  if (!tour || !catalog) return <NotFound />;

  const L = labels[lang];
  const priced = isPriced(catalog);
  const priceRows = priced && catalog.pricesUsd
    ? Object.entries(catalog.pricesUsd)
        .map(([people, price]) => ({ people: Number(people), price }))
        .sort((a, b) => a.people - b.people)
    : [];
  const ctaLabel = catalog.status === "info_only" ? L.requestInfo : L.requestTour;

  const overviewItems = [
    { icon: Clock, label: L.duration, value: t(tour.overview.duration, lang) },
    { icon: Users, label: L.groupSize, value: t(tour.overview.groupSize, lang) },
    ...(tour.overview.crew ? [{ icon: Tent, label: L.crew, value: t(tour.overview.crew, lang) }] : []),
    ...(tour.overview.route ? [{ icon: MapPin, label: L.route, value: t(tour.overview.route, lang) }] : []),
    { icon: BedDouble, label: L.accommodation, value: t(tour.accommodation, lang) },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <SiteNavbar backLink={{ href: paths.page("tours"), label: L.back }} />

      <div className={`flex-1 flex flex-col ${SITE_NAVBAR_OFFSET}`}>
        <section className="relative flex h-[52vh] min-h-[320px] max-h-[480px] items-end overflow-hidden bg-stone-950 sm:h-[58vh] sm:min-h-[400px] md:min-h-[460px] md:max-h-[540px]">
          <div className="absolute inset-0">
            <TourHeroPicture
              src={tour.hero.image}
              srcHd={tour.hero.imageHd}
              srcWebp={tour.hero.imageWebp}
              alt={t(tour.hero.title, lang)}
              objectPosition={tour.hero.imageObjectPosition}
              objectScale={tour.hero.imageObjectScale}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-stone-950/10" />
          </div>
          <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 sm:px-6 sm:pb-14">
            <h1 className="mb-2 max-w-3xl text-2xl font-bold leading-tight text-white sm:mb-3 sm:text-3xl md:text-5xl">
              {t(tour.hero.title, lang)}
            </h1>
            <p className="max-w-2xl text-sm leading-relaxed text-stone-200 sm:text-base md:text-lg">
              {t(tour.hero.subtitle, lang)}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link href={paths.contact(tour.slug)}>
                <Button className="bg-amber-600 text-white hover:bg-amber-700">
                  <Mail className="mr-1.5 h-4 w-4" />
                  {ctaLabel}
                </Button>
              </Link>
              <span className="rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-white">
                {priced && priceRows.length
                  ? `${formatUsd(Math.min(...priceRows.map((r) => r.price)))}+`
                  : t(PRICE_ON_REQUEST, lang)}
              </span>
            </div>
          </div>
        </section>

        <main className="flex-1 pb-20 sm:pb-8">
          {/* Overview */}
          <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {overviewItems.map((item) => (
                <Card key={item.label} className="border-stone-200 bg-white">
                  <CardContent className="p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2 text-amber-700">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="text-[11px] font-semibold uppercase tracking-wider">{item.label}</span>
                    </div>
                    <p className="whitespace-pre-line text-sm font-medium leading-snug text-stone-900 sm:text-base">
                      {item.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
            <p className="text-base leading-relaxed text-stone-700 sm:text-lg">{t(tour.description, lang)}</p>
          </section>

          {/* Notices */}
          {tour.notices.length > 0 && (
            <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 sm:p-5" role="note">
                <p className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
                  <AlertTriangle className="h-4 w-4" />
                  {L.notices}
                </p>
                <ul className="space-y-1.5 text-sm leading-relaxed text-amber-900">
                  {tour.notices.map((n, i) => (
                    <li key={i}>{t(n, lang)}</li>
                  ))}
                </ul>
              </div>
            </section>
          )}

          {/* Fixed departures */}
          {catalog.fixedDepartures && catalog.fixedDepartures.length > 0 && (
            <section className="mx-auto max-w-4xl px-4 pb-10 sm:px-6">
              <SectionTitle icon={Calendar}>{L.departures}</SectionTitle>
              <ul className="grid gap-3 sm:grid-cols-2">
                {catalog.fixedDepartures.map((d) => (
                  <li key={d.start} className="rounded-xl border border-stone-200 bg-white p-4 font-semibold text-stone-900">
                    {formatDepartureRange(d, lang)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Itinerary */}
          <section className="border-y border-stone-200 bg-white py-10 sm:py-14">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <SectionTitle icon={Calendar}>{L.schedule}</SectionTitle>
              {tour.days.length === 0 ? (
                // TODO(content): өдөрчилсөн хөтөлбөр (summer-fishing, winter-ice-fishing, nomadic-culture, winter-hunting)
                <p className="rounded-xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
                  {L.itineraryPending}
                </p>
              ) : (
                <ol className="space-y-8">
                  {tour.days.map((day) => (
                    <li key={day.day} className="relative pl-12 md:pl-16">
                      <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 font-bold text-white shadow md:h-12 md:w-12">
                        {day.day}
                      </div>
                      <h3 className="mb-1 text-base font-bold text-stone-900 sm:text-lg md:text-xl">{t(day.title, lang)}</h3>
                      {day.subtitle && <p className="mb-4 text-sm font-medium text-amber-700">{t(day.subtitle, lang)}</p>}
                      <ul className="space-y-2.5">
                        {day.schedule.map((item, idx) => (
                          <li key={idx} className="flex flex-col gap-1 text-stone-700 sm:flex-row sm:gap-4">
                            <span className="shrink-0 font-mono text-sm font-semibold text-stone-900 sm:w-32">
                              {localizeScheduleTime(item.time, lang)}
                            </span>
                            <span className="text-sm leading-relaxed">{t(item.text, lang)}</span>
                          </li>
                        ))}
                      </ul>
                      {day.overnight && (
                        <div className="mt-4 inline-flex items-center gap-2 rounded-md bg-stone-100 px-3 py-1.5 text-xs text-stone-600">
                          <Tent className="h-3.5 w-3.5" />
                          <span className="font-medium">{L.overnight}:</span>
                          <span>{t(day.overnight, lang)}</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>

          {/* Meals + highlights (зөвхөн өгөгдөл байвал) */}
          {(tour.meals || tour.highlights) && (
            <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 sm:px-6 md:grid-cols-2">
              {tour.meals && (
                <Card className="border-stone-200 bg-white">
                  <CardContent className="p-6">
                    <SectionTitle icon={Utensils}>{L.meals}</SectionTitle>
                    <dl className="space-y-4 text-sm">
                      {[
                        { label: L.breakfast, value: tour.meals.breakfast },
                        { label: L.lunch, value: tour.meals.lunch },
                        { label: L.dinner, value: tour.meals.dinner },
                        ...(tour.meals.special ? [{ label: L.special, value: tour.meals.special }] : []),
                      ].map((m) => (
                        <div key={m.label}>
                          <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-amber-700">{m.label}</dt>
                          <dd className="leading-relaxed text-stone-700">{t(m.value, lang)}</dd>
                        </div>
                      ))}
                    </dl>
                  </CardContent>
                </Card>
              )}
              {tour.highlights && tour.highlights.items.length > 0 && (
                <Card className="border-stone-200 bg-white">
                  <CardContent className="p-6">
                    <SectionTitle icon={Sparkles}>{t(tour.highlights.title, lang)}</SectionTitle>
                    <ul className="space-y-2.5">
                      {tour.highlights.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-stone-700">
                          <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                          <span className="leading-relaxed">{t(item, lang)}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </section>
          )}

          {/* Logistics */}
          {tour.logistics.length > 0 && (
            <section className="border-y border-stone-200 bg-stone-100 py-12">
              <div className="mx-auto max-w-5xl px-4 sm:px-6">
                <SectionTitle icon={Compass}>{L.logistics}</SectionTitle>
                <div className="grid gap-3 md:grid-cols-2">
                  {tour.logistics.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-4">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                      <span className="text-sm leading-relaxed text-stone-700">{t(item, lang)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Pricing — info_only (hunting) аялалд үнэ, урьдчилгаа огт харуулахгүй */}
          <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
            <h2 className="mb-6 text-2xl font-bold text-stone-900 md:text-3xl">{L.pricing}</h2>
            {priced ? (
              <>
                <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">
                  <table className="w-full text-left text-sm sm:text-base">
                    <thead className="bg-stone-100 text-stone-700">
                      <tr>
                        <th scope="col" className="px-4 py-3 font-semibold">{L.travelers}</th>
                        <th scope="col" className="px-4 py-3 text-right font-semibold">{L.perPerson}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {priceRows.map((row) => (
                        <tr key={row.people} className="border-t border-stone-100">
                          <td className="px-4 py-3 text-stone-800">{formatTravelers(row.people, lang)}</td>
                          <td className="px-4 py-3 text-right font-semibold tabular-nums text-stone-900">{formatUsd(row.price)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-stone-600">{L.paymentTerms}</p>
                <p className="mt-1 text-xs text-stone-500">{t(ESTIMATE_DISCLAIMER, lang)}</p>
                <Link href={paths.page("faq")} className="mt-2 inline-block text-sm font-semibold text-amber-700 underline">
                  {L.termsLink}
                </Link>
              </>
            ) : (
              <p className="text-lg font-semibold text-stone-900">{t(PRICE_ON_REQUEST, lang)}</p>
            )}

            {(tour.included.length > 0 || tour.excluded.length > 0) && (
              <div className="mt-10 grid gap-6 md:grid-cols-2">
                {tour.included.length > 0 && (
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      {L.included}
                    </h3>
                    <ul className="space-y-2">
                      {tour.included.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                          <span className="leading-relaxed">{t(item, lang)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {tour.excluded.length > 0 && (
                  <div>
                    <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-rose-700">
                      <XCircle className="h-4 w-4" />
                      {L.excluded}
                    </h3>
                    <ul className="space-y-2">
                      {tour.excluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-500" />
                          <span className="leading-relaxed">{t(item, lang)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* CTA */}
          <section className="mx-auto max-w-4xl px-4 py-16 text-center sm:px-6">
            <h2 className="mb-3 text-3xl font-bold text-stone-900 md:text-4xl">{ctaLabel}</h2>
            <p className="mx-auto mb-8 max-w-xl leading-relaxed text-stone-600">{L.ctaHint}</p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={paths.contact(tour.slug)}>
                <Button className="bg-amber-600 px-6 text-white hover:bg-amber-700">
                  <Mail className="mr-2 h-4 w-4" />
                  {ctaLabel}
                </Button>
              </Link>
              <a href={CONTACT.phoneHref[0]}>
                <Button variant="outline" className="border-stone-300 px-6 text-stone-800">
                  <Phone className="mr-2 h-4 w-4" />
                  {CONTACT.phones[0]}
                </Button>
              </a>
            </div>
            <Link href={paths.page("tours")} className="mt-8 inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-amber-700">
              <ArrowLeft className="h-4 w-4" />
              {L.back}
            </Link>
          </section>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
