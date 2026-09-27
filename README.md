# MDD — Monde Du Dev

Community app for developers: subscribe to topics, publish articles, and comment.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [Better Auth](https://www.better-auth.com) (email/password authentication, database sessions)
- [Prisma](https://www.prisma.io) 7 (ORM) with the [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/overview/databases/postgresql) adapter
- PostgreSQL 16 (via Docker)
- TypeScript, Tailwind CSS

## Prerequisites

- Node.js 20+
- Docker (for the PostgreSQL database)

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file at the project root with the following variables:

   ```env
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=
   POSTGRES_PORT=5432
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db>"
   BETTER_AUTH_SECRET=
   BETTER_AUTH_URL=http://localhost:3000
   ```

   `BETTER_AUTH_SECRET` is used to sign session cookies and encrypt sensitive data (Better Auth). Generate a value with:

   ```bash
   openssl rand -base64 32
   ```

3. Start the PostgreSQL database:

   ```bash
   docker compose up -d
   ```

4. Apply the database schema:

   ```bash
   npm run db:migrate
   ```

5. Seed the database with test data:

   ```bash
   npm run db:seed
   ```

## Running the project in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command               | Description                             |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Starts the Next.js development server    |
| `npm run build`        | Production build                         |
| `npm run start`        | Runs the production build                |
| `npm run lint`         | Checks the code with ESLint              |
| `npm run db:migrate`   | Creates/applies Prisma migrations        |
| `npm run db:seed`      | Inserts test data into the database      |

## Data model

- **User**: user account (username, email)
- **Session** / **Account** / **Verification**: Better Auth tables (sessions, credentials with hashed password, verification tokens)
- **Topic**: theme a user can subscribe to
- **Post**: article published by a user, associated with a topic
- **Comment**: a user's comment on a post
- **Subscription**: a user's subscription to a topic

The full schema is defined in [prisma/schema.prisma](prisma/schema.prisma).

## Authentication

Authentication uses [Better Auth](https://www.better-auth.com) with the Prisma adapter; sessions are stored in the database.

- `/`, `/login` and `/register` are public; every other route (e.g. `/posts`) requires a session.
- Route protection is handled in [proxy.ts](proxy.ts): on `/login` and `/register` the session is fully verified (logged-in users are redirected to `/posts`); on protected routes only the presence of the session cookie is checked (optimistic check). The real verification happens in the pages via `getCurrentUser()`.
- Better Auth is configured in [lib/auth.ts](lib/auth.ts) (email/password, `username` plugin) and exposed via the HTTP handler in `app/api/auth/[...all]`. There is no client-side Better Auth client yet: login/logout go through server actions that call `auth.api.*` directly (see [modules/auth/auth.service.ts](modules/auth/auth.service.ts)).
- Login/logout server actions live in [modules/auth/auth.actions.ts](modules/auth/auth.actions.ts).
