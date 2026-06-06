import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { useLang } from "@/lib/lang";
import { BookingForm } from "@/components/booking-form";
import { SiteNavbar, SITE_NAVBAR_OFFSET } from "@/components/site-navbar";
import olonNuurLogo from "@assets/olon_nuur_travel_logo.png";

const copy = {
  mn: {
    back: "Нүүр хуудас",
    tag: "Захиалга",
    title: "Аялал захиалах",
    desc: "Доорх маягтыг бөглөж илгээнэ үү. Бид имэйл болон KakaoTalk-оор урьдчилгаа төлбөрийн мэдээллийг илгээнэ.",
  },
  ko: {
    back: "홈으로",
    tag: "예약",
    title: "투어 예약 신청",
    desc: "아래 양식을 작성해 주시면 이메일과 카카오톡으로 예약금 안내를 보내 드립니다.",
  },
  en: {
    back: "Back to home",
    tag: "Booking",
    title: "Book a tour",
    desc: "Complete the form below. We will send deposit payment details by email and KakaoTalk.",
  },
} as const;

function useTourFromQuery(): string | undefined {
  const [slug, setSlug] = useState<string | undefined>();
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSlug(params.get("tour") || undefined);
  }, []);
  return slug;
}

export default function BookingPage() {
  const { lang } = useLang();
  const t = copy[lang];
  const tourSlug = useTourFromQuery();

  return (
    <div className="min-h-screen bg-stone-100">
      <SiteNavbar backLink={{ href: "/", label: t.back }} />

      <main className={`mx-auto max-w-2xl px-4 py-10 pb-24 sm:px-6 sm:py-12 md:py-16 sm:pb-16 ${SITE_NAVBAR_OFFSET}`}>
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-stone-600 hover:text-amber-700 mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          {t.back}
        </Link>

        <span className="inline-block text-sm font-semibold text-amber-600 tracking-widest uppercase mb-2">
          {t.tag}
        </span>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-900 mb-3">{t.title}</h1>
        <p className="text-stone-600 leading-relaxed mb-10">{t.desc}</p>

        <div className="rounded-2xl bg-stone-900 border border-stone-800 p-6 md:p-8 shadow-xl">
          <BookingForm defaultTourSlug={tourSlug} />
        </div>
      </main>

      <footer className="py-8 px-6 border-t border-stone-200 bg-white mt-12">
        <FooterInner />
      </footer>
    </div>
  );
}

function FooterInner() {
  return (
    <div className="max-w-5xl mx-auto flex items-center gap-2.5">
      <img src={olonNuurLogo} alt="" className="h-8 w-8 rounded-md object-cover object-top" aria-hidden />
      <span className="text-sm font-bold text-stone-600 tracking-tight">OLON NUUR TRAVEL LLC</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-stone-200 bg-white mt-12">
      <FooterInner />
    </footer>
  );
}
