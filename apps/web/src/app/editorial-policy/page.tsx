import type { Metadata } from 'next';
import { siteConfig } from '@tools-website/config';

const canonical = `${siteConfig.url.replace(/\/$/, '')}/editorial-policy`;

export const metadata: Metadata = {
  title: 'Editorial & Quality Policy',
  description: 'How MultiTools reviews tool instructions, technical claims, limitations, corrections, and advertising separation.',
  alternates: { canonical },
};

export default function EditorialPolicyPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 dark:text-white">Editorial &amp; quality policy</h1>
      <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">Last reviewed: November 4, 2026</p>

      <div className="mt-10 space-y-9 text-base leading-7 text-zinc-600 dark:text-zinc-300">
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Content has to support the tool</h2>
          <p className="mt-3">Instructions and explanations are written to help visitors complete the task on the page. We avoid publishing pages whose only purpose is to target a search phrase, and we do not create separate pages for trivial wording variations of the same utility.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Review checklist</h2>
          <p className="mt-3">A maintained tool should have a clear input and result, useful error states, instructions that match its current controls, an accurate privacy description, and disclosed limitations. Document tools are checked with ordinary sample files; generated downloads should open in an appropriate reader before behavior is described as supported.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Claims and limitations</h2>
          <p className="mt-3">We distinguish features from guarantees. Local processing does not make every file safe, output compatibility can vary, and performance depends on the visitor&apos;s browser, device memory, and input complexity. Electronic signature tools do not automatically create certificate-backed digital signatures.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Corrections and updates</h2>
          <p className="mt-3">Reports are evaluated against the current interface and a reproducible example when possible. Confirmed errors may result in a code fix, revised instructions, a clearer limitation, or removal of an unsupported claim. Contact details remain available in the site footer.</p>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Advertising separation</h2>
          <p className="mt-3">Advertising does not determine tool results or editorial conclusions. Ads, if enabled, should be visually distinguishable from navigation, tool controls, download buttons, and generated output. Payment is not accepted in exchange for disguising promotional material as an independent tool recommendation.</p>
        </section>
      </div>
    </article>
  );
}
