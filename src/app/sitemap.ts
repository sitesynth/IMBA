import type { MetadataRoute } from 'next'
import { posts } from '@/lib/posts'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1.0 },
    { url: SITE_URL + '/esim', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: SITE_URL + '/virtual-card', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: SITE_URL + '/blog', lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    ...blogPosts,
    { url: SITE_URL + '/terms', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: SITE_URL + '/privacy-policy', lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ]
}
