import type { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = posts.map((p) => ({
    url: `https://www.imba.live/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: 'https://www.imba.live', lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: 'https://www.imba.live/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...blogPosts,
    { url: 'https://www.imba.live/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: 'https://www.imba.live/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
