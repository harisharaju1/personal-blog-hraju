import Link from 'next/link'
import type { PostWithAuthor } from '@/lib/queries/posts'

export function PostCard({ post }: { post: PostWithAuthor }) {
  return (
    <article className="rounded-md border p-4">
      <Link href={`/posts/${post.id}`} className="font-medium hover:underline">
        {post.title}
      </Link>
      <p className="mt-1 text-xs text-neutral-500">
        {new Date(post.created_at).toLocaleDateString()}
      </p>
    </article>
  )
}
