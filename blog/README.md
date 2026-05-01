# personal-blog-hraju

A personal read-only blog. Posts are written on the collaborative app and displayed here via a shared Supabase database.

Built with Next.js 15 App Router, Supabase (Postgres + RLS), Tailwind v4, and shadcn/ui.

## Local development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Configure environment

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Publishable (anon) key |
| `BLOG_AUTHOR_USER_ID` | Your Supabase user UUID (Authentication → Users) |

### 3. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Next.js dev server |
| `pnpm build` | Production build |
| `pnpm typecheck` | TypeScript check |
| `pnpm test` | Unit tests (Vitest) |

## Deploy

Create a new Vercel project, set root directory to `blog/`, and add the env vars above.
