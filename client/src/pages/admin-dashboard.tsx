import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/lib/auth";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Globe, LogOut, Plus, Pencil, Trash2, DollarSign,
  MapPin, Clock, Loader2, Package, Users, Shield, Check, X
} from "lucide-react";
import type { Routine, AdminSelection } from "@shared/schema";

function RoutineForm({
  routine,
  onSubmit,
  isPending,
  onCancel,
}: {
  routine?: Routine;
  onSubmit: (data: any) => void;
  isPending: boolean;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(routine?.title || "");
  const [destination, setDestination] = useState(routine?.destination || "");
  const [description, setDescription] = useState(routine?.description || "");
  const [duration, setDuration] = useState(routine?.duration || "");
  const [price, setPrice] = useState(routine?.price?.toString() || "");
  const [image, setImage] = useState(routine?.image || "");
  const [highlights, setHighlights] = useState(routine?.highlights?.join(", ") || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      destination,
      description,
      duration,
      price: parseInt(price) || 0,
      image: image || null,
      highlights: highlights ? highlights.split(",").map((h) => h.trim()).filter(Boolean) : [],
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="title">Нэр</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="жишээ нь: Бали далайн амралт"
            required
            data-testid="input-routine-title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Очих газар</Label>
          <Input
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="жишээ нь: Бали, Индонез"
            required
            data-testid="input-routine-destination"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Тайлбар</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Энэ аялалын маршрутыг тайлбарлана уу..."
          required
          className="min-h-[100px]"
          data-testid="input-routine-description"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Хугацаа</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="жишээ нь: 5 хоног / 4 шөнө"
            required
            data-testid="input-routine-duration"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Үнэ ($)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="жишээ нь: 1200"
            required
            data-testid="input-routine-price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Зургийн URL (заавал биш)</Label>
          <Input
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="/images/beach-paradise.png"
            data-testid="input-routine-image"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="highlights">Онцлох зүйлс (таслалаар тусгаарлана)</Label>
        <Input
          id="highlights"
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="жишээ нь: Шумбалт, Спа, Нар жаргалтын зоог"
          data-testid="input-routine-highlights"
        />
      </div>
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-routine">
          Цуцлах
        </Button>
        <Button type="submit" disabled={isPending} data-testid="button-save-routine">
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : null}
          {routine ? "Маршрут шинэчлэх" : "Маршрут үүсгэх"}
        </Button>
      </DialogFooter>
    </form>
  );
}

