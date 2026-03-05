import { createContext, useContext, useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Instagram, Compass, Menu, ChevronDown, Globe } from "lucide-react";
import brochureFront from "@assets/IMG_7059_1772631193955.jpeg";
import brochureBack from "@assets/IMG_7060_1772631198093.jpeg";

type Lang = "mn" | "ko";

const translations = {
  mn: {
    heroTag: "Монгол аялалын мэргэжилтэн",
    heroTitle: "Олон Нуур Травэл",
    heroDesc: "Говийн элсэн дундуур тэмээгээр аялж, нүүдэлчдийн амьдралыг мэдэрч, одот тэнгэрийн доор мартагдашгүй дурсамж бүтээгээрэй.",
    viewBrochure: "Брошур үзэх",
    contactUs: "Холбоо барих",
    brochureSubtitle: "Olon Nuur Travel",
    brochureTitle: "Аялалын брошур",
    brochureDesc: "Монгол орны гайхамшигт аялалын бүрэн мэдээллийг доорх брошураас үзнэ үү.",
    brochureDivider: "Нүүр тал · Ар тал",
    contactLabel: "Холбоо барих",
    contactTitle: "Аялалаа төлөвлөхөд бэлэн үү?",
    contactDesc: "Бидэнтэй холбогдож, танд тохирсон Монгол аялалыг хамтдаа төлөвлөцгөөе. Хөтөч, тээвэр, байр бүгдийг бид зохицуулна.",
    emailLabel: "Имэйл",
    phoneLabel: "Утас",
    instaLabel: "Инстаграм",
    copyright: "© 2025 Olon Nuur Travel LLC. Бүх эрх хуулиар хамгаалагдсан.",
  },
  ko: {
    heroTag: "몽골 여행 전문가",
    heroTitle: "올론 누르 트래블",
    heroDesc: "고비 사막에서 낙타를 타고, 유목민의 삶을 체험하며, 별이 쏟아지는 하늘 아래 잊지 못할 추억을 만들어 보세요.",
    viewBrochure: "브로슈어 보기",
    contactUs: "문의하기",
    brochureSubtitle: "Olon Nuur Travel",
    brochureTitle: "여행 브로슈어",
    brochureDesc: "아래 브로슈어에서 몽골 여행에 대한 자세한 정보를 확인하세요.",
    brochureDivider: "앞면 · 뒷면",
    contactLabel: "문의하기",
    contactTitle: "여행을 계획할 준비가 되셨나요?",
    contactDesc: "저희에게 연락하시면 맞춤형 몽골 여행을 함께 계획해 드립니다. 가이드, 교통, 숙소 모두 저희가 준비합니다.",
    emailLabel: "이메일",
    phoneLabel: "전화",
    instaLabel: "인스타그램",
    copyright: "© 2025 Olon Nuur Travel LLC. All rights reserved.",
  },
};

const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({ lang: "mn", setLang: () => {} });

function useLang() {
  return useContext(LangContext);
}

function LangSwitcher() {
  const { lang, setLang } = useLang();
  const other: Lang = lang === "mn" ? "ko" : "mn";
  const label = other === "ko" ? "한국어" : "Монгол";

  return (
    <button
      onClick={() => setLang(other)}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-stone-600 hover:bg-stone-100 transition-colors"
      aria-label="Хэл солих"
      data-testid="button-lang-switch"
    >
      <Globe className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-stone-200/60">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
            <Compass className="h-4 w-4 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-stone-900 leading-none">OLON NUUR</span>
            <span className="text-[10px] font-medium text-amber-700 tracking-widest uppercase leading-none mt-0.5">Travel LLC</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <LangSwitcher />
          <Link href={user ? "/admin" : "/admin/login"}>
            <button
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Админ цэс"
              data-testid="button-admin-menu"
            >
              <Menu className="h-5 w-5 text-stone-700" />
            </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}

function HeroSection() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden bg-stone-950">
      <div className="absolute inset-0">
        <img
          src={brochureFront}
          alt="Монгол аялал"
          className="w-full h-full object-cover opacity-30 scale-110 blur-sm"
          data-testid="img-hero-bg"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950/95 via-stone-950/70 to-stone-950/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-600/15 border border-amber-500/25 mb-8">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-sm font-medium text-amber-300 tracking-wide">{t.heroTag}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight" data-testid="text-hero-title">
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">{t.heroTitle}</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-300 mb-10 leading-relaxed max-w-lg">
            {t.heroDesc}
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#brochure">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-amber-900/30" data-testid="button-view-brochure">
                {t.viewBrochure}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="border-stone-500 text-stone-200 hover:bg-white/10 px-8 h-12 text-base" data-testid="button-contact">
                {t.contactUs}
              </Button>
            </a>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="h-6 w-6 text-white/40" />
      </div>
    </section>
  );
}

