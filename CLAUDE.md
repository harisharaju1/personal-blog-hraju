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
- Tailwind CSS v4, shadcn/ui components (`components/ui/`)
- Supabase (Postgres + Auth via `@supabase/ssr`)
- `react-markdown` + `remark-gfm` for post body rendering
- `next-themes` for dark mode
- pnpm, Vitest (unit + integration), Playwright (e2e)
- Deployed on Vercel — root directory: `blog/`

## Commands (`cd blog`)

- `pnpm dev` — dev server on `http://localhost:3000`
- `pnpm build` / `pnpm start` — production build and serve
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm test` — Vitest unit tests (`tests/unit/`)
- `pnpm test:integration` — Vitest integration tests against Supabase
- `pnpm test:e2e` — Playwright (`e2e/`)
- `pnpm test:all` — all three layers
- `pnpm db:gen` — regenerate `lib/supabase/types.ts` from linked Supabase project
- `pnpm db:push` — apply local migrations to linked Supabase project

## Routes

| Route | Visibility | Description |
|---|---|---|
| `/` | Public | Post list (sorted by `new` by default) |
| `/posts/[id]` | Public | Individual post (title, date, author, markdown body) |
| `/admin/login` | Admin | Email/password login via Supabase Auth |
| `/admin/new` | Admin | Create a new post (title + markdown body) |

The middleware (`middleware.ts`) runs `updateSession` only on `/admin/:path*` to protect the write routes.

## Code layout

```
blog/
├── app/
│   ├── page.tsx                  — home, lists posts
│   ├── posts/[id]/page.tsx       — read-only post view
│   ├── admin/login/page.tsx      — login form
│   └── admin/new/page.tsx        — new post form (auth-gated)
├── components/
│   ├── header.tsx                — site header (title + theme toggle only)
│   ├── posts/post-card.tsx       — post list item
│   ├── posts/post-body.tsx       — markdown renderer
│   ├── theme-toggle.tsx
│   └── ui/                       — shadcn/ui primitives (button, input, textarea, label)
├── lib/
│   ├── queries/posts.ts          — DB read helpers (server-only)
│   ├── actions/admin.ts          — Server Actions: login, logout, createPost (server-only)
│   ├── actions/result.ts         — shared ActionResult<T> type
│   ├── sorting.ts                — SortKey type + buildPostsQuery helper
│   ├── supabase/server.ts        — Supabase server client
│   ├── supabase/middleware.ts    — session refresh helper
│   ├── supabase/types.ts         — generated DB types (pnpm db:gen)
│   └── utils.ts                  — cn() helper
└── middleware.ts                 — applies updateSession to /admin/* only
```

## Environment variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # only needed if you add admin DB operations
BLOG_AUTHOR_USER_ID=           # Supabase user UUID; filters post list to author only
```

`BLOG_AUTHOR_USER_ID` is the only env var unique to this repo. Every `listPosts` query calls `.eq('author_id', BLOG_AUTHOR_USER_ID)`. Individual post pages (`/posts/[id]`) do not filter by author.

## Conventions

- Server Actions live in `lib/actions/<entity>.ts` and start with `import 'server-only'`.
- DB read helpers live in `lib/queries/<entity>.ts` and start with `import 'server-only'`.
- Pure logic (no Supabase imports) lives in `lib/<topic>.ts` and is the unit-test layer.
- Every Server Action returns `ActionResult<T>` from `lib/actions/result.ts` or redirects.
- TypeScript strict mode on. No `any`, no non-null assertions unless forced by ORM/framework patterns.

## Write path

Posts are written through `/admin/new`. `createPostAction` in `lib/actions/admin.ts`:
1. Calls `supabase.auth.getUser()` and checks `user.id === BLOG_AUTHOR_USER_ID`.
2. Inserts into `posts` table via the Supabase client (anon key is sufficient because RLS allows the author to insert their own rows).
3. Redirects to the new post's page on success.

The admin section is deliberately minimal — no rich editor, no image upload. Write in plain markdown in the textarea.
