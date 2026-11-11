import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useLang, usePaths, type Lang } from "@/lib/lang";

const copy: Record<Lang, { title: string; body: string; home: string }> = {
  en: { title: "404 Page not found", body: "Sorry, we couldn't find the page you were looking for.", home: "Back to home" },
  ko: { title: "404 페이지를 찾을 수 없습니다", body: "죄송합니다. 요청하신 페이지를 찾을 수 없습니다.", home: "홈으로 돌아가기" },
  mn: { title: "404 Хуудас олдсонгүй", body: "Уучлаарай, таны хайсан хуудас олдсонгүй.", home: "Нүүр хуудас руу буцах" },
  ja: { title: "404 ページが見つかりません", body: "申し訳ございません。お探しのページは見つかりませんでした。", home: "ホームに戻る" },
};

export default function NotFound() {
  const { lang } = useLang();
  const paths = usePaths();
  const t = copy[lang];

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-destructive" />
            <h1 className="text-2xl font-bold">{t.title}</h1>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">{t.body}</p>
          <Link href={paths.page("home")}>
            <Button size="sm" className="mt-4" data-testid="button-go-home">
              {t.home}
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
