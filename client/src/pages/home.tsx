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
          alt="Travel destinations"
          className="w-full h-full object-cover"
          data-testid="img-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        <Badge variant="secondary" className="mb-6 text-sm px-4 py-1.5 bg-white/15 text-white border-white/20 backdrop-blur-sm">
          Discover the World
        </Badge>
        <h1
          className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight"
          data-testid="text-hero-title"
        >
          Your Next Adventure
          <br />
          <span className="text-primary-foreground/90">Starts Here</span>
        </h1>
        <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Explore breathtaking destinations, curated travel routines, and unforgettable experiences crafted just for you.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <a href="#routines">
            <Button size="lg" data-testid="button-explore-routines">
              Explore Routines
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </a>
          <a href="#brochure">
            <Button size="lg" variant="outline" className="text-white border-white/30 backdrop-blur-sm bg-white/10">
              View Brochure
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
          <Badge variant="secondary" className="mb-4">Travel Brochure</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-brochure-title">
            Featured Destinations
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Browse our curated collection of stunning travel destinations from around the globe.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/beach-paradise.png"
              alt="Beach Paradise"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-beach"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Palmtree className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Tropical</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Beach Paradise</h3>
              <p className="text-white/70 mt-1">Crystal clear waters and pristine sandy beaches</p>
            </div>
          </div>

          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/temple-tour.png"
              alt="Temple Tour"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-temple"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Cultural</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Temple Exploration</h3>
              <p className="text-white/70 mt-1">Ancient temples and rich cultural heritage</p>
            </div>
          </div>

          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/mountain-adventure.png"
              alt="Mountain Adventure"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-mountain"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <Mountain className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">Adventure</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Mountain Trek</h3>
              <p className="text-white/70 mt-1">Majestic peaks and breathtaking alpine views</p>
            </div>
          </div>

          <div className="group relative rounded-md overflow-hidden aspect-[4/3] hover-elevate">
            <img
              src="/images/european-city.png"
              alt="European City"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              data-testid="img-brochure-europe"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="h-4 w-4 text-white/80" />
                <span className="text-white/80 text-sm">City Tour</span>
              </div>
              <h3 className="text-2xl font-bold text-white">European Charm</h3>
              <p className="text-white/70 mt-1">Historic streets and world-class cuisine</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-10">
          <p className="text-sm text-muted-foreground italic">
            More brochure images coming soon. Stay tuned for our full collection!
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
          <Badge variant="secondary" className="mb-4">Travel Routines</Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4" data-testid="text-routines-title">
            Our Travel Packages
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Carefully crafted travel experiences designed to give you the perfect getaway.
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
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No Routines Available Yet</h3>
            <p className="text-muted-foreground">
              Our travel routines are being prepared. Check back soon for amazing packages!
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

function StatsSection() {
  const stats = [
    { icon: Globe, value: "50+", label: "Destinations" },
    { icon: Plane, value: "200+", label: "Tours Completed" },
    { icon: Mountain, value: "100%", label: "Satisfaction" },
    { icon: DollarSign, value: "Best", label: "Price Guarantee" },
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
            Crafting unforgettable travel experiences since 2020.
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
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link href="/admin/login">
                <Button size="sm" variant="outline" data-testid="button-admin-login">
                  <LogIn className="h-4 w-4 mr-1.5" />
                  Admin Login
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
