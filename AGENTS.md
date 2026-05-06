# AGENTS.md

## Cursor Cloud specific instructions

### Architecture
Single fullstack app: Express.js backend + React (Vite) SPA, both served from one process on port 5000. The `homebrew/` directory is unrelated (Homebrew source copy) and should be ignored.

### Services
- **PostgreSQL 16** must be running before the dev server starts. Start with `pg_ctlcluster 16 main start`.
- **Dev server** (`npm run dev`) starts Express + Vite HMR on port 5000.

### Database
- The `DATABASE_URL` env var must include a username for TCP connections: `postgresql://root@localhost:5432/warehouse_db`
- The `.env` file omits the username, so export `DATABASE_URL` before running the dev server or drizzle-kit commands.
- Push schema changes with `DATABASE_URL="postgresql://root@localhost:5432/warehouse_db" npx drizzle-kit push`
- Admin accounts (`admin1`–`admin5`, password `admin123`) are auto-seeded on startup.

### Key commands
| Task | Command |
|------|---------|
| Dev server | `DATABASE_URL="postgresql://root@localhost:5432/warehouse_db" npm run dev` |
| Type check | `npx tsc --noEmit` |
| Schema push | `DATABASE_URL="postgresql://root@localhost:5432/warehouse_db" npx drizzle-kit push` |
| Build | `npm run build` |

### Gotchas
- `tsc --noEmit` reports 4 pre-existing type errors in `server/routes.ts` (Express v5 `req.params` type is `string | string[]` instead of `string`). These do not affect runtime behavior.
- pg_hba.conf is configured with `trust` auth for local TCP connections (127.0.0.1 and ::1) to avoid needing passwords in development.
- The `root` PostgreSQL role was created as a superuser to match the default user in the Cloud Agent environment.
