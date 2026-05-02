import type { MetadataRoute } from 'next'
import { listPosts } from '@/lib/queries/posts'
import { SITE_URL } from '@/lib/config'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await listPosts('new')

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.id}`,
    lastModified: new Date(post.created_at),
    changeFrequency: 'monthly',
    priority: 0.8,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: `${SITE_URL}/about`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.5 },
    ...postEntries,
  ]
}
