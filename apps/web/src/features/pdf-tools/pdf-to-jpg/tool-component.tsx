'use client';

import * as React from 'react';
import JSZip from 'jszip';
import { Button } from '@tools-website/ui';
import { Image as ImageIcon, Download, FileArchive } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPageGrid,
  PageThumbnailItem,
} from '../components';
import { downloadBlob, getPdfJs } from '../utils/pdfjs-init';

export const PdfToJpgTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PageThumbnailItem[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [zipBlob, setZipBlob] = React.useState<Blob | null>(null);
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

      const pdfjs = await getPdfJs();
      if (!pdfjs) throw new Error('PDF reader could not be loaded.');

      const buffer = await selected.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
      const count = pdf.numPages;

      const items: PageThumbnailItem[] = [];
      for (let i = 1; i <= count; i++) {
        items.push({ pageNumber: i, rotation: 0, selected: true });
      }
      setPages(items);
    } catch (err: any) {
      console.error('Error loading PDF for JPG conversion:', err);
      setError('Could not read PDF. The document may be corrupted or encrypted.');
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

  const handleSelectAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: true })));
  };

  const handleDeselectAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  // Convert and download a single page directly
  const handleDownloadSinglePage = async (pageNumber: number) => {
    if (!file) return;
    try {
      setLoading(true);
      setStatusText(`Converting page ${pageNumber} to JPG...`);
      setProgress(50);

      const pdfjs = await getPdfJs();
      if (!pdfjs) return;

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
      const page = await pdf.getPage(pageNumber);

      const viewport = page.getViewport({ scale: 2.0 }); // High-def 2x rendering
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      if (ctx) {
        await page.render({ canvasContext: ctx, viewport }).promise;
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const baseName = file.name.replace(/\.pdf$/i, '');
              downloadBlob(blob, `${baseName}-page-${pageNumber}.jpg`);
            }
            setLoading(false);
          },
          'image/jpeg',
          0.92
        );
      }
    } catch (err: any) {
      console.error('Single page export error:', err);
      setError(err?.message || 'Failed to export page as JPG.');
      setLoading(false);
    }
  };

  // Convert selected pages to a ZIP archive
  const handleConvertAll = async () => {
    if (!file || pages.length === 0) return;
    const selectedPages = pages.filter((p) => p.selected);

    if (selectedPages.length === 0) {
      setError('Please select at least one page to convert.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(5);
      setStatusText('Initializing JPG conversion...');

      const pdfjs = await getPdfJs();
      if (!pdfjs) throw new Error('Could not load PDF engine.');

      const buffer = await file.arrayBuffer();
      const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
      const zip = new JSZip();
      const baseName = file.name.replace(/\.pdf$/i, '');

      for (let i = 0; i < selectedPages.length; i++) {
        const pageNum = selectedPages[i].pageNumber;
        setStatusText(`Rendering page ${pageNum} to high-res JPG (${i + 1} of ${selectedPages.length})...`);
        setProgress(Math.round(((i + 1) / selectedPages.length) * 80));

        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2.0 });

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          const rawBase64 = dataUrl.split(',')[1];
          zip.file(`${baseName}-page-${pageNum}.jpg`, rawBase64, { base64: true });
        }
      }

      setStatusText('Bundling ZIP archive...');
      setProgress(90);

      const generatedZip = await zip.generateAsync({ type: 'blob' });
      setProgress(100);

      setZipBlob(generatedZip);
    } catch (err: any) {
      console.error('Conversion error:', err);
      setError(err?.message || 'Failed to convert PDF pages to JPG.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadZip = () => {
    if (!zipBlob || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBlob(zipBlob, `${baseName}-jpg-images.zip`);
  };

  const handleReset = () => {
    setFile(null);
    setPages([]);
    setZipBlob(null);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : zipBlob ? (
        <PdfDownload
          onDownload={handleDownloadZip}
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-jpg-images.zip`}
          originalSize={file?.size}
          newSize={zipBlob.size}
          isZip
          message="All selected pages converted to JPG!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to convert to JPG"
          description="Convert document pages into crisp, high-resolution JPEG images"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Select Pages to Convert
              </h3>
              <p className="text-xs text-zinc-500">
                Click pages to toggle selection, or download individual pages directly below.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                Change File
              </Button>
              <Button
                onClick={handleConvertAll}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
              >
                <FileArchive className="mr-2 h-4 w-4" />
                <span>
                  Convert Selected to ZIP ({pages.filter((p) => p.selected).length})
                </span>
              </Button>
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
              customBadge={(idx) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownloadSinglePage(pages[idx].pageNumber);
                  }}
                  className="mt-1 flex items-center space-x-1 rounded-md bg-zinc-100 px-2 py-1 text-[10px] font-semibold text-zinc-700 hover:bg-rose-50 hover:text-rose-600 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700 transition-colors"
                  title="Download this page as JPG"
                >
                  <Download className="h-3 w-3" />
                  <span>JPG</span>
                </button>
              )}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
