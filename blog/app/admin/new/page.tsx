import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { createPostAction, logoutAction } from '@/lib/actions/admin'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

export default async function AdminNewPostPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.BLOG_AUTHOR_USER_ID) redirect('/admin/login')

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-semibold">New post</h1>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
            logout
          </button>
        </form>
      </div>

      <form action={createPostAction} className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="title" className="block text-sm">Title</label>
          <Input id="title" name="title" type="text" required placeholder="Post title" />
        </div>
        <div className="space-y-1">
          <label htmlFor="body" className="block text-sm">Body</label>
          <Textarea id="body" name="body" rows={24} placeholder="Write in markdown..." />
        </div>
        <Button type="submit">Publish</Button>
      </form>
    </main>
  )
}
