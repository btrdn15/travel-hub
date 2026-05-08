import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Mail, MessageCircle, X } from "lucide-react";
import { SiKakaotalk, SiInstagram, SiMessenger } from "react-icons/si";

type Lang = "mn" | "ko";

type ChatItem = {
  id: string;
  href: string;
  label: { mn: string; ko: string };
  icon: JSX.Element;
  bg: string;
  ring: string;
  testId: string;
};

const labels = {
  mn: {
    open: "Бидэнтэй холбогдох",
    close: "Хаах",
  },
  ko: {
    open: "문의하기",
    close: "닫기",
  },
};

// NOTE: Update the KakaoTalk and Messenger URLs below with your real channel links.
// - KakaoTalk: replace with your Kakao Channel URL, e.g. https://pf.kakao.com/_xxxxxx
// - Messenger: replace with your Facebook Page m.me link, e.g. https://m.me/yourpage
const KAKAO_URL = "https://pf.kakao.com/_olonnuurtravel";
const MESSENGER_URL = "https://m.me/olonnuurtravel";
const INSTAGRAM_URL =
  "https://www.instagram.com/olonnurtravel/?utm_source=ig_web_button_share_sheet";
const EMAIL_ADDRESS = "olonnuurtravel@gmail.com";

const items: ChatItem[] = [
  {
    id: "kakao",
    href: KAKAO_URL,
    label: { mn: "KakaoTalk", ko: "카카오톡" },
    icon: <SiKakaotalk className="h-7 w-7 text-[#3C1E1E]" />,
    bg: "bg-[#FEE500]",
    ring: "ring-[#FEE500]/40",
    testId: "link-chat-kakao",
  },
  {
    id: "instagram",
    href: INSTAGRAM_URL,
    label: { mn: "Instagram", ko: "인스타그램" },
    icon: <SiInstagram className="h-6 w-6 text-white" />,
    bg: "bg-gradient-to-tr from-[#FEDA75] via-[#D62976] to-[#4F5BD5]",
    ring: "ring-[#D62976]/40",
    testId: "link-chat-instagram",
  },
  {
    id: "messenger",
    href: MESSENGER_URL,
    label: { mn: "Messenger", ko: "메신저" },
    icon: <SiMessenger className="h-6 w-6 text-white" />,
    bg: "bg-gradient-to-br from-[#00B2FF] to-[#006AFF]",
    ring: "ring-[#0084FF]/40",
    testId: "link-chat-messenger",
  },
  {
    id: "email",
    href: `mailto:${EMAIL_ADDRESS}`,
    label: { mn: "Имэйл", ko: "이메일" },
    icon: <Mail className="h-6 w-6 text-white" />,
    bg: "bg-stone-900",
    ring: "ring-stone-900/40",
    testId: "link-chat-email",
  },
];

interface FloatingChatProps {
  lang?: Lang;
}

export default function FloatingChat({ lang = "mn" }: FloatingChatProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const t = labels[lang];

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-testid="floating-chat"
    >
      <AnimatePresence>
        {open && (
          <motion.ul
            key="chat-list"
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
            }}
            className="flex flex-col items-end gap-3"
          >
            {items.map((item) => (
              <motion.li
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 12, scale: 0.85 },
                  visible: { opacity: 1, y: 0, scale: 1 },
                }}
                transition={{ type: "spring", stiffness: 320, damping: 24 }}
                className="group flex items-center gap-3"
              >
                <span className="hidden sm:block px-3 py-1.5 rounded-lg bg-stone-900/85 text-white text-xs font-medium shadow-md opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 pointer-events-none whitespace-nowrap">
                  {item.label[lang]}
                </span>
                <a
                  href={item.href}
                  target={item.href.startsWith("mailto:") ? undefined : "_blank"}
                  rel={item.href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                  aria-label={item.label[lang]}
                  data-testid={item.testId}
                  className={`w-14 h-14 rounded-full ${item.bg} flex items-center justify-center shadow-lg ring-4 ${item.ring} hover:scale-110 active:scale-95 transition-transform`}
                >
                  {item.icon}
                </a>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t.close : t.open}
        aria-expanded={open}
        data-testid="button-floating-chat-toggle"
        whileTap={{ scale: 0.9 }}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-colors ${
          open
            ? "bg-white text-stone-900 ring-1 ring-stone-200"
            : "bg-amber-600 text-white hover:bg-amber-700"
        }`}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <X className="h-6 w-6" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <MessageCircle className="h-6 w-6" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
