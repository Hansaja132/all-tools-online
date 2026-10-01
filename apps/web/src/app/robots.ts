import { MetadataRoute } from 'next';
import { siteConfig } from '@tools-website/config';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = siteConfig.url.replace(/\/$/, '');

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/developer-tools/',
          '/text-tools/',
          '/study-tools/',
          '/crypto-tools/',
          '/color-tools/',
          '/image-tools/',
          '/api/og',
        ],
        disallow: ['/admin/', '/api/', '/profile/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
