import * as React from 'react';
import { notFound } from 'next/navigation';
import { siteConfig } from '@tools-website/config';
import { generateBreadcrumbJsonLd } from '@tools-website/utils';
import { CategoryView } from './category-view';

export function generateStaticParams() {
  return siteConfig.categories.map((c) => ({
    category: c.slug,
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const resolvedParams = await params;
  const category = siteConfig.categories.find((c) => c.slug === resolvedParams.category);

  if (!category) {
    notFound();
  }

  // Filter tools strictly inside this category
  const categoryTools = (siteConfig as any).tools.filter(
    (tool: any) => tool.category === category.slug
  );

  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: 'Home', item: siteConfig.url },
    { name: category.name, item: `${siteConfig.url}/${category.slug}` },
  ]);

  return (
    <CategoryView
      category={category}
      categoryTools={categoryTools}
      breadcrumbJsonLd={breadcrumbJsonLd}
    />
  );
}
