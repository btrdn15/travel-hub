import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">404 Хуудас олдсонгүй</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Уучлаарай, таны хайсан хуудас олдсонгүй.
          </p>
          <Link href="/">
            <Button size="sm" className="mt-4" data-testid="button-go-home">
              Нүүр хуудас руу буцах
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
