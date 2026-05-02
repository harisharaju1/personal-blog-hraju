import 'server-only'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) redirect('/admin/login?error=1')
  redirect('/admin/new')
}

export async function logoutAction() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/admin/login')
}

export async function createPostAction(formData: FormData) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.BLOG_AUTHOR_USER_ID) redirect('/admin/login')

  const title = (formData.get('title') as string).trim()
  const body = (formData.get('body') as string).trim()

  const { data } = await supabase
    .from('posts')
    .insert({ author_id: user.id, title, body })
    .select('id')
    .single()

  if (data) redirect(`/posts/${data.id}`)
}
