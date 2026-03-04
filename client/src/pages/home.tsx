import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Plane, Mountain, DollarSign, ChevronRight, LogIn, LayoutDashboard } from "lucide-react";
import brochureFront from "@assets/IMG_7059_1772631193955.jpeg";
import brochureBack from "@assets/IMG_7060_1772631198093.jpeg";

function HeroSection() {
  return (
    <section className="relative h-[85vh] min-h-[600px] flex items-center justify-center">
      <div className="absolute inset-0">
        <img
          src="/images/hero-travel.png"
          alt="Аялалын газрууд"
          className="w-full h-full object-cover"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5 bg-white/15 text-white border-white/20 backdrop-blur-sm">
          Дэлхийг нээ
        </Badge>
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          data-testid="text-hero-title"
        >
          Таны дараагийн
          <br />
          <span className="text-primary-foreground/90">адал явдал эндээс эхэлнэ</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Гайхалтай газрууд, тусгайлан бэлтгэсэн аялалын маршрутууд болон мартагдашгүй туршлагуудыг танд зориулав.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="#brochure">
            <Button size="lg" data-testid="button-explore-brochure">
              Брошур үзэх
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </a>
        </div>
      </div>
    </section>
  );
}

function BrochureSection() {
  return (
    <section id="brochure" className="py-20 px-6 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Аялалын брошур</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-brochure-title">
            Olon Nuur Travel
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Монгол аялалын бүрэн мэдээллийг доорх брошураас харна уу.
          </p>
        </div>

        <div className="space-y-8">
          <div className="relative group">
            <div className="overflow-hidden rounded-xl shadow-2xl border border-border/50 transition-shadow duration-500 group-hover:shadow-3xl">
              <img
                src={brochureFront}
                alt="Olon Nuur Travel - Брошурын нүүр тал"
                className="w-full h-auto object-contain"
                data-testid="img-brochure-front"
              />
            </div>
          </div>

          <div className="relative group">
            <div className="overflow-hidden rounded-xl shadow-2xl border border-border/50 transition-shadow duration-500 group-hover:shadow-3xl">
              <img
                src={brochureBack}
                alt="Olon Nuur Travel - Брошурын ар тал"
                className="w-full h-auto object-contain"
                data-testid="img-brochure-back"
              />
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground">
            Дэлгэрэнгүй мэдээлэл авахыг хүсвэл бидэнтэй холбогдоорой.
          </p>
        </div>
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Globe, value: "50+", label: "Очих газрууд" },
    { icon: Plane, value: "200+", label: "Дууссан аялалууд" },
    { icon: Mountain, value: "100%", label: "Сэтгэл ханамж" },
    { icon: DollarSign, value: "Шилдэг", label: "Үнийн баталгаа" },
  ];

  return (
    <section className="py-16 px-6 bg-primary text-primary-foreground">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat, i) => (
          <div key={i} className="text-center">
            <stat.icon className="h-8 w-8 mx-auto mb-3 opacity-80" />
            <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm opacity-80">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="py-12 px-6 bg-card border-t">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">TravelWorld</span>
          </div>
          <p className="text-sm text-muted-foreground">
            2020 оноос хойш мартагдашгүй аялалын туршлага бүтээж байна.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold" data-testid="text-logo">TravelWorld</span>
          </Link>
          <div className="flex items-center gap-2">
            {user ? (
              <Link href="/admin">
                <Button size="sm" data-testid="button-admin-dashboard">
                  <LayoutDashboard className="h-4 w-4 mr-1.5" />
                  Хяналтын самбар
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button size="sm" variant="outline" data-testid="button-admin-login">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Админ нэвтрэх
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="pt-16">
        <BrochureSection />
        <HeroSection />
        <StatsSection />
        <Footer />
      </main>
    </div>
  );
}
