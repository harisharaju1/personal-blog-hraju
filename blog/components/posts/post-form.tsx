'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { createPostAction, updatePostAction } from '@/lib/actions/admin'
import { postInput, type PostInput } from '@/lib/validation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RichBodyEditor } from '@/components/posts/rich-body-editor'

interface PostFormProps {
  initialPost?: { id: number; title: string; body: string; visibility: string }
}

export function PostForm({ initialPost }: PostFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!initialPost

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PostInput>({
    resolver: zodResolver(postInput),
    defaultValues: {
      title: initialPost?.title ?? '',
      body: initialPost?.body ?? '',
      visibility: (initialPost?.visibility as 'public' | 'draft') ?? 'public',
    },
  })

  const body = watch('body')

  function onSubmit(data: PostInput) {
    const fd = new FormData()
    fd.set('title', data.title)
    fd.set('body', data.body)
    fd.set('visibility', data.visibility)

    startTransition(async () => {
      const result = isEditing
        ? await updatePostAction(initialPost.id, fd)
        : await createPostAction(fd)

      if (!result.ok) {
        result.errors.forEach(({ field, message }) => {
          if (field === 'title' || field === 'body') {
            setError(field, { message })
          } else {
            setError('root', { message })
          }
        })
        return
      }
      router.push(`/posts/${result.data.id}`)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="title">Title</Label>
        <Input id="title" type="text" {...register('title')} />
        {errors.title && <p className="text-sm text-red-500">{errors.title.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="body">Body (optional)</Label>
        <RichBodyEditor
          id="body"
          value={body}
          onChange={(v) => setValue('body', v, { shouldValidate: true })}
        />
        {errors.body && <p className="text-sm text-red-500">{errors.body.message}</p>}
      </div>

      <div className="space-y-1">
        <Label htmlFor="visibility">Visibility</Label>
        <select
          id="visibility"
          {...register('visibility')}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="public">Public</option>
          <option value="draft">Draft (only you)</option>
        </select>
      </div>

      {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending
          ? isEditing ? 'Saving…' : 'Posting…'
          : isEditing ? 'Save changes' : 'Publish'}
      </Button>
    </form>
  )
}
