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
npm run db:test:down
```

- Prisma config is in `prisma7.config.ts` (schema path, migrations, seed command). The client is generated to `prisma/generated/prisma` (git-ignored) and imported from `@/prisma/generated/prisma/client`, not `@prisma/client`. Run `npx prisma generate` if imports fail.
- E2E uses `.env.test` and a RAM-backed DB; `tests/e2e/global-setup.ts` runs `prisma migrate reset --force` + seed, and Playwright builds and serves the app on port 3001 (`reuseExistingServer` locally, so a stale server on 3001 will be reused).

## Architecture

**Layered modules** (`modules/<domain>/`): each domain has
- `*.schemas.ts`: zod schema + inferred type (`PostSchema` / `PostType`), shared by client form and server action.
- `*.repository.ts`: only layer that touches `prisma`. Defines `include` objects with `satisfies Prisma.XInclude` and derives payload types via `Prisma.XGetPayload`.
- `*.service.ts`: business logic over the repository. Mostly classes with the repository injected via constructor default, exported as a singleton (`postService`); `commentService` is a plain object.
- `*.actions.ts`: `"use server"` Server Actions.

**Server Action contract** (used by every form):
1. `await authService.requireUser()` first on protected actions (redirects to `/login`).
2. `Schema.safeParse(...)` from `FormData`; on failure return `{ errors: z.flattenError(err).fieldErrors }`.
3. Call the service in `try/catch`; on failure return `{ message: "..." }`.
4. `redirect()` (outside the try) or `revalidatePath()` on success.
State type is `{ errors?: {field?: string[]}, message?: string } | undefined`.

**Client forms** (`app/**/_components/*-form.tsx`): `useActionState(action)` + `useForm({ resolver: zodResolver(Schema) })`; native fields (`Input`, `Textarea`, `NativeSelect`) use `form.register(name)` inside shadcn `Field`/`FieldLabel`/`FieldError`, with errors from `form.formState.errors`. Keep `Controller` for non-native components only. No `defaultValues`: uncontrolled inputs keep what was typed before hydration (a controlled reset breaks WebKit e2e). `onSubmit` builds a `FormData` and calls `startTransition(() => formAction(fd))`. `useServerErrors(form, state?.errors)` (`hooks/use-server-errors.ts`) pushes server field errors into RHF; `state.message` is rendered as `{state?.message && <p role="alert">…</p>}`.

**Auth**:
- `lib/auth.ts`: Better Auth config; `nextCookies()` plugin sets cookies from Server Actions.
- `proxy.ts` (Next 16's replacement for `middleware.ts`): `/`, `/login`, `/register` redirect logged-in users to `/posts`; other routes only check the session cookie exists (optimistic).
- Real session validation happens in pages/actions via `authService.requireUser()`, which must be called at the top of every protected page and Server Action.
- `app/api/auth/[...all]/route.ts` mounts the Better Auth handler.

**Routing**: route groups `app/(auth)` (login/register, public) and `app/(authenticated)` (shared `AppHeader` layout). Route-local components go in `_components/` next to the page. Pages use Next's global `PageProps<"/route">` / `LayoutProps` types. `components/ui/` is shadcn-generated (excluded from coverage); `components/shared/` holds app-wide components.

## Testing conventions

- Tests are colocated with the file under test (VS Code file nesting groups them).
- Unit tests mock collaborators with `vi.mock("./auth.service")` / `vi.mock("next/navigation")` and assert on `vi.mocked(...)`. `tests/setup.ts` runs `cleanup()` and `vi.clearAllMocks()` after each test.
- Integration tests render components with Testing Library + `userEvent`, mocking the Server Action module (`vi.mock("@/modules/auth/auth.actions", () => ({ loginAction: vi.fn() }))`).
- Vitest and Playwright need no DB except e2e.

## Conventions

- JSDoc on every repository/service/action method (`@param`, `@returns`).
- Use straight apostrophes in UI strings (`'`, `&apos;` in JSX), not `’`.
- Commits follow Conventional Commits with scope (`feat(posts): ...`, `refactor(forms): ...`).
