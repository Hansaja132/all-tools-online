import type { Metadata } from 'next';
import { siteConfig } from '@tools-website/config';

const canonical = `${siteConfig.url.replace(/\/$/, '')}/terms`;

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms governing authorized, lawful use of MultiTools and its browser-based utilities.',
  alternates: { canonical },
  openGraph: {
    title: 'Terms of Service | MultiTools',
    description: 'Terms governing authorized, lawful use of MultiTools and its browser-based utilities.',
    url: canonical,
    type: 'website',
  },
};

export default function TermsPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Terms of Service</h1>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Last updated: October 26, 2026</p>

      <div className="mt-10 space-y-9 text-base leading-7 text-zinc-600 dark:text-zinc-300">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Permitted use</h2>
          <p className="mt-3">
            You may use MultiTools for lawful personal or business tasks. You are responsible for the content you process and for having any permission, license, password, or authority required to modify it.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">PDF unlocking and security tools</h2>
          <p className="mt-3">
            The PDF unlock tool requires a valid password and is intended only for documents you own or are authorized to access and modify. You must not use MultiTools to bypass access controls, infringe rights, or process unlawfully obtained material.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Output and backups</h2>
          <p className="mt-3">
            Review generated or converted output before relying on it. Keep backups of original files. Browser compatibility, available memory, unusual file structures, and third-party PDF readers can affect results.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Availability and warranties</h2>
          <p className="mt-3">
            The service is provided on an as-available basis without a guarantee that every tool will be uninterrupted, error-free, or suitable for a particular purpose. Nothing on the site is legal, financial, medical, or security advice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Changes</h2>
          <p className="mt-3">
            Tools and these terms may be updated as the service develops. Continued use after revised terms are published constitutes acceptance of the updated terms where permitted by law.
          </p>
        </section>
      </div>
    </article>
  );
}
