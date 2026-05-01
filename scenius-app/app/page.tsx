import Link from 'next/link'
import { PostCard } from '@/components/posts/post-card'
import { listPosts } from '@/lib/queries/posts'
import { isValidSortKey, VALID_SORT_KEYS } from '@/lib/sorting'

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string }>
}) {
  const { sort: rawSort } = await searchParams
  const sort = isValidSortKey(rawSort) ? rawSort : 'hot'

  const posts = await listPosts(sort)

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4">
        <nav className="flex text-sm">
          {VALID_SORT_KEYS.map((s) => (
            <Link
              key={s}
              href={`/?sort=${s}`}
              className={`flex min-h-[44px] items-center px-3 first:pl-0 ${
                s === sort ? 'font-semibold' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {s}
            </Link>
          ))}
        </nav>
      </div>

      <div className="space-y-2">
        {posts.length === 0 ? (
          <p className="text-neutral-500">No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    </main>
  )
}
