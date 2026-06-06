-- Run once on PostgreSQL: psql $DATABASE_URL -f script/create-bookings.sql
CREATE TABLE IF NOT EXISTS bookings (
  id varchar PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number text NOT NULL UNIQUE,
  full_name text NOT NULL,
  nationality text NOT NULL,
  phone text NOT NULL,
  kakao_id text,
  email text NOT NULL,
  tour_slug text NOT NULL,
  tour_title text NOT NULL,
  number_of_people integer NOT NULL,
  travel_date text NOT NULL,
  special_requests text,
  airport_pickup boolean NOT NULL DEFAULT false,
  lang text NOT NULL DEFAULT 'ko',
  price_per_person_krw integer,
  total_amount_krw integer,
  deposit_amount_krw integer,
  status text NOT NULL DEFAULT 'deposit_pending',
  created_at timestamp NOT NULL DEFAULT now()
);
