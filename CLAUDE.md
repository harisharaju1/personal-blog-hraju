# CLAUDE.md

This file provides guidance to Claude Code when working with code in this repository.

## What this is

**hraju.dev** — a personal blog by Harish Raju. Visitors read posts; only the author can publish. It shares a Supabase database with a separate collaborative blog, filtering posts by `BLOG_AUTHOR_USER_ID` so only the author's posts appear here.

## Repository layout

```
sceniusblog/
└── blog/          ← the only active project (Next.js 15 App Router)
```

All commands run from inside `blog/`.

## Tech stack

- Next.js 15 (App Router) + React 19
- Tailwind CSS v4 + `@tailwindcss/typography` (prose styles for post bodies)
- shadcn/ui components (`components/ui/`)
- Supabase (Postgres + Auth + Storage via `@supabase/ssr`)
- `unified` + `rehype-pretty-code` (Shiki) for server-side markdown → HTML with syntax highlighting
- `react-hook-form` + Zod for the admin post form
- `next-themes` for dark mode
- pnpm, Vitest (unit + integration), Playwright (e2e)
- Deployed on Vercel — root directory: `blog/`

## Commands (`cd blog`)

- `pnpm dev` — dev server on `http://localhost:3000`
- `pnpm build` / `pnpm start` — production build and serve
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Vitest unit tests (`tests/unit/`)
- `pnpm test:integration` — Vitest integration tests against Supabase
- `pnpm test:e2e` — Playwright (`e2e/`) — requires `pnpm exec playwright install chromium` on first run
- `pnpm test:all` — all three layers
- `pnpm db:gen` — regenerate `lib/supabase/types.ts` from linked Supabase project
- `pnpm db:push` — apply local migrations to linked Supabase project

## Routes

| Route | Visibility | Description |
|---|---|---|
| `/` | Public | Post list with excerpt + read time |
| `/posts/[id]` | Public | Post — syntax-highlighted body, read time, share buttons, JSON-LD |
| `/about` | Public | Author bio |
| `/feed.xml` | Public | RSS 2.0 feed |
| `/sitemap.xml` | Public | XML sitemap (Next.js built-in) |
| `/robots.txt` | Public | Crawl rules — allows all, blocks `/admin/` |
| `/llms.txt` | Public | LLM index (llmstxt.org spec) |
| `/llms-full.txt` | Public | Full post content for RAG indexing |
| `/admin/login` | Admin | Email/password login via Supabase Auth |
| `/admin/new` | Admin | Rich post editor — title + markdown body with drag-and-drop image upload |

The middleware (`middleware.ts`) runs `updateSession` only on `/admin/:path*`.

## Code layout

