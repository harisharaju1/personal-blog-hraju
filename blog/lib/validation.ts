import { z } from 'zod'

export const postInput = z.object({
  title: z.string().min(1, 'Title is required').max(300, 'Must be at most 300 characters'),
  body: z.string(),
  visibility: z.enum(['public', 'draft']).default('public'),
})

export type PostInput = z.infer<typeof postInput>
