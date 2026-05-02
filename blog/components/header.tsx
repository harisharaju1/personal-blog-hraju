import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white dark:bg-neutral-800 dark:border-neutral-700">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          hraju.dev
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link
            href="/about"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
          >
            About
          </Link>
          <a
            href="/feed.xml"
            className="text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors"
            aria-label="RSS feed"
          >
            RSS
          </a>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
