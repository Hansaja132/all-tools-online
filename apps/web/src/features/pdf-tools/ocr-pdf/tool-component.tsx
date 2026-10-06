'use client';

import * as React from 'react';
import { createWorker } from 'tesseract.js';
import { Button } from '@tools-website/ui';
import { ScanText, Copy, Check, Download, RotateCcw, AlertCircle, Sparkles } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfToolLayout,
} from '../components';
import { downloadBlob, getPdfJs } from '../utils/pdfjs-init';

interface OcrPageResult {
  pageNumber: number;
  text: string;
  confidence: number;
}

export const OcrPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [ocrResults, setOcrResults] = React.useState<OcrPageResult[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setError(null);
  };

  const handleRunOcr = async () => {
    if (!file) return;

    let worker: any = null;
    try {
      setLoading(true);
      setError(null);
      setProgress(5);
      setStatusText('Initializing neural OCR engine...');

      // Initialize Tesseract client-side worker
      worker = await createWorker('eng');

      setStatusText('Rendering PDF page canvases...');
      setProgress(15);

      const pdfjs = await getPdfJs();
      if (!pdfjs) throw new Error('PDF rendering engine could not be loaded.');

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
      const count = pdf.numPages;

      const results: OcrPageResult[] = [];

      for (let i = 1; i <= count; i++) {
        setStatusText(`Running OCR on scanned page ${i} of ${count}...`);
        setProgress(Math.round(15 + (i / count) * 80));

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // High scale for optimal OCR accuracy

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;

          // OCR the canvas image
          const { data } = await worker.recognize(canvas);
          results.push({
            pageNumber: i,
            text: data.text.trim(),
            confidence: Math.round(data.confidence || 0),
          });
        }
      }

      setOcrResults(results);
      setProgress(100);
    } catch (err: any) {
      console.error('OCR error:', err);
      setError(err?.message || 'Failed to perform OCR on this PDF.');
    } finally {
      if (worker) {
        await worker.terminate();
      }
      setLoading(false);
    }
  };

  const fullText = ocrResults
    .map((p) => `--- [OCR Page ${p.pageNumber} - Confidence: ${p.confidence}%] ---\n${p.text}\n`)
    .join('\n');

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
    downloadBlob(blob, `${baseName}-ocr-text.txt`);
  };

  const handleReset = () => {
    setFile(null);
    setOcrResults([]);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout
      error={error}
      privacyNotice="OCR character recognition runs entirely on your device CPU via WebAssembly. Your documents and recognized text are never uploaded to any server."
    >
      {loading ? (
        <PdfProgress
          progress={progress}
          statusText={statusText}
          subText="Neural character recognition is processing locally in your browser"
        />
      ) : ocrResults.length > 0 ? (
        <div className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <div>
              <div className="flex items-center space-x-2">
                <span className="rounded-full bg-cyan-100 px-2.5 py-0.5 text-[11px] font-bold text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300">
                  OCR-Generated Text
                </span>
                <span className="text-xs text-zinc-500">
                  {ocrResults.length} Scanned Pages Processed
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-500">
                Note: This text was transcribed using optical character recognition from scanned images.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleCopy} className="text-xs">
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
                <span>Download OCR TXT</span>
              </Button>

              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                <RotateCcw className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {ocrResults.map((page) => (
              <div
                key={page.pageNumber}
                className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-2"
              >
                <div className="flex items-center justify-between border-b border-zinc-100 pb-2 dark:border-zinc-800">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Page {page.pageNumber}
                    </span>
                    <span className="rounded-md bg-zinc-100 px-2 py-0.5 text-[10px] font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                      Confidence: {page.confidence}%
                    </span>
                  </div>
                  <button
                    onClick={() => navigator.clipboard.writeText(page.text)}
                    className="text-[11px] text-zinc-500 hover:text-rose-600 flex items-center space-x-1"
                  >
                    <Copy className="h-3 w-3" />
                    <span>Copy Page</span>
                  </button>
                </div>
                <p className="font-mono text-xs text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap leading-relaxed">
                  {page.text || <span className="italic text-zinc-400">(No text detected on this scanned page)</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop scanned PDF here for OCR"
          description="Transcribe non-selectable text from scanned documents using in-browser neural OCR"
        />
      ) : (
        <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {file.name}
              </h3>
              <p className="text-xs text-zinc-500">
                Ready for optical character recognition
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
              Change File
            </Button>
          </div>

          <div className="rounded-xl bg-cyan-50/70 p-4 text-xs text-cyan-900 dark:bg-cyan-950/30 dark:text-cyan-300 border border-cyan-200/80 dark:border-cyan-900/50 space-y-1.5">
            <p className="font-bold flex items-center space-x-1.5">
              <Sparkles className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              <span>Client-Side Neural Recognition</span>
            </p>
            <p className="leading-relaxed">
              Optical Character Recognition converts pixel bitmaps into editable characters directly
              on your computer. OCR output will be clearly distinguished from native digital text so
              you can proofread accuracy.
            </p>
          </div>

          <Button
            onClick={handleRunOcr}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
          >
            <ScanText className="mr-2 h-4 w-4" />
            <span>Start Optical Character Recognition (OCR)</span>
          </Button>
        </div>
      )}
    </PdfToolLayout>
  );
};
