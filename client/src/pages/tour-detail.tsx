import { useEffect } from "react"; // vdsn nwoo ikis ovgb
import { Link, useRoute } from "wouter";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
import {
  ArrowLeft,
  Bird,
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
import { useLang } from "@/lib/lang";
import { getTourBySlug } from "@/data/tours";
import { localize, localizeScheduleTime } from "@/lib/localize";
import type { Lang } from "@/lib/lang";
import olonNuurLogo from "@assets/olon_nuur_travel_logo.png";

const t = (str: Parameters<typeof localize>[0], lang: Lang) => localize(str, lang);

function TourHeroPicture({
  src,
  srcHd,
  srcWebp,
  alt,
}: {
  src: string;
  srcHd?: string;
  srcWebp?: string;
  alt: string;
}) {
  const hd = srcHd ?? src;

  if (srcWebp) {
    return (
      <picture className="absolute inset-0 block h-full w-full">
        <source type="image/webp" srcSet={`${srcWebp} 1920w`} sizes="100vw" />
        <source type="image/jpeg" srcSet={`${hd} 1920w`} sizes="100vw" />
        <img
          src={hd}
          alt={alt}
          decoding="async"
          fetchPriority="high"
          className="h-full w-full object-cover object-[center_40%] brightness-[1.04] saturate-[1.06] sm:object-[center_45%]"
        />
      </picture>
    );
  }

  return (
    <img
      src={hd}
      alt={alt}
      decoding="async"
      fetchPriority="high"
      className="h-full w-full object-cover object-[center_40%] brightness-[1.04] saturate-[1.06] sm:object-[center_45%]"
    />
  );
}

const labels = {
  mn: {
    back: "Бүх аялал руу буцах",
    duration: "Хугацаа",
    target: "Зорилтот бүлэг",
    crew: "Бүрэлдэхүүн",
    route: "Маршрут",
    overview: "Аяллын тойм",
    schedule: "Аяллын хуваарь",
    meals: "Хоолны цэс",
    breakfast: "Өглөө",
    lunch: "Өдөр",
    dinner: "Орой",
    special: "Тусгай хоол",
    logistics: "Аяллын зохион байгуулалт",
    pricing: "Үнэ ба нөхцөл",
    perPerson: "/ хүн",
    included: "Үнэнд багтсан",
    excluded: "Үнэнд багтаагүй",
    overnight: "Хонох газар",
    departures: "Тусгай хуваарьт аялалууд",
    bookCta: "Захиалга өгөх",
    bookHint: "Доорх товчоор онлайн захиалгын маягтыг бөглөнө үү.",
    bookForm: "Захиалгын маягт",
    notReady: "Удахгүй нэмэгдэнэ",
    notReadyDesc: "Энэ аяллын дэлгэрэнгүй хуваарь удахгүй нэмэгдэх болно. Бидэнтэй шууд холбогдоход баяртайгаар хариулах болно.",
  },
  ko: {
    back: "전체 투어로 돌아가기",
    duration: "기간",
    target: "대상",
    crew: "구성",
    route: "경로",
    overview: "투어 개요",
    schedule: "일정표",
    meals: "식사",
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    special: "특별 식사",
    logistics: "투어 운영",
    pricing: "가격 및 조건",
    perPerson: "/ 인",
    included: "포함 사항",
    excluded: "불포함 사항",
    overnight: "숙박",
    departures: "특별 출발 일정",
    bookCta: "예약 문의",
    bookHint: "아래 버튼으로 온라인 예약 양식을 작성해 주세요.",
    bookForm: "예약 양식",
    notReady: "곧 공개 예정",
    notReadyDesc: "이 투어의 자세한 일정은 곧 공개됩니다. 직접 문의 주시면 친절히 안내해 드립니다.",
  },
  en: {
    back: "Back to all tours",
    duration: "Duration",
    target: "Target group",
    crew: "Team",
    route: "Route",
    overview: "Tour overview",
    schedule: "Itinerary",
    meals: "Meals",
    breakfast: "Breakfast",
    lunch: "Lunch",
    dinner: "Dinner",
    special: "Special meal",
    logistics: "Logistics",
    pricing: "Pricing & terms",
    perPerson: "/ person",
    included: "Included",
    excluded: "Not included",
    overnight: "Overnight",
    departures: "Special departures",
    bookCta: "Book now",
    bookHint: "Use the button below to complete the online booking form.",
    bookForm: "Booking form",
    notReady: "Coming soon",
    notReadyDesc:
      "A detailed itinerary for this tour will be added soon. Contact us directly and we will be happy to help.",
  },
} as const;

function Footer() {
  return (
    <footer className="py-8 px-6 bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <img src={olonNuurLogo} alt="" className="h-8 w-8 rounded-md object-cover object-top" aria-hidden />
          <span className="text-sm font-bold text-stone-300 tracking-tight">OLON NUUR TRAVEL LLC</span>
        </div>
        <p className="text-xs text-stone-500">© 2026 Olon Nuur Travel LLC.</p>
      </div>
    </footer>
  );
}

export default function TourDetailPage() {
  const [, params] = useRoute<{ slug: string }>("/tours/:slug");
  const { lang } = useLang();
  const slug = params?.slug ?? "";
  const tour = getTourBySlug(slug);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [slug]);

  if (!tour) {
    return (
      <div className="min-h-screen bg-stone-50 flex flex-col">
        <SiteNavbar backLink={{ href: "/#tours", label: labels[lang].back }} />
        <div className={`flex-1 flex items-center justify-center px-6 py-24 text-center ${SITE_NAVBAR_OFFSET}`}>
          <div>
            <h1 className="text-3xl font-bold text-stone-900 mb-3">404</h1>
            <p className="text-stone-600 mb-6">Аялал олдсонгүй / 투어를 찾을 수 없습니다</p>
            <Link href="/#tours">
              <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                <ArrowLeft className="h-4 w-4 mr-1.5" />
                {labels[lang].back}
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const L = labels[lang];
  const isComingSoon = tour.status === "coming_soon" || tour.days.length === 0;

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      <SiteNavbar backLink={{ href: "/#tours", label: L.back }} />

      <div className={`flex-1 flex flex-col ${SITE_NAVBAR_OFFSET}`}>
      {/* Hero — 3 аяллын хуудас (bird / nomadic / fishing) */}
      <section className="relative flex h-[52vh] min-h-[320px] max-h-[480px] items-end overflow-hidden bg-stone-950 sm:h-[58vh] sm:min-h-[400px] md:min-h-[460px] md:max-h-[540px]">
        <div className="absolute inset-0">
          <TourHeroPicture
            src={tour.hero.image}
            srcHd={tour.hero.imageHd}
            srcWebp={tour.hero.imageWebp}
            alt={t(tour.hero.title, lang)}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/40 to-stone-950/10" />
        </div>
        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-24 sm:px-6 sm:pb-28 md:pb-32">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-600/15 px-3 py-1 sm:mb-4">
            <Bird className="h-3.5 w-3.5 shrink-0 text-amber-300" />
            <span className="text-[10px] font-semibold uppercase tracking-widest text-amber-200 sm:text-xs">
              Olon Nuur Travel
            </span>
          </div>
          <h1 className="mb-2 max-w-3xl text-2xl font-bold leading-tight text-white sm:mb-3 sm:text-3xl md:text-5xl lg:text-6xl">
            {t(tour.hero.title, lang)}
          </h1>
          <p className="relative z-10 max-w-2xl text-sm leading-relaxed text-stone-200 sm:text-base md:text-lg">
            {t(tour.hero.subtitle, lang)}
          </p>
        </div>
      </section>

      {isComingSoon ? (
        tour.comingSoon ? (
          <main className="flex-1 pb-20 sm:pb-8">
            <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-4 sm:-mt-16 sm:px-6 md:-mt-20">
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
                {[
                  { icon: Clock, label: L.duration, value: t(tour.overview.duration, lang) },
                  { icon: Users, label: L.target, value: t(tour.overview.target, lang) },
                  { icon: Tent, label: L.crew, value: t(tour.overview.crew, lang) },
                ].map((item) => (
                  <Card key={item.label} className="border-stone-200 bg-white shadow-lg">
                    <CardContent className="p-4 sm:p-5">
                      <div className="mb-2 flex items-center gap-2 text-amber-700">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] sm:tracking-widest">
                          {item.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium leading-snug text-stone-900 sm:text-base">
                        {item.value}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Card className="mt-3 w-full border-stone-200 bg-white shadow-lg sm:max-w-xl lg:max-w-2xl">
                <CardContent className="p-4 sm:p-5">
                  <div className="mb-2 flex items-center gap-2 text-amber-700">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] sm:tracking-widest">
                      {L.route}
                    </span>
                  </div>
                  <p className="text-sm font-medium leading-snug text-stone-900 sm:text-base">
                    {t(tour.overview.route, lang)}
                  </p>
                </CardContent>
              </Card>
            </section>

            <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16 md:py-20">
              <p className="text-center text-[11px] font-semibold uppercase tracking-[0.28em] text-amber-700">
                {t(tour.comingSoon.eyebrow, lang)}
              </p>
              <h2 className="mt-3 text-center font-serif text-3xl font-bold text-stone-900 sm:text-4xl">
                {t(tour.comingSoon.headline, lang)}
              </h2>
              <div className="mt-10 space-y-5 text-base leading-relaxed text-stone-700 sm:text-lg">
                {tour.comingSoon.paragraphs.map((paragraph, index) => {
                  const text = t(paragraph, lang).trim();
                  if (!text) return null;
                  return <p key={index}>{text}</p>;
                })}
              </div>
              {tour.comingSoon.brandLine && t(tour.comingSoon.brandLine, lang).trim() ? (
                <p className="mt-10 text-center font-serif text-xl text-stone-900 sm:text-2xl">
                  {t(tour.comingSoon.brandLine, lang).trim()}
                </p>
              ) : null}
              <p className="mt-6 text-center text-sm font-semibold uppercase tracking-[0.2em] text-amber-800">
                {t(tour.comingSoon.tagline, lang)}
              </p>
              <div className="mt-10 flex justify-center">
                <Link href="/#contact">
                  <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                    <Mail className="h-4 w-4 mr-1.5" />
                    {L.bookCta}
                  </Button>
                </Link>
              </div>
            </section>
          </main>
        ) : (
          <section className="flex-1 px-6 py-24">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex w-14 h-14 rounded-full bg-amber-100 items-center justify-center mb-5">
                <Sparkles className="h-7 w-7 text-amber-600" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-3">{L.notReady}</h2>
              <p className="text-stone-600 leading-relaxed mb-8">{L.notReadyDesc}</p>
              <Link href="/#contact">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Mail className="h-4 w-4 mr-1.5" />
                  {L.bookCta}
                </Button>
              </Link>
            </div>
          </section>
        )
      ) : (
        <main className="flex-1 pb-20 sm:pb-8">
          {/* Overview cards: 3 дээр, маршрут доор (нүүдэлчдийн аялалтай ижил) */}
          <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-4 sm:-mt-16 sm:px-6 md:-mt-20">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
              {[
                { icon: Clock, label: L.duration, value: t(tour.overview.duration, lang) },
                { icon: Users, label: L.target, value: t(tour.overview.target, lang) },
                { icon: Tent, label: L.crew, value: t(tour.overview.crew, lang) },
              ].map((item) => (
                <Card key={item.label} className="border-stone-200 bg-white shadow-lg">
                  <CardContent className="p-4 sm:p-5">
                    <div className="mb-2 flex items-center gap-2 text-amber-700">
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] sm:tracking-widest">
                        {item.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium leading-snug text-stone-900 sm:text-base">
                      {item.value}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="mt-3 w-full border-stone-200 bg-white shadow-lg sm:max-w-xl lg:max-w-2xl">
              <CardContent className="p-4 sm:p-5">
                <div className="mb-2 flex items-center gap-2 text-amber-700">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span className="text-[10px] font-semibold uppercase tracking-wider sm:text-[11px] sm:tracking-widest">
                    {L.route}
                  </span>
                </div>
                <p className="text-sm font-medium leading-snug text-stone-900 sm:text-base">
                  {t(tour.overview.route, lang)}
                </p>
              </CardContent>
            </Card>
          </section>

          {/* Description */}
          <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
            <p className="text-base leading-relaxed text-stone-700 sm:text-lg">
              {t(tour.description, lang)}
            </p>
          </section>

          {/* Schedule */}
          <section className="border-y border-stone-200 bg-white py-12 sm:py-16">
            <div className="mx-auto max-w-5xl px-4 sm:px-6">
              <div className="flex items-center gap-3 mb-10">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-amber-700" />
                </div>
                <h2 className="text-xl font-bold text-stone-900 sm:text-2xl md:text-3xl">{L.schedule}</h2>
              </div>

              <div className="space-y-8">
                {tour.days.map((day) => (
                  <div key={day.day} className="relative pl-12 md:pl-16">
                    <div className="absolute left-0 top-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-white flex items-center justify-center font-bold shadow-lg">
                      {day.day}
                    </div>
                    <div className="border-l-2 border-amber-200 pl-6 pb-2 -ml-5 md:-ml-6 ml-5 md:ml-6">
                      <h3 className="mb-1 text-base font-bold text-stone-900 sm:text-lg md:text-xl">
                        {t(day.title, lang)}
                      </h3>
                      {day.subtitle && (
                        <p className="text-sm text-amber-700 font-medium mb-4">
                          {t(day.subtitle, lang)}
                        </p>
                      )}

                      <ul className="space-y-2.5">
                        {day.schedule.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-stone-700"
                          >
                            <span className="text-sm font-mono font-semibold text-stone-900 sm:w-32 shrink-0">
                              {localizeScheduleTime(item.time, lang)}
                            </span>
                            <span className="text-sm leading-relaxed">{t(item.text, lang)}</span>
                          </li>
                        ))}
                      </ul>

                      {day.overnight && (
                        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-stone-100 text-xs text-stone-600">
                          <Tent className="h-3.5 w-3.5" />
                          <span className="font-medium">{L.overnight}:</span>
                          <span>{t(day.overnight, lang)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Meals + Highlights */}
          <section className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-8">
            <Card className="bg-white border-stone-200">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Utensils className="h-5 w-5 text-amber-700" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-stone-900">{L.meals}</h2>
                </div>
                <dl className="space-y-4 text-sm">
                  {[
                    { label: L.breakfast, value: tour.meals.breakfast },
                    { label: L.lunch, value: tour.meals.lunch },
                    { label: L.dinner, value: tour.meals.dinner },
                    ...(tour.meals.special
                      ? [{ label: L.special, value: tour.meals.special }]
                      : []),
                  ].map((m) => (
                    <div key={m.label}>
                      <dt className="text-xs font-semibold uppercase tracking-widest text-amber-700 mb-1">
                        {m.label}
                      </dt>
                      <dd className="text-stone-700 leading-relaxed">{t(m.value, lang)}</dd>
                    </div>
                  ))}
                </dl>
              </CardContent>
            </Card>

            <Card className="bg-white border-stone-200">
              <CardContent className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                    <Bird className="h-5 w-5 text-amber-700" />
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-stone-900">
                    {t(tour.highlights.title, lang)}
                  </h2>
                </div>
                <ul className="space-y-2.5">
                  {tour.highlights.items.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-stone-700"
                    >
                      <span className="mt-1.5 inline-block w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                      <span className="leading-relaxed">{t(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Logistics */}
          {tour.logistics.length > 0 && (
            <section className="bg-stone-100 border-y border-stone-200 py-16">
              <div className="max-w-5xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-lg bg-stone-900 flex items-center justify-center">
                    <Compass className="h-5 w-5 text-amber-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-stone-900">{L.logistics}</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-3">
                  {tour.logistics.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-white border border-stone-200"
                    >
                      <CheckCircle2 className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                      <span className="text-sm text-stone-700 leading-relaxed">
                        {t(item, lang)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Pricing */}
          <section className="max-w-6xl mx-auto px-6 py-16">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-stone-900 mb-2">{L.pricing}</h2>
              <p className="text-sm text-stone-500">{t(tour.pricing.note, lang)}</p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
              {tour.pricing.tiers.map((tier, idx) => {
                const featured = idx === 0;
                return (
                  <Card
                    key={idx}
                    className={
                      featured
                        ? "bg-gradient-to-br from-stone-900 to-stone-800 border-amber-700/30 text-white shadow-2xl"
                        : "bg-white border-stone-200"
                    }
                  >
                    <CardContent className="p-6 text-center">
                      <p
                        className={`text-xs font-semibold uppercase tracking-widest mb-2 ${
                          featured ? "text-amber-300" : "text-amber-700"
                        }`}
                      >
                        {t(tier.groupSize, lang)}
                      </p>
                      <p
                        className={`text-2xl md:text-3xl font-bold mb-1 ${
                          featured ? "text-white" : "text-stone-900"
                        }`}
                      >
                        {t(tier.pricePerPerson, lang)}
                      </p>
                      <p className={`text-xs ${featured ? "text-stone-400" : "text-stone-500"}`}>
                        {L.perPerson}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-emerald-700 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  {L.included}
                </h3>
                <ul className="space-y-2">
                  {tour.pricing.included.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span className="leading-relaxed">{t(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-rose-700 mb-4 flex items-center gap-2">
                  <XCircle className="h-4 w-4" />
                  {L.excluded}
                </h3>
                <ul className="space-y-2">
                  {tour.pricing.excluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm text-stone-700">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span className="leading-relaxed">{t(item, lang)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* Special departures */}
          {tour.specialDepartures && tour.specialDepartures.length > 0 && (
            <section className="bg-stone-900 text-white py-16">
              <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-lg bg-amber-500/15 flex items-center justify-center">
                    <Sparkles className="h-5 w-5 text-amber-400" />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{L.departures}</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {tour.specialDepartures.map((dep, idx) => (
                    <div
                      key={idx}
                      className="rounded-2xl border border-stone-700 bg-stone-800/40 p-6 md:p-8 hover:border-amber-600/40 transition-colors"
                    >
                      <span className="inline-block text-[11px] font-semibold uppercase tracking-widest text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-md mb-4">
                        {t(dep.badge, lang)}
                      </span>
                      <h3 className="text-lg md:text-xl font-bold mb-3 leading-snug">
                        {t(dep.title, lang)}
                      </h3>
                      <p className="text-sm text-stone-300 leading-relaxed mb-5">
                        {t(dep.description, lang)}
                      </p>
                      <dl className="space-y-2 text-sm mb-5">
                        <div className="flex gap-2">
                          <Calendar className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                          <span className="text-stone-300">{t(dep.date, lang)}</span>
                        </div>
                        <div className="flex gap-2">
                          <MapPin className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                          <span className="whitespace-pre-line text-stone-300">
                            {t(dep.route, lang)}
                          </span>
                        </div>
                      </dl>
                      <ul className="space-y-1.5">
                        {dep.highlights.map((h, hIdx) => (
                          <li
                            key={hIdx}
                            className="flex items-start gap-2 text-sm text-stone-300"
                          >
                            <span className="mt-1.5 w-1 h-1 rounded-full bg-amber-400 shrink-0" />
                            <span className="leading-relaxed">{t(h, lang)}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Booking CTA */}
          <section className="max-w-4xl mx-auto px-6 py-20 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">{L.bookCta}</h2>
            <p className="text-stone-600 mb-8 max-w-xl mx-auto leading-relaxed">{L.bookHint}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href={`/book?tour=${slug}`}>
                <Button className="bg-amber-600 hover:bg-amber-700 text-white px-6">
                  <Mail className="h-4 w-4 mr-2" />
                  {L.bookForm}
                </Button>
              </Link>
              <a href="tel:+97688012341">
                <Button variant="outline" className="border-stone-300 text-stone-800 px-6">
                  <Phone className="h-4 w-4 mr-2" />
                  +976 88012341
                </Button>
              </a>
            </div>
          </section>
        </main>
      )}
      </div>

      <Footer />
    </div>
  );
}
