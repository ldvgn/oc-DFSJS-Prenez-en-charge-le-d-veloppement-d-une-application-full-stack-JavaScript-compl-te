---
name: feature
description: Builds an MDD feature end to end (schema, repository, service, action, UI, tests). Use for any new feature or change to an existing one.
argument-hint: <feature description>
---

Requested feature: $ARGUMENTS

## 1. Explore

- Identify the domain(s) involved in `modules/<domain>/` and the routes in `app/(authenticated)` or `app/(auth)`.
- Read a similar existing module (e.g. `modules/posts/`, `modules/comments/`) and follow its conventions.
- Check `prisma/schema.prisma` if data is involved.
- Summarize what you understood in a few lines: what exists, what is missing, what is ambiguous.

## 2. Plan (STOP: wait for my approval)

Present a short plan:
- Files created / modified, per layer: `*.schemas.ts` → `*.repository.ts` → `*.service.ts` → `*.actions.ts` → page / `_components/*-form.tsx`.
- Prisma migration if needed (migration name).
- Technical choices and rejected alternatives.
- Planned tests (unit, integration, e2e).

Do not write any code before I approve.

## 3. Implement

In small steps, from data to UI, following CLAUDE.md:
- Migration: `npm run db:migrate -- --name <name>` (regenerates the client).
- Repository: the only layer touching `prisma`; `include` with `satisfies Prisma.XInclude`, types via `Prisma.XGetPayload`.
- Server Action: `authService.requireUser()` → `safeParse` → service in `try/catch` → `redirect()` outside the try, or `revalidatePath()`.
- Form: `useActionState` + RHF `form.register` on native fields (no `defaultValues`) + shadcn `Field`, `useServerErrors`, message in a `role="alert"` element.
- Protected page: `authService.requireUser()` first, `PageProps<"/route">`.
- JSDoc on every repository / service / action method. UI text in French, straight apostrophes (`'`, `&apos;` in JSX).

## 4. Test

Use the `write-tests` skill to write colocated tests:
- `*.test.ts` (unit) for services and actions, collaborators mocked with `vi.mock`.
- `*.int.test.tsx` (integration) for forms, action mocked.
- `tests/e2e/*.spec.ts` if the user flow changes.

## 5. Verify

Run and fix until everything passes:

```bash
npm run lint
npx tsc --noEmit
npm run test:unit
npm run test:integration
npm run test:e2e   # if e2e tests were added or changed
```

Never disable a lint rule or a test to make verification pass.

## 6. Review

Delegate the diff review (`git diff main...HEAD` + uncommitted files) to the `code-reviewer` subagent. Apply the relevant feedback, rerun step 5, then summarize: what was done, review feedback applied or dismissed (and why), and a proposed Conventional Commits message (`feat(<scope>): ...`). Do not commit without my approval.
