import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLang, type Lang } from "@/lib/lang";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, CheckCircle2 } from "lucide-react";
import {
  NATIONALITY_OPTIONS,
  type NationalityId,
} from "@shared/nationalities";

type BookingConfig = {
  tours: {
    slug: string;
    titleMn: string;
    titleKo: string;
    titleEn: string;
    bookable: boolean;
    hasPricing: boolean;
    maxPeople: number;
  }[];
  depositRate: number;
  bank: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    transferDeadlineHours: number;
  };
};

type BookingSuccess = {
  bookingNumber: string;
  tourSlug: string;
  tourTitle: string;
  travelDate: string;
  numberOfPeople: number;
  totalAmountKrw: number | null;
  depositAmountKrw: number | null;
  emailSent?: boolean;
  bank: BookingConfig["bank"];
};

const labels = {
  mn: {
    fullName: "Бүтэн нэр",
    nationality: "Иргэншил",
    phone: "Утасны дугаар",
    kakaoId: "KakaoTalk ID",
    email: "Имэйл",
    tour: "Аялал сонгох",
    people: "Хүний тоо",
    travelDate: "Аялах огноо",
    specialRequests: "Тусгай хүсэлт",
    submit: "Захиалга илгээх",
    submitting: "Илгээж байна...",
    depositEstimate: "Урьдчилгаа (тооцоолол)",
    pricingNote: "Энэ аяллын үнийг бид танд имэйлээр илгээнэ.",
    successTitle: "Захиалга амжилттай илгээгдлээ",
    successDesc:
      "Бид таны имэйл болон KakaoTalk руу урьдчилгаа төлбөрийн мэдээллийг илгээнэ. Доорх данс руу шилжүүлнэ үү.",
    emailNotSent:
      "Имэйл автоматаар илгээгдсэнгүй. Доорх мэдээллийг хадгалж, бидэнтэй шууд холбогдоорой.",
    bookingNo: "Захиалгын дугаар",
    bankTitle: "Банкны шилжүүлэг",
    bank: "Банк",
    account: "Данс",
    holder: "Эзэмшигч",
    deadline: "Хугацаа",
    hours: "цагийн дотор",
    selectTour: "Аялал сонгоно уу",
    selectNationality: "Иргэншил сонгоно уу",
    newBooking: "Шинэ захиалга",
    maxPeople: "Энэ аялалд хамгийн ихдээ 3 хүн захиална",
  },
  ko: {
    fullName: "성명",
    nationality: "국적",
    phone: "전화번호",
    kakaoId: "카카오톡 ID",
    email: "이메일",
    tour: "투어 선택",
    people: "인원",
    travelDate: "여행 날짜",
    specialRequests: "특별 요청",
    submit: "예약 신청",
    submitting: "제출 중...",
    depositEstimate: "예약금 (예상)",
    pricingNote: "해당 투어의 가격은 이메일로 안내해 드립니다.",
    successTitle: "예약 신청이 완료되었습니다",
    successDesc:
      "이메일과 카카오톡으로 예약금 안내를 보내 드립니다. 아래 계좌로 입금해 주세요.",
    emailNotSent:
      "이메일이 자동 발송되지 않았습니다. 아래 정보를 저장하고 직접 문의해 주세요.",
    bookingNo: "예약 번호",
    bankTitle: "입금 계좌",
    bank: "은행",
    account: "계좌번호",
    holder: "예금주",
    deadline: "입금 기한",
    hours: "시간 이내",
    selectTour: "투어를 선택하세요",
    selectNationality: "국적을 선택하세요",
    newBooking: "새 예약",
    maxPeople: "이 투어는 최대 3명까지 예약 가능합니다",
  },
  en: {
    fullName: "Full name",
    nationality: "Nationality",
    phone: "Phone number",
    kakaoId: "KakaoTalk ID",
    email: "Email",
    tour: "Select tour",
    people: "Number of guests",
    travelDate: "Travel date",
    specialRequests: "Special requests",
    submit: "Submit booking",
    submitting: "Submitting...",
    depositEstimate: "Deposit (estimate)",
    pricingNote: "Pricing for this tour will be sent to you by email.",
    successTitle: "Booking submitted successfully",
    successDesc:
      "We will send deposit payment details by email and KakaoTalk. Please transfer to the account below.",
    emailNotSent:
      "Email was not sent automatically. Save the details below and contact us directly.",
    bookingNo: "Booking number",
    bankTitle: "Bank transfer",
    bank: "Bank",
    account: "Account",
    holder: "Account holder",
    deadline: "Deadline",
    hours: "hours",
    selectTour: "Select a tour",
    selectNationality: "Select nationality",
    newBooking: "New booking",
    maxPeople: "This tour allows a maximum of 3 guests",
  },
} as const;

