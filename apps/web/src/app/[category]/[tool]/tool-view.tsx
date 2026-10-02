'use client';

import * as React from 'react';
import { Breadcrumb, Card } from '@tools-website/ui';
import { CheckCircle2, ChevronDown, ChevronUp, Sparkles, ArrowRight } from 'lucide-react';
import type { ToolSeoData } from '../../../lib/seo/tool-seo';
import { AdBanner } from '../../../components/ads';

interface ToolViewProps {
  category: {
    name: string;
    slug: string;
  };
  toolMeta: {
    name: string;
    slug: string;
    description: string;
    category: string;
  };
  seoData: ToolSeoData;
  children: React.ReactNode;
  relatedTools: {
    slug: string;
    name: string;
    category: string;
    categoryName: string;
    description: string;
    href: string;
  }[];
  breadcrumbJson: any;
  webAppJson: any;
  howToJson: any;
}

export function ToolView({
  category,
  toolMeta,
  seoData,
  children,
  relatedTools,
  breadcrumbJson,
  webAppJson,
  howToJson,
}: ToolViewProps) {
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  const breadcrumbs = [
    { label: category.name, href: `/${category.slug}` },
    { label: toolMeta.name, href: `/${category.slug}/${toolMeta.slug}` },
  ];

  return (
    <article className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Dynamic SEO Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJson) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJson) }}
      />

      {/* Semantic Navigation Breadcrumbs */}
      <Breadcrumb items={breadcrumbs} className="mb-6" />

      {/* Primary Tool Header */}
      <header className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
          {seoData.h1}
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-zinc-600 dark:text-zinc-400 max-w-4xl">
          {seoData.intro}
        </p>
      </header>

      {/* Interactive Tool Container */}
      <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40">
        {children}
      </div>

      {/* ========================================================================= */}
      {/* AD SLOT: POST-TOOL PRIMARY BANNER (HIGHEST VIEWABILITY & HIGHEST CPM)     */}
      {/* Recommended Format: 728x90 Leaderboard (Desktop) / 300x250 Rectangle     */}
      {/* Suitable for: Adsterra Banner or Monetag Banner                           */}
      {/* UX Guarantee: Outside the interactive workspace; zero interference with    */}
      {/* file uploads, sliders, or action buttons. Pre-allocated height avoids CLS. */}
      {/* ========================================================================= */}
      <div className="mt-8">
        <AdBanner
          slotId="tool-view-post-tool-primary"
          format="leaderboard"
        />
      </div>

      {/* How to Use Section */}
      <section className="mt-12" aria-labelledby="how-to-heading">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2
            id="how-to-heading"
            className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6"
          >
            {seoData.howTo.heading}
          </h2>
          <ol className="relative border-l border-zinc-200 dark:border-zinc-800 space-y-6 ml-3.5">
            {seoData.howTo.steps.map((step, idx) => (
              <li key={idx} className="mb-6 ml-6">
                <span className="absolute -left-3.5 flex h-7 w-7 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700 dark:bg-violet-950 dark:text-violet-400 border border-violet-200 dark:border-violet-800">
                  {idx + 1}
                </span>
                <h3 className="font-bold text-zinc-900 dark:text-zinc-100 text-base">
                  {step.name}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {step.text}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Key Features Grid */}
      <section className="mt-16" aria-labelledby="features-heading">
        <div className="flex items-center space-x-2.5 mb-6">
          <Sparkles className="h-6 w-6 text-violet-600 dark:text-violet-400" />
          <h2
            id="features-heading"
            className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
          >
            {seoData.featuresHeading}
          </h2>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {seoData.features.map((feature, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col justify-start"
            >
              <div className="flex items-center space-x-2.5 mb-2.5">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {feature.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AD SLOT: IN-CONTENT EDITORIAL BANNER                                      */}
      {/* Recommended Format: Responsive Horizontal Banner / Adsterra Native Widget */}
      {/* Suitable for: Monetag Banner or Adsterra Native 4:1 Widget                */}
      {/* UX Guarantee: Placed between content sections with clean margins           */}
      {/* ========================================================================= */}
      <div className="mt-12">
        <AdBanner
          slotId="tool-view-in-content"
          format="horizontal"
        />
      </div>

      {/* Explanatory Guide: What is [Tool]? */}
      <section className="mt-12" aria-labelledby="what-is-heading">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2
            id="what-is-heading"
            className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-4"
          >
            {seoData.whatIs.heading}
          </h2>
          <div className="space-y-4 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            {seoData.whatIs.paragraphs.map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mt-16" aria-labelledby="faqs-heading">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2
            id="faqs-heading"
            className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6"
          >
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {seoData.faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg p-1"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-base text-zinc-900 dark:text-zinc-100 pr-4">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500">
                      {isOpen ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </span>
                  </button>
                  {isOpen && (
                    <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 pl-1 pr-4">
                      {faq.answer}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* AD SLOT: PRE-RELATED TOOLS BANNER                                         */}
      {/* Recommended Format: 728x90 Leaderboard / 300x250 Rectangle                */}
      {/* Suitable for: Adsterra Banner or Monetag Banner                           */}
      {/* ========================================================================= */}
      <div className="mt-12">
        <AdBanner
          slotId="tool-view-pre-related"
          format="leaderboard"
        />
      </div>

      {/* Related Tools Internal Linking */}
      {relatedTools.length > 0 && (
        <section className="mt-16 border-t border-zinc-200 pt-12 dark:border-zinc-800" aria-labelledby="related-heading">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2
                id="related-heading"
                className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
              >
                Related Tools
              </h2>
              <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                Explore complementary utilities to speed up your workflow.
              </p>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((rel) => (
              <Card
                key={rel.slug}
                hoverable
                className="flex flex-col justify-between p-5 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 rounded-xl"
              >
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 mb-2">
                    {rel.categoryName}
                  </span>
                  <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                    {rel.name}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-2">
                    {rel.description}
                  </p>
                </div>
                <div className="mt-5">
                  <a
                    href={rel.href}
                    className="inline-flex w-full items-center justify-center space-x-1.5 rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <span>Open Tool</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
