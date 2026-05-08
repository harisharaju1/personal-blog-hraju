import { describe, expect, it } from 'vitest'
import { postInput } from '@/lib/validation'

describe('postInput', () => {
  const base = { title: 'Hello', body: 'World', visibility: 'public' as const }

  it('accepts a valid public post', () => {
    expect(postInput.safeParse(base).success).toBe(true)
  })

  it('accepts a draft post', () => {
    expect(postInput.safeParse({ ...base, visibility: 'draft' }).success).toBe(true)
  })

  it('rejects an unknown visibility value', () => {
    expect(postInput.safeParse({ ...base, visibility: 'private' }).success).toBe(false)
  })

  it('rejects a missing visibility field', () => {
    const { visibility: _, ...withoutVisibility } = base
    expect(postInput.safeParse(withoutVisibility).success).toBe(false)
  })

  it('rejects an empty title', () => {
    expect(postInput.safeParse({ ...base, title: '' }).success).toBe(false)
  })

  it('rejects a title over 300 characters', () => {
    expect(postInput.safeParse({ ...base, title: 'a'.repeat(301) }).success).toBe(false)
  })

  it('accepts an empty body', () => {
    expect(postInput.safeParse({ ...base, body: '' }).success).toBe(true)
  })
})
