import type { Metadata } from 'next';
import './globals.css';
import * as React from 'react';
import { siteConfig } from '@tools-website/config';
import { ClientProviders } from '../components/client-providers';
import { Navbar } from '../components/navbar';

export const metadata: Metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  alternates: {
    canonical: siteConfig.url,
  },
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
    images: [
      {
        url: `${siteConfig.url}/api/og?title=${encodeURIComponent('MultiTools')}&category=${encodeURIComponent('Free Online Tools')}&description=${encodeURIComponent(siteConfig.description)}`,
        width: 1200,
        height: 630,
        alt: 'MultiTools free online tools',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
  },
  verification: {
    google: siteConfig.seo.googleSiteVerification,
  },
  other: {
    'google-adsense-account': siteConfig.seo.googleAdsenseAccount,
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
        <meta name="google-adsense-account" content={siteConfig.seo.googleAdsenseAccount} />
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
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t border-zinc-200 bg-white py-10 text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
            <div className="mx-auto grid max-w-7xl gap-8 px-4 text-sm sm:px-6 md:grid-cols-[1.4fr_1fr_1fr] lg:px-8">
              <div>
                <div className="flex items-center space-x-2">
                  <img src="/logo.png" alt="" className="h-7 w-7 object-contain" />
                  <span className="font-bold text-zinc-900 dark:text-zinc-100">{siteConfig.name}</span>
                </div>
                <p className="mt-3 max-w-md leading-6">
                  Practical browser-based utilities with clear instructions, limitations, and privacy notes.
                </p>
              </div>
              <nav aria-label="About MultiTools">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">About</h2>
                <div className="mt-3 flex flex-col items-start gap-2">
                  <a href="/about" className="hover:text-violet-600 hover:underline">About MultiTools</a>
                  <a href="/editorial-policy" className="hover:text-violet-600 hover:underline">Editorial &amp; quality policy</a>
                  <a href="/contact" className="hover:text-violet-600 hover:underline">Contact &amp; corrections</a>
                </div>
              </nav>
              <nav aria-label="Legal and site links">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100">Site</h2>
                <div className="mt-3 flex flex-col items-start gap-2">
                  <a href="/privacy" className="hover:text-violet-600 hover:underline">Privacy Policy</a>
                  <a href="/terms" className="hover:text-violet-600 hover:underline">Terms of Service</a>
                  <a href="/sitemap.xml" className="hover:text-violet-600 hover:underline">Sitemap</a>
                </div>
              </nav>
            </div>
            <div className="mx-auto mt-8 max-w-7xl border-t border-zinc-200 px-4 pt-6 text-xs dark:border-zinc-800 sm:px-6 lg:px-8">
              &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
            </div>
          </footer>
        </ClientProviders>
      </body>
    </html>
  );
}
