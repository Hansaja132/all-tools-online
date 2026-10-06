'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import JSZip from 'jszip';
import { Button, Input } from '@tools-website/ui';
import { Split, FileArchive, CheckSquare, Layers } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPageGrid,
  PageThumbnailItem,
} from '../components';
import { downloadBlob, downloadBytes } from '../utils/pdfjs-init';

export const SplitPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PageThumbnailItem[]>([]);
  const [mode, setMode] = React.useState<'burst' | 'range'>('burst');
  const [customRange, setCustomRange] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [downloadBlobData, setDownloadBlobData] = React.useState<Blob | null>(null);
  const [downloadFilename, setDownloadFilename] = React.useState('');
  const [isZip, setIsZip] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);

    try {
      setLoading(true);
      setStatusText('Reading PDF structure...');
      setProgress(20);

      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      const items: PageThumbnailItem[] = [];
      for (let i = 1; i <= count; i++) {
        items.push({
          pageNumber: i,
          rotation: 0,
          selected: true,
        });
      }
      setPages(items);
      setCustomRange(`1-${count}`);
    } catch (err: any) {
      console.error('Error reading PDF:', err);
      setError('Could not load PDF. The document may be corrupted or protected.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageToggle = (index: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], selected: !copy[index].selected };
      return copy;
    });
  };

  const parseRanges = (str: string, maxPage: number): number[] => {
    const indices: Set<number> = new Set();
    const parts = str.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const start = parseInt(startStr, 10);
        const end = parseInt(endStr, 10);
        if (!isNaN(start) && !isNaN(end)) {
          const from = Math.max(1, Math.min(start, end));
          const to = Math.min(maxPage, Math.max(start, end));
          for (let p = from; p <= to; p++) {
            indices.add(p - 1);
          }
        }
      } else {
        const p = parseInt(part, 10);
        if (!isNaN(p) && p >= 1 && p <= maxPage) {
          indices.add(p - 1);
        }
      }
    }

    return Array.from(indices).sort((a, b) => a - b);
  };

  const handleSplit = async () => {
    if (!file || pages.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(5);
      setStatusText('Loading document for splitting...');

      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = srcDoc.getPageCount();

      if (mode === 'burst') {
        // Burst: Split into individual 1-page PDFs packaged in a ZIP
        const zip = new JSZip();
        const baseName = file.name.replace(/\.pdf$/i, '');

        for (let i = 0; i < totalPages; i++) {
          setStatusText(`Extracting page ${i + 1} of ${totalPages}...`);
          setProgress(Math.round(((i + 1) / totalPages) * 80));

          const singleDoc = await PDFDocument.create();
          const [copiedPage] = await singleDoc.copyPages(srcDoc, [i]);
          singleDoc.addPage(copiedPage);

          const pdfBytes = await singleDoc.save();
          zip.file(`${baseName}-page-${i + 1}.pdf`, pdfBytes);
        }

        setStatusText('Compressing ZIP archive...');
        setProgress(90);

        const zipBlob = await zip.generateAsync({ type: 'blob' });
        setProgress(100);

        setDownloadBlobData(zipBlob);
        setDownloadFilename(`${baseName}-split-pages.zip`);
        setIsZip(true);
      } else {
        // Range extraction
        const targetIndices = parseRanges(customRange, totalPages);
        if (targetIndices.length === 0) {
          setError('Please specify valid page ranges (e.g. "1-3, 5").');
          setLoading(false);
          return;
        }

        setStatusText(`Extracting ${targetIndices.length} specified pages...`);
        setProgress(40);

        const rangeDoc = await PDFDocument.create();
        const copied = await rangeDoc.copyPages(srcDoc, targetIndices);
        copied.forEach((p) => rangeDoc.addPage(p));

        const resultBytes = await rangeDoc.save();
        const baseName = file.name.replace(/\.pdf$/i, '');
        const blob = new Blob([resultBytes as any], { type: 'application/pdf' });

        setDownloadBlobData(blob);
        setDownloadFilename(`${baseName}-extracted-range.pdf`);
        setIsZip(false);
        setProgress(100);
      }
    } catch (err: any) {
      console.error('Split error:', err);
      setError(err?.message || 'Failed to split PDF document.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!downloadBlobData) return;
    downloadBlob(downloadBlobData, downloadFilename);
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setDownloadBlobData(null);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : downloadBlobData ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename={downloadFilename}
          originalSize={file?.size}
          newSize={downloadBlobData.size}
          isZip={isZip}
          message={isZip ? 'All pages split into individual PDFs!' : 'Selected page range exported successfully!'}
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to split"
          description="Split all pages into standalone files or extract custom intervals"
        />
      ) : (
        <div className="space-y-6">
          {/* Split Mode Selector */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-4">
            <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
              Split Configuration
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              <label
                onClick={() => setMode('burst')}
                className={`flex cursor-pointer items-start space-x-3 rounded-xl border p-4 transition-all ${
                  mode === 'burst'
                    ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500'
                    : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="split-mode"
                  checked={mode === 'burst'}
                  onChange={() => setMode('burst')}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <FileArchive className="h-4 w-4 text-rose-500" />
                    <span>Split into Individual Pages (ZIP)</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Creates an individual 1-page PDF for every page in the document.
                  </p>
                </div>
              </label>

              <label
                onClick={() => setMode('range')}
                className={`flex cursor-pointer items-start space-x-3 rounded-xl border p-4 transition-all ${
                  mode === 'range'
                    ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500'
                    : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700'
                }`}
              >
                <input
                  type="radio"
                  name="split-mode"
                  checked={mode === 'range'}
                  onChange={() => setMode('range')}
                  className="mt-1 text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <div className="flex items-center space-x-1.5 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <Layers className="h-4 w-4 text-rose-500" />
                    <span>Extract Specific Page Range</span>
                  </div>
                  <p className="mt-1 text-xs text-zinc-500">
                    Combine selected page intervals (e.g. 1-3, 5) into a new PDF.
                  </p>
                </div>
              </label>
            </div>

            {mode === 'range' && (
              <div className="pt-2 max-w-md space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Page Range (Total Pages: {pages.length})
                </label>
                <Input
                  value={customRange}
                  onChange={(e) => setCustomRange(e.target.value)}
                  placeholder="e.g. 1-3, 5, 8-10"
                  className="font-mono text-xs"
                />
                <p className="text-[11px] text-zinc-400">
                  Use hyphens for ranges and commas for separate pages.
                </p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                Choose Different File
              </Button>

              <Button
                onClick={handleSplit}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
              >
                <Split className="mr-2 h-4 w-4" />
                <span>{mode === 'burst' ? 'Split All Pages (ZIP)' : 'Extract Specified Range'}</span>
              </Button>
            </div>
          </div>

          {/* Visual Page Grid */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 mb-4">
              Document Pages Preview
            </h4>
            <PdfPageGrid
              pdfFile={file}
              pages={pages}
              selectable={false}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
