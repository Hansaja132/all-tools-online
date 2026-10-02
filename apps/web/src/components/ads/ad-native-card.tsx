'use client';

import * as React from 'react';
import { Card } from '@tools-website/ui';
import { ExternalLink, Sparkles } from 'lucide-react';
import { adConfig } from './ad-config';

export interface AdNativeCardProps {
  slotId?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  href?: string;
  className?: string;
}

export function AdNativeCard({
  slotId = 'in-feed-native-card',
  title = 'Featured Productivity Utility',
  description = 'Discover recommended cloud, developer, and design tools curated to accelerate your daily workflow.',
  ctaText = 'Learn More',
  href = '#',
  className = '',
}: AdNativeCardProps) {
  if (!adConfig.enabled) {
    return null;
  }

  const directLink = adConfig.adsterra.directLinkUrl || href;

  return (
    <Card
      data-ad-slot={slotId}
      hoverable
      className={`relative flex flex-col justify-between border border-dashed border-violet-300/80 bg-gradient-to-b from-violet-50/40 to-transparent p-5 dark:border-violet-900/50 dark:from-violet-950/20 rounded-2xl group transition-all ${className}`}
    >
      <div>
        {/* Header row with Sponsored badge */}
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center space-x-1 rounded-full bg-violet-100 px-2.5 py-0.5 text-[11px] font-semibold text-violet-700 dark:bg-violet-950 dark:text-violet-300">
            <Sparkles className="h-3 w-3" />
            <span>Sponsored</span>
          </span>
          <span className="text-[10px] uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            {slotId}
          </span>
        </div>

        {/* Content */}
        <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
          {title}
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3">
          {description}
        </p>
      </div>

      {/* Action CTA */}
      <div className="mt-6">
        <a
          href={directLink}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="flex w-full items-center justify-between rounded-xl border border-violet-200 bg-white px-3.5 py-2 text-xs font-semibold text-violet-700 shadow-sm hover:bg-violet-50 dark:border-violet-800 dark:bg-zinc-900 dark:text-violet-300 dark:hover:bg-zinc-800 transition-colors"
        >
          <span>{ctaText}</span>
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </Card>
  );
}
