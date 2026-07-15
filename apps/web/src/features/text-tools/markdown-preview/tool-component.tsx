'use client';

import * as React from 'react';
import { Textarea } from '@tools-website/ui';

export const MarkdownPreview: React.FC = () => {
  const [markdown, setMarkdown] = React.useState(
    `# Markdown Live Preview\n\nWrite your **markdown** content in the left pane and see the *rendered HTML* update live on the right.\n\n## Features:\n- Instant live previews\n- Standard heading formatting\n- List support\n- Blockquote formatting\n\n> "Simplicity is the ultimate sophistication." — Leonardo da Vinci`
  );

  const parseMarkdown = (md: string) => {
    let html = md
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Headings
    html = html.replace(/^# (.*$)/gim, '<h1 class="text-3xl font-extrabold my-4 text-zinc-900 dark:text-white">$1</h1>');
    html = html.replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold my-3 text-zinc-900 dark:text-white">$1</h2>');
    html = html.replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold my-2 text-zinc-900 dark:text-white">$1</h3>');

    // Blockquotes
    html = html.replace(/^\s*&gt;\s+(.*$)/gim, '<blockquote class="border-l-4 border-violet-500 pl-4 py-1 italic my-4 bg-zinc-50 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400">$1</blockquote>');

    // Bold & Italics
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Unordered Lists
    html = html.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li class="ml-6 list-disc text-zinc-700 dark:text-zinc-300">$1</li>');

    // Paragraphs (split by double newlines, wrap non-HTML blocks)
    return html
      .split('\n\n')
      .map((p) => {
        if (p.trim().startsWith('<h') || p.trim().startsWith('<li') || p.trim().startsWith('<blockquote')) {
          return p;
        }
        return `<p class="my-2.5 text-zinc-700 dark:text-zinc-300">${p.replace(/\n/g, '<br />')}</p>`;
      })
      .join('\n');
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Editor */}
      <div className="flex flex-col space-y-4">
        <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Editor</label>
        <Textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          placeholder="Enter markdown syntax here..."
          className="font-mono text-sm min-h-[450px] h-full"
        />
      </div>

      {/* Preview */}
      <div className="flex flex-col space-y-4">
        <label className="text-base font-bold text-zinc-900 dark:text-zinc-100">Live Preview</label>
        <div
          dangerouslySetInnerHTML={{ __html: parseMarkdown(markdown) }}
          className="border border-zinc-200 rounded-xl bg-white p-6 min-h-[450px] overflow-y-auto dark:border-zinc-800 dark:bg-zinc-900/50 prose dark:prose-invert max-w-none"
        />
      </div>
    </div>
  );
};