function bookingTourLabel(
  tour: { titleMn: string; titleKo: string; titleEn: string },
  lang: Lang,
): string {
  if (lang === "ko") return tour.titleKo;
  if (lang === "en") return tour.titleEn;
  return tour.titleMn;
}

function peopleSuffix(lang: Lang): string {
  if (lang === "ko") return "명";
  if (lang === "en") return " guests";
  return " хүн";
}

const formSchema = z
  .object({
    fullName: z.string().min(2),
    nationality: z.string().min(1),
    phone: z.string().min(5),
    kakaoId: z.string().optional(),
    email: z.string().email(),
    tourSlug: z.string().min(1),
    numberOfPeople: z.coerce.number().int().min(1).max(20),
    travelDate: z.string().min(1),
    specialRequests: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.tourSlug === "bird-photography" && data.numberOfPeople > 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["numberOfPeople"],
        message: "max3",
      });
    }
  });

type FormValues = z.infer<typeof formSchema>;

function formatKrw(n: number) {
  return `₩${n.toLocaleString("ko-KR")}`;
}

function FormField({
  label,
  error,
  children,
}: {
  label: string;
  error?: { message?: string };
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-stone-300 text-sm font-medium">{label}</Label>
      {children}
      {error && <p className="text-xs text-red-400 mt-1">{error.message}</p>}
    </div>
  );
}

type Props = {
  defaultTourSlug?: string;
  compact?: boolean;
};

