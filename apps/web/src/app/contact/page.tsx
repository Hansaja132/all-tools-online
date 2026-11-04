import type { Metadata } from 'next';
import { siteConfig } from '@tools-website/config';

const canonical = `${siteConfig.url.replace(/\/$/, '')}/contact`;

export const metadata: Metadata = {
  title: 'Contact & Corrections',
  description: 'Contact MultiTools to report a broken tool, suggest an improvement, request a correction, or ask a privacy question.',
  alternates: { canonical },
};

export default function ContactPage() {
  const email = siteConfig.contactEmail;
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Contact &amp; corrections</h1>
      <p className="mt-5 text-lg leading-8 text-zinc-600 dark:text-zinc-300">Report a broken result, unclear instruction, accessibility problem, or privacy concern directly to the team.</p>

      <section className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/50 sm:p-8">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Email us</h2>
        <a href={`mailto:${email}`} className="mt-3 inline-block text-lg font-semibold text-violet-600 underline dark:text-violet-400">{email}</a>
        <p className="mt-4 leading-7 text-zinc-600 dark:text-zinc-300">For a tool problem, include the page URL, browser and device, steps you took, expected result, and the error message. Do not attach confidential documents, passwords, access tokens, or personal records.</p>
      </section>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        <section>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Corrections</h2>
          <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">Point to the exact statement and explain what should change. Technical references or a reproducible example are especially helpful.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-white">Privacy requests</h2>
          <p className="mt-2 leading-7 text-zinc-600 dark:text-zinc-300">Use the subject “Privacy request.” Describe the feature involved and the request, but do not send sensitive tool inputs.</p>
        </section>
      </div>
    </article>
  );
}
