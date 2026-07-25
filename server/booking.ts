import {
  calculateBookingAmounts,
  getBankTransferInfo,
  getBookingTour,
  formatKrw,
} from "@shared/booking-config";
import type { Booking } from "@shared/schema";
import { buildCustomerBookingEmail, buildKakaoMessage } from "./booking-messages";
import { sendEmail } from "./email";

export function generateBookingNumber(): string {
  const year = new Date().getFullYear();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `ON-${year}-${suffix}`;
}

export function resolveTourTitle(slug: string, lang: "mn" | "ko" | "en" | "ja"): string {
  const tour = getBookingTour(slug);
  if (!tour) return slug;
  if (lang === "ko") return tour.titleKo;
  if (lang === "en") return tour.titleEn;
  if (lang === "ja") return tour.titleJa;
  return tour.titleMn;
}

export async function sendBookingConfirmationEmail(
  booking: Booking,
): Promise<boolean> {
  const { subject, text } = buildCustomerBookingEmail(booking);
  return sendEmail({
    to: booking.email,
    subject,
    text,
  });
}

export async function notifyMakeWebhook(booking: Booking): Promise<void> {
  const url = process.env.MAKE_WEBHOOK_URL;
  if (!url) {
    console.warn(
      "[webhook] MAKE_WEBHOOK_URL not set — KakaoTalk auto-message skipped. Set it in .env for Make.com.",
    );
    return;
  }

  const bank = getBankTransferInfo();
  const kakaoMessage = buildKakaoMessage(booking);
  const customerEmail = buildCustomerBookingEmail(booking);

  const payload = {
    type: "booking_confirmation",
    bookingNumber: booking.bookingNumber,
    fullName: booking.fullName,
    nationality: booking.nationality,
    phone: booking.phone,
    kakaoId: booking.kakaoId,
    email: booking.email,
    tourSlug: booking.tourSlug,
    tourTitle: booking.tourTitle,
    numberOfPeople: booking.numberOfPeople,
    travelDate: booking.travelDate,
    specialRequests: booking.specialRequests,
    airportPickup: booking.airportPickup,
    lang: booking.lang,
    totalAmountKrw: booking.totalAmountKrw,
    totalAmountFormatted: booking.totalAmountKrw
      ? formatKrw(booking.totalAmountKrw)
      : null,
    depositAmountKrw: booking.depositAmountKrw,
    depositAmountFormatted: booking.depositAmountKrw
      ? formatKrw(booking.depositAmountKrw)
      : null,
    status: booking.status,
    bankName: bank.bankName,
    accountNumber: bank.accountNumber,
    accountHolder: bank.accountHolder,
    transferDeadlineHours: bank.transferDeadlineHours,
    createdAt: booking.createdAt,
    /** Make.com → KakaoTalk мессеж илгээхэд ашиглана */
    kakaoMessage,
    emailSubject: customerEmail.subject,
    emailBody: customerEmail.text,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Make.com webhook failed:", res.status, await res.text());
  }
}

async function notifyCompanyInbox(booking: Booking): Promise<void> {
  const inbox = process.env.BOOKING_NOTIFY_EMAIL || "olonnuurtravel@gmail.com";
  const { subject, text } = buildCustomerBookingEmail(booking);
  await sendEmail({
    to: inbox,
    subject: `[Шинэ захиалга] ${subject}`,
    text: `Шинэ захиалга ирлээ.\n\n${text}`,
  });
}

export async function notifyBookingChannels(
  booking: Booking,
): Promise<{ emailSent: boolean }> {
  const [customerResult] = await Promise.allSettled([
    sendBookingConfirmationEmail(booking),
    notifyCompanyInbox(booking),
    notifyMakeWebhook(booking),
  ]);

  const emailSent =
    customerResult.status === "fulfilled" && customerResult.value === true;

  return { emailSent };
}

export { calculateBookingAmounts, getBookingTour };
