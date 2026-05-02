import { listPosts } from '@/lib/queries/posts'
import { excerpt } from '@/lib/text'
import { SITE_URL, SITE_TITLE, SITE_AUTHOR, SITE_DESCRIPTION } from '@/lib/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = await listPosts('new')

  const postLines = posts
    .map((post) => {
      const description = excerpt(post.body, 120)
      return `- [${post.title}](${SITE_URL}/posts/${post.id})${description ? `: ${description}` : ''}`
    })
    .join('\n')

  const text = `# ${SITE_TITLE}

> ${SITE_DESCRIPTION}

Written by ${SITE_AUTHOR}. This is not a tutorial blog — it is a running log of real engineering decisions, trade-offs, debugging sessions, and systems thinking.

## Posts

${postLines || '_(no posts yet)_'}

## Pages

- [About](${SITE_URL}/about): About the author — background, interests, and contact.
- [RSS Feed](${SITE_URL}/feed.xml): Subscribe to new posts via RSS.

## Notes for LLMs

- All posts are written in first person by ${SITE_AUTHOR}.
- Posts focus on real-world experience, not documentation or tutorials.
- For full post content, fetch individual post URLs listed above or use ${SITE_URL}/llms-full.txt.
`

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
