import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PostBody } from '@/components/posts/post-body'
import { getPostById } from '@/lib/queries/posts'
import { readingTime, excerpt } from '@/lib/text'
import { SITE_URL, SITE_TITLE, SITE_AUTHOR } from '@/lib/config'

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const post = await getPostById(parseInt(id, 10))
  if (!post) return {}

  const description = excerpt(post.body, 160)
  const url = `${SITE_URL}/posts/${post.id}`

  return {
    title: post.title,
    description,
    openGraph: {
      title: post.title,
      description,
      type: 'article',
      publishedTime: post.created_at,
      url,
      siteName: SITE_TITLE,
    },
    twitter: {
      card: 'summary',
      title: post.title,
      description,
    },
    alternates: { canonical: url },
  }
}

export default async function PostPage({ params }: PageProps) {
  const { id } = await params
  const postId = parseInt(id, 10)
  if (isNaN(postId)) notFound()

  const post = await getPostById(postId)
  if (!post) notFound()

  const postUrl = `${SITE_URL}/posts/${post.id}`
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`
  const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: excerpt(post.body, 160),
    author: { '@type': 'Person', name: SITE_AUTHOR, url: `${SITE_URL}/about` },
    datePublished: post.created_at,
    url: postUrl,
    publisher: { '@type': 'Person', name: SITE_AUTHOR, url: SITE_URL },
  }

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    <main className="mx-auto max-w-3xl px-4 py-6">
      <article className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">{post.title}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            {' · '}
            {readingTime(post.body)}
          </p>
        </div>

        {post.body && <PostBody body={post.body} />}

        <div className="flex items-center gap-3 border-t pt-6 text-sm text-neutral-500">
          <span>Share:</span>
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            X / Twitter
          </a>
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </article>
    </main>
    </>
  )
}
