'use client';

import * as React from 'react';
import { Search, Code2, Image, FileText, Palette, Star, ArrowRight, Heart, Coins, GraduationCap } from 'lucide-react';
import { siteConfig } from '@tools-website/config';
import { Card, Button, SearchInput } from '@tools-website/ui';
import { useSearchStore } from '../lib/store/search-store';
import { useFavoritesStore } from '../lib/store/favorites-store';

export default function HomePage() {
  const { query, setQuery, categoryFilter, setCategoryFilter } = useSearchStore();
  const { favorites, toggleFavorite, isFavorite } = useFavoritesStore();
  const [newsletterEmail, setNewsletterEmail] = React.useState('');
  const [activeFaq, setActiveFaq] = React.useState<number | null>(null);

  // Map category slugs to icons
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
        return <Coins className="h-6 w-6 text-amber-500 animate-pulse" />;
      case 'study-tools':
        return <GraduationCap className="h-6 w-6 text-teal-400" />;
      default:
        return <Code2 className="h-6 w-6 text-zinc-500" />;
    }
  };

  // Filter tools based on query and category filter
  const filteredTools = (siteConfig as any).tools.filter((tool: any) => {
    const matchesSearch =
      tool.name.toLowerCase().includes(query.toLowerCase()) ||
      tool.description.toLowerCase().includes(query.toLowerCase()) ||
      tool.keywords.some((kw: string) => kw.toLowerCase().includes(query.toLowerCase()));

    const matchesCategory = !categoryFilter || tool.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Thank you for subscribing with ${newsletterEmail}!`);
    setNewsletterEmail('');
  };

  const faqs = [
    {
      q: 'Are these tools free to use?',
      a: 'Yes! All of our core tools (such as JSON Formatter, UUID Generator, and Color Picker) are 100% free and run directly in your web browser. No registration is required.',
    },
    {
      q: 'Is my data secure?',
      a: 'Absolutely. All client-side tools process your data directly in your browser. Your input data is never sent to our servers, ensuring total privacy and security.',
    },
    {
      q: 'Will you add more tools in the future?',
      a: 'Yes, we are continuously building and releasing new tools. You can subscribe to our newsletter to receive updates when new utilities go live.',
    },
  ];

  return (
    <div className="relative isolate overflow-hidden">
      {/* Dynamic Background Glows */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-violet-300 to-indigo-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white sm:text-6xl">
            All the developer tools you need in{' '}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-400">
              one place
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
            Free, fast, secure, and client-side online tools to boost your daily engineering and design productivity.
          </p>

          {/* Search Bar Container */}
          <div className="mx-auto mt-10 max-w-xl">
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              placeholder="Search by tool name, description, or keywords..."
            />
          </div>
        </div>

        {/* Categories Section */}
        <div className="mt-16">
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              variant={categoryFilter === null ? 'primary' : 'outline'}
              onClick={() => setCategoryFilter(null)}
              size="sm"
            >
              All Tools
            </Button>
            {siteConfig.categories.map((cat) => (
              <Button
                key={cat.slug}
                variant={categoryFilter === cat.slug ? 'primary' : 'outline'}
                onClick={() => setCategoryFilter(cat.slug)}
                size="sm"
                className="flex items-center space-x-1.5"
              >
                <span>{cat.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Grid Tools Listing */}
        <div className="mt-12">
          {filteredTools.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredTools.map((tool: any) => {
                const fav = isFavorite(tool.slug);
                return (
                  <Card key={tool.slug} hoverable className="flex flex-col justify-between relative group">
                    <div>
                      {/* Top Action Row */}
                      <div className="flex items-center justify-between">
                        <div className="rounded-lg bg-zinc-100 p-2.5 dark:bg-zinc-800">
                          {getCategoryIcon(tool.category)}
                        </div>
                        <button
                          onClick={() => toggleFavorite(tool.slug)}
                          className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-800 transition-colors"
                        >
                          <Heart className={`h-5 w-5 ${fav ? 'fill-red-500 text-red-500' : ''}`} />
                        </button>
                      </div>

                      {/* Tool Info */}
                      <h3 className="mt-4 text-lg font-bold text-zinc-900 dark:text-zinc-100">
                        {tool.name}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3">
                        {tool.description}
                      </p>
                    </div>

                    {/* Footer Button Link */}
                    <div className="mt-6">
                      <a href={`/${tool.category}/${tool.slug}`} className="w-full inline-block">
                        <Button variant="outline" className="w-full justify-between group-hover:bg-violet-50 dark:group-hover:bg-zinc-800 transition-colors text-sm">
                          <span>Use Tool</span>
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </a>
                    </div>
                  </Card>
                );
              })}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-lg text-zinc-500 dark:text-zinc-400">No tools found matching your query.</p>
              <Button variant="ghost" onClick={() => setQuery('')} className="mt-2 text-violet-600 dark:text-violet-400">
                Clear search filter
              </Button>
            </div>
          )}
        </div>

        {/* FAQs Accordion */}
        <div className="mx-auto mt-32 max-w-3xl border-t border-zinc-200 pt-16 dark:border-zinc-800">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white text-center">
            Frequently Asked Questions
          </h2>
          <dl className="mt-10 space-y-6 divide-y divide-zinc-200 dark:divide-zinc-800">
            {faqs.map((faq, index) => (
              <div key={index} className="pt-6">
                <dt className="text-lg">
                  <button
                    onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                    className="flex w-full items-start justify-between text-left text-zinc-900 dark:text-white"
                  >
                    <span className="font-bold">{faq.q}</span>
                    <span className="ml-6 flex h-7 items-center text-zinc-400">
                      {activeFaq === index ? '-' : '+'}
                    </span>
                  </button>
                </dt>
                {activeFaq === index && (
                  <dd className="mt-2 pr-12 transition-all">
                    <p className="text-base text-zinc-600 dark:text-zinc-400">{faq.a}</p>
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>

        {/* Newsletter Signup Banner */}
        <div className="relative mt-32 overflow-hidden rounded-3xl bg-zinc-900 px-6 py-20 shadow-xl dark:bg-zinc-950 sm:px-12 sm:py-24">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.violet.800),theme(colors.zinc.900))] opacity-40" />
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Get notified when new tools are added.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-zinc-300">
              No spam. Just updates on new generators, converters, encoders and productivity builders.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email"
                className="min-w-0 max-w-xs rounded-lg border border-transparent bg-white/10 px-4 py-2.5 text-base text-white placeholder-zinc-400 focus:border-white focus:outline-none focus:ring-2 focus:ring-white/20 sm:max-w-none"
              />
              <Button type="submit" variant="primary">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
