import type { Metadata } from 'next';
import { siteConfig } from '@tools-website/config';

const canonical = `${siteConfig.url.replace(/\/$/, '')}/about`;

export const metadata: Metadata = {
  title: 'About MultiTools',
  description: 'Why MultiTools exists, how its browser utilities are selected, and how the site approaches privacy, testing, and maintenance.',
  alternates: { canonical },
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="border-b border-zinc-200 pb-8 dark:border-zinc-800">
        <p className="text-sm font-semibold uppercase tracking-wider text-violet-600 dark:text-violet-400">About the project</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Small utilities should be simple, useful, and transparent</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-600 dark:text-zinc-300">
          MultiTools is an independent web-utility project for common document, developer, text, image, color, and study tasks. The goal is to help someone finish a specific job without installing a large application or creating an account.
        </p>
      </header>

      <div className="mt-10 grid gap-10 text-base leading-7 text-zinc-600 dark:text-zinc-300 md:grid-cols-2">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">What earns a place here</h2>
          <p className="mt-3">A tool should produce a useful result, have understandable controls, explain its output, and handle common errors without trapping the visitor. We prioritize improving working tools over publishing large numbers of nearly identical pages.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">How privacy descriptions work</h2>
          <p className="mt-3">When a page says processing is local, the selected file or text is handled in browser memory rather than submitted to a MultiTools processing server. A tool may still download application code, fonts, or language models needed to run. See the privacy policy for the broader site practices.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Maintenance and limitations</h2>
          <p className="mt-3">Browser APIs, document formats, and dependencies change. We review behavior as tools evolve, keep instructions aligned with the visible interface, and describe important constraints such as device memory, file complexity, and output compatibility.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Corrections are welcome</h2>
          <p className="mt-3">If a result is wrong, an instruction is unclear, or a privacy statement does not match observed behavior, contact us with the page URL and steps to reproduce it. We use specific reports to correct both the tool and its explanation.</p>
        </section>
      </div>

      <aside className="mt-12 rounded-2xl border border-violet-200 bg-violet-50 p-6 dark:border-violet-900 dark:bg-violet-950/30">
        <h2 className="font-bold text-zinc-900 dark:text-white">Learn more</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-700 dark:text-zinc-300">Read our <a href="/editorial-policy" className="font-semibold text-violet-700 underline dark:text-violet-300">editorial and quality policy</a>, review the <a href="/privacy" className="font-semibold text-violet-700 underline dark:text-violet-300">privacy policy</a>, or <a href="/contact" className="font-semibold text-violet-700 underline dark:text-violet-300">send a correction</a>.</p>
      </aside>
    </article>
  );
}
