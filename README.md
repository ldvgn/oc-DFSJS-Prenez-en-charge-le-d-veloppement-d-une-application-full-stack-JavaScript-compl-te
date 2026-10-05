# MDD — Monde Du Dev

Community app for developers: subscribe to topics, publish articles, and comment.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [Better Auth](https://www.better-auth.com) (email/password authentication, database sessions)
- [Prisma](https://www.prisma.io) 7 (ORM) with the [`@prisma/adapter-pg`](https://www.prisma.io/docs/orm/overview/databases/postgresql) adapter
- PostgreSQL 16 (via Docker)
- TypeScript, Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com) (on `@base-ui/react`)
- [react-hook-form](https://react-hook-form.com) + [zod](https://zod.dev) 4 (form validation shared by client and Server Actions)
- [Vitest](https://vitest.dev) + Testing Library, [Playwright](https://playwright.dev), SonarQube

## Prerequisites

- Node.js 20+
- Docker (for the PostgreSQL database)

## Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy [.env.example](.env.example) to `.env` and fill in the values:

   ```bash
   cp .env.example .env
   ```

   ```env
   POSTGRES_USER=
   POSTGRES_PASSWORD=
   POSTGRES_DB=
   POSTGRES_PORT=5432
   DATABASE_URL="postgresql://<user>:<password>@localhost:5432/<db>"
   BETTER_AUTH_SECRET=
   BETTER_AUTH_URL=http://localhost:3000
   SONAR_TOKEN=            # optional, see "Code quality"
   ```

   `BETTER_AUTH_SECRET` is used to sign session cookies and encrypt sensitive data (Better Auth). Generate a value with:

   ```bash
   openssl rand -base64 32
   ```

3. Start the PostgreSQL database:

   ```bash
   docker compose up -d
   ```

4. Apply the database schema (also generates the Prisma client):

   ```bash
   npm run db:migrate
   ```

   The Prisma configuration lives in [prisma7.config.ts](prisma7.config.ts) and the client is generated to `prisma/generated/prisma` (git-ignored). If imports from `@/prisma/generated/prisma/client` fail, run `npx prisma generate`.

5. Seed the database with test data (wipes existing data first):

   ```bash
   npm run db:seed
   ```

   It creates 3 topics, a few posts, a comment, subscriptions and two accounts:

   | Username | Email           | Password       |
   | -------- | --------------- | -------------- |
   | `alice`  | `alice@mdd.dev` | `Password123!` |
   | `bob`    | `bob@mdd.dev`   | `Password123!` |

## Running the project in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available scripts

| Command                     | Description                                                          |
| --------------------------- | -------------------------------------------------------------------- |
| `npm run dev`               | Starts the Next.js development server                                |
| `npm run build`             | Production build                                                     |
| `npm run start`             | Runs the production build                                            |
| `npm run lint`              | Checks the code with ESLint                                          |
| `npx tsc --noEmit`          | Type-checks the project (no npm script)                              |
| `npm run db:migrate`        | Creates/applies Prisma migrations and regenerates the client         |
| `npm run db:seed`           | Resets the data and inserts test data                                |
| `npm test`                  | Runs Vitest in watch mode (unit + integration)                       |
| `npm run test:unit`         | Runs unit tests once (`*.test.ts[x]`, Node environment)              |
| `npm run test:integration`  | Runs integration tests once (`*.int.test.ts[x]`, jsdom)              |
| `npm run test:coverage`     | Runs Vitest with a V8 coverage report (`coverage/unit/`)             |
| `npm run test:e2e`          | Starts the test database and runs Playwright end-to-end tests        |
| `npm run test:e2e:ui`       | Same, with the Playwright UI mode                                    |
| `npm run test:e2e:coverage` | E2E tests on Chromium with front-end coverage (`coverage/e2e/`)      |
| `npm run db:test:up`        | Starts the test PostgreSQL container (port 5433)                     |
| `npm run db:test:down`      | Stops and removes the test PostgreSQL container                      |
| `npm run sonar:up`          | Starts the local SonarQube server (port 9000)                        |
| `npm run sonar`             | Runs the SonarQube analysis (needs `SONAR_TOKEN` in `.env`)          |
| `npm run sonar:down`        | Stops the SonarQube server                                           |

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

`npm run test:e2e` starts the test container, then Playwright resets and seeds the test database ([global-setup.ts](tests/e2e/global-setup.ts)), builds the app and serves it on `http://localhost:3001`. The container is stopped and removed once the suite ends ([global-teardown.ts](tests/e2e/global-teardown.ts)); run `npm run db:test:down` manually if a run was interrupted.

Locally, Playwright reuses a server already listening on port 3001: stop any stale one to test a fresh build.

Specs import `test` / `expect` from [tests/e2e/fixtures.ts](tests/e2e/fixtures.ts), not from `@playwright/test`.

### End-to-end coverage

`npm run test:e2e:coverage` runs the suite on Chromium only with `E2E_COVERAGE=1`: the browser's V8 coverage is recorded through [Monocart](https://github.com/cenfun/monocart-coverage-reports) and mapped back to the sources, giving a front-end coverage report per file in `coverage/e2e/` (server code is not measured).

## Code quality (SonarQube)

Local analysis, run on demand (no CI).

1. Start the server (`sonar` Docker Compose profile), then open [http://localhost:9000](http://localhost:9000):

   ```bash
   npm run sonar:up
   ```

2. First time only: log in with `admin` / `admin` and change the password, create a local project with the key `oc-monde-du-dev`, then generate a token (My Account > Security) and add it to `.env`:

   ```env
   SONAR_TOKEN=
   ```

3. Generate the coverage reports, then run the analysis:

   ```bash
   npm run test:coverage       # coverage/unit/lcov.info
   npm run test:e2e:coverage   # coverage/e2e/lcov.info (optional)
   npm run sonar
   ```

4. Stop the server with `npm run sonar:down`.

## Project organization in VS Code

The repository ships a shared [.vscode/settings.json](.vscode/settings.json) that enables **file nesting** in the Explorer to keep the tree readable:

- test files are nested under the file they test: `login-form.tsx` groups `login-form.test.tsx` and `login-form.int.test.tsx`;
- config and lock files (`package-lock.json`, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `playwright.config.ts`, `docker-compose.yml`, …) are nested under `package.json`;
- `node_modules` and `.next` are hidden from the Explorer.

Click the arrow next to a file to expand its nested files. If a file seems to be missing, look under `package.json` or its parent source file. These settings only apply to VS Code (other editors are not affected); to turn nesting off, set `"explorer.fileNesting.enabled": false` in [.vscode/settings.json](.vscode/settings.json) — workspace settings take precedence over user settings.

## Architecture

```
app/
  (auth)/            login, register (public)
  (authenticated)/   posts, posts/new, posts/[id], topics, profile (shared header layout)
  **/_components/    components local to a route
components/
  ui/                shadcn/ui generated components
  shared/            app-wide components
lib/                 auth.ts (Better Auth), prisma.ts (Prisma client)
modules/<domain>/    auth, comment, post, subscription, topic, user
prisma/              schema, migrations, seed
tests/               Vitest setup, e2e/ (Playwright)
proxy.ts             route protection (Next 16 replacement for middleware.ts)
```

Each domain in `modules/` is split into layers:

| File               | Role                                                                     |
| ------------------ | ------------------------------------------------------------------------ |
| `*.schemas.ts`     | zod schemas and types, shared by the client form and the Server Action   |
| `*.repository.ts`  | Prisma queries (the only layer that accesses the database)               |
| `*.service.ts`     | Business logic over the repository                                       |
| `*.actions.ts`     | Server Actions: check the session, validate `FormData`, call the service |

## Data model

- **User**: user account (username, email)
- **Session** / **Account** / **Verification**: Better Auth tables (sessions, credentials with hashed password, verification tokens)
- **Topic**: theme a user can subscribe to
- **Post**: article published by a user, associated with a topic
- **Comment**: a user's comment on a post
- **Subscription**: a user's subscription to a topic

The full schema is defined in [prisma/schema.prisma](prisma/schema.prisma).

## Authentication

Authentication uses [Better Auth](https://www.better-auth.com) (email/password + `username` plugin) with sessions stored in the database. Users log in with their email **or** their username.

- `/`, `/login` and `/register` are public and redirect logged-in users to `/posts`.
- `/posts`, `/topics` and `/profile` require a session: [proxy.ts](proxy.ts) redirects to `/login` without one, and each protected page and Server Action re-checks it with `authService.requireUser()`.
- Key files: [lib/auth.ts](lib/auth.ts) (configuration), [proxy.ts](proxy.ts) (route protection), [modules/auth/](modules/auth/) (login/register/logout server actions and service).
