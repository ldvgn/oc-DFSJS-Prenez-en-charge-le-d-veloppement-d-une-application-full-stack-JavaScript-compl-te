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
| `npm test`             | Runs Vitest in watch mode (unit + integration) |
| `npm run test:unit`    | Runs unit tests once (`*.test.ts[x]`, Node environment) |
| `npm run test:integration` | Runs integration tests once (`*.int.test.ts[x]`, jsdom) |
| `npm run test:coverage` | Runs Vitest with a V8 coverage report (`coverage/`) |
| `npm run test:e2e`     | Starts the test database and runs Playwright end-to-end tests |
| `npm run test:e2e:ui`  | Same, with the Playwright UI mode        |
| `npm run db:test:up`   | Starts the test PostgreSQL container (port 5433) |
| `npm run db:test:down` | Stops and removes the test PostgreSQL container |

## Tests

| Type        | Tool       | Files                                   | Location                    |
| ----------- | ---------- | --------------------------------------- | --------------------------- |
| Unit        | Vitest     | `*.test.ts` / `*.test.tsx`              | next to the tested file     |
| Integration | Vitest + Testing Library (jsdom) | `*.int.test.ts` / `*.int.test.tsx` | next to the tested file |
| End-to-end  | Playwright | `*.spec.ts`                             | [tests/e2e/](tests/e2e/)    |

Unit and integration tests need no database. The Vitest setup file is [tests/setup.ts](tests/setup.ts).

### End-to-end tests

E2E tests run against an **isolated test database** (`postgres_test` service in [docker-compose.yml](docker-compose.yml), port `5433`, stored in RAM and wiped on every stop), so your development data is never touched.

1. Create a `.env.test` file at the project root (it is git-ignored):

   ```env
   DATABASE_URL="postgresql://test:test@localhost:5433/mdd_test"
   BETTER_AUTH_SECRET=<any random value>
   BETTER_AUTH_URL=http://localhost:3001
   ```

2. Install the Playwright browsers (first time only):

   ```bash
   npx playwright install
   ```

3. Run the tests:

   ```bash
   npm run test:e2e
   ```

`npm run test:e2e` starts the test container, then Playwright resets and seeds the test database ([global-setup.ts](tests/e2e/global-setup.ts)), builds the app and serves it on `http://localhost:3001`. Stop the container afterwards with `npm run db:test:down`.

## Project organization in VS Code

The repository ships a shared [.vscode/settings.json](.vscode/settings.json) that enables **file nesting** in the Explorer to keep the tree readable:

- test files are nested under the file they test: `login-form.tsx` groups `login-form.test.tsx` and `login-form.int.test.tsx`;
- config and lock files (`package-lock.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `playwright.config.ts`, `docker-compose.yml`, …) are nested under `package.json`;
- `node_modules` and `.next` are hidden from the Explorer.

Click the arrow next to a file to expand its nested files. If a file seems to be missing, look under `package.json` or its parent source file. These settings only apply to VS Code (other editors are not affected); to turn nesting off, set `"explorer.fileNesting.enabled": false` in [.vscode/settings.json](.vscode/settings.json) — workspace settings take precedence over user settings.

## Data model

- **User**: user account (username, email)
- **Session** / **Account** / **Verification**: Better Auth tables (sessions, credentials with hashed password, verification tokens)
- **Topic**: theme a user can subscribe to
- **Post**: article published by a user, associated with a topic
- **Comment**: a user's comment on a post
- **Subscription**: a user's subscription to a topic

The full schema is defined in [prisma/schema.prisma](prisma/schema.prisma).

## Authentication

Authentication uses [Better Auth](https://www.better-auth.com) (email/password) with sessions stored in the database.

- `/`, `/login` and `/register` are public; every other route (e.g. `/posts`) requires a session.
- Key files: [lib/auth.ts](lib/auth.ts) (configuration), [proxy.ts](proxy.ts) (route protection), [modules/auth/](modules/auth/) (login/register/logout server actions and service).