export default function AdminDashboard() {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingRoutine, setEditingRoutine] = useState<Routine | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const isSuperAdmin = user?.role === "super_admin";

  useEffect(() => {
    if (!authLoading && !user) {
      setLocation("/admin/login");
    }
  }, [user, authLoading, setLocation]);

  const { data: routines, isLoading } = useQuery<Routine[]>({
    queryKey: ["/api/routines"],
  });

  const { data: selections } = useQuery<AdminSelection[]>({
    queryKey: ["/api/admin/selections"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!user && !isSuperAdmin,
  });

  const selectedRoutineIds = new Set(selections?.map((s) => s.routineId) || []);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await apiRequest("POST", "/api/routines", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      setShowCreateDialog(false);
      toast({ title: "Амжилттай", description: "Маршрут амжилттай үүсгэгдлээ" });
    },
    onError: (error: any) => {
      toast({ title: "Алдаа", description: error.message || "Маршрут үүсгэхэд алдаа гарлаа", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PATCH", `/api/routines/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      setEditingRoutine(null);
      toast({ title: "Амжилттай", description: "Маршрут амжилттай шинэчлэгдлээ" });
    },
    onError: (error: any) => {
      toast({ title: "Алдаа", description: error.message || "Маршрут шинэчлэхэд алдаа гарлаа", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/routines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      setDeletingId(null);
      toast({ title: "Амжилттай", description: "Маршрут амжилттай устгагдлаа" });
    },
    onError: (error: any) => {
      toast({ title: "Алдаа", description: error.message || "Маршрут устгахад алдаа гарлаа", variant: "destructive" });
    },
  });

  const selectMutation = useMutation({
    mutationFn: async (routineId: string) => {
      await apiRequest("POST", "/api/admin/selections", { routineId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/selections"] });
      toast({ title: "Сонгосон", description: "Маршрут таны үйлчилгээний жагсаалтад нэмэгдлээ" });
    },
    onError: (error: any) => {
      toast({ title: "Алдаа", description: error.message || "Маршрут сонгоход алдаа гарлаа", variant: "destructive" });
    },
  });

  const deselectMutation = useMutation({
    mutationFn: async (routineId: string) => {
      await apiRequest("DELETE", `/api/admin/selections/${routineId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/selections"] });
      toast({ title: "Хасагдсан", description: "Маршрут таны үйлчилгээний жагсаалтаас хасагдлаа" });
    },
    onError: (error: any) => {
      toast({ title: "Алдаа", description: error.message || "Маршрут хасахад алдаа гарлаа", variant: "destructive" });
    },
  });

  const handleLogout = async () => {
    await logout();
    setLocation("/");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold">TravelWorld</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" data-testid="badge-user-role">
                <Shield className="h-3 w-3 mr-1" />
                {isSuperAdmin ? "Ерөнхий Админ" : "Админ"}
              </Badge>
              <span className="text-sm text-muted-foreground" data-testid="text-username">
                {user.username}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-1.5" />
              Гарах
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
              {isSuperAdmin ? "Админ хяналтын самбар" : "Үйлчилгээний самбар"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isSuperAdmin
                ? "Аялалын маршрут, үнэ, админ бүртгэлийг удирдах"
                : "Аялалын маршрутуудыг сонгон үйлчилгээ үзүүлэх"}
            </p>
          </div>
          {isSuperAdmin && (
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-routine">
              <Plus className="h-4 w-4 mr-1.5" />
              Шинэ маршрут
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold" data-testid="text-total-routines">
                  {routines?.length || 0}
                </p>
                <p className="text-sm text-muted-foreground">Нийт маршрутууд</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {routines?.length
                    ? `$${Math.min(...routines.map((r) => r.price))} - $${Math.max(...routines.map((r) => r.price))}`
                    : "$0"}
                </p>
                <p className="text-sm text-muted-foreground">Үнийн хүрээ</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                {isSuperAdmin ? <Shield className="h-5 w-5 text-primary" /> : <Users className="h-5 w-5 text-primary" />}
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {isSuperAdmin ? "Бүрэн эрх" : `${selectedRoutineIds.size} сонгосон`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isSuperAdmin ? "Ерөнхий Админ эрх" : "Миний үйлчилгээний маршрутууд"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {isSuperAdmin ? "Маршрутууд удирдах" : "Боломжит маршрутууд"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isSuperAdmin
              ? "Бүх маршрутуудыг үүсгэх, засах, устгах, үнэ өөрчлөх"
              : "Харилцагчдад үйлчилгээ үзүүлэх маршрутуудыг сонгоно уу"}
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : routines && routines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {routines.map((routine) => {
              const isSelected = selectedRoutineIds.has(routine.id);
              return (
                <Card
                  key={routine.id}
                  className={!isSuperAdmin && isSelected ? "ring-2 ring-primary" : ""}
                  data-testid={`card-admin-routine-${routine.id}`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold truncate" data-testid={`text-admin-routine-title-${routine.id}`}>
                            {routine.title}
                          </h3>
                          {!isSuperAdmin && isSelected && (
                            <Badge variant="default" className="flex-shrink-0 text-xs">
                              <Check className="h-3 w-3 mr-0.5" />
                              Идэвхтэй
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" />
                            {routine.destination}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {routine.duration}
                          </span>
                        </div>
                      </div>
                      <Badge className="flex-shrink-0 text-base font-semibold px-3">
                        ${routine.price}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                      {routine.description}
                    </p>
                    {routine.highlights && routine.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {routine.highlights.map((h, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {h}
                          </Badge>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      {isSuperAdmin ? (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingRoutine(routine)}
                            data-testid={`button-edit-routine-${routine.id}`}
                          >
                            <Pencil className="h-3.5 w-3.5 mr-1" />
                            Засах
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => setDeletingId(routine.id)}
                            data-testid={`button-delete-routine-${routine.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Устгах
                          </Button>
                        </>
                      ) : isSelected ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deselectMutation.mutate(routine.id)}
                          disabled={deselectMutation.isPending}
                          data-testid={`button-deselect-routine-${routine.id}`}
                        >
                          <X className="h-3.5 w-3.5 mr-1" />
                          Үйлчилгээнээс хасах
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => selectMutation.mutate(routine.id)}
                          disabled={selectMutation.isPending}
                          data-testid={`button-select-routine-${routine.id}`}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Үйлчилгээнд сонгох
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-1">Маршрут байхгүй</h3>
              <p className="text-sm text-muted-foreground">
                {isSuperAdmin
                  ? "Эхний аялалын маршрутаа үүсгэж эхлээрэй."
                  : "Маршрут байхгүй байна. Ерөнхий админаас маршрут үүсгэхийг хүснэ үү."}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Шинэ маршрут үүсгэх</DialogTitle>
            <DialogDescription>
              Харилцагчдад зориулсан шинэ аялалын маршрут нэмэх.
            </DialogDescription>
          </DialogHeader>
          <RoutineForm
            onSubmit={(data) => createMutation.mutate(data)}
            isPending={createMutation.isPending}
            onCancel={() => setShowCreateDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingRoutine} onOpenChange={() => setEditingRoutine(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Маршрут засах</DialogTitle>
            <DialogDescription>
              Энэ маршрутын мэдээлэл болон үнийг шинэчлэх.
            </DialogDescription>
          </DialogHeader>
          {editingRoutine && (
            <RoutineForm
              routine={editingRoutine}
              onSubmit={(data) => updateMutation.mutate({ id: editingRoutine.id, data })}
              isPending={updateMutation.isPending}
              onCancel={() => setEditingRoutine(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Маршрут устгах</DialogTitle>
            <DialogDescription>
              Та энэ маршрутыг устгахдаа итгэлтэй байна уу? Энэ үйлдлийг буцаах боломжгүй.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeletingId(null)} data-testid="button-cancel-delete">
              Цуцлах
            </Button>
            <Button
              variant="destructive"
              onClick={() => deletingId && deleteMutation.mutate(deletingId)}
              disabled={deleteMutation.isPending}
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1.5" />
              )}
              Устгах
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
