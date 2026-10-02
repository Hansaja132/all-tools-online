'use client';

import * as React from 'react';
import { adConfig } from './ad-config';

export type AdFormat = 'leaderboard' | 'rectangle' | 'horizontal' | 'native';

export interface AdBannerProps {
  /** Unique identifier for tracking and placement marking */
  slotId: string;
  /** Ad dimensions and format style */
  format?: AdFormat;
  /** Optional custom Adsterra Key override for this specific slot */
  adsterraKey?: string;
  /** Optional custom Monetag Zone ID override for this specific slot */
  monetagZoneId?: string;
  /** Optional custom className for outer styling */
  className?: string;
  /** Label for transparency (Google and UX standard: "ADVERTISEMENT" or "SPONSORED") */
  label?: string;
}

export function AdBanner({
  slotId,
  format = 'leaderboard',
  adsterraKey,
  monetagZoneId,
  className = '',
  label = 'ADVERTISEMENT',
}: AdBannerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  // Check if ads are enabled
  if (!adConfig.enabled) {
    return null;
  }

  // Determine active keys from props or global config
  const activeAdsterraKey =
    adsterraKey ||
    (format === 'leaderboard'
      ? adConfig.adsterra.bannerKeys.leaderboard728x90
      : format === 'rectangle'
      ? adConfig.adsterra.bannerKeys.rectangle300x250
      : adConfig.adsterra.bannerKeys.nativeWidget);

  const activeMonetagZone =
    monetagZoneId ||
    (format === 'leaderboard'
      ? adConfig.monetag.bannerZones.leaderboard
      : adConfig.monetag.bannerZones.rectangle);

  const hasLiveAd = Boolean(activeAdsterraKey || activeMonetagZone);

  // Dimension presets to avoid Cumulative Layout Shift (CLS)
  const formatStyles: Record<
    AdFormat,
    { containerClass: string; placeholderSize: string; minHeight: string }
  > = {
    leaderboard: {
      containerClass: 'min-h-[60px] sm:min-h-[100px] max-w-[760px]',
      placeholderSize: '728 × 90 (Desktop) / 320 × 50 (Mobile)',
      minHeight: '100px',
    },
    rectangle: {
      containerClass: 'min-h-[260px] max-w-[340px]',
      placeholderSize: '300 × 250 Medium Rectangle',
      minHeight: '260px',
    },
    horizontal: {
      containerClass: 'min-h-[90px] w-full max-w-4xl',
      placeholderSize: 'Responsive In-Article Banner',
      minHeight: '90px',
    },
    native: {
      containerClass: 'min-h-[120px] w-full max-w-4xl',
      placeholderSize: 'Native Recommendation Widget',
      minHeight: '120px',
    },
  };

  const currentStyle = formatStyles[format];

  // Adsterra iframe injection for isolated safe execution (prevents global atOptions collision)
  React.useEffect(() => {
    if (!isMounted || !hasLiveAd || !containerRef.current) return;

    if (activeAdsterraKey) {
      // Clear container and mount safe iframe
      const width = format === 'rectangle' ? 300 : format === 'leaderboard' ? 728 : 728;
      const height = format === 'rectangle' ? 250 : format === 'leaderboard' ? 90 : 90;

      const iframe = document.createElement('iframe');
      iframe.width = `${width}`;
      iframe.height = `${height}`;
      iframe.style.border = 'none';
      iframe.style.overflow = 'hidden';
      iframe.title = `Advertisement ${slotId}`;
      iframe.setAttribute('loading', 'lazy');

      const htmlContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; background: transparent; }</style>
          </head>
          <body>
            <script type="text/javascript">
              atOptions = {
                'key': '${activeAdsterraKey}',
                'format': 'iframe',
                'height': ${height},
                'width': ${width},
                'params': {}
              };
            </script>
            <script type="text/javascript" src="//www.topcreativeformat.com/${activeAdsterraKey}/invoke.js"></script>
          </body>
        </html>
      `;

      containerRef.current.innerHTML = '';
      containerRef.current.appendChild(iframe);

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(htmlContent);
        doc.close();
      }
    }
  }, [isMounted, hasLiveAd, activeAdsterraKey, format, slotId]);

  return (
    <div
      id={`ad-slot-${slotId}`}
      data-ad-slot={slotId}
      data-ad-format={format}
      className={`relative mx-auto my-6 flex flex-col items-center justify-center transition-all ${className}`}
    >
      {/* Transparency / Google Policy Label */}
      <span className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
        {label}
      </span>

      {/* Main Banner Container with guaranteed min-height to prevent layout shifts */}
      <div
        className={`w-full flex items-center justify-center overflow-hidden rounded-xl border border-dashed border-zinc-200 bg-zinc-50/70 p-2 dark:border-zinc-800 dark:bg-zinc-900/40 ${currentStyle.containerClass}`}
        style={{ minHeight: currentStyle.minHeight }}
      >
        {/* Live Ad Container */}
        {hasLiveAd ? (
          <div ref={containerRef} className="flex w-full items-center justify-center" />
        ) : adConfig.showPlaceholders ? (
          /* Developer / Webmaster Visual Marker */
          <div className="flex flex-col items-center justify-center py-4 px-3 text-center">
            <div className="inline-flex items-center space-x-1.5 rounded-full bg-violet-100 dark:bg-violet-950/60 px-2.5 py-0.5 text-xs font-semibold text-violet-700 dark:text-violet-300">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
              <span>Ad Slot: {slotId}</span>
            </div>
            <p className="mt-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400">
              {currentStyle.placeholderSize}
            </p>
            <p className="mt-0.5 text-[11px] text-zinc-400 dark:text-zinc-500 max-w-sm">
              Ready for <strong>Adsterra Banner</strong> or <strong>Monetag Banner</strong>. Pre-allocated height prevents CLS.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
