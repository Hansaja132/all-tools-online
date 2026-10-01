'use client';

import * as React from 'react';
import { Download, CheckCircle2, RotateCcw, FileText, ArrowDownRight } from 'lucide-react';
import { Button } from '@tools-website/ui';
import { formatBytes } from '../utils/pdfjs-init';

interface PdfDownloadProps {
  onDownload: () => void;
  onReset: () => void;
  filename: string;
  originalSize?: number;
  newSize?: number;
  pageCount?: number;
  message?: string;
  isZip?: boolean;
}

export const PdfDownload: React.FC<PdfDownloadProps> = ({
  onDownload,
  onReset,
  filename,
  originalSize,
  newSize,
  pageCount,
  message = 'Your file is ready for download!',
  isZip = false,
}) => {
  const reduction =
    originalSize && newSize && originalSize > newSize
      ? Math.round(((originalSize - newSize) / originalSize) * 100)
      : null;

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border border-emerald-200 bg-emerald-50/40 dark:border-emerald-950/60 dark:bg-emerald-950/20 space-y-6">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-emerald-200 dark:bg-zinc-800 dark:ring-emerald-900/40">
        <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
      </div>

      <div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {message}
        </h3>
        <p className="mt-1 text-xs font-mono text-zinc-600 dark:text-zinc-400 break-all max-w-md">
          {filename}
        </p>
      </div>

      {/* Metrics / Statistics */}
      {(originalSize !== undefined || newSize !== undefined || pageCount !== undefined) && (
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
          {originalSize !== undefined && (
            <div className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-zinc-400 block">Original Size</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {formatBytes(originalSize)}
              </span>
            </div>
          )}

          {newSize !== undefined && (
            <div className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-zinc-400 block">{isZip ? 'Archive Size' : 'Result Size'}</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {formatBytes(newSize)}
              </span>
            </div>
          )}

          {reduction !== null && (
            <div className="rounded-xl border border-emerald-300 bg-emerald-100/60 px-3.5 py-2 dark:border-emerald-900 dark:bg-emerald-950/60">
              <span className="text-emerald-700 dark:text-emerald-400 block flex items-center space-x-1">
                <span>Savings</span>
                <ArrowDownRight className="h-3 w-3" />
              </span>
              <span className="font-bold text-emerald-700 dark:text-emerald-300">
                {reduction}% Smaller
              </span>
            </div>
          )}

          {pageCount !== undefined && (
            <div className="rounded-xl border border-zinc-200 bg-white px-3.5 py-2 dark:border-zinc-800 dark:bg-zinc-900">
              <span className="text-zinc-400 block">Total Pages</span>
              <span className="font-bold text-zinc-800 dark:text-zinc-200">
                {pageCount} {pageCount === 1 ? 'Page' : 'Pages'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="flex flex-wrap items-center justify-center gap-3 w-full max-w-sm">
        <Button
          onClick={onDownload}
          className="flex-1 min-w-[160px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20"
        >
          <Download className="mr-2 h-4 w-4" />
          <span>Download {isZip ? 'ZIP Archive' : 'PDF'}</span>
        </Button>

        <Button variant="secondary" onClick={onReset} className="flex-initial">
          <RotateCcw className="mr-2 h-4 w-4" />
          <span>Start Over</span>
        </Button>
      </div>

      <p className="text-[11px] text-zinc-400">
        Processed locally in your browser • No files were uploaded
      </p>
    </div>
  );
};
