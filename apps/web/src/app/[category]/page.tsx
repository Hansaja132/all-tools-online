import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@tools-website/config';
import { generateBreadcrumbJsonLd } from '@tools-website/utils';
import { CategoryView } from './category-view';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export function generateStaticParams() {
  return siteConfig.categories.map((c) => ({
    category: c.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const category = siteConfig.categories.find((c) => c.slug === resolvedParams.category);

  if (!category) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    };
  }

  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/${category.slug}`;

  if (category.slug === 'pdf-tools') {
    const title = 'Free Online PDF Tools - Convert, Compress, Edit & Merge PDFs | MultiTools';
    const description =
      'Free online PDF tools to merge, split, compress, convert, edit, sign, and protect PDF documents directly in your browser. Fast, secure, and client-side processing.';
    const keywords = [
      'PDF tools',
      'PDF editor',
      'PDF converter',
      'PDF compressor',
      'PDF merger',
      'PDF splitter',
      'online PDF tools',
      'free PDF tools',
      'merge PDF',
      'split PDF',
      'compress PDF',
      'sign PDF',
      'protect PDF',
    ];

    return {
      title,
      description,
      keywords,
      alternates: {
        canonical: canonicalUrl,
      },
      openGraph: {
        title,
        description,
        url: canonicalUrl,
        siteName: siteConfig.name,
        locale: siteConfig.seo.openGraph.locale,
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  }

  const title = `${category.name} - Free Online Utilities | MultiTools`;
  const description = category.description;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.seo.openGraph.locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
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
