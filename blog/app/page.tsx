import { PostCard } from '@/components/posts/post-card'
import { listPosts } from '@/lib/queries/posts'

export default async function HomePage() {
  const posts = await listPosts('new')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
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