function BrochureSection() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <section id="brochure" className="bg-stone-100">
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <span className="inline-block text-sm font-semibold text-amber-700 tracking-widest uppercase mb-3">
            {t.brochureSubtitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-5" data-testid="text-brochure-title">
            {t.brochureTitle}
          </h2>
          <p className="text-stone-500 max-w-xl mx-auto text-lg leading-relaxed">
            {t.brochureDesc}
          </p>
        </div>
      </div>

      <div className="relative w-full">
        <div className="absolute inset-0 bg-gradient-to-b from-stone-100 via-stone-200/50 to-stone-100 pointer-events-none" style={{ zIndex: 0 }} />

        <div className="relative z-10 max-w-[1400px] mx-auto px-4 md:px-8">
          <div className="bg-white rounded-3xl shadow-2xl ring-1 ring-stone-900/5 overflow-hidden">
            <div className="p-3 md:p-6 bg-gradient-to-b from-stone-50 to-white">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={brochureFront}
                  alt="Olon Nuur Travel - Front"
                  className="w-full h-auto"
                  data-testid="img-brochure-front"
                />
              </div>
            </div>

            <div className="flex items-center justify-center py-4 md:py-6">
              <div className="flex items-center gap-3">
                <div className="h-px w-16 bg-stone-200" />
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-semibold text-stone-400 tracking-widest uppercase">{t.brochureDivider}</span>
                  <Compass className="h-4 w-4 text-amber-600" />
                </div>
                <div className="h-px w-16 bg-stone-200" />
              </div>
            </div>

            <div className="p-3 md:p-6 bg-gradient-to-t from-stone-50 to-white">
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src={brochureBack}
                  alt="Olon Nuur Travel - Back"
                  className="w-full h-auto"
                  data-testid="img-brochure-back"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-24" />
    </section>
  );
}

function ContactSection() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <section id="contact" className="py-24 px-6 bg-stone-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-sm font-semibold text-amber-500 tracking-widest uppercase mb-3">
              {t.contactLabel}
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              {t.contactTitle}
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-10">
              {t.contactDesc}
            </p>

            <div className="space-y-5">
              <a
                href="mailto:olonnuurtravel@gmail.com"
                className="flex items-center gap-4 p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 hover:border-amber-600/40 hover:bg-stone-800 transition-all group"
                data-testid="link-email"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-600/15 flex items-center justify-center shrink-0">
                  <Mail className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{t.emailLabel}</p>
                  <p className="text-white font-medium group-hover:text-amber-400 transition-colors">olonnuurtravel@gmail.com</p>
                </div>
              </a>

              <a
                href="tel:01092905686"
                className="flex items-center gap-4 p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 hover:border-amber-600/40 hover:bg-stone-800 transition-all group"
                data-testid="link-phone"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-600/15 flex items-center justify-center shrink-0">
                  <Phone className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{t.phoneLabel}</p>
                  <p className="text-white font-medium group-hover:text-amber-400 transition-colors">010-9290-5686</p>
                </div>
              </a>

              <a
                href="https://instagram.com/olonnuurtravel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-xl bg-stone-800/50 border border-stone-700/50 hover:border-amber-600/40 hover:bg-stone-800 transition-all group"
                data-testid="link-instagram"
              >
                <div className="w-11 h-11 rounded-lg bg-amber-600/15 flex items-center justify-center shrink-0">
                  <Instagram className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">{t.instaLabel}</p>
                  <p className="text-white font-medium group-hover:text-amber-400 transition-colors">@olonnuurtravel</p>
                </div>
              </a>
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className="absolute -inset-4 bg-gradient-to-br from-amber-600/20 to-transparent rounded-3xl blur-2xl" />
            <div className="relative overflow-hidden rounded-2xl ring-1 ring-stone-700/50">
              <img
                src={brochureFront}
                alt="Olon Nuur Travel"
                className="w-full h-[500px] object-cover object-right"
                data-testid="img-contact-visual"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { lang } = useLang();
  const t = translations[lang];

  return (
    <footer className="py-8 px-6 bg-stone-950 border-t border-stone-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center">
            <Compass className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-sm font-bold text-stone-300 tracking-tight">OLON NUUR TRAVEL LLC</span>
        </div>
        <p className="text-xs text-stone-500">
          {t.copyright}
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("mn");

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <div className="min-h-screen bg-white">
        <Navbar />
        <main className="pt-16">
          <HeroSection />
          <BrochureSection />
          <ContactSection />
          <Footer />
        </main>
      </div>
    </LangContext.Provider>
  );
}
