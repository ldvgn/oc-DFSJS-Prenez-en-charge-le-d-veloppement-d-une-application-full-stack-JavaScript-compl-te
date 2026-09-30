---
name: write-tests
description: Writes Vitest (unit, integration) and Playwright (e2e) tests for an MDD file or feature following the project conventions. Use after an implementation or to fill a coverage gap.
argument-hint: <file(s) or feature to test>
---

Target: $ARGUMENTS (defaults to the files changed in `git diff main...HEAD` and `git status`).

## 1. Pick the test type

| File under test | Test | Environment |
|---|---|---|
| `*.service.ts`, `*.actions.ts`, `lib/*` | `<file>.test.ts` (unit) | node |
| component, `_components/*-form.tsx`, `page.tsx`, `layout.tsx` | `<file>.int.test.tsx` (integration) | jsdom |
| full user flow | `tests/e2e/<domain>.spec.ts` | Playwright + test DB |

Tests are colocated with the file under test. Repositories are not unit tested: e2e covers them.

Before writing, read an existing test of the same type as a model:
- unit action: `modules/auth/auth.actions.test.ts`
- unit service: `modules/auth/auth.service.test.ts`
- integration form: `app/(auth)/login/_components/login-form.int.test.tsx`
- e2e: `tests/e2e/auth.spec.ts`

## 2. Conventions

- Explicit imports: `import { describe, it, expect, vi } from "vitest"`.
- Test names in English, third person: `it("returns an error when ...")`, `it("redirects to /posts on ...")`.
- Arrange / Act / Assert separated by blank lines.
- No cleanup `afterEach`: `tests/setup.ts` already runs `cleanup()` and `vi.clearAllMocks()`.
- Expected UI strings are in French, with straight apostrophes.

### Unit: Server Action

```ts
vi.mock("./post.service");
vi.mock("next/navigation");
vi.mock("next/cache");
vi.mock("@/modules/auth/auth.service");
```

Cover for each action:
1. invalid data → `{ errors: {...} }`, service not called;
2. service error → `{ message: "..." }`, no `redirect`;
3. success → service called with the right data, then `redirect(...)` or `revalidatePath(...)`;
4. `authService.requireUser` called (protected action).

### Unit: service

Mock the repository (`vi.mock("./post.repository")`) or the external dependency (`@/lib/auth`, `next/headers`). Test business logic and error cases, not Prisma.

### Integration: form / component

```tsx
vi.mock("@/modules/posts/post.actions", () => ({ createPostAction: vi.fn() }));
```

- Query by role or label: `getByRole("button", { name: "..." })`, `getByLabelText("...")`. No `getByTestId`.
- Interact with `userEvent`, assert asynchronously with `findBy*`.
- Cover: client validation errors (action not called), `message` returned by the action displayed, server field errors (`errors`) displayed, valid submission (action called once).
- Async server pages: `render(await Page({ params: Promise.resolve({...}) }))`, services mocked.

### E2E

- Use seeded users (`prisma/seed.ts`), e.g. `alice` / `Password123!`.
- Unique data via `crypto.randomUUID().slice(0, 8)` to avoid collisions.
- Accessible selectors (`getByLabel`, `getByRole`), assertions on the URL and visible content.

## 3. Run

```bash
npx vitest run <file>          # while writing
npm run test:unit
npm run test:integration
npx playwright test tests/e2e/<domain>.spec.ts --project=chromium
```

A failing test reveals either a bug in the code or a mistake in the test: find out which before fixing, and report any bug found in the code. Never change an assertion just to make it pass.
