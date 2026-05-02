import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About',
  description: 'Senior Software Engineer. I write about engineering decisions, systems, and lessons learned.',
}

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">About</h1>
      <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
        <p>
          I&apos;m Harish Raju, a Senior Software Engineer. This is where I write about engineering
          decisions, systems I&apos;ve built, and lessons learned the hard way.
        </p>
        <p>
          I&apos;m interested in distributed systems, developer tooling, embedded hardware
          (Raspberry Pi, home automation), and the craft of writing good software. I try to write
          about the <em>why</em> behind decisions — trade-offs, constraints, mistakes — not just
          the <em>what</em>.
        </p>
        <p>
          This is not a tutorial blog. It&apos;s a running log of things I actually ran into.
        </p>
        <div className="pt-2 flex gap-4 text-sm">
          <a
            href="https://github.com/harisharaju1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/harish-raju"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </main>
  )
}
