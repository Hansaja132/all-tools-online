import * as React from 'react';
import { notFound } from 'next/navigation';
import { siteConfig } from '@tools-website/config';
import { toolsRegistry } from '../../../features/registry';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateHowToJsonLd } from '@tools-website/utils';
import { ToolView } from './tool-view';

export function generateStaticParams() {
  return (siteConfig as any).tools.map((tool: any) => ({
    category: tool.category,
    tool: tool.slug,
  }));
}

export default async function ToolPage({ params }: { params: Promise<{ category: string; tool: string }> }) {
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

  const { component, faqs, guide } = toolRegistryItem;

  // Filter related tools (in same category)
  const relatedTools = (siteConfig as any).tools.filter(
    (t: any) => t.category === category.slug && t.slug !== toolMeta.slug
  );

  // Generate Schemas for SEO
  const breadcrumbJson = generateBreadcrumbJsonLd([
    { name: 'Home', item: siteConfig.url },
    { name: category.name, item: `${siteConfig.url}/${category.slug}` },
    { name: toolMeta.name, item: `${siteConfig.url}/${category.slug}/${toolMeta.slug}` },
  ]);

  const faqJson = generateFAQJsonLd(faqs);

  const howToSteps = guide.steps.map((step) => ({
    name: step.name,
    text: step.text,
  }));
  const howToJson = generateHowToJsonLd(
    toolMeta.name,
    toolMeta.description,
    howToSteps,
    `${siteConfig.url}/${category.slug}/${toolMeta.slug}`
  );

  return (
    <ToolView
      category={category}
      toolMeta={toolMeta}
      component={component}
      faqs={faqs}
      guide={guide}
      relatedTools={relatedTools}
      breadcrumbJson={breadcrumbJson}
      faqJson={faqJson}
      howToJson={howToJson}
    />
  );
}
