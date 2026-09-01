import "dotenv/config";
import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { z } from "zod";
import { NATIONALITY_IDS } from "./nationalities";

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  bookingNumber: text("booking_number").notNull().unique(),
  fullName: text("full_name").notNull(),
  nationality: text("nationality").notNull(),
  phone: text("phone").notNull(),
  kakaoId: text("kakao_id"),
  email: text("email").notNull(),
  tourSlug: text("tour_slug").notNull(),
  tourTitle: text("tour_title").notNull(),
  numberOfPeople: integer("number_of_people").notNull(),
  travelDate: text("travel_date").notNull(),
  specialRequests: text("special_requests"),
  airportPickup: boolean("airport_pickup").notNull().default(false),
  lang: text("lang").notNull().default("mn"),
  pricePerPersonKrw: integer("price_per_person_krw"),
  totalAmountKrw: integer("total_amount_krw"),
  depositAmountKrw: integer("deposit_amount_krw"),
  status: text("status").notNull().default("deposit_pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const bookingSubmitSchema = z.object({
  fullName: z.string().min(2, "Name is required"),
  nationality: z.enum(NATIONALITY_IDS),
  phone: z.string().min(5, "Phone is required"),
  kakaoId: z.string().optional(),
  email: z.string().email("Valid email required"),
  tourSlug: z.string().min(1, "Tour is required"),
  numberOfPeople: z.number().int().min(1).max(20),
  travelDate: z.string().min(1, "Travel date is required"),
  specialRequests: z.string().optional(),
  airportPickup: z.boolean(),
  lang: z.enum(["mn", "ko", "en", "ja"]),
});

export type BookingSubmit = z.infer<typeof bookingSubmitSchema>;
export type Booking = typeof bookings.$inferSelect;
