'use client';

import * as React from 'react';
import { Button, Textarea, Select, Checkbox } from '@tools-website/ui';
import { Check, Clipboard, Download, FileText, RefreshCw } from 'lucide-react';

const LOREM_WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do',
  'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim',
  'ad', 'minim', 'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi',
  'aliquip', 'ex', 'ea', 'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit',
  'voluptate', 'velit', 'esse', 'cillum', 'eu', 'fugiat', 'nulla', 'pariatur', 'excepteur',
  'sint', 'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
  'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
];

export const LoremGenerator: React.FC = () => {
  const [type, setType] = React.useState<'paragraphs' | 'words' | 'sentences'>('paragraphs');
  const [count, setCount] = React.useState(3);
  const [startWithLorem, setStartWithLorem] = React.useState(true);
  const [wrapHtml, setWrapHtml] = React.useState(false);
  const [output, setOutput] = React.useState('');
  const [copied, setCopied] = React.useState(false);

  const generateWord = () => LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)];

  const generateSentence = (minWords = 8, maxWords = 15) => {
    const wordCount = Math.floor(Math.random() * (maxWords - minWords + 1)) + minWords;
    const words = Array.from({ length: wordCount }, () => generateWord());
    words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    return words.join(' ') + '.';
  };

  const generateParagraph = (minSentences = 4, maxSentences = 7) => {
    const sentenceCount = Math.floor(Math.random() * (maxSentences - minSentences + 1)) + minSentences;
    return Array.from({ length: sentenceCount }, () => generateSentence()).join(' ');
  };

  const handleGenerate = () => {
    let result = '';

    if (type === 'words') {
      const words = Array.from({ length: count }, () => generateWord());
      if (startWithLorem && words.length >= 2) {
        words[0] = 'lorem';
        words[1] = 'ipsum';
      }
      result = wrapHtml ? `<p>${words.join(' ')}</p>` : words.join(' ');
    } else if (type === 'sentences') {
      const sentences = Array.from({ length: count }, () => generateSentence());
      if (startWithLorem && sentences.length > 0) {
        sentences[0] = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.';
      }
      result = wrapHtml ? sentences.map((s) => `<p>${s}</p>`).join('\n') : sentences.join(' ');
    } else {
      const paragraphs = Array.from({ length: count }, () => generateParagraph());
      if (startWithLorem && paragraphs.length > 0) {
        paragraphs[0] =
          'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
      }
      result = wrapHtml ? paragraphs.map((p) => `<p>${p}</p>`).join('\n\n') : paragraphs.join('\n\n');
    }

    setOutput(result);
  };

  React.useEffect(() => {
    handleGenerate();
  }, [type, count, startWithLorem, wrapHtml]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lorem-ipsum-${count}-${type}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="grid gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/50 md:grid-cols-4 items-center">
        <div>
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Generate Type</label>
          <select
            value={type}
            onChange={(e: any) => setType(e.target.value)}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
          >
            <option value="paragraphs">Paragraphs</option>
            <option value="sentences">Sentences</option>
            <option value="words">Words</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-bold text-zinc-500 dark:text-zinc-400 block mb-1">Quantity ({count})</label>
          <input
            type="range"
            min="1"
            max="20"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full accent-violet-600"
          />
        </div>

        <div className="flex flex-col space-y-2 pt-3 md:pt-0">
          <label className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={startWithLorem}
              onChange={(e) => setStartWithLorem(e.target.checked)}
              className="rounded text-violet-600 focus:ring-violet-500"
            />
            <span>Start with "Lorem ipsum..."</span>
          </label>
          <label className="flex items-center space-x-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={wrapHtml}
              onChange={(e) => setWrapHtml(e.target.checked)}
              className="rounded text-violet-600 focus:ring-violet-500"
            />
            <span>Wrap with &lt;p&gt; HTML tags</span>
          </label>
        </div>

        <div className="flex space-x-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleGenerate} className="flex items-center space-x-1.5 w-full">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Regenerate</span>
          </Button>
        </div>
      </div>

      {/* Output Section */}
      <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center space-x-1.5">
            <FileText className="h-3.5 w-3.5 text-violet-500" />
            <span>Generated Text Content</span>
          </span>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCopy} className="h-8 text-xs">
              {copied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}
              <span className="ml-1.5">{copied ? 'Copied' : 'Copy'}</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="h-8 text-xs">
              <Download className="h-3.5 w-3.5" />
              <span className="ml-1.5">Download TXT</span>
            </Button>
          </div>
        </div>
        <Textarea
          readOnly
          value={output}
          className="font-sans text-sm min-h-[300px] leading-relaxed bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
        />
      </div>
    </div>
  );
};
