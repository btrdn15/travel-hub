import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Instagram, Users, Star, Compass, LogIn, Menu, ChevronDown, X } from "lucide-react";
import brochureFront from "@assets/IMG_7059_1772631193955.jpeg";
import brochureBack from "@assets/IMG_7060_1772631198093.jpeg";

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

        <div className="hidden md:flex items-center gap-8">
          <a href="#about" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors" data-testid="link-about">Бидний тухай</a>
          <a href="#brochure" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors" data-testid="link-brochure">Аялалын брошур</a>
          <a href="#contact" className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors" data-testid="link-contact">Холбоо барих</a>
        </div>

        <div className="flex items-center">
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
            <span className="text-sm font-medium text-amber-300 tracking-wide">Монгол аялалын мэргэжилтэн</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight" data-testid="text-hero-title">
            Тал нутгийн
            <br />
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">чөлөөт сэтгэл</span>
          </h1>

          <p className="text-lg md:text-xl text-stone-300 mb-10 leading-relaxed max-w-lg">
            Говийн элсэн дундуур тэмээгээр аялж, нүүдэлчдийн амьдралыг мэдэрч, одот тэнгэрийн доор мартагдашгүй дурсамж бүтээгээрэй.
          </p>

          <div className="flex flex-wrap gap-4">
            <a href="#brochure">
              <Button size="lg" className="bg-amber-600 hover:bg-amber-700 text-white px-8 h-12 text-base font-semibold shadow-lg shadow-amber-900/30" data-testid="button-view-brochure">
                Брошур үзэх
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </a>
            <a href="#contact">
              <Button size="lg" variant="outline" className="border-stone-500 text-stone-200 hover:bg-white/10 px-8 h-12 text-base" data-testid="button-contact">
                Холбоо барих
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

function StatsSection() {
  const stats = [
    { icon: Compass, value: "4+", label: "Жилийн туршлага" },
    { icon: Users, value: "500+", label: "Аялагчид" },
    { icon: Star, value: "100%", label: "Сэтгэл ханамж" },
    { icon: MapPin, value: "20+", label: "Очих газрууд" },
  ];

  return (
    <section id="about" className="py-20 px-6 bg-white border-b border-stone-100">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="text-center p-6 rounded-2xl bg-stone-50 border border-stone-100"
              data-testid={`stat-card-${i}`}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <stat.icon className="h-6 w-6 text-amber-700" />
              </div>
              <div className="text-3xl md:text-4xl font-bold text-stone-900 mb-1">{stat.value}</div>
              <div className="text-sm font-medium text-stone-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BrochureSection() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") setLightbox(null);
  }, []);

  useEffect(() => {
    if (lightbox) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "";
      };
    }
  }, [lightbox, handleEsc]);

  return (
    <>
      <section id="brochure" className="py-24 px-6 bg-gradient-to-b from-stone-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-sm font-semibold text-amber-700 tracking-widest uppercase mb-3">
              Olon Nuur Travel
            </span>
            <h2 className="text-3xl md:text-5xl font-bold text-stone-900 mb-5" data-testid="text-brochure-title">
              Аялалын брошур
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto text-lg leading-relaxed">
              Монгол орны гайхамшигт аялалын бүрэн мэдээллийг доорх брошураас үзнэ үү. Зурган дээр дарж томруулна уу.
            </p>
          </div>

          <div className="space-y-12">
            <div
              className="group cursor-pointer"
              onClick={() => setLightbox(brochureFront)}
              data-testid="brochure-front-wrapper"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-stone-200/60 transition-all duration-500 group-hover:shadow-2xl group-hover:ring-amber-300/50 group-hover:-translate-y-1">
                <img
                  src={brochureFront}
                  alt="Olon Nuur Travel - Брошурын нүүр тал"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                  data-testid="img-brochure-front"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-center mt-4 text-sm font-medium text-stone-400">Нүүр тал — дарж томруулна уу</p>
            </div>

            <div
              className="group cursor-pointer"
              onClick={() => setLightbox(brochureBack)}
              data-testid="brochure-back-wrapper"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-xl ring-1 ring-stone-200/60 transition-all duration-500 group-hover:shadow-2xl group-hover:ring-amber-300/50 group-hover:-translate-y-1">
                <img
                  src={brochureBack}
                  alt="Olon Nuur Travel - Брошурын ар тал"
                  className="w-full h-auto transition-transform duration-700 group-hover:scale-[1.02]"
                  data-testid="img-brochure-back"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <p className="text-center mt-4 text-sm font-medium text-stone-400">Ар тал — дарж томруулна уу</p>
            </div>
          </div>
        </div>
      </section>

      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setLightbox(null)}
          data-testid="lightbox-overlay"
        >
          <button
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
            onClick={() => setLightbox(null)}
            aria-label="Хаах"
            data-testid="button-close-lightbox"
          >
            <X className="h-5 w-5 text-white" />
          </button>
          <img
            src={lightbox}
            alt="Брошур томруулсан"
            className="max-w-full max-h-[90vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
            data-testid="img-lightbox"
          />
        </div>
      )}
    </>
  );
}

function ContactSection() {
  return (
    <section id="contact" className="py-24 px-6 bg-stone-900">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block text-sm font-semibold text-amber-500 tracking-widest uppercase mb-3">
              Холбоо барих
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Аялалаа төлөвлөхөд бэлэн үү?
            </h2>
            <p className="text-stone-400 text-lg leading-relaxed mb-10">
              Бидэнтэй холбогдож, танд тохирсон Монгол аялалыг хамтдаа төлөвлөцгөөе. Хөтөч, тээвэр, байр бүгдийг бид зохицуулна.
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
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Имэйл</p>
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
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Утас</p>
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
                  <p className="text-xs text-stone-500 font-medium uppercase tracking-wider">Инстаграм</p>
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
          © 2025 Olon Nuur Travel LLC. Бүх эрх хуулиар хамгаалагдсан.
        </p>
      </div>
    </footer>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main className="pt-16">
        <HeroSection />
        <StatsSection />
        <BrochureSection />
        <ContactSection />
        <Footer />
      </main>
    </div>
  );
}
