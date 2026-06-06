import { useState } from "react";
import { Instagram, Mail, MessageCircle, X } from "lucide-react";
import kakaotalkLogo from "@assets/kakaotalk_logo.png";

/**
 * URL-уудыг client/.env-ээр дарж бичиж болно: VITE_KAKAO_URL, VITE_FACEBOOK_URL, …
 */
const emailHref = (() => {
  const raw = import.meta.env.VITE_CONTACT_EMAIL?.toString().trim();
  if (!raw) return "mailto:olonnuurtravel@gmail.com";
  return raw.startsWith("mailto:") ? raw : `mailto:${raw}`;
})();

const SOCIAL = {
  kakao:
    import.meta.env.VITE_KAKAO_URL?.toString().trim() ||
    "http://pf.kakao.com/_cSlsX/chat",
  instagram:
    import.meta.env.VITE_INSTAGRAM_URL?.toString().trim() ||
    "https://www.instagram.com/olonnurtravel/",
  facebook:
    import.meta.env.VITE_FACEBOOK_URL?.toString().trim() ||
    "https://www.facebook.com/people/Olon-nuur-travel/61587187435858/",
  gmail: emailHref,
} as const;

function FacebookMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function FloatingSocialLinks() {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="fixed bottom-4 right-3 z-[60] flex flex-col items-end gap-2 safe-bottom safe-right sm:bottom-6 sm:right-6 sm:gap-3"
      data-testid="floating-social-links"
    >
      {open ? (
        <>
          <a
            href={SOCIAL.kakao}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 overflow-hidden rounded-xl shadow-lg ring-2 ring-black/10 transition-transform hover:scale-105 sm:h-14 sm:w-14 sm:rounded-2xl"
            aria-label="KakaoTalk"
          >
            <img
              src={kakaotalkLogo}
              alt=""
              className="h-full w-full object-cover"
              width={56}
              height={56}
              decoding="async"
            />
          </a>
          <a
            href={SOCIAL.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full sm:h-14 sm:w-14 bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white shadow-lg ring-2 ring-white/20 transition-transform hover:scale-105"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2} />
          </a>
          <a
            href={SOCIAL.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 w-11 items-center justify-center rounded-full sm:h-14 sm:w-14 bg-[#1877F2] text-white shadow-lg ring-2 ring-white/15 transition-transform hover:scale-105"
            aria-label="Facebook"
          >
            <FacebookMark className="h-6 w-6 sm:h-8 sm:w-8" />
          </a>
          <a
            href={SOCIAL.gmail}
            className="flex h-11 w-11 items-center justify-center rounded-full sm:h-14 sm:w-14 bg-stone-900 text-white shadow-lg ring-2 ring-black/10 transition-transform hover:scale-105"
            aria-label="Email"
          >
            <Mail className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2} />
          </a>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-11 w-11 items-center justify-center rounded-full sm:h-14 sm:w-14 border border-stone-200 bg-white text-stone-800 shadow-lg transition-transform hover:scale-105"
            aria-label="Холбоосыг нуух"
          >
            <X className="h-5 w-5 sm:h-6 sm:w-6" strokeWidth={2.5} />
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg ring-2 ring-amber-400/40 transition-transform hover:scale-105 hover:bg-amber-600 sm:h-14 sm:w-14"
          aria-label="Холбоосыг нээх"
          aria-expanded={false}
        >
          <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}
