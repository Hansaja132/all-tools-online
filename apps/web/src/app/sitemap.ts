import { MetadataRoute } from 'next';
import { siteConfig } from '@tools-website/config';
import { toolSeo } from '../lib/seo/tool-seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const now = new Date();

  // Root / Home page
  const homeRoute: MetadataRoute.Sitemap[0] = {
    url: `${baseUrl}/`,
    lastModified: now,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  // Category pages
  const categoryRoutes: MetadataRoute.Sitemap = siteConfig.categories.map((category) => ({
    url: `${baseUrl}/${category.slug}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  // All 16 Tool pages
  const toolRoutes: MetadataRoute.Sitemap = Object.values(toolSeo).map((tool) => ({
    url: `${baseUrl}/${tool.category}/${tool.slug}`,
    lastModified: now,
    // Weekly for general utility tools, daily for frequently updated crypto mini-games
    changeFrequency: tool.slug === 'binance-wodl' ? 'daily' : 'weekly',
    priority: 0.9,
  }));

  return [homeRoute, ...categoryRoutes, ...toolRoutes];
}