```
blog/
├── app/
│   ├── page.tsx                     — home, lists posts
│   ├── about/page.tsx               — author bio
│   ├── posts/[id]/page.tsx          — post view (OG meta + JSON-LD)
│   ├── admin/login/page.tsx         — login form
│   ├── admin/new/page.tsx           — new post page (auth-gated, uses PostForm)
│   ├── feed.xml/route.ts            — RSS feed
│   ├── llms.txt/route.ts            — LLM index
│   ├── llms-full.txt/route.ts       — full content for RAG
│   ├── icon.tsx                     — favicon (ImageResponse)
│   ├── robots.ts                    — robots.txt
│   └── sitemap.ts                   — sitemap.xml
├── components/
│   ├── header.tsx                   — site header (logo, About, RSS, theme toggle)
│   ├── posts/post-card.tsx          — post list item (title, excerpt, read time)
│   ├── posts/post-body.tsx          — async server component; renders markdown HTML
│   ├── posts/post-form.tsx          — client form (react-hook-form + Zod)
│   ├── posts/rich-body-editor.tsx   — markdown textarea + drag-drop image upload
│   ├── posts/code-copy-buttons.tsx  — client component; injects copy buttons into code blocks
│   ├── theme-toggle.tsx
│   └── ui/                          — shadcn/ui primitives (button, input, textarea, label)
├── lib/
│   ├── queries/posts.ts             — DB read helpers (server-only)
│   ├── actions/admin.ts             — Server Actions: login, logout, createPost ('use server')
│   ├── actions/result.ts            — ActionResult<T> discriminated union + ok/fail helpers
│   ├── config.ts                    — SITE_URL, SITE_TITLE, SITE_AUTHOR, SITE_DESCRIPTION
│   ├── images.ts                    — extractStoragePaths (pure; used for image lifecycle)
│   ├── markdown.ts                  — markdownToHtml (async, server-only, unified pipeline)
│   ├── sorting.ts                   — SortKey type + buildPostsQuery helper
│   ├── text.ts                      — readingTime, excerpt (pure, unit-tested)
│   ├── validation.ts                — postInput Zod schema + PostInput type
│   ├── supabase/server.ts           — Supabase server client (cookies-based)
│   ├── supabase/client.ts           — Supabase browser client (for image uploads)
│   ├── supabase/middleware.ts       — session refresh helper
│   ├── supabase/types.ts            — generated DB types (pnpm db:gen)
│   └── utils.ts                     — cn() helper
├── tests/unit/                      — Vitest unit tests (text, markdown, sorting, result)
├── e2e/navigation.spec.ts           — Playwright e2e tests
└── middleware.ts                    — applies updateSession to /admin/* only
```

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
BLOG_AUTHOR_USER_ID=           # Supabase user UUID; filters post list + guards write path
NEXT_PUBLIC_SITE_URL=          # e.g. https://hraju.dev (no trailing slash)
```

`BLOG_AUTHOR_USER_ID` does two things: every `listPosts` query filters `.eq('author_id', BLOG_AUTHOR_USER_ID)`, and `createPostAction` rejects requests from any other authenticated user.

## Conventions

- Server Actions live in `lib/actions/<entity>.ts` and use the `'use server'` directive (not `import 'server-only'` — these are different).
- DB read helpers live in `lib/queries/<entity>.ts` and use `import 'server-only'`.
- Pure logic (no Supabase imports) lives in `lib/<topic>.ts` and is the unit-test layer.
- Every Server Action returns `ActionResult<T>` from `lib/actions/result.ts`. `loginAction` and `logoutAction` are exceptions — they `redirect()` directly.
- TypeScript strict mode on. No `any`, no non-null assertions unless forced by framework patterns.

## Write path

Posts are written through `/admin/new`:

1. The page server-checks auth (`user.id === BLOG_AUTHOR_USER_ID`) and redirects to `/admin/login` if not the author.
2. `PostForm` (client component) uses react-hook-form + Zod (`postInput` schema) with a title input and `RichBodyEditor` for the body.
3. `RichBodyEditor` is a controlled markdown textarea with: a `</>` code block insert button, drag-and-drop image upload to the `post-images` Supabase Storage bucket (inserts `![image](url)` at cursor), and upload/drag visual overlays.
4. On submit, `createPostAction` validates with Zod, re-checks auth, inserts the post, records embedded image paths in `post_images` for lifecycle management, and returns `ok({ id })`.
5. The client navigates to `/posts/{id}` on success.

## Syntax highlighting

`lib/markdown.ts` runs a `unified` pipeline server-side:
`remark-parse → remark-gfm → remark-rehype → rehype-pretty-code → rehype-stringify`

Dual theme: `github-light` / `github-dark-dimmed`. Switching is CSS-only via `--shiki-light` and `--shiki-dark` variables — no hydration flash. Rules are in `app/globals.css`.

## Testing

- **Unit** (`pnpm test`): 32 tests across `text.ts`, `markdown.ts`, `sorting.ts`, `actions/result.ts`
- **E2E** (`pnpm test:e2e`): 19 Playwright tests — site structure, feeds/crawlability, 404 handling
- The markdown test file uses `// @vitest-environment node` (Shiki loads WASM, no DOM needed)
- `tests/setup.ts` mocks `server-only` so server-only imports don't throw in tests
