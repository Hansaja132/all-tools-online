import type { Metadata } from 'next';
import { siteConfig } from '@tools-website/config';

const canonical = `${siteConfig.url.replace(/\/$/, '')}/privacy`;

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'How MultiTools handles tool inputs, browser storage, account data, advertising, and third-party services.',
  alternates: { canonical },
  openGraph: {
    title: 'Privacy Policy | MultiTools',
    description: 'How MultiTools handles tool inputs, browser storage, account data, advertising, and third-party services.',
    url: canonical,
    type: 'website',
  },
};

export default function PrivacyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Privacy Policy</h1>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Last updated: October 26, 2026</p>

      <div className="mt-10 space-y-9 text-base leading-7 text-zinc-600 dark:text-zinc-300">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Tool inputs and files</h2>
          <p className="mt-3">
            Tools described as client-side process their input in your browser. This includes the UUID, gradient, case conversion, QR code, and PDF unlock tools. Their working input is not intentionally uploaded to MultiTools by those tool interfaces. Browser limitations, extensions, or the software and network on your device remain outside our control.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Browser storage</h2>
          <p className="mt-3">
            MultiTools uses browser storage to remember settings such as your theme, favorite tools, and selected tool preferences. You can clear this data using your browser controls. Essential browser storage used for sign-in or security may be required when account features are enabled.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Accounts and communications</h2>
          <p className="mt-3">
            If you create an account, the service may process the details you provide for authentication, account management, and security. The current homepage newsletter form is a user-interface preview and does not add your address to a mailing list.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Advertising, analytics, and consent</h2>
          <p className="mt-3">
            The site identifies an intended Google AdSense publisher account in page metadata, but this codebase does not currently load an advertising or analytics script. Before advertising or non-essential tracking is activated, this policy must be updated with the providers, purposes, retention, and opt-out choices. Where required, consent must be collected before non-essential storage or personalized advertising is used.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Third-party links and future affiliate links</h2>
          <p className="mt-3">
            Links to external sites are governed by those sites&apos; policies. MultiTools does not currently include affiliate links in the inspected codebase. If affiliate recommendations are introduced, qualifying links should be clearly disclosed near the recommendation and on an updated disclosure page.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Policy updates</h2>
          <p className="mt-3">
            This notice may change when the service, vendors, or legal requirements change. The date above will be revised when material updates are published.
          </p>
        </section>
      </div>
    </article>
  );
}
