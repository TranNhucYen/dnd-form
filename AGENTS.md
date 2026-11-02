<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# AGENTS.md

## Commands & verification
- Node 24 and pnpm 9.15.9 (`.nvmrc`, `packageManager`; `engine-strict` is on).
- `pnpm install` also runs `postinstall`, copying `pdf.worker.min.mjs` into `public/` (gitignored). Re-run with `node scripts/copy-pdf-worker.mjs` if it is missing.
- `pnpm dev` / `pnpm build` / `pnpm typecheck`.
- `pnpm typecheck` is the only CI check (`.github/workflows/ci-cd.yml`). Run it before pushing.
- There is no test script or test suite. Do not invent or assume one.
- `pnpm lint` currently reports ~55 pre-existing errors / 44 warnings and is not in CI. Lint touched files, but don't treat the full-repo result as a regression.
- `pnpm format` currently fails: `.prettierrc` points `tailwindStylesheet` at `app/globals.css`, but the file is `src/app/globals.css`. Fix that path before using it; avoid whole-repo formatting.
- DB is MySQL 8. `pnpm db:push` uses `drizzle-kit push` (no migration files). `pnpm db:seed` runs `tsx --env-file=.env src/db/seed/init-system-data.ts`; it is safe to re-run, but existing rows are ignored, so changing `SUPER_ADMIN_PASSWORD` does not update an existing account.

## Environment & data mode
- Copy `.env.example` to `.env`; `DATABASE_URL`, `JWT_SECRET` (at least 32 chars), and `SUPER_ADMIN_*` are required for a real run.
- `isMockMode()` (`src/lib/config.ts`) returns true unless `USE_MOCK_DATA` is exactly `"false"`. Unset therefore means mock mode.
- Mock mode is partial. Auth, editor/save, print/PDF, and submissions always hit MySQL; mock repositories exist for account, community, my-form, notifications, shared-with-me, templates, and admin category/dashboard/template/user. Use `USE_MOCK_DATA=false` to exercise real end-to-end flows.
- Storage: `STORAGE_DRIVER=local` writes to `storage/uploads` (gitignored) and serves via `/api/files/[...key]`; `s3` requires `S3_PUBLIC_URL` and rejects localhost in production. Storage/PDF/hydration modules import `server-only` — never import them from client components.

## Architecture
- `src/app` is routing only. Business code is feature-sliced under `src/features/<feature>/{actions,services,repositories,hooks,components,types,validation}`. Flow: repository → service → server action → hook/UI.
- Repositories are selected at import time in each `repositories/index.ts` via `isMockMode()`. If you add one, add its mock counterpart or mock mode will break.
- Server actions use `"use server"`, return `ActionResponse<T>` (`@/shared/types/action.type`), and wrap errors with `handleActionError(error, name)`. Services do zod validation and throw `AppError` subclasses from `@/shared/errors`.
- There is no middleware. Auth is manual: actions read the `auth_token` cookie and call `verifyJwtToken`; `(dashboard)/layout.tsx` allows only `USER`, `(admin)/layout.tsx` allows `admin`/`super_admin`. Public routes are `/share/[token]`, `/collect/[token]`, and `/preview/eform`.
- Next 16 specifics in this repo: route `params`/`searchParams` and `cookies()` are async — `await` them.
- Path alias: `@/*` → `src/*`. User-facing text and comments are Vietnamese; keep new UI strings Vietnamese.
- `README.md` / `README_VN.md` document the product and `FormSchemaJson`; use them for domain context, not for commands.

## Form builder, units, and PDF
- Builder state lives in `src/features/form-builder/store/useFormBuilderStore.ts` (Zustand, undo/redo). Field types are in `types/formBuilder.types.ts`, palette/defaults in `constants/fields.config.tsx`, renderers in `fields/*`.
- Canvas coordinates are CSS px. Persisted `FormSchemaJson` uses integer `InternalUnit`s: 100 units = 1 mm. Convert only through `domain/units.ts` and `domain/transformers.ts`; never persist screen px or floats.
- Schema stores media as `fileKey` only (images and `backgroundPdf`); call `hydrateImageUrls()` on read. Do not persist resolved URLs.
- PDF export routes (`/api/{forms,templates,submissions}/[id]/export-pdf`) drive a shared Puppeteer browser to the matching `/print/...` page. Print views must set `window.__DRAGFORM_RENDER_READY__` via `usePrintReadiness`; new print views should use `PrintCanvas` or exports will time out. Dev needs Chrome available (`PUPPETEER_EXECUTABLE_PATH` or the default `chrome` channel); Docker installs `google-chrome-stable`.

## CI / deploy
- PRs and pushes to `main`: install with frozen lockfile, then `pnpm typecheck`.
- Only pushes to `main` (or manual dispatch) build/push the GHCR image and deploy to EC2 via AWS SSM. A merge to `main` ships to production.