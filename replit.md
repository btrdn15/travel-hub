# TravelWorld - Mongolian Travel & Tourism Website

## Overview
A Mongolian-language travel and tourism website with a public-facing homepage displaying brochure images and travel routine packages, plus an admin system with role-based access control. All UI text is in Mongolian (Cyrillic script).

## Architecture
- **Frontend**: React + TypeScript with Vite, Tailwind CSS, shadcn/ui components
- **Backend**: Express.js with session-based authentication (express-session + connect-pg-simple)
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: wouter (frontend), Express (backend API)

## Key Features
- Public homepage with brochure gallery (first), hero section, stats, and travel routines
- Admin login system with role-based permissions
- Super Admin (admin1): Full CRUD control over travel routines (create, edit, delete, change prices)
- Regular Admins (admin2-5): Can view and select routines for customer services
- Admin routine selection tracking in database
- All UI and seed data in Mongolian language

## Data Model
- **users**: id, username, password (hashed with scrypt), role (super_admin | admin)
- **routines**: id, title, destination, description, duration, price, image, highlights[], createdBy
- **admin_selections**: id, adminId, routineId (tracks which routines each admin has selected for service)

## Admin Accounts
- `admin1` / `admin123` - Role: `super_admin` (full CRUD)
- `admin2` / `admin234` - Role: `admin` (view & select only)
- `admin3` / `admin345` - Role: `admin`
- `admin4` / `admin456` - Role: `admin`
- `admin5` / `admin567` - Role: `admin`

## Important Implementation Details
- **Login redirect fix**: Login page uses `useEffect` to watch for `user` state changes from `useAuth()` and redirects to `/admin` when user becomes available. The auth mutation uses `queryClient.setQueryData` (not `invalidateQueries`) to avoid race conditions.
- **Homepage order**: BrochureSection → HeroSection → StatsSection → RoutinesSection → Footer
- **createdBy** is set server-side from `req.session.userId`, not trusted from client
- Generated images saved to `client/public/images/`

## Project Structure
```
client/src/
  pages/home.tsx              - Public homepage with brochure, hero, routines
  pages/login.tsx             - Admin login page (/admin/login)
  pages/admin-dashboard.tsx   - Admin management dashboard (/admin)
  pages/not-found.tsx         - 404 page
  lib/auth.tsx                - Auth context provider with login/logout
  lib/queryClient.ts          - TanStack Query client config
server/
  index.ts                    - Express server setup
  routes.ts                   - API endpoints with auth middleware
  storage.ts                  - Database storage layer (PostgreSQL)
  seed.ts                     - Seed data for admin accounts and Mongolian routines
shared/
  schema.ts                   - Drizzle schema + Zod validation
client/public/images/         - Generated travel destination images
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
