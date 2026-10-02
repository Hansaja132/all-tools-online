'use client';

import * as React from 'react';
import { Card, Breadcrumb } from '@tools-website/ui';
import {
  Code2,
  Image,
  FileText,
  Palette,
  ArrowRight,
  Heart,
  Coins,
  GraduationCap,
  ShieldCheck,
  Zap,
  Sparkles,
  Lock,
  Scissors,
  Layers,
  Search,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useFavoritesStore } from '../../lib/store/favorites-store';
import { AdBanner, AdNativeCard } from '../../components/ads';

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
  const [searchFilter, setSearchFilter] = React.useState('');
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

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
      case 'pdf-tools':
        return <FileText className="h-6 w-6 text-rose-500" />;
      default:
        return <Code2 className="h-6 w-6 text-zinc-500" />;
    }
  };

  const breadcrumbs = [{ label: category.name, href: `/${category.slug}` }];

  // Dedicated layout for PDF Tools Category Landing Page
  if (category.slug === 'pdf-tools') {
    const pdfSubcategories = [
      {
        id: 'convert',
        title: 'Convert PDF',
        description: 'Convert between PDF documents and popular image formats seamlessly.',
        icon: <Zap className="h-5 w-5 text-indigo-500" />,
        toolSlugs: ['pdf-to-jpg', 'pdf-to-png', 'jpg-to-pdf', 'png-to-pdf'],
      },
      {
        id: 'organize',
        title: 'Organize PDF',
        description: 'Merge, split, extract, rotate, and reorder document pages with visual previews.',
        icon: <Layers className="h-5 w-5 text-violet-500" />,
        toolSlugs: ['merge-pdf', 'split-pdf', 'extract-pdf-pages', 'reorder-pdf-pages', 'rotate-pdf'],
      },
      {
        id: 'optimize',
        title: 'Optimize PDF',
        description: 'Compress file sizes, crop borders, and convert to grayscale for faster sharing and printing.',
        icon: <Scissors className="h-5 w-5 text-emerald-500" />,
        toolSlugs: ['compress-pdf', 'grayscale-pdf', 'crop-pdf'],
      },
      {
        id: 'edit',
        title: 'Edit PDF',
        description: 'Add watermarks, stamp page numbers, modify metadata, and apply electronic signatures.',
        icon: <Sparkles className="h-5 w-5 text-amber-500" />,
        toolSlugs: ['watermark-pdf', 'add-page-numbers-to-pdf', 'edit-pdf-metadata', 'sign-pdf'],
      },
      {
        id: 'security',
        title: 'PDF Security',
        description: 'Protect confidential files with AES password encryption or remove passwords on authorized PDFs.',
        icon: <Lock className="h-5 w-5 text-rose-500" />,
        toolSlugs: ['password-protect-pdf', 'unlock-pdf'],
      },
      {
        id: 'text',
        title: 'PDF Text',
        description: 'Extract native digital text or transcribe scanned document images with neural OCR.',
        icon: <FileText className="h-5 w-5 text-cyan-500" />,
        toolSlugs: ['extract-text-from-pdf', 'ocr-pdf'],
      },
    ];

    const pdfFaqs = [
      {
        question: 'Are these online PDF tools safe and secure?',
        answer:
          'Yes, 100%. All of our PDF tools process your files directly inside your web browser using modern WebAssembly and JavaScript libraries. Your documents are never uploaded to any remote server or cloud database, ensuring complete confidentiality for contracts, financial filings, and personal records.',
      },
      {
        question: 'Are all PDF tools free to use?',
        answer:
          'Yes! Every PDF tool—including PDF merger, PDF compressor, PDF converter, and PDF splitter—is completely free with no subscriptions, account registrations, or watermarks attached to your output files.',
      },
      {
        question: 'Do I need to install any desktop software or extensions?',
        answer:
          'No installation is required. All tools run directly in any modern desktop, laptop, tablet, or smartphone web browser (Chrome, Edge, Safari, Firefox).',
      },
      {
        question: 'What is the file size limit for PDF processing?',
        answer:
          'Because file manipulation occurs locally using your device memory rather than remote server queues, you can comfortably process large documents with dozens of pages and high-resolution graphics.',
      },
      {
        question: 'Can I use these PDF tools on mobile devices?',
        answer:
          'Yes, our entire PDF suite is fully mobile-responsive and supports touchscreen gestures, file pickers, and camera scans across iOS and Android.',
      },
    ];

    const filteredCategoryTools = categoryTools.filter(
      (t) =>
        t.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        (t.keywords && t.keywords.some((kw: string) => kw.toLowerCase().includes(searchFilter.toLowerCase())))
    );

    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb & JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
        />

        <Breadcrumb items={breadcrumbs} className="mb-6" />

        {/* Hero & SEO Header */}
        <header className="rounded-3xl border border-zinc-200 bg-gradient-to-b from-white to-zinc-50/50 p-6 sm:p-10 shadow-sm dark:border-zinc-800 dark:from-zinc-900/60 dark:to-zinc-950">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <span className="inline-flex items-center space-x-2 rounded-full bg-rose-50 px-3.5 py-1 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200/80 dark:border-rose-900/60">
              <ShieldCheck className="h-4 w-4" />
              <span>100% Client-Side Privacy • Zero Server Uploads</span>
            </span>
            <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
              20 Free PDF Utilities Available
            </span>
          </div>

          <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-4xl lg:text-5xl">
            Free Online PDF Tools
          </h1>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-zinc-600 dark:text-zinc-300 max-w-4xl">
            Welcome to the ultimate suite of free online <strong>PDF tools</strong> designed for
            professionals, students, and businesses. Whether you need a powerful{' '}
            <strong>PDF editor</strong> to add watermarks and page numbers, a fast{' '}
            <strong>PDF converter</strong> to transform pages to JPG or PNG, a high-efficiency{' '}
            <strong>PDF compressor</strong> to shrink email attachments, a versatile{' '}
            <strong>PDF merger</strong> to combine documents, or a flexible{' '}
            <strong>PDF splitter</strong> to isolate specific pages—our utilities execute directly
            in your browser memory. Enjoy instant, private, and unlimited document processing
            without software installations.
          </p>

          {/* Quick Search Filter */}
          <div className="mt-8 max-w-md">
            <div className="relative">
              <Search className="absolute inset-y-0 left-3.5 h-4 w-4 my-auto text-zinc-400" />
              <input
                type="text"
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                placeholder="Search PDF tools (e.g. merge, compress, sign, ocr)..."
                className="h-11 w-full rounded-xl border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 shadow-sm focus:border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 placeholder-zinc-400"
              />
            </div>
          </div>
        </header>

        {/* ========================================================================= */}
        {/* AD SLOT: PDF CATEGORY TOP LEADERBOARD                                     */}
        {/* Recommended Format: 728x90 Leaderboard / 320x50 Mobile                    */}
        {/* Suitable for: Adsterra Banner or Monetag Banner                           */}
        {/* UX Safety: Placed directly below the hero card with zero CLS layout shift */}
        {/* ========================================================================= */}
        <div className="mt-8">
          <AdBanner slotId="category-pdf-top" format="leaderboard" />
        </div>

        {/* Categorized PDF Tool Sections */}
        {searchFilter.trim() === '' ? (
          <div className="mt-12 space-y-12">
            {pdfSubcategories.map((subcat, subcatIdx) => {
              const toolsInSubcat = categoryTools.filter((t) =>
                subcat.toolSlugs.includes(t.slug)
              );

              return (
                <React.Fragment key={subcat.id}>
                  {/* ========================================================================= */}
                  {/* AD SLOT: MID-SUBCATEGORY IN-CONTENT BANNER                                */}
                  {/* Breaks up long catalog list naturally; high scroll engagement             */}
                  {/* ========================================================================= */}
                  {subcatIdx === 2 && (
                    <div className="my-10">
                      <AdBanner slotId="category-pdf-mid-subcat" format="leaderboard" />
                    </div>
                  )}

                  <section aria-labelledby={`subcat-${subcat.id}`}>
                    <div className="flex items-center space-x-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
                      <div className="rounded-lg bg-zinc-100 p-2 dark:bg-zinc-800">
                        {subcat.icon}
                      </div>
                      <div>
                        <h2
                          id={`subcat-${subcat.id}`}
                          className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white"
                        >
                          {subcat.title}
                        </h2>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                          {subcat.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {toolsInSubcat.map((tool: any) => {
                      const fav = isFavorite(tool.slug);
                      return (
                        <Card
                          key={tool.slug}
                          hoverable
                          className="flex flex-col justify-between relative group border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 rounded-2xl transition-all"
                        >
                          <div>
                            <div className="flex items-center justify-between">
                              <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                                {subcat.title}
                              </span>
                              <button
                                onClick={() => toggleFavorite(tool.slug)}
                                className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 transition-colors"
                                aria-label={`Favorite ${tool.name}`}
                              >
                                <Heart
                                  className={`h-4 w-4 ${fav ? 'fill-red-500 text-red-500' : ''}`}
                                />
                              </button>
                            </div>

                            <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
                              {tool.name}
                            </h3>
                            <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3">
                              {tool.description}
                            </p>
                          </div>

                          <div className="mt-5">
                            <a
                              href={`/${category.slug}/${tool.slug}`}
                              className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-rose-50 hover:border-rose-200 hover:text-rose-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 dark:hover:text-rose-300 transition-colors"
                            >
                              <span>Use {tool.name}</span>
                              <ArrowRight className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              </React.Fragment>
            );
          })}
        </div>
      ) : (
        /* Filtered Results View */
        <div className="mt-12">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white mb-6">
            Matching Tools ({filteredCategoryTools.length})
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCategoryTools.map((tool: any, index: number) => {
              const fav = isFavorite(tool.slug);
              return (
                <React.Fragment key={tool.slug}>
                  {index === 3 && (
                    <AdNativeCard
                      slotId="category-pdf-filtered-native"
                      title="Recommended Document & Office Suite"
                      description="Boost your workflow with fast cloud storage, electronic signatures, and PDF tools."
                      ctaText="Learn More"
                    />
                  )}
                  <Card
                    hoverable
                    className="flex flex-col justify-between relative group border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 p-5 rounded-2xl"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                          PDF Tool
                        </span>
                        <button
                          onClick={() => toggleFavorite(tool.slug)}
                          className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 transition-colors"
                          aria-label={`Favorite ${tool.name}`}
                        >
                          <Heart
                            className={`h-4 w-4 ${fav ? 'fill-red-500 text-red-500' : ''}`}
                          />
                        </button>
                      </div>

                      <h3 className="mt-3 text-base font-bold text-zinc-900 dark:text-zinc-100">
                        {tool.name}
                      </h3>
                      <p className="mt-1.5 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3">
                        {tool.description}
                      </p>
                    </div>

                    <div className="mt-5">
                      <a
                        href={`/${category.slug}/${tool.slug}`}
                        className="flex w-full items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2 text-xs font-semibold text-zinc-900 shadow-sm hover:bg-rose-50 hover:text-rose-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      >
                        <span>Open Tool</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </a>
                    </div>
                  </Card>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* AD SLOT: PDF CATEGORY PRE-GUIDE LEADERBOARD                               */}
      {/* Recommended Format: 728x90 Leaderboard / Responsive Horizontal            */}
      {/* Suitable for: Monetag Banner or Adsterra Banner                           */}
      {/* ========================================================================= */}
      <div className="mt-16">
        <AdBanner slotId="category-pdf-pre-guide" format="leaderboard" />
      </div>

      {/* Informational SEO Guide */}
        <section className="mt-16 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Why Use Browser-Based Online PDF Tools?
          </h2>
          <div className="mt-4 space-y-4 text-sm sm:text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
            <p>
              In today's fast-paced digital workspace, managing PDF documents quickly and securely
              is an everyday necessity. Traditional desktop PDF editors frequently demand costly
              recurring software licenses, consume gigabytes of storage, and require manual updates.
              Conversely, many conventional web converters transmit your private tax records, signed
              contracts, and medical files to third-party cloud servers where data might be logged or
              retained.
            </p>
            <p>
              Our free <strong>online PDF tools</strong> offer the best of both worlds: zero-install
              simplicity paired with absolute client-side privacy. Utilizing cutting-edge
              WebAssembly execution and HTML5 canvas engines, every conversion, compression, merge,
              split, and signature operation executes directly on your own computer CPU. Your files
              are processed locally in browser memory and are never uploaded across the internet.
            </p>
          </div>
        </section>

        {/* Category FAQ Section */}
        <section className="mt-12 rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-6">
            Frequently Asked Questions About PDF Tools
          </h2>
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {pdfFaqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="flex w-full items-center justify-between text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 rounded-lg p-1"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-base text-zinc-900 dark:text-zinc-100 pr-4">
                      {faq.question}
                    </span>
                    <span className="flex-shrink-0 text-zinc-400 dark:text-zinc-500">
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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
        </section>
      </div>
    );
  }

  // Standard category view for other categories (developer-tools, image-tools, etc.)
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
        <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">{category.description}</p>
      </div>

      {/* ========================================================================= */}
      {/* AD SLOT: CATEGORY TOP LEADERBOARD                                         */}
      {/* Recommended Format: 728x90 Leaderboard (Desktop) / 320x50 (Mobile)         */}
      {/* Suitable for: Adsterra Banner or Monetag Banner                           */}
      {/* ========================================================================= */}
      <div className="mt-6">
        <AdBanner slotId={`category-${category.slug}-top`} format="leaderboard" />
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {categoryTools.map((tool: any, index: number) => {
          const fav = isFavorite(tool.slug);
          return (
            <React.Fragment key={tool.slug}>
              {/* ========================================================================= */}
              {/* AD SLOT: IN-FEED NATIVE SPONSORED CARD                                    */}
              {/* Blends smoothly into the category tools grid with honest Sponsored badge  */}
              {/* ========================================================================= */}
              {index === 3 && (
                <AdNativeCard
                  slotId={`category-${category.slug}-native`}
                  title={`Top Utilities for ${category.name}`}
                  description="Explore complementary professional tools and services curated for your productivity."
                  ctaText="Explore Partner"
                />
              )}

              <Card hoverable className="flex flex-col justify-between relative group">
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
            </React.Fragment>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* AD SLOT: CATEGORY BOTTOM LEADERBOARD                                      */}
      {/* ========================================================================= */}
      <div className="mt-16">
        <AdBanner slotId={`category-${category.slug}-bottom`} format="leaderboard" />
      </div>
    </div>
  );
}
