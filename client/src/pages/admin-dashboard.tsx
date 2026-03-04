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
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Bali Beach Getaway"
            required
            data-testid="input-routine-title"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="destination">Destination</Label>
          <Input
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="e.g. Bali, Indonesia"
            required
            data-testid="input-routine-destination"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this travel routine..."
          required
          className="min-h-[100px]"
          data-testid="input-routine-description"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="duration">Duration</Label>
          <Input
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="e.g. 5 Days / 4 Nights"
            required
            data-testid="input-routine-duration"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input
            id="price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="e.g. 1200"
            required
            data-testid="input-routine-price"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="image">Image URL (optional)</Label>
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
        <Label htmlFor="highlights">Highlights (comma separated)</Label>
        <Input
          id="highlights"
          value={highlights}
          onChange={(e) => setHighlights(e.target.value)}
          placeholder="e.g. Snorkeling, Spa, Sunset Dinner"
          data-testid="input-routine-highlights"
        />
      </div>
      <DialogFooter className="gap-2">
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-routine">
          Cancel
        </Button>
        <Button type="submit" disabled={isPending} data-testid="button-save-routine">
          {isPending ? (
            <Loader2 className="h-4 w-4 mr-1.5 animate-spin" />
          ) : null}
          {routine ? "Update Routine" : "Create Routine"}
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
      toast({ title: "Success", description: "Routine created successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to create routine", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      await apiRequest("PATCH", `/api/routines/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      setEditingRoutine(null);
      toast({ title: "Success", description: "Routine updated successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to update routine", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/routines/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/routines"] });
      setDeletingId(null);
      toast({ title: "Success", description: "Routine deleted successfully" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to delete routine", variant: "destructive" });
    },
  });

  const selectMutation = useMutation({
    mutationFn: async (routineId: string) => {
      await apiRequest("POST", "/api/admin/selections", { routineId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/selections"] });
      toast({ title: "Selected", description: "Routine added to your service list" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to select routine", variant: "destructive" });
    },
  });

  const deselectMutation = useMutation({
    mutationFn: async (routineId: string) => {
      await apiRequest("DELETE", `/api/admin/selections/${routineId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/selections"] });
      toast({ title: "Removed", description: "Routine removed from your service list" });
    },
    onError: (error: any) => {
      toast({ title: "Error", description: error.message || "Failed to remove selection", variant: "destructive" });
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
                {isSuperAdmin ? "Super Admin" : "Admin"}
              </Badge>
              <span className="text-sm text-muted-foreground" data-testid="text-username">
                {user.username}
              </span>
            </div>
            <Button size="sm" variant="outline" onClick={handleLogout} data-testid="button-logout">
              <LogOut className="h-4 w-4 mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold" data-testid="text-dashboard-title">
              {isSuperAdmin ? "Admin Dashboard" : "Service Dashboard"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {isSuperAdmin
                ? "Manage travel routines, pricing, and admin accounts"
                : "View and select travel routines to provide services"}
            </p>
          </div>
          {isSuperAdmin && (
            <Button onClick={() => setShowCreateDialog(true)} data-testid="button-create-routine">
              <Plus className="h-4 w-4 mr-1.5" />
              New Routine
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
                <p className="text-sm text-muted-foreground">Total Routines</p>
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
                <p className="text-sm text-muted-foreground">Price Range</p>
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
                  {isSuperAdmin ? "Full Control" : `${selectedRoutineIds.size} Selected`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {isSuperAdmin ? "Super Admin Access" : "My Service Routines"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold">
            {isSuperAdmin ? "Manage Routines" : "Available Routines"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {isSuperAdmin
              ? "Create, edit, delete, and manage pricing for all routines"
              : "Select routines you want to provide as services to customers"}
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
                              Active
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
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-destructive"
                            onClick={() => setDeletingId(routine.id)}
                            data-testid={`button-delete-routine-${routine.id}`}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
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
                          Remove from Services
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => selectMutation.mutate(routine.id)}
                          disabled={selectMutation.isPending}
                          data-testid={`button-select-routine-${routine.id}`}
                        >
                          <Check className="h-3.5 w-3.5 mr-1" />
                          Select for Service
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
              <h3 className="text-lg font-semibold text-muted-foreground mb-1">No Routines Yet</h3>
              <p className="text-sm text-muted-foreground">
                {isSuperAdmin
                  ? "Create your first travel routine to get started."
                  : "No routines available. Please ask the primary admin to create some."}
              </p>
            </CardContent>
          </Card>
        )}
      </main>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Routine</DialogTitle>
            <DialogDescription>
              Add a new travel routine package for your customers.
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
            <DialogTitle>Edit Routine</DialogTitle>
            <DialogDescription>
              Update the details and pricing for this routine.
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
            <DialogTitle>Delete Routine</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this routine? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setDeletingId(null)} data-testid="button-cancel-delete">
              Cancel
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
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