export function BookingForm({ defaultTourSlug, compact }: Props) {
  const { lang } = useLang();
  const L = labels[lang];
  const [config, setConfig] = useState<BookingConfig | null>(null);
  const [success, setSuccess] = useState<BookingSuccess | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      nationality: "",
      phone: "",
      kakaoId: "",
      email: "",
      tourSlug: defaultTourSlug || "",
      numberOfPeople: 2,
      travelDate: "",
      specialRequests: "",
    },
  });

  useEffect(() => {
    fetch("/api/bookings/config")
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => setConfig(null));
  }, []);

  useEffect(() => {
    if (defaultTourSlug) {
      form.setValue("tourSlug", defaultTourSlug);
    }
  }, [defaultTourSlug, form]);

  const tourSlug = form.watch("tourSlug");
  const nationality = form.watch("nationality");
  const numberOfPeople = form.watch("numberOfPeople");
  const selectedTour = config?.tours.find((t) => t.slug === tourSlug);
  const maxPeople = selectedTour?.maxPeople ?? 20;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = form;

  useEffect(() => {
    const people = Number(numberOfPeople);
    if (people > maxPeople) {
      setValue("numberOfPeople", maxPeople, { shouldValidate: true });
    }
  }, [tourSlug, maxPeople, numberOfPeople, setValue]);

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await apiRequest("POST", "/api/bookings", {
        lang,
        ...values,
        airportPickup: false,
      });
      const data = (await res.json()) as BookingSuccess;
      setSuccess({ ...data, tourSlug: values.tourSlug });
    } catch (err) {
      let message =
        lang === "ko"
          ? "제출에 실패했습니다. 잠시 후 다시 시도해 주세요."
          : lang === "en"
            ? "Submission failed. Please try again shortly."
            : "Илгээхэд алдаа гарлаа. Дахин оролдоно уу.";

      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message.replace(/^\d+:\s*/, "")) as {
            message?: string;
            errors?: Record<string, string[]>;
          };
          if (parsed.errors) {
            const first = Object.values(parsed.errors).flat()[0];
            if (first) message = first;
          } else if (parsed.message) {
            message = parsed.message;
          }
        } catch {
          // keep default message
        }
      }
      setServerError(message);
    }
  };

  if (success) {
    return (
      <BookingSuccessView
        success={success}
        config={config}
        L={L}
        lang={lang}
        onNew={() => {
          setSuccess(null);
          form.reset();
        }}
      />
    );
  }

  const inputClass = "bg-stone-800/80 border-stone-600 text-white";
  const grid = compact ? "grid gap-4" : "grid sm:grid-cols-2 gap-4";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={compact ? "space-y-4" : "space-y-5"}>
      <FormField label={L.fullName} error={errors.fullName}>
        <Input {...register("fullName")} className={inputClass} />
      </FormField>

      <div className={grid}>
        <FormField label={L.nationality} error={errors.nationality}>
          <Select
            value={nationality || undefined}
            onValueChange={(v) =>
              setValue("nationality", v as NationalityId, { shouldValidate: true })
            }
          >
            <SelectTrigger className={inputClass}>
              <SelectValue placeholder={L.selectNationality} />
            </SelectTrigger>
            <SelectContent>
              {NATIONALITY_OPTIONS.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt[lang]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>
        <FormField label={L.phone} error={errors.phone}>
          <Input {...register("phone")} type="tel" className={inputClass} />
        </FormField>
      </div>

      <FormField label={L.kakaoId} error={errors.kakaoId}>
        <Input {...register("kakaoId")} className={inputClass} />
      </FormField>

      <FormField label={L.email} error={errors.email}>
        <Input {...register("email")} type="email" className={inputClass} />
      </FormField>

      <FormField label={L.tour} error={errors.tourSlug}>
        <Select
          value={tourSlug || undefined}
          onValueChange={(v) => setValue("tourSlug", v, { shouldValidate: true })}
        >
          <SelectTrigger className={inputClass}>
            <SelectValue placeholder={L.selectTour} />
          </SelectTrigger>
          <SelectContent>
            {config?.tours
              .filter((t) => t.bookable)
              .map((t) => (
                <SelectItem key={t.slug} value={t.slug}>
                  {bookingTourLabel(t, lang)}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </FormField>

      <div className={grid}>
        <FormField
          label={L.people}
          error={
            errors.numberOfPeople?.message === "max3"
              ? { message: L.maxPeople }
              : errors.numberOfPeople
          }
        >
          <Input
            {...register("numberOfPeople")}
            type="number"
            min={1}
            max={maxPeople}
            className={inputClass}
          />
        </FormField>
        <FormField label={L.travelDate} error={errors.travelDate}>
          <Input {...register("travelDate")} type="date" className={inputClass} />
        </FormField>
      </div>

      {selectedTour && !selectedTour.hasPricing && (
        <p className="text-sm text-amber-400/90 bg-amber-950/30 border border-amber-800/40 rounded-lg px-4 py-3">
          {L.pricingNote}
        </p>
      )}

      <FormField label={L.specialRequests} error={errors.specialRequests}>
        <Textarea {...register("specialRequests")} rows={3} className={`${inputClass} resize-none`} />
      </FormField>

      {serverError && (
        <p className="text-sm text-red-400 bg-red-950/40 border border-red-800/50 rounded-lg px-4 py-3">
          {serverError}
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-amber-600 hover:bg-amber-700 text-white h-12 text-base font-semibold"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            {L.submitting}
          </>
        ) : (
          L.submit
        )}
      </Button>
    </form>
  );
}

function BookingSuccessView({
  success,
  config,
  L,
  lang,
  onNew,
}: {
  success: BookingSuccess;
  config: BookingConfig | null;
  L: (typeof labels)[keyof typeof labels];
  lang: Lang;
  onNew: () => void;
}) {
  const bank = success.bank;
  const tour = config?.tours.find((t) => t.slug === success.tourSlug);
  const tourDisplay = tour ? bookingTourLabel(tour, lang) : success.tourTitle;
  return (
    <div className="rounded-2xl border border-emerald-800/50 bg-emerald-950/20 p-6 md:p-8 space-y-6">
      <div className="flex items-start gap-3">
        <CheckCircle2 className="h-8 w-8 text-emerald-500 shrink-0" />
        <div>
          <h3 className="text-xl font-bold text-white">{L.successTitle}</h3>
          <p className="text-stone-400 mt-1 text-sm leading-relaxed">{L.successDesc}</p>
          {success.emailSent === false && (
            <p className="mt-3 text-sm text-amber-300 bg-amber-950/40 border border-amber-700/50 rounded-lg px-3 py-2">
              {L.emailNotSent}
            </p>
          )}
        </div>
      </div>

      <dl className="space-y-2 text-sm">
        <Row label={L.bookingNo} value={success.bookingNumber} />
        <Row label={L.tour} value={tourDisplay} />
        <Row label={L.travelDate} value={success.travelDate} />
        <Row label={L.people} value={`${success.numberOfPeople}${peopleSuffix(lang)}`} />
        {success.depositAmountKrw != null && (
          <Row label={L.depositEstimate} value={formatKrw(success.depositAmountKrw)} highlight />
        )}
      </dl>

      {success.depositAmountKrw != null && (
        <BankBlock bank={bank} L={L} />
      )}

      <Button type="button" variant="outline" onClick={onNew} className="border-stone-600 text-stone-200">
        {L.newBooking}
      </Button>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-stone-500">{label}</dt>
      <dd className={highlight ? "text-amber-400 font-semibold" : "text-white font-medium"}>{value}</dd>
    </div>
  );
}

function BankBlock({ bank, L }: { bank: BookingSuccess["bank"]; L: (typeof labels)[keyof typeof labels] }) {
  return (
    <div className="rounded-xl border border-stone-700 bg-stone-900/80 p-4 space-y-2 text-sm">
      <p className="font-semibold text-amber-500">{L.bankTitle}</p>
      <p className="text-stone-300">
        {L.bank}: {bank.bankName}
      </p>
      <p className="text-stone-300">
        {L.account}: {bank.accountNumber}
      </p>
      <p className="text-stone-300">
        {L.holder}: {bank.accountHolder}
      </p>
      <p className="text-stone-400 text-xs">
        {L.deadline}: {bank.transferDeadlineHours} {L.hours}
      </p>
    </div>
  );
}
