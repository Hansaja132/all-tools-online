'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button, Input } from '@tools-website/ui';
import { Layers, CheckSquare, Download } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPageGrid,
  PageThumbnailItem,
} from '../components';
import { downloadBytes } from '../utils/pdfjs-init';

export const ExtractPdfPagesTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PageThumbnailItem[]>([]);
  const [rangeInput, setRangeInput] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [pdfBytes, setPdfBytes] = React.useState<Uint8Array | null>(null);
  const [extractedPageCount, setExtractedPageCount] = React.useState(0);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);

    try {
      setLoading(true);
      setStatusText('Reading document pages...');
      setProgress(20);

      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      const items: PageThumbnailItem[] = [];
      for (let i = 1; i <= count; i++) {
        items.push({ pageNumber: i, rotation: 0, selected: false });
      }
      setPages(items);
    } catch (err: any) {
      console.error('Error loading PDF for page extraction:', err);
      setError('Could not load PDF document.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageToggle = (index: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], selected: !copy[index].selected };
      // Sync range text input
      const selectedNums = copy
        .filter((p) => p.selected)
        .map((p) => p.pageNumber);
      setRangeInput(selectedNums.join(', '));
      return copy;
    });
  };

  const handleSelectAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: true })));
    setRangeInput(`1-${pages.length}`);
  };

  const handleDeselectAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: false })));
    setRangeInput('');
  };

  const handleRangeInputChange = (val: string) => {
    setRangeInput(val);
    const selectedIndices = new Set<number>();
    const parts = val.split(',').map((p) => p.trim());

    for (const part of parts) {
      if (part.includes('-')) {
        const [startStr, endStr] = part.split('-');
        const s = parseInt(startStr, 10);
        const e = parseInt(endStr, 10);
        if (!isNaN(s) && !isNaN(e)) {
          const from = Math.max(1, Math.min(s, e));
          const to = Math.min(pages.length, Math.max(s, e));
          for (let i = from; i <= to; i++) selectedIndices.add(i);
        }
      } else {
        const num = parseInt(part, 10);
        if (!isNaN(num) && num >= 1 && num <= pages.length) {
          selectedIndices.add(num);
        }
      }
    }

    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        selected: selectedIndices.has(p.pageNumber),
      }))
    );
  };

  const handleExtract = async () => {
    if (!file) return;
    const targetPages = pages.filter((p) => p.selected);

    if (targetPages.length === 0) {
      setError('Please select at least one page to extract.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText(`Extracting ${targetPages.length} selected pages...`);

      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      const zeroBasedIndices = targetPages.map((p) => p.pageNumber - 1);
      const copied = await newDoc.copyPages(srcDoc, zeroBasedIndices);

      copied.forEach((page) => newDoc.addPage(page));
      setProgress(80);

      setStatusText('Generating new PDF...');
      const resultBytes = await newDoc.save();
      setProgress(100);

      setPdfBytes(resultBytes);
      setExtractedPageCount(copied.length);
    } catch (err: any) {
      console.error('Extract error:', err);
      setError(err?.message || 'Failed to extract selected pages.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-extracted-pages.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setPdfBytes(null);
    setRangeInput('');
    setError(null);
    setProgress(0);
  };

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : pdfBytes ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-extracted-pages.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          pageCount={extractedPageCount}
          message="Selected pages extracted into a new PDF successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to extract pages"
          description="Select specific pages visually or specify custom page ranges to generate a new document"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  Select Pages to Extract
                </h3>
                <p className="text-xs text-zinc-500">
                  Click thumbnails below to choose pages, or enter ranges manually.
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                  Change File
                </Button>
                <Button
                  onClick={handleExtract}
                  disabled={selectedCount === 0}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm"
                >
                  <Layers className="mr-1.5 h-3.5 w-3.5" />
                  <span>Extract {selectedCount} Pages</span>
                </Button>
              </div>
            </div>

            <div className="max-w-md space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Custom Page Range Input
              </label>
              <Input
                value={rangeInput}
                onChange={(e) => handleRangeInputChange(e.target.value)}
                placeholder="e.g. 1-3, 5, 8"
                className="font-mono text-xs"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <PdfPageGrid
              pdfFile={file}
              pages={pages}
              selectable
              onPageToggle={handlePageToggle}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
