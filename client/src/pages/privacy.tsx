import { useLang } from "@/lib/lang";
import { SITE_COPY } from "@/data/site-copy";
import { PageShell } from "@/components/page-shell";

/**
 * Privacy Policy.
 * TODO(content): Privacy Policy-ийн бүрэн текст — LAUNCH-ААС ӨМНӨ ЗААВАЛ.
 * Inquiry form-ийн consent checkbox энэ хуудас руу холбогдоно.
 * Хамрах зүйлс (brief §11): хувийн мэдээллийн зөвшөөрөл, хадгалах хугацаа,
 * устгах хүсэлт, улс дамнасан дамжуулалт.
 */
export default function PrivacyPage() {
  const { lang } = useLang();
  const c = SITE_COPY[lang].privacy;
  return (
    <PageShell title={c.title}>
      <p className="rounded-xl border border-dashed border-stone-300 bg-white p-5 text-stone-700" data-todo="content">
        {c.placeholder}
      </p>
    </PageShell>
  );
}
