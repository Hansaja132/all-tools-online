import { MetadataRoute } from 'next';
import { siteConfig } from '@tools-website/config';
import { toolSeo } from '../lib/seo/tool-seo';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url.replace(/\/$/, '');
  // Root / Home page
  const homeRoute: MetadataRoute.Sitemap[0] = {
    url: `${baseUrl}/`,
    changeFrequency: 'daily',
    priority: 1.0,
  };

  // Category pages
  // Keep single-tool taxonomy pages available for navigation without presenting
  // them to search engines as standalone destination pages.
  const categoryRoutes: MetadataRoute.Sitemap = siteConfig.categories
    .filter(
      (category) =>
        siteConfig.tools.filter((tool) => tool.category === category.slug).length > 1
    )
    .map((category) => ({
      url: `${baseUrl}/${category.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  const trustRoutes: MetadataRoute.Sitemap = [
    'about',
    'contact',
    'editorial-policy',
    'privacy',
    'terms',
  ].map((path) => ({
    url: `${baseUrl}/${path}`,
    changeFrequency: 'yearly',
    priority: 0.3,
  }));

  // All indexable tool pages
  const toolRoutes: MetadataRoute.Sitemap = Object.values(toolSeo).map((tool) => ({
    url: `${baseUrl}/${tool.category}/${tool.slug}`,
    // Weekly for general utility tools, daily for frequently updated crypto mini-games
    changeFrequency: tool.slug === 'binance-wodl' ? 'daily' : 'weekly',
    priority: 0.9,
  }));

  return [homeRoute, ...categoryRoutes, ...toolRoutes, ...trustRoutes];
}
