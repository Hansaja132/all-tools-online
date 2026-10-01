import * as React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { siteConfig } from '@tools-website/config';
import { toolsRegistry } from '../../../features/registry';
import {
  generateBreadcrumbJsonLd,
  generateHowToJsonLd,
  generateWebApplicationJsonLd,
} from '@tools-website/utils';
import { getToolSeo, getRelatedTools, toolSeo } from '../../../lib/seo/tool-seo';
import { ToolView } from './tool-view';

interface PageProps {
  params: Promise<{ category: string; tool: string }>;
}

export function generateStaticParams() {
  return (siteConfig as any).tools.map((tool: any) => ({
    category: tool.category,
    tool: tool.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const toolData = getToolSeo(resolvedParams.category, resolvedParams.tool);

  if (!toolData) {
    return {
      title: 'Tool Not Found',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/${toolData.category}/${toolData.slug}`;
  const ogImageUrl = `${baseUrl}/api/og?title=${encodeURIComponent(
    toolData.name
  )}&category=${encodeURIComponent(toolData.categoryName)}&description=${encodeURIComponent(
    toolData.metaDescription
  )}`;

  return {
    title: toolData.seoTitle,
    description: toolData.metaDescription,
    keywords: [...toolData.primaryKeywords, ...toolData.secondaryKeywords],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: toolData.seoTitle,
      description: toolData.metaDescription,
      url: canonicalUrl,
      siteName: siteConfig.name,
      locale: siteConfig.seo.openGraph.locale,
      type: 'website',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${toolData.name} - ${siteConfig.name}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: toolData.seoTitle,
      description: toolData.metaDescription,
      images: [ogImageUrl],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const resolvedParams = await params;
  const category = siteConfig.categories.find((c) => c.slug === resolvedParams.category);
  const toolMeta = (siteConfig as any).tools.find(
    (t: any) => t.slug === resolvedParams.tool && t.category === resolvedParams.category
  );

  if (!category || !toolMeta) {
    notFound();
  }

  const toolRegistryItem = toolsRegistry[toolMeta.slug];
  if (!toolRegistryItem) {
    notFound();
  }

  const { component: ToolComponent } = toolRegistryItem;
  const seoData = getToolSeo(category.slug, toolMeta.slug) || toolSeo[toolMeta.slug];

  if (!seoData) {
    notFound();
  }

  // Related tools based on the contextual internal linking mapping
  const relatedTools = getRelatedTools(toolMeta.slug);

  const baseUrl = siteConfig.url.replace(/\/$/, '');
  const canonicalUrl = `${baseUrl}/${category.slug}/${toolMeta.slug}`;

  // Structured Data (JSON-LD)
  const breadcrumbJson = generateBreadcrumbJsonLd([
    { name: 'Home', item: `${baseUrl}/` },
    { name: category.name, item: `${baseUrl}/${category.slug}` },
    { name: toolMeta.name, item: canonicalUrl },
  ]);

  const webAppJson = generateWebApplicationJsonLd({
    name: seoData.name,
    description: seoData.metaDescription,
    url: canonicalUrl,
    applicationCategory: seoData.applicationCategory,
  });

  const howToJson = generateHowToJsonLd(
    seoData.howTo.heading,
    seoData.metaDescription,
    seoData.howTo.steps,
    canonicalUrl
  );

  return (
    <ToolView
      category={category}
      toolMeta={toolMeta}
      seoData={seoData}
      relatedTools={relatedTools}
      breadcrumbJson={breadcrumbJson}
      webAppJson={webAppJson}
      howToJson={howToJson}
    >
      <ToolComponent />
    </ToolView>
  );
}
