'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@tools-website/ui';
import { ArrowUp, ArrowDown, Trash2, Combine, FileText } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  UploadedFile,
} from '../components';
import { downloadBytes, formatBytes } from '../utils/pdfjs-init';

export const MergePdfTool: React.FC = () => {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [mergedPdfBytes, setMergedPdfBytes] = React.useState<Uint8Array | null>(null);
  const [mergedStats, setMergedStats] = React.useState<{
    size: number;
    pages: number;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = (newFiles: File[]) => {
    setError(null);
    const mapped: UploadedFile[] = newFiles.map((file) => ({
      id: `${file.name}-${Date.now()}-${Math.random()}`,
      file,
      name: file.name,
      size: file.size,
    }));
    setFiles((prev) => [...prev, ...mapped]);
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMoveFile = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= files.length) return;

    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleMerge = async () => {
    if (files.length < 2) {
      setError('Please select at least 2 PDF files to merge.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(5);
      setStatusText('Initializing document consolidation...');

      const mergedDoc = await PDFDocument.create();
      let totalPageCount = 0;

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setStatusText(`Loading file ${i + 1} of ${files.length}: ${item.name}...`);
        setProgress(Math.round(((i + 1) / (files.length + 1)) * 80));

        const arrayBuffer = await item.file.arrayBuffer();
        const donorDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        const copiedPages = await mergedDoc.copyPages(donorDoc, donorDoc.getPageIndices());

        copiedPages.forEach((page) => mergedDoc.addPage(page));
        totalPageCount += copiedPages.length;
      }

      setStatusText('Finalizing merged PDF...');
      setProgress(90);

      const mergedBytes = await mergedDoc.save();
      setProgress(100);

      setMergedPdfBytes(mergedBytes);
      setMergedStats({
        size: mergedBytes.length,
        pages: totalPageCount,
      });
    } catch (err: any) {
      console.error('Merge error:', err);
      setError(
        err?.message ||
          'Failed to merge PDF files. One or more files may be corrupted or password-protected.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!mergedPdfBytes) return;
    downloadBytes(mergedPdfBytes, 'merged-document.pdf');
  };

  const handleReset = () => {
    setFiles([]);
    setMergedPdfBytes(null);
    setMergedStats(null);
    setError(null);
    setProgress(0);
  };

  const totalOriginalSize = files.reduce((acc, curr) => acc + curr.size, 0);

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : mergedPdfBytes && mergedStats ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename="merged-document.pdf"
          originalSize={totalOriginalSize}
          newSize={mergedStats.size}
          pageCount={mergedStats.pages}
          message="Your merged PDF document is ready!"
        />
      ) : (
        <div className="space-y-6">
          <PdfUploader
            multiple
            accept=".pdf,application/pdf"
            onFilesSelected={handleFilesSelected}
            title="Drop multiple PDF files here to merge"
            description="Drag and drop 2 or more PDF documents to combine them into one"
          />

          {files.length > 0 && (
            <div className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    PDF Files to Combine ({files.length})
                  </h3>
                  <p className="text-xs text-zinc-500">
                    Arrange the files in the order they should appear in the combined document.
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                  Clear All
                </Button>
              </div>

              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {files.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-3 text-xs dark:border-zinc-800 dark:bg-zinc-800/40 hover:border-zinc-300 transition-colors"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-100 font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        {index + 1}
                      </span>
                      <FileText className="h-4 w-4 text-rose-500 flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100 truncate">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-zinc-400">
                          {formatBytes(item.size)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <button
                        disabled={index === 0}
                        onClick={() => handleMoveFile(index, 'up')}
                        className="rounded p-1.5 text-zinc-500 hover:bg-white hover:text-zinc-900 disabled:opacity-30 dark:hover:bg-zinc-700"
                        title="Move Up"
                        aria-label="Move Up"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={index === files.length - 1}
                        onClick={() => handleMoveFile(index, 'down')}
                        className="rounded p-1.5 text-zinc-500 hover:bg-white hover:text-zinc-900 disabled:opacity-30 dark:hover:bg-zinc-700"
                        title="Move Down"
                        aria-label="Move Down"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleRemoveFile(item.id)}
                        className="rounded p-1.5 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                        title="Remove File"
                        aria-label="Remove File"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-zinc-500">
                  Combined Size: {formatBytes(totalOriginalSize)}
                </span>

                <Button
                  onClick={handleMerge}
                  disabled={files.length < 2}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
                >
                  <Combine className="mr-2 h-4 w-4" />
                  <span>Merge {files.length} PDFs</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </PdfToolLayout>
  );
};
