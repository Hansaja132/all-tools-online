import type { Metadata } from 'next';
import './globals.css';
import * as React from 'react';
import { siteConfig } from '@tools-website/config';
import { ClientProviders } from '../components/client-providers';
import { Navbar } from '../components/navbar';
import { AdGlobalScripts, AdBanner } from '../components/ads';

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  icons: {
    icon: '/favicon.png',
    shortcut: '/favicon.png',
    apple: '/favicon.png',
  },
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.seo.openGraph.siteName,
    locale: siteConfig.seo.openGraph.locale,
    type: 'website',
  },
  verification: {
    google: siteConfig.seo.googleSiteVerification,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('multi-tools-theme') || 'system';
                  const root = document.documentElement;
                  root.classList.remove('light', 'dark');
                  if (theme === 'system') {
                    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                    root.classList.add(systemTheme);
                  } else {
                    root.classList.add(theme);
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
        <ClientProviders>
          {/* ========================================================================= */}
          {/* GLOBAL AD SCRIPTS (Monetag MultiTag / Adsterra Social Bar / Popunder)     */}
          {/* Configured in apps/web/src/components/ads/ad-config.ts                    */}
          {/* ========================================================================= */}
          <AdGlobalScripts />

          <Navbar />

          {/* ========================================================================= */}
          {/* AD SLOT: GLOBAL TOP BANNER (Optional)                                     */}
          {/* Format: 728x90 Leaderboard (Desktop) / 320x50 (Mobile)                    */}
          {/* UX Safety: Centered beneath navbar with reserved height to avoid CLS.     */}
          {/* ========================================================================= */}
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AdBanner slotId="global-top-header" format="leaderboard" className="my-3" />
          </div>

          <main className="flex-grow">
            {children}
          </main>

          {/* ========================================================================= */}
          {/* AD SLOT: GLOBAL ABOVE-FOOTER BANNER                                       */}
          {/* Format: 728x90 Leaderboard / Responsive Horizontal Banner                */}
          {/* UX Safety: High viewability when users scroll to the bottom, 0% tool risk */}
          {/* ========================================================================= */}
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <AdBanner slotId="global-above-footer" format="leaderboard" />
          </div>

          <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <img src="/logo.png" alt={siteConfig.name} className="h-6 w-6 object-contain" />
                <span className="font-bold text-zinc-900 dark:text-zinc-100">{siteConfig.name}</span>
              </div>
              <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
              <div className="mt-3 flex justify-center space-x-6">
                <a href="/privacy" className="hover:underline">Privacy Policy</a>
                <a href="/terms" className="hover:underline">Terms of Service</a>
                <a href="/sitemap.xml" className="hover:underline">Sitemap</a>
              </div>
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
