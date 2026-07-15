import './globals.css';
import * as React from 'react';
import { siteConfig } from '@tools-website/config';
import { ClientProviders } from '../components/client-providers';
import { Navbar } from '../components/navbar';

export const metadata = {
  title: {
    default: siteConfig.seo.defaultTitle,
    template: siteConfig.seo.titleTemplate,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    title: siteConfig.seo.defaultTitle,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.seo.openGraph.siteName,
    locale: siteConfig.seo.openGraph.locale,
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="flex min-h-screen flex-col bg-zinc-50 dark:bg-zinc-950 font-sans">
        <ClientProviders>
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="border-t border-zinc-200 bg-white py-8 dark:border-zinc-800 dark:bg-zinc-950 text-zinc-500 dark:text-zinc-400">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center text-sm">
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
