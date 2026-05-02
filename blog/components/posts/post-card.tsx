import Link from 'next/link'
import type { PostWithAuthor } from '@/lib/queries/posts'
import { excerpt, readingTime } from '@/lib/text'

export function PostCard({ post }: { post: PostWithAuthor }) {
  const postExcerpt = excerpt(post.body)
  const readTime = readingTime(post.body)

  return (
    <article className="rounded-md border p-4 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors">
      <Link href={`/posts/${post.id}`} className="font-medium hover:underline">
        {post.title}
      </Link>
      {postExcerpt && (
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
          {postExcerpt}
        </p>
      )}
      <p className="mt-2 text-xs text-neutral-500">
        {new Date(post.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        })}
        {' · '}
        {readTime}
      </p>
    </article>
  )
}
