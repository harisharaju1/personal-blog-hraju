import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getPostById } from '@/lib/queries/posts'
import { logoutAction } from '@/lib/actions/admin'
import { PostForm } from '@/components/posts/post-form'

type PageProps = { params: Promise<{ id: string }> }

export default async function AdminEditPostPage({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id, 10)
  if (isNaN(postId)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.id !== process.env.BLOG_AUTHOR_USER_ID) redirect('/admin/login')

  const post = await getPostById(postId)
  if (!post) notFound()

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">Edit post</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            logout
          </button>
        </form>
      </div>
      <PostForm initialPost={{ id: post.id, title: post.title, body: post.body, visibility: post.visibility }} />
    </main>
  )
}
