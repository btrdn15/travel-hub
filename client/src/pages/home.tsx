import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Clock, DollarSign, Plane, Globe, Mountain, Palmtree, ChevronRight, LogIn, LayoutDashboard } from "lucide-react";
import type { Routine } from "@shared/schema";

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
          <a href="#routines">
            <Button size="lg" data-testid="button-explore-routines">
              Маршрутууд үзэх
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </a>
          <a href="#brochure">
            <Button size="lg" variant="outline" className="text-white border-white/30 backdrop-blur-sm bg-white/10">
              Брошур үзэх
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
            Онцлох газрууд
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Дэлхийн өнцөг булан бүрээс сонгон цуглуулсан гайхалтай аялалын газруудтай танилцана уу.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/beach-paradise.png"
              alt="Далайн эрэг"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-beach"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Palmtree className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Халуун орон</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Далайн диваажин</h3>
              <p className="text-white/70 mt-1">Тунгалаг ус, цэвэрхэн элсэн эрэг</p>
            </div>
          </div>

          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/temple-tour.png"
              alt="Сүм хийд"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-temple"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Соёл</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Сүм хийдийн аялал</h3>
              <p className="text-white/70 mt-1">Эртний сүм хийд, баялаг соёлын өв</p>
            </div>
          </div>

          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/mountain-adventure.png"
              alt="Уулын аялал"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-mountain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Адал явдал</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Уулын аялал</h3>
              <p className="text-white/70 mt-1">Сүрлэг оргилууд, гайхамшигт уулсын үзэмж</p>
            </div>
          </div>

          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/european-city.png"
              alt="Европын хот"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-europe"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Хотын аялал</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Европын сайхан</h3>
              <p className="text-white/70 mt-1">Түүхэн гудамж, дэлхийн түвшний хоол</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground italic">
            Брошурын зургууд удахгүй нэмэгдэнэ. Хүлээгээрэй!
          </p>
        </div>
      </div>
    </section>
  );
}

function RoutineCard({ routine }: { routine: Routine }) {
  const imageMap: Record<string, string> = {
    "Beach": "/images/beach-paradise.png",
    "Temple": "/images/temple-tour.png",
    "Mountain": "/images/mountain-adventure.png",
    "Europe": "/images/european-city.png",
    "Далай": "/images/beach-paradise.png",
    "Сүм": "/images/temple-tour.png",
    "Уул": "/images/mountain-adventure.png",
    "Европ": "/images/european-city.png",
  };

  const matchedImage = routine.image || Object.entries(imageMap).find(([key]) =>
    routine.title.toLowerCase().includes(key.toLowerCase()) ||
    routine.destination.toLowerCase().includes(key.toLowerCase())
  )?.[1] || "/images/hero-travel.png";

  return (
    <Card className="group overflow-visible" data-testid={`card-routine-${routine.id}`}>
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-md">
        <img
          src={matchedImage}
          alt={routine.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3">
          <Badge className="bg-primary text-primary-foreground font-semibold">
            ${routine.price}
          </Badge>
        </div>
      </div>
      <CardContent className="p-5">
        <h3 className="text-lg font-semibold mb-2" data-testid={`text-routine-title-${routine.id}`}>
          {routine.title}
        </h3>
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            {routine.destination}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {routine.duration}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {routine.description}
        </p>
        {routine.highlights && routine.highlights.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {routine.highlights.slice(0, 3).map((h, i) => (
              <Badge key={i} variant="secondary" className="text-xs">
                {h}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RoutinesSection() {
  const { data: routines, isLoading } = useQuery<Routine[]>({
    queryKey: ["/api/routines"],
  });

  return (
    <section id="routines" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <Badge variant="secondary" className="mb-4">Аялалын маршрутууд</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-routines-title">
            Манай аялалын багцууд
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Танд хамгийн тохиромжтой амралтыг бэлэглэхээр тусгайлан бэлтгэсэн аялалын туршлагууд.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <Skeleton className="aspect-[16/9] rounded-t-md" />
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : routines && routines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {routines.map((routine) => (
              <RoutineCard key={routine.id} routine={routine} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Plane className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">Маршрут байхгүй байна</h3>
            <p className="text-muted-foreground">
              Аялалын маршрутууд бэлтгэгдэж байна. Удахгүй гайхалтай багцууд нэмэгдэнэ!
            </p>
          </div>
        )}
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
        <RoutinesSection />
        <Footer />
      </main>
    </div>
  );
}
