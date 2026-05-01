import { notFound } from 'next/navigation'
import { PostBody } from '@/components/posts/post-body'
import { getPostById } from '@/lib/queries/posts'

export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const postId = parseInt(id, 10)
  if (isNaN(postId)) notFound()

  const post = await getPostById(postId)
  if (!post) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <article className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            by {post.author_username} &middot;{' '}
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>

        {post.body && <PostBody body={post.body} />}
      </article>
    </main>
  )
}
