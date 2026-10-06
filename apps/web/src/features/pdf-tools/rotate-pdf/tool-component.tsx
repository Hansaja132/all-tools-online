'use client';

import * as React from 'react';
import { PDFDocument, degrees } from 'pdf-lib';
import { Button } from '@tools-website/ui';
import { RotateCw, RotateCcw, Check, Save } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPageGrid,
  PageThumbnailItem,
} from '../components';
import { downloadBytes } from '../utils/pdfjs-init';

export const RotatePdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PageThumbnailItem[]>([]);
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
      setStatusText('Reading PDF pages and rotations...');
      setProgress(25);

      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();

      const items: PageThumbnailItem[] = [];
      for (let i = 0; i < count; i++) {
        const page = pdfDoc.getPage(i);
        const currentRot = page.getRotation().angle;
        items.push({
          pageNumber: i + 1,
          rotation: currentRot,
          selected: true,
        });
      }
      setPages(items);
    } catch (err: any) {
      console.error('Error loading PDF for rotation:', err);
      setError('Could not load PDF document.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleRotatePage = (index: number) => {
    setPages((prev) => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        rotation: (copy[index].rotation + 90) % 360,
      };
      return copy;
    });
  };

  const handleRotateAll = (delta: number) => {
    setPages((prev) =>
      prev.map((p) => ({
        ...p,
        rotation: (p.rotation + delta + 360) % 360,
      }))
    );
  };

  const handleSave = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Applying permanent page rotations...');

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      const pageCount = pdfDoc.getPageCount();
      for (let i = 0; i < pageCount; i++) {
        const page = pdfDoc.getPage(i);
        const targetRot = pages[i]?.rotation ?? 0;
        page.setRotation(degrees(targetRot));
        setProgress(Math.round(10 + ((i + 1) / pageCount) * 75));
      }

      setStatusText('Saving updated document...');
      setProgress(90);

      const savedBytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(savedBytes);
    } catch (err: any) {
      console.error('Rotate save error:', err);
      setError(err?.message || 'Failed to apply page rotations.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-rotated.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
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
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-rotated.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          pageCount={pages.length}
          message="PDF pages rotated permanently!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to rotate"
          description="Rotate individual pages or the entire document by 90°, 180°, or 270°"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Rotate Pages
              </h3>
              <p className="text-xs text-zinc-500">
                Click rotate on individual thumbnails or rotate all pages at once.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRotateAll(-90)}
                className="text-xs"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                <span>Rotate All Left (90°)</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRotateAll(90)}
                className="text-xs"
              >
                <RotateCw className="mr-1.5 h-3.5 w-3.5" />
                <span>Rotate All Right (90°)</span>
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleRotateAll(180)}
                className="text-xs"
              >
                <span>Rotate All 180°</span>
              </Button>

              <Button
                onClick={handleSave}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs shadow-sm"
              >
                <Save className="mr-1.5 h-3.5 w-3.5" />
                <span>Save Rotated PDF</span>
              </Button>
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40">
            <PdfPageGrid
              pdfFile={file}
              pages={pages}
              rotatable
              onPageRotate={handleRotatePage}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
