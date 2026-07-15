'use client';

import * as React from 'react';
import { notFound } from 'next/navigation';
import { siteConfig } from '@tools-website/config';
import { Breadcrumb, Card, Button } from '@tools-website/ui';
import { toolsRegistry } from '../../../features/registry';
import { generateBreadcrumbJsonLd, generateFAQJsonLd, generateHowToJsonLd } from '@tools-website/utils';

export default function ToolPage({ params }: { params: { category: string; tool: string } }) {
  const category = siteConfig.categories.find((c) => c.slug === params.category);
  const toolMeta = (siteConfig as any).tools.find(
    (t: any) => t.slug === params.tool && t.category === params.category
  );

  if (!category || !toolMeta) {
    notFound();
  }

  const toolRegistryItem = toolsRegistry[toolMeta.slug];
  if (!toolRegistryItem) {
    notFound();
  }

  // FAQs and steps from registry
  const { component, faqs, guide } = toolRegistryItem;

  // Filter related tools (in same category)
  const relatedTools = (siteConfig as any).tools.filter(
    (t: any) => t.category === category.slug && t.slug !== toolMeta.slug
  );

  const breadcrumbs = [
    { label: category.name, href: `/${category.slug}` },
    { label: toolMeta.name, href: `/${category.slug}/${toolMeta.slug}` },
  ];

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

  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic SEO Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJson) }}
      />

      {/* Navigation Breadcrumbs */}
      <Breadcrumb items={breadcrumbs} className="mb-6" />

      {/* Tool Header */}
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white sm:text-4xl">
          {toolMeta.name}
        </h1>
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
          {toolMeta.description}
        </p>
      </div>

      {/* Interactive Tool Container */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        {component}
      </div>

      {/* Guide & Documentation */}
      <div className="mt-16 grid gap-8 lg:grid-cols-2">
        {/* Guide / How-to */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            {guide.title}
          </h2>
          <ol className="relative border-l border-zinc-200 dark:border-zinc-800 space-y-6 ml-3.5">
            {guide.steps.map((step, idx) => (
              <li key={idx} className="mb-6 ml-6">
                <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100">{step.name}</h3>
                <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* FAQs specific to this tool */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="flex w-full items-start justify-between text-left text-zinc-900 dark:text-white"
                >
                  <span className="font-semibold text-sm">{faq.question}</span>
                  <span className="ml-4 text-zinc-400">{activeFaq === index ? '-' : '+'}</span>
                </button>
                {activeFaq === index && (
                  <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{faq.answer}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Related Tools Section */}
      {relatedTools.length > 0 && (
        <div className="mt-16 border-t border-zinc-200 pt-10 dark:border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white mb-6">
            Related Tools
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedTools.slice(0, 4).map((tool: any) => (
              <Card key={tool.slug} hoverable className="flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{tool.name}</h3>
                  <p className="mt-1.5 text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2">{tool.description}</p>
                </div>
                <div className="mt-4">
                  <a href={`/${category.slug}/${tool.slug}`} className="w-full inline-block">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      Open Tool
                    </Button>
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
