import { describe, expect, it } from 'vitest'
import { readingTime, excerpt } from '@/lib/text'

describe('readingTime', () => {
  it('returns 1 min for very short text', () => {
    expect(readingTime('hello world')).toBe('1 min read')
  })

  it('minimum is always 1 min', () => {
    expect(readingTime('')).toBe('1 min read')
  })

  it('calculates correctly at 200 wpm', () => {
    // 400 words → 2 min
    expect(readingTime('word '.repeat(400).trim())).toBe('2 min read')
  })

  it('rounds to nearest minute', () => {
    // 300 words → 1.5 min → rounds to 2
    expect(readingTime('word '.repeat(300).trim())).toBe('2 min read')
    // 100 words → 0.5 min → rounds to 1 (also floored by Math.max)
    expect(readingTime('word '.repeat(100).trim())).toBe('1 min read')
  })
})

describe('excerpt', () => {
  it('returns plain text unchanged if short enough', () => {
    expect(excerpt('short post')).toBe('short post')
  })

  it('truncates to maxLength and appends ellipsis', () => {
    const long = 'a'.repeat(200)
    const result = excerpt(long, 50)
    expect(result.endsWith('…')).toBe(true)
    expect(result.length).toBeLessThanOrEqual(51)
  })

  it('strips bold and italic markers', () => {
    expect(excerpt('**bold** and _italic_')).toBe('bold and italic')
  })

  it('converts links to their text', () => {
    expect(excerpt('[click here](https://example.com)')).toBe('click here')
  })

  it('removes images entirely', () => {
    const result = excerpt('Before. ![alt](img.png) After.')
    expect(result).not.toContain('![')
    expect(result).not.toContain('img.png')
    expect(result).toContain('Before.')
    expect(result).toContain('After.')
  })

  it('strips heading markers', () => {
    expect(excerpt('## My heading')).toBe('My heading')
  })

  it('removes fenced code blocks', () => {
    const md = 'Intro.\n```js\nconst x = 1\n```\nEnd.'
    const result = excerpt(md)
    expect(result).not.toContain('const x')
    expect(result).toContain('Intro')
    expect(result).toContain('End')
  })

  it('removes inline code', () => {
    const result = excerpt('Use `npm install` to install.')
    expect(result).not.toContain('`')
    expect(result).not.toContain('npm install')
    expect(result).toContain('Use')
    expect(result).toContain('to install.')
  })

  it('normalises multiple spaces', () => {
    expect(excerpt('one   two')).toBe('one two')
  })
})
