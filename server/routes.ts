import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { StorageUnavailableError, storage } from "./storage";
import { bookingSubmitSchema } from "@shared/schema";
import { BOOKING_TOUR_OPTIONS, DEPOSIT_RATE, getBankTransferInfo, getMaxPeopleForTour } from "@shared/booking-config";
import { resolveNationalityId } from "@shared/nationalities";
import {
  calculateBookingAmounts,
  generateBookingNumber,
  getBookingTour,
  notifyBookingChannels,
  resolveTourTitle,
} from "./booking";

export async function registerRoutes(
  httpServer: Server,
  app: Express,
): Promise<Server> {
  app.get("/api/bookings/config", (_req: Request, res: Response) => {
    const bank = getBankTransferInfo();
    return res.json({
      tours: BOOKING_TOUR_OPTIONS.map((t) => ({
        slug: t.slug,
        titleMn: t.titleMn,
        titleKo: t.titleKo,
        titleEn: t.titleEn,
        bookable: t.bookable,
        hasPricing: Boolean(t.priceTiers?.length),
        maxPeople: getMaxPeopleForTour(t.slug),
      })),
      depositRate: DEPOSIT_RATE,
      bank,
    });
  });

  app.post("/api/bookings", async (req: Request, res: Response) => {
    try {
      const parsed = bookingSubmitSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({
          message: "Invalid booking data",
          errors: parsed.error.flatten().fieldErrors,
        });
      }

      const data = parsed.data;
      const tour = getBookingTour(data.tourSlug);
      if (!tour || !tour.bookable) {
        return res.status(400).json({ message: "Invalid or unavailable tour" });
      }

      const maxPeople = getMaxPeopleForTour(data.tourSlug);
      if (data.numberOfPeople > maxPeople) {
        return res.status(400).json({
          message:
            data.lang === "ko"
              ? `최대 ${maxPeople}명까지 예약 가능합니다.`
              : data.lang === "en"
                ? `Maximum ${maxPeople} guest(s) for this tour.`
                : `Энэ аялалд хамгийн ихдээ ${maxPeople} хүн захиална.`,
        });
      }

      const nationalityId = resolveNationalityId(data.nationality);
      if (!nationalityId) {
        return res.status(400).json({
          message:
            data.lang === "ko"
              ? "국적을 선택해 주세요."
              : data.lang === "en"
                ? "Please select a valid nationality."
                : "Иргэншлээ сонгоно уу.",
        });
      }

      const amounts = calculateBookingAmounts(data.tourSlug, data.numberOfPeople);
      const tourTitle = resolveTourTitle(data.tourSlug, data.lang);

      const booking = await storage.createBooking({
        bookingNumber: generateBookingNumber(),
        fullName: data.fullName,
        nationality: nationalityId,
        phone: data.phone,
        kakaoId: data.kakaoId || null,
        email: data.email,
        tourSlug: data.tourSlug,
        tourTitle,
        numberOfPeople: data.numberOfPeople,
        travelDate: data.travelDate,
        specialRequests: data.specialRequests || null,
        airportPickup: data.airportPickup,
        lang: data.lang,
        pricePerPersonKrw: amounts.pricePerPersonKrw,
        totalAmountKrw: amounts.totalKrw,
        depositAmountKrw: amounts.depositKrw,
        status: "deposit_pending",
      });

      const { emailSent } = await notifyBookingChannels(booking);

      return res.status(201).json({
        bookingNumber: booking.bookingNumber,
        tourSlug: booking.tourSlug,
        tourTitle: booking.tourTitle,
        travelDate: booking.travelDate,
        numberOfPeople: booking.numberOfPeople,
        totalAmountKrw: booking.totalAmountKrw,
        depositAmountKrw: booking.depositAmountKrw,
        status: booking.status,
        emailSent,
        bank: getBankTransferInfo(),
      });
    } catch (error) {
      console.error("Booking failed:", error);
      if (error instanceof StorageUnavailableError) {
        return res.status(503).json({ message: "Booking storage is unavailable" });
      }

      return res.status(500).json({ message: "Failed to submit booking" });
    }
  });

  return httpServer;
}
