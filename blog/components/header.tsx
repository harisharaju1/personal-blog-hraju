import Link from 'next/link'
import { ThemeToggle } from '@/components/theme-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-10 border-b bg-white dark:bg-neutral-950 dark:border-neutral-800">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          hraju
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
