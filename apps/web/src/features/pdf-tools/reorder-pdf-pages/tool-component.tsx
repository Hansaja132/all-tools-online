'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@tools-website/ui';
import { ArrowLeftRight, Save, RotateCcw } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPageGrid,
  PageThumbnailItem,
} from '../components';
import { downloadBytes } from '../utils/pdfjs-init';

export const ReorderPdfPagesTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PageThumbnailItem[]>([]);
  const [initialPages, setInitialPages] = React.useState<PageThumbnailItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [pdfBytes, setPdfBytes] = React.useState<Uint8Array | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);

    try {
      setLoading(true);
      setStatusText('Reading PDF pages...');
      setProgress(20);

      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      const items: PageThumbnailItem[] = [];
      for (let i = 1; i <= count; i++) {
        items.push({ pageNumber: i, rotation: 0, selected: true });
      }
      setPages(items);
      setInitialPages(items);
    } catch (err: any) {
      console.error('Error loading PDF for reordering:', err);
      setError('Could not load PDF document.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handlePageMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= pages.length) return;
    setPages((prev) => {
      const copy = [...prev];
      const item = copy.splice(fromIndex, 1)[0];
      copy.splice(toIndex, 0, item);
      return copy;
    });
  };

  const handlePageDelete = (pageIndex: number) => {
    if (pages.length <= 1) return;
    setPages((prev) => prev.filter((_, idx) => idx !== pageIndex));
  };

  const handleResetOrder = () => {
    setPages(initialPages);
  };

  const handleSave = async () => {
    if (!file || pages.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Reorganizing document structure...');

      const buffer = await file.arrayBuffer();
      const srcDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const newDoc = await PDFDocument.create();

      // Copy pages in the new user sequence
      const zeroBasedIndices = pages.map((p) => p.pageNumber - 1);
      const copied = await newDoc.copyPages(srcDoc, zeroBasedIndices);

      copied.forEach((page) => newDoc.addPage(page));
      setProgress(80);

      setStatusText('Exporting reordered PDF...');
      const savedBytes = await newDoc.save();
      setProgress(100);

      setPdfBytes(savedBytes);
    } catch (err: any) {
      console.error('Reorder error:', err);
      setError(err?.message || 'Failed to reorder PDF pages.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-reordered.pdf`);
  };

  const handleResetAll = () => {
    setFile(null);
    setPages([]);
    setInitialPages([]);
    setPdfBytes(null);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : pdfBytes ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleResetAll}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-reordered.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          pageCount={pages.length}
          message="PDF pages reordered and saved successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to reorder pages"
          description="Rearrange and organize page order visually with thumbnail previews"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Organize Page Order
              </h3>
              <p className="text-xs text-zinc-500">
                Use the left/right arrows on page thumbnails to reposition pages.
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetOrder}
                className="text-xs"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                <span>Reset Order</span>
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetAll}
                className="text-xs"
              >
                Change File
              </Button>

              <Button
                onClick={handleSave}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm"
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                <span>Save Reordered PDF</span>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <PdfPageGrid
              pdfFile={file}
              pages={pages}
              reorderable
              deletable
              onPageMove={handlePageMove}
              onPageDelete={handlePageDelete}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
