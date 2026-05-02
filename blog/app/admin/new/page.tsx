import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/lib/actions/admin'
import { PostForm } from '@/components/posts/post-form'

export default async function AdminNewPostPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.BLOG_AUTHOR_USER_ID) redirect('/admin/login')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">New post</h1>
        <form action={logoutAction}>
          <button
            type="submit"
            className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            logout
          </button>
        </form>
      </div>
      <PostForm />
    </main>
  )
}
