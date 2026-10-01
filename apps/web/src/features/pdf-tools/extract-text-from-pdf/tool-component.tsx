'use client';

import * as React from 'react';
import { Button } from '@tools-website/ui';
import { FileText, Copy, Check, Download, RotateCcw } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfToolLayout,
} from '../components';
import { downloadBlob, getPdfJs, formatBytes } from '../utils/pdfjs-init';

interface ExtractedPageText {
  pageNumber: number;
  text: string;
}

export const ExtractTextFromPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [extractedPages, setExtractedPages] = React.useState<ExtractedPageText[]>([]);
  const [viewMode, setViewMode] = React.useState<'combined' | 'by-page'>('combined');
  const [copied, setCopied] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Initializing text reader...');

      const pdfjs = await getPdfJs();
      if (!pdfjs) throw new Error('PDF parsing engine could not be loaded.');

      const buffer = await selected.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
      const count = pdf.numPages;

      const results: ExtractedPageText[] = [];

      for (let i = 1; i <= count; i++) {
        setStatusText(`Extracting digital text from page ${i} of ${count}...`);
        setProgress(Math.round(10 + (i / count) * 85));

        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item: any) => item.str)
          .join(' ');

        results.push({ pageNumber: i, text: pageText.trim() });
      }

      setExtractedPages(results);
      setProgress(100);
    } catch (err: any) {
      console.error('Text extraction error:', err);
      setError('Could not extract text. The document may be scanned or encrypted.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const fullText = extractedPages
    .map((p) => `--- Page ${p.pageNumber} ---\n${p.text}\n`)
    .join('\n');

  const totalWords = fullText
    .split(/\s+/)
    .filter(Boolean).length;

  const handleCopy = () => {
    if (!fullText) return;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (!fullText || !file) return;
    const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBlob(blob, `${baseName}-extracted-text.txt`);
  };

  const handleReset = () => {
    setFile(null);
    setExtractedPages([]);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : extractedPages.length > 0 ? (
        <div className="space-y-6">
          {/* Header Bar with Stats & Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {file?.name}
              </h3>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-zinc-500">
                <span>{extractedPages.length} Pages</span>
                <span>•</span>
                <span>{totalWords.toLocaleString()} Words</span>
                <span>•</span>
                <span>{fullText.length.toLocaleString()} Characters</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant={viewMode === 'combined' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('combined')}
                className="text-xs"
              >
                Full Document
              </Button>

              <Button
                variant={viewMode === 'by-page' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('by-page')}
                className="text-xs"
              >
                Page-by-Page
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="text-xs"
              >
                {copied ? (
                  <>
                    <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-3.5 w-3.5" />
                    <span>Copy Text</span>
                  </>
                )}
              </Button>

              <Button
                onClick={handleDownloadTxt}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm"
              >
                <Download className="mr-1.5 h-3.5 w-3.5" />
                <span>Download TXT</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          {/* Text Output Viewer */}
          {totalWords === 0 ? (
            <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-center text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/20 dark:text-amber-300">
              <p className="font-bold">No digital selectable text was detected in this PDF.</p>
              <p className="mt-1">
                This document may be a flat image scan. Please use our <strong>PDF OCR</strong> tool
                to transcribe scanned characters using neural optical recognition.
              </p>
            </div>
          ) : viewMode === 'combined' ? (
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/30">
              <pre className="font-mono text-xs text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap leading-relaxed max-h-[500px] overflow-y-auto">
                {fullText}
              </pre>
            </div>
          ) : (
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
              {extractedPages.map((page) => (
                <div
                  key={page.pageNumber}
                  className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-2"
                >
                  <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Page {page.pageNumber}
                    </span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(page.text);
                      }}
                      className="text-[11px] text-zinc-500 hover:text-rose-600 flex items-center space-x-1"
                    >
                      <Copy className="h-3 w-3" />
                      <span>Copy Page</span>
                    </button>
                  </div>
                  <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                    {page.text || <span className="italic text-zinc-400">(No text on this page)</span>}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to extract text"
          description="Extract digital selectable text page-by-page with one-click clipboard copying and TXT exports"
        />
      )}
    </PdfToolLayout>
  );
};
