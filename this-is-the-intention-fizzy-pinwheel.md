# Personal Blog: Separate Repo Plan

## Context

The current `scenius` repo is a collaborative blog — users can register, post, vote, and comment. The goal is to spin up a second, independent site using the same Supabase database: a personal read-only blog where only you post and visitors can only read. Because the two apps will diverge significantly (one strips ~60% of the features), a separate git repo is cleaner than a branch.

---

## Step 1 — Create the new repo

```bash
# From the parent directory of scenius/
cp -r scenius sceniusblog
cd sceniusblog
rm -rf .git
git init
git add .
git commit -m "initial: copy from scenius"
```

Then create a new GitHub repo and push to it.

---

## Step 2 — Files to DELETE entirely

All of these are inside `scenius-app/`:

### Auth system
- `app/(auth)/` — entire directory (login, register, forgot-password, reset-password, callback, register/confirm)
- `components/auth/` — entire directory (all auth form components)
- `lib/actions/auth.ts`

### Write path
- `app/posts/new/` — create post page
- `components/posts/post-form.tsx`
- `components/posts/rich-body-editor.tsx`
- `components/posts/comment-form.tsx`
- `components/posts/delete-button.tsx`
- `lib/actions/posts.ts` — has createPostAction + deletePostAction
- `lib/actions/comments.ts`
- `lib/images.ts` — image upload handling

### Voting system
- `components/posts/vote-buttons.tsx`
- `lib/actions/votes.ts`
- `lib/voting.ts`

### Queries no longer needed
- `lib/queries/comments.ts`

---

## Step 3 — Files to MODIFY

### `middleware.ts`
Remove the session-refresh logic entirely or replace with a no-op export. Visitors don't have sessions.

```ts
// simplest replacement
export { } // no middleware needed
```

Or just delete the file if Next.js doesn't require it.

### `components/layout/header.tsx` (or wherever the nav lives)
- Remove: Login / Register / Logout links
- Remove: username display
- Keep: site title, theme toggle

### `app/posts/[id]/page.tsx`
- Remove: vote buttons section
- Remove: comment form section
- Remove: delete button
- Keep: post body render, post metadata (title, date, author)

### `app/page.tsx` (home/feed)
- Remove: "New Post" button
- Keep: post list with sorting (hot/top/new)

### `components/posts/post-card.tsx`
- Remove: vote score display (optional — you may want to keep the number)
- Keep: title, excerpt, date, author

### `lib/actions/posts.ts`
Delete entirely (see above) — reading posts is handled by `lib/queries/posts.ts` which stays untouched.

### `lib/queries/posts.ts` — add author filter
The personal blog shares the same `posts` table as the collaborative blog. To show only your posts, add a `.eq()` filter to every query that fetches the post list:

```ts
.from('posts')
.select(...)
.eq('author_username', 'harish')  // replace with your actual username
```

This single filter is the only net-new code on the personal blog. Individual post pages (`/posts/[id]`) do not need the filter — a direct ID lookup is already scoped.

### `lib/validation.ts`
Safe to delete entirely or trim to only what's still used (likely nothing after the above deletions).

---

## Step 4 — Environment variables in Vercel

In the new Vercel project, set the **same** Supabase env vars as the collaborative blog:

```
NEXT_PUBLIC_SUPABASE_URL=<same value>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<same value>
```

**Do NOT copy `SUPABASE_SERVICE_ROLE_KEY`** — the personal blog has no write path, so it never needs elevated access. Omitting it enforces read-only at the application layer.

---

## Step 5 — Supabase RLS check

Verify that `posts` table has a public read policy. If not, add one in the Supabase dashboard:

```sql
-- Allow anyone to read posts
CREATE POLICY "public read posts"
ON posts FOR SELECT
USING (true);
```

The collaborative blog's existing RLS policies (insert/update/delete require auth) will remain and continue protecting write operations — the personal blog simply never calls those paths.

---

## Step 6 — Vercel setup

1. Go to vercel.com → New Project
2. Import the new GitHub repo (`sceniusblog`)
3. Framework: Next.js (auto-detected)
4. Root directory: `scenius-app`
5. Add env vars from Step 4
6. Deploy

---

## Step 7 — Post management (how you'll post)

Write posts on the **collaborative blog** using its existing full editor (rich text, images, everything). The personal blog picks them up automatically since both apps read from the same `posts` table — no extra write UI needed on the personal blog side.

---

## Verification checklist

- [ ] `pnpm typecheck` passes with no errors in `scenius-app/`
- [ ] `pnpm build` succeeds
- [ ] Home page shows only your posts (author filter working), sorted by hot/top/new
- [ ] Individual post page shows body correctly, no vote/comment UI
- [ ] No login/register links in header
- [ ] Navigating to `/login` or `/posts/new` returns 404
- [ ] Supabase anon key can read posts (test in browser network tab)
- [ ] No write calls succeed from the browser (no service role key present)
