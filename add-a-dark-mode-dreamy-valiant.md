# Plan: Dark Mode Toggle in Navbar

## Context
The app is currently light-mode only with hardcoded `bg-white` on the header and no theme switching mechanism. Tailwind UI primitives (button, input, textarea) already carry `dark:` classes, so the component-level groundwork is partly done. The task is to wire up a class-based dark mode system driven by a navbar icon button — no text labels, just a sun/moon icon indicating what clicking will switch TO.

## Approach

### Package
Install `next-themes` — it's the only reliable way to prevent FOUC. A custom `useEffect` solution always flashes the wrong theme on first paint because effects run after hydration. `next-themes` injects a blocking inline `<script>` into `<head>` that sets the `.dark` class on `<html>` before any CSS is painted.

```
pnpm add next-themes
```

### Files to create

**`components/theme-provider.tsx`** — thin `'use client'` wrapper around `NextThemesProvider` (required because next-themes uses React context, which can't be used directly in Server Components).

**`components/theme-toggle.tsx`** — client component using `useTheme`. Uses `resolvedTheme` (not `theme`) so it correctly handles the `'system'` value. Renders a placeholder `<div>` with matching dimensions until mounted to avoid hydration mismatch on the icon. Shows moon icon in light mode (click → dark), sun icon in dark mode (click → light). Inline SVGs only — no icon library.

### Files to modify

**`app/globals.css`** — add `@custom-variant dark` immediately after the import to switch Tailwind v4 from `prefers-color-scheme` to class-based dark mode:
```css
@import "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));
```

**`app/layout.tsx`** — three changes:
1. Import and wrap body contents with `<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>`
2. Add `suppressHydrationWarning` to `<html>` (next-themes mutates the `class` attribute client-side; this suppresses the expected hydration mismatch on that one attribute only)
3. Add `bg-white text-neutral-900 dark:bg-neutral-950 dark:text-neutral-50` to `<body>`

**`components/header.tsx`** — two changes:
1. Import `<ThemeToggle />` and place it at the trailing end of `<nav>`
2. Fix hardcoded colors to dark-mode-aware equivalents:
   - `bg-white` → `bg-white dark:bg-neutral-950`
   - `border-b` → `border-b dark:border-neutral-800`
   - hover classes → add `dark:hover:text-neutral-200` alongside existing `hover:text-neutral-800`

## FOUC prevention — how it works
1. Server renders `<html>` with no class
2. next-themes' blocking `<script>` in `<head>` reads localStorage → falls back to `prefers-color-scheme` → immediately stamps `class="light"` or `class="dark"` on `<html>` before first paint
3. Tailwind applies `dark:` classes only when `.dark` is on `<html>`, so colours are correct on first paint
4. React hydrates; `suppressHydrationWarning` silences the class-attribute mismatch on `<html>` only
5. ThemeToggle renders a placeholder (server + initial client) → swaps to real icon after `useEffect` — no mismatch

## Critical files
- `app/globals.css`
- `app/layout.tsx`
- `components/header.tsx`
- `components/theme-provider.tsx` ← new
- `components/theme-toggle.tsx` ← new

## Verification
1. `pnpm typecheck` — zero errors
2. Dev server: manually add `class="dark"` to `<html>` in DevTools → page goes dark
3. Click the toggle → icon switches moon↔sun, `<html>` class flips, colours update
4. Hard-reload in dark mode → page opens dark with no white flash
5. Incognito window → page matches OS dark/light setting (system default)
6. Browser console → no React hydration warnings
