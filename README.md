# Northstar Market

Northstar Market is a production-style MVP for a modern second-hand marketplace built with Next.js App Router, TypeScript, Tailwind CSS, Prisma, PostgreSQL, and Auth.js.

## Stack

- Next.js 16 App Router
- TypeScript
- Tailwind CSS
- shadcn-style UI component structure
- Prisma + PostgreSQL
- Auth.js / NextAuth with credentials and Google
- React Hook Form + Zod
- Local filesystem upload storage abstraction
- Vitest unit tests

## Features

- Public homepage, browse, category, listing detail, safety, prohibited items, and how-it-works pages
- Credentials auth and Google sign-in entrypoint
- User dashboard for profile, listings, saved items, and messages
- Listing creation/editing with multi-image upload support
- Favorites, report flow, seller trust card, and safe meetup guidance
- Moderation foundations with prohibited-keyword screening
- Admin dashboard for listings, reports, users, and categories
- Prisma seed data with realistic marketplace records
- Docker Compose file for PostgreSQL

## Project Structure

```text
src/
  app/
    api/
    admin/
    browse/
    category/[slug]/
    dashboard/
    listing/[slug]/
  actions/
  components/
    admin/
    dashboard/
    forms/
    layout/
    listing/
    ui/
  lib/
    db/
    queries/
    storage/
  tests/
prisma/
  schema.prisma
  seed.ts
  migrations/
```

## Local Setup

1. Copy the env file:

```bash
cp .env.example .env
```

2. Start PostgreSQL.

If Docker is available:

```bash
docker compose up -d
```

If Docker is not available, create a local PostgreSQL database manually and point `DATABASE_URL` to it.

3. Install dependencies:

```bash
npm install
```

4. Generate Prisma client:

```bash
npx prisma generate
```

5. Run migrations:

```bash
npx prisma migrate dev --name init
```

6. Seed the database:

```bash
npm run db:seed
```

7. Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Demo Seed Accounts

- Admin: `admin@northstar.test`
- User: `ayesha@northstar.test`
- Password: `Password123!`

## Verification Commands

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## What Was Verified In This Environment

Verified successfully:

- `npx prisma generate`
- `npm run typecheck`
- `npm run lint`
- `npm test`
- `npm run build`
- Initial SQL migration file generated at `prisma/migrations/0001_init/migration.sql`

Not executed here because this machine does not have Docker or PostgreSQL installed:

- `npx prisma migrate dev --name init`
- `npm run db:seed`
- full runtime login/create-listing/message flow against a live database

The codebase, schema, env file, and commands are prepared for those DB-backed steps.

## Deployment Notes

- Set `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and optional Google OAuth credentials.
- Replace local upload storage with cloud object storage by swapping the implementation in `src/lib/storage/local-storage.ts`.
- Keep middleware and server-side auth checks enabled for dashboard/admin routes.
- Use a managed PostgreSQL instance for production.

## Notes

- Public browse pages only surface approved listings.
- Listing creation runs Zod validation on the server and keyword-based moderation screening.
- Messaging blocks self-messaging and enforces participant authorization on conversation APIs.
- Admin flows are gated by role checks in middleware and server actions.
