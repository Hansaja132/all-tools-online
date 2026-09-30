'use client';

import * as React from 'react';
import { Card, Button, Breadcrumb } from '@tools-website/ui';
import { Code2, Image, FileText, Palette, ArrowRight, Heart, Coins, GraduationCap } from 'lucide-react';
import { useFavoritesStore } from '../../lib/store/favorites-store';

interface CategoryViewProps {
  category: {
    name: string;
    slug: string;
    description: string;
  };
  categoryTools: any[];
  breadcrumbJsonLd: any;
}

export function CategoryView({ category, categoryTools, breadcrumbJsonLd }: CategoryViewProps) {
  const { isFavorite, toggleFavorite } = useFavoritesStore();

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
      case 'crypto-tools':
        return <Coins className="h-6 w-6 text-amber-500" />;
      case 'study-tools':
        return <GraduationCap className="h-6 w-6 text-teal-400" />;
      default:
        return <Code2 className="h-6 w-6 text-zinc-500" />;
    }
  };

  const breadcrumbs = [{ label: category.name, href: `/${category.slug}` }];

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
                <a
                  href={`/${category.slug}/${tool.slug}`}
                  className="flex w-full items-center justify-between rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-900 shadow-sm hover:bg-violet-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span>Open Tool</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
