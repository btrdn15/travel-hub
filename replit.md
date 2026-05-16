# Olon Nuur Travel - Mongolian Travel & Tourism Website

## Overview
A Mongolian-language travel and tourism website for Olon Nuur Travel LLC. Features a modern public homepage with brochure showcase, contact info, and an admin system with role-based access control. All UI text is in Mongolian (Cyrillic script).

## Architecture
- **Frontend**: React + TypeScript with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with session-based authentication (express-session + connect-pg-simple)
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (frontend), Express (backend API)
- **Color Theme**: Warm amber/earth tones (hsl 30-35) matching Mongolian travel aesthetic

## Key Features
- Modern public homepage: hero with brochure background, stats, brochure gallery with lightbox zoom, contact section
- Admin login system with role-based permissions
- Super Admin role: Full CRUD control over travel routines
- Regular Admin role: Can view and select routines for customer services
- Admin routine selection tracking in database

## Data Model
- **users**: id, username, password (hashed with scrypt), role (super_admin | admin)
- **routines**: id, title, destination, description, duration, price, image, highlights[], createdBy
- **admin_selections**: id, adminId, routineId

## Admin Bootstrap
- Development (`NODE_ENV=development`) seeds local-only default accounts for testing.
- Non-development environments must set `ADMIN_USERNAME` and `ADMIN_PASSWORD` to create the initial `super_admin`; the development default password is rejected.
- Existing seeded accounts with the old development default password are rotated in non-development environments before they can be used.

## Important Implementation Details
- **Login redirect**: Login page uses `useEffect` to watch for `user` state changes from `useAuth()` and redirects to `/admin`. Auth mutation uses `queryClient.setQueryData` to avoid race conditions.
- **Homepage sections**: HeroSection → StatsSection → BrochureSection (with lightbox) → ContactSection → Footer
- **Brochure images**: Imported from `@assets/` (IMG_7059, IMG_7060) - Olon Nuur Travel brochure front/back
- **Contact info**: olonnuurtravel@gmail.com, 010-9290-5686, @olonnuurtravel (Instagram)
- **createdBy** is set server-side from `req.session.userId`

## Project Structure
```
client/src/
  pages/home.tsx              - Public homepage (hero, stats, brochure, contact)
  pages/login.tsx             - Admin login page (/admin/login)
  pages/admin-dashboard.tsx   - Admin management dashboard (/admin)
  pages/not-found.tsx         - 404 page
  lib/auth.tsx                - Auth context provider with login/logout
  lib/queryClient.ts          - TanStack Query client config
server/
  index.ts                    - Express server setup
  routes.ts                   - API endpoints with auth middleware
  storage.ts                  - Database storage layer (PostgreSQL)
  seed.ts                     - Seed data for admin accounts
shared/
  schema.ts                   - Drizzle schema + Zod validation
attached_assets/              - Brochure images (IMG_7059, IMG_7060)
```

## API Routes
- POST /api/auth/login - Admin login
- POST /api/auth/logout - Logout
- GET /api/auth/me - Current user session
- POST /api/auth/register - Create admin (super_admin only)
- GET /api/routines - List all routines (public)
- GET /api/routines/:id - Get single routine
- POST /api/routines - Create routine (super_admin only)
- PATCH /api/routines/:id - Update routine (super_admin only)
- DELETE /api/routines/:id - Delete routine (super_admin only)
- GET /api/admin/selections - Get admin's selected routines
- POST /api/admin/selections - Select a routine for service
- DELETE /api/admin/selections/:routineId - Remove routine selection
