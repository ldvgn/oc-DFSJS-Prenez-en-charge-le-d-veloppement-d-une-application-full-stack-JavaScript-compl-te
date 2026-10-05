# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

MDD (Monde Du Dev): a Next.js 16 App Router community app where developers subscribe to topics, publish posts and comment. Stack: Better Auth (email/password + `username` plugin, DB sessions), Prisma 7 with `@prisma/adapter-pg` on PostgreSQL 16 (Docker), Tailwind 4, shadcn/ui on `@base-ui/react`, react-hook-form + zod 4. UI text is in French.

## Commands

```bash
docker compose up -d          # dev Postgres (reads POSTGRES_* from .env)
npm run db:migrate            # prisma migrate dev (also regenerates the client)
npm run db:seed               # tsx prisma/seed.ts
npm run dev
npm run lint
npx tsc --noEmit              # type-check (no npm script)

npm run test:unit             # Vitest "unit" project, node env, *.test.ts[x]
npm run test:integration      # Vitest "integration" project, jsdom, *.int.test.ts[x]
npx vitest run modules/auth/auth.actions.test.ts   # single file
npx vitest run -t "returns an error"               # by test name
npm run test:coverage

npm run test:e2e              # starts postgres_test (port 5433), then Playwright
npx playwright test tests/e2e/auth.spec.ts --project=chromium
npm run test:e2e:coverage     # e2e on Chromium + front-end coverage per file in coverage/e2e
npm run db:test:down
```

- Prisma config is in `prisma7.config.ts` (schema path, migrations, seed command). The client is generated to `prisma/generated/prisma` (git-ignored) and imported from `@/prisma/generated/prisma/client`, not `@prisma/client`. Run `npx prisma generate` if imports fail.
- E2E uses `.env.test` and a RAM-backed DB; `tests/e2e/global-setup.ts` runs `prisma migrate reset --force` + seed, and Playwright builds and serves the app on port 3001 (`reuseExistingServer` locally, so a stale server on 3001 will be reused).
- E2E coverage (`E2E_COVERAGE=1`, Monocart): front-end only, Chromium. `next.config.ts` emits browser source maps; the `page` fixture in `tests/e2e/fixtures.ts` records V8 coverage over CDP and takes a snapshot before each `page.goto` (a full navigation drops the previous document's scripts; client-side navigations don't); `global-setup.ts` returns the teardown that generates the report. Specs import `test`/`expect` from `./fixtures`, not `@playwright/test`.

## Architecture

**Layered modules** (`modules/<domain>/`): each domain has

- `*.schemas.ts`: zod schema + inferred type + action state type (`PostSchema` / `PostType` / `PostState`), shared by client form and server action. Also holds the query result types (`PostWithAuthor`, `PostDetail`) written as `Prisma.XGetPayload<{ include: {...} }>` with `import type` only.
- `*.repository.ts`: only layer that touches `prisma`. `include` / `orderBy` are written inline in each query (no shared `include` constants).
- `*.service.ts`: business logic over the repository. Classes with the repository injected via constructor default, exported as a singleton (`postService`, `commentService`).
- `*.actions.ts`: `"use server"` Server Actions.

**Server Action contract** (used by every form):

1. `await authService.requireUser()` first on protected actions (redirects to `/login`).
2. `Schema.safeParse(...)` from `FormData`; on failure return `{ errors: z.flattenError(err).fieldErrors }`.
3. Call the service in `try/catch`; on failure return `{ message: "..." }`.
4. `redirect()` (outside the try) or `revalidatePath()` on success.
   State type (in `*.schemas.ts`) is `{ errors?: {field?: string[]}, message?: string } | undefined`.

**Client forms** (`app/**/_components/*-form.tsx`): `useActionState(action)` + `useForm({ resolver: zodResolver(Schema) })`; native fields (`Input`, `Textarea`, `NativeSelect`) use `form.register(name)` inside shadcn `Field`/`FieldLabel`/`FieldError`, with errors from `form.formState.errors`. Keep `Controller` for non-native components only. No `defaultValues`: uncontrolled inputs keep what was typed before hydration (a controlled reset breaks WebKit e2e). `onSubmit` builds a `FormData` and calls `startTransition(() => formAction(fd))`. Field errors come from the client zod resolver only (the action re-validates with the same schema for security); `state.message` is rendered as `{state?.message && <p role="alert">…</p>}`.

**Action buttons** (no user-typed field, e.g. `subscribe-button.tsx`): `<form action={formAction}>` with `useActionState` and hidden inputs, no `useForm`/zod resolver. The state is `{ message?: string } | undefined` (no `errors`, nothing to show next to a field): the action returns `{ message }` on validation failure too. Do not copy this pattern into forms with real fields.

**Auth**:

- `lib/auth.ts`: Better Auth config; `nextCookies()` plugin sets cookies from Server Actions.
- `proxy.ts` (Next 16's replacement for `middleware.ts`): follows the Better Auth Next.js doc; full `auth.api.getSession` on `/posts`, `/topics`, `/profile` (matcher), redirects to `/login` without a session.
- `/`, `/login`, `/register` pages call `auth.api.getSession` themselves and redirect logged-in users to `/posts`.
- Real session validation happens in pages/actions via `authService.requireUser()`, which must be called at the top of every protected page and Server Action.

**Routing**: route groups `app/(auth)` (login/register, public) and `app/(authenticated)` (shared `AppHeader` layout). Route-local components go in `_components/` next to the page. Pages use Next's global `PageProps<"/route">` / `LayoutProps` types. `components/ui/` is shadcn-generated (excluded from coverage); `components/shared/` holds app-wide components.

## Testing conventions

- Tests are colocated with the file under test (VS Code file nesting groups them).
- Unit tests mock collaborators with `vi.mock("./auth.service")` / `vi.mock("next/navigation")` and assert on `vi.mocked(...)`. Repository tests mock `@/lib/prisma` with a factory (`vi.mock("@/lib/prisma", () => ({ prisma: { post: { findMany: vi.fn() } } }))`) and assert on the full Prisma call. `tests/setup.ts` runs `cleanup()` and `vi.clearAllMocks()` after each test.
- Integration tests render components with Testing Library + `userEvent`, mocking the Server Action module (`vi.mock("@/modules/auth/auth.actions", () => ({ loginAction: vi.fn() }))`).
- Vitest and Playwright need no DB except e2e.
- No type casts in tests (`as never`, `as any`): fixtures list every field the type expects.
- Each test is self-contained: interactions are written inline, no shared step helpers (`fillForm()`); only fixture data may be shared.

## Conventions

- JSDoc on every repository/service/action method, kept minimal like `modules/auth`: a one-line summary (ends with `.`), then `@param name - Short phrase` and `@returns Short phrase` without trailing `.`. No filler ("Validated", "The post's", "for the given author"), no multi-line descriptions. Actions don't document `_state`; `@param formData` lists the fields (`` `topicId`, `title` ``), `@returns The errors to display`.
  ```ts
  /**
   * Creates a post.
   *
   * @param input - Post form data
   * @param authorId - Author ID
   * @returns The created post
   */
  ```
- Use straight apostrophes in UI strings (`'`, `&apos;` in JSX), not `’`.
- Commits follow Conventional Commits with scope (`feat(posts): ...`, `refactor(forms): ...`).
