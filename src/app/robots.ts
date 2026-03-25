import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://filmradar.com.tr';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/profile/', '/watchlist/', '/favorites/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
