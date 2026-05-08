'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { fail, ok, type ActionResult } from '@/lib/actions/result'
import { postInput } from '@/lib/validation'
import { extractStoragePaths } from '@/lib/images'

const BUCKET = 'post-images'
const bucketBase = () =>
  `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${BUCKET}`

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

export async function updatePostAction(postId: number, formData: FormData): Promise<ActionResult<{ id: number }>> {
  const parsed = postInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return fail(
      parsed.error.issues.map((i) => ({ field: String(i.path[0] ?? 'root'), message: i.message })),
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.BLOG_AUTHOR_USER_ID) {
    return fail([{ field: 'root', message: 'Unauthorized' }])
  }

  const { error } = await supabase
    .from('posts')
    .update({ title: parsed.data.title, body: parsed.data.body, visibility: parsed.data.visibility })
    .eq('id', postId)
    .eq('author_id', user.id)

  if (error) {
    return fail([{ field: 'root', message: 'Failed to update post' }])
  }

  // Record any newly embedded image paths (best-effort; orphaned paths are not removed here).
  const imagePaths = extractStoragePaths(parsed.data.body, bucketBase())
  if (imagePaths.length > 0) {
    await supabase
      .from('post_images')
      .upsert(imagePaths.map((storage_path) => ({ post_id: postId, storage_path })), {
        onConflict: 'post_id,storage_path',
        ignoreDuplicates: true,
      })
  }

  return ok({ id: postId })
}

export async function createPostAction(formData: FormData): Promise<ActionResult<{ id: number }>> {
  const parsed = postInput.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return fail(
      parsed.error.issues.map((i) => ({ field: String(i.path[0] ?? 'root'), message: i.message })),
    )
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.id !== process.env.BLOG_AUTHOR_USER_ID) {
    return fail([{ field: 'root', message: 'Unauthorized' }])
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ author_id: user.id, title: parsed.data.title, body: parsed.data.body, visibility: parsed.data.visibility })
    .select('id')
    .single()

  if (error || !data) {
    return fail([{ field: 'root', message: 'Failed to create post' }])
  }

  // Record embedded image paths for lifecycle management (cleanup if post is ever deleted).
  const imagePaths = extractStoragePaths(parsed.data.body, bucketBase())
  if (imagePaths.length > 0) {
    await supabase
      .from('post_images')
      .insert(imagePaths.map((storage_path) => ({ post_id: data.id, storage_path })))
  }

  return ok({ id: data.id })
}
