import { listPosts } from '@/lib/queries/posts'
import { SITE_URL, SITE_TITLE, SITE_AUTHOR, SITE_DESCRIPTION } from '@/lib/config'

export const dynamic = 'force-dynamic'

export async function GET() {
  const posts = await listPosts('new')

  const postSections = posts
    .map((post) => {
      const url = `${SITE_URL}/posts/${post.id}`
      const date = new Date(post.created_at).toISOString().split('T')[0]
      return `### ${post.title}

URL: ${url}
Author: ${SITE_AUTHOR}
Published: ${date}

${post.body}

---`
    })
    .join('\n\n')

  const text = `# ${SITE_TITLE} — Full Content

> ${SITE_DESCRIPTION}

Author: ${SITE_AUTHOR}
Index: ${SITE_URL}/llms.txt

This file contains the complete text of all posts on ${SITE_TITLE}.
It is provided for LLM indexing and retrieval-augmented generation (RAG).

---

## Posts

${postSections || '_(no posts yet)_'}
`

  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  })
}
