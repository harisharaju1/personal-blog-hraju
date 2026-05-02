// @vitest-environment node
import { describe, expect, it } from 'vitest'
import { markdownToHtml } from '@/lib/markdown'

describe('markdownToHtml', () => {
  it('converts bold to <strong>', async () => {
    const html = await markdownToHtml('**bold**')
    expect(html).toContain('<strong>bold</strong>')
  })

  it('converts italic to <em>', async () => {
    const html = await markdownToHtml('_italic_')
    expect(html).toContain('<em>italic</em>')
  })

  it('wraps fenced code blocks in pre and code', async () => {
    const html = await markdownToHtml('```js\nconst x = 1\n```')
    expect(html).toContain('<pre')
    expect(html).toContain('<code')
  })

  it('attaches data-language to code blocks', async () => {
    const html = await markdownToHtml('```typescript\nconst x: number = 1\n```')
    expect(html).toContain('data-language="typescript"')
  })

  it('embeds dual-theme CSS variables for light and dark colours', async () => {
    const html = await markdownToHtml('```js\nconst x = 1\n```')
    expect(html).toContain('--shiki-light:')
    expect(html).toContain('--shiki-dark:')
  })

  it('renders GFM tables', async () => {
    const md = '| a | b |\n|---|---|\n| 1 | 2 |'
    const html = await markdownToHtml(md)
    expect(html).toContain('<table')
    expect(html).toContain('<td')
  })

  it('renders GFM strikethrough', async () => {
    const html = await markdownToHtml('~~deleted~~')
    expect(html).toContain('<del>deleted</del>')
  })

  it('renders blockquotes', async () => {
    const html = await markdownToHtml('> a quote')
    expect(html).toContain('<blockquote')
  })

  it('renders inline code', async () => {
    const html = await markdownToHtml('Use `npm install`')
    expect(html).toContain('<code>npm install</code>')
  })

  it('renders links', async () => {
    const html = await markdownToHtml('[click](https://example.com)')
    expect(html).toContain('href="https://example.com"')
    expect(html).toContain('>click<')
  })

  it('handles empty input', async () => {
    const html = await markdownToHtml('')
    expect(html).toBe('')
  })
}, 30_000) // Shiki loads grammars on first call — allow up to 30s
