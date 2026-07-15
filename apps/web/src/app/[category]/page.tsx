'use client';

import * as React from 'react';
import { notFound } from 'next/navigation';
import { siteConfig } from '@tools-website/config';
import { Card, Button, Breadcrumb } from '@tools-website/ui';
import { Code2, Image, FileText, Palette, ArrowRight, Heart } from 'lucide-react';
import { useFavoritesStore } from '../../lib/store/favorites-store';
import { generateBreadcrumbJsonLd } from '@tools-website/utils';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const category = siteConfig.categories.find((c) => c.slug === params.category);
  const { isFavorite, toggleFavorite } = useFavoritesStore();

  if (!category) {
    notFound();
  }

  // Filter tools strictly inside this category
  const categoryTools = (siteConfig as any).tools.filter(
    (tool: any) => tool.category === category.slug
  );

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'developer-tools':
        return <Code2 className="h-6 w-6 text-violet-500" />;
      case 'image-tools':
        return <Image className="h-6 w-6 text-emerald-500" />;
      case 'text-tools':
        return <FileText className="h-6 w-6 text-blue-500" />;
      case 'color-tools':
        return <Palette className="h-6 w-6 text-pink-500" />;
      default:
        return <Code2 className="h-6 w-6 text-zinc-500" />;
    }
  };

  const breadcrumbs = [
    { label: category.name, href: `/${category.slug}` },
  ];

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', item: siteConfig.url },
    { name: category.name, item: `${siteConfig.url}/${category.slug}` },
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* JSON-LD Schema Injector */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Breadcrumb items={breadcrumbs} className="mb-6" />

      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
          {category.name}
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {category.description}
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryTools.map((tool: any) => {
          const fav = isFavorite(tool.slug);
          return (
            <Card key={tool.slug} hoverable className="flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-800">
                    {getCategoryIcon(category.slug)}
                  </div>
                  <button
                    onClick={() => toggleFavorite(tool.slug)}
                    className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Heart className={`h-5 w-5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>

                <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                  {tool.name}
                </h3>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                  {tool.description}
                </p>
              </div>

              <div className="mt-6">
                <a href={`/${category.slug}/${tool.slug}`} className="w-full inline-block">
                  <Button variant="outline" className="w-full justify-between group-hover:bg-violet-50 dark:group-hover:bg-zinc-800 transition-colors text-sm">
                    <span>Open Tool</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
