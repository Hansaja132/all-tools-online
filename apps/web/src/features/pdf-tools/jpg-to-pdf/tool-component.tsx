'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@tools-website/ui';
import { ArrowUp, ArrowDown, Trash2, FilePlus, Layout, Image as ImageIcon } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  UploadedFile,
} from '../components';
import { downloadBytes, formatBytes } from '../utils/pdfjs-init';

type PageSize = 'a4' | 'letter' | 'fit';
type Orientation = 'portrait' | 'landscape' | 'auto';
type Margin = 'none' | 'small' | 'large';

const PAGE_DIMENSIONS: Record<string, [number, number]> = {
  a4: [595.28, 841.89], // pt
  letter: [612.0, 792.0], // pt
};

export const JpgToPdfTool: React.FC = () => {
  const [files, setFiles] = React.useState<UploadedFile[]>([]);
  const [pageSize, setPageSize] = React.useState<PageSize>('a4');
  const [orientation, setOrientation] = React.useState<Orientation>('auto');
  const [margin, setMargin] = React.useState<Margin>('small');
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [pdfBytes, setPdfBytes] = React.useState<Uint8Array | null>(null);
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

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= files.length) return;
    setFiles((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  const handleConvert = async () => {
    if (files.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(5);
      setStatusText('Creating empty PDF document...');

      const pdfDoc = await PDFDocument.create();
      const marginPoints = margin === 'none' ? 0 : margin === 'small' ? 20 : 40;

      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        setStatusText(`Embedding JPG ${i + 1} of ${files.length}: ${item.name}...`);
        setProgress(Math.round(((i + 1) / (files.length + 1)) * 85));

        const buffer = await item.file.arrayBuffer();
        const jpgImage = await pdfDoc.embedJpg(buffer);
        const { width: imgW, height: imgH } = jpgImage.scale(1);

        let pageWidth: number;
        let pageHeight: number;

        if (pageSize === 'fit') {
          pageWidth = imgW + marginPoints * 2;
          pageHeight = imgH + marginPoints * 2;
        } else {
          const dims = PAGE_DIMENSIONS[pageSize];
          let isLandscape = false;
          if (orientation === 'landscape') isLandscape = true;
          else if (orientation === 'auto') isLandscape = imgW > imgH;

          pageWidth = isLandscape ? dims[1] : dims[0];
          pageHeight = isLandscape ? dims[0] : dims[1];
        }

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        // Calculate fitted image dimensions maintaining aspect ratio
        const availW = pageWidth - marginPoints * 2;
        const availH = pageHeight - marginPoints * 2;
        const ratio = Math.min(availW / imgW, availH / imgH, 1.0);

        const drawW = imgW * ratio;
        const drawH = imgH * ratio;

        const posX = marginPoints + (availW - drawW) / 2;
        const posY = marginPoints + (availH - drawH) / 2;

        page.drawImage(jpgImage, {
          x: posX,
          y: posY,
          width: drawW,
          height: drawH,
        });
      }

      setStatusText('Saving PDF document...');
      setProgress(95);

      const bytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(bytes);
    } catch (err: any) {
      console.error('JPG to PDF conversion error:', err);
      setError(err?.message || 'Failed to convert JPG images to PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes) return;
    downloadBytes(pdfBytes, 'converted-images.pdf');
  };

  const handleReset = () => {
    setFiles([]);
    setPdfBytes(null);
    setError(null);
    setProgress(0);
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : pdfBytes ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename="converted-images.pdf"
          originalSize={totalSize}
          newSize={pdfBytes.length}
          pageCount={files.length}
          message="Your JPG images were converted into PDF successfully!"
        />
      ) : (
        <div className="space-y-6">
          <PdfUploader
            multiple
            accept="image/jpeg,image/jpg"
            onFilesSelected={handleFilesSelected}
            title="Drop JPG images here"
            description="Convert one or multiple JPG / JPEG photos into a polished PDF document"
          />

          {files.length > 0 && (
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-6">
              {/* Layout Options */}
              <div className="grid gap-4 sm:grid-cols-3 border-b border-zinc-100 pb-5 dark:border-zinc-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Page Size
                  </label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value as PageSize)}
                    className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="a4">A4 Standard (210 x 297 mm)</option>
                    <option value="letter">US Letter (8.5 x 11 in)</option>
                    <option value="fit">Fit Page to Image Dimensions</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Orientation
                  </label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value as Orientation)}
                    disabled={pageSize === 'fit'}
                    className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500 disabled:opacity-50"
                  >
                    <option value="auto">Auto (Match Image Aspect)</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Margins
                  </label>
                  <select
                    value={margin}
                    onChange={(e) => setMargin(e.target.value as Margin)}
                    className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                  >
                    <option value="none">No Margin (Full Bleed)</option>
                    <option value="small">Small Margin (20pt)</option>
                    <option value="large">Large Margin (40pt)</option>
                  </select>
                </div>
              </div>

              {/* Image Ordering List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                    Reorder Images ({files.length})
                  </h4>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                    Clear All
                  </Button>
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {files.map((item, index) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50/70 p-2.5 text-xs dark:border-zinc-800 dark:bg-zinc-800/40"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <span className="flex h-5 w-5 items-center justify-center rounded-md bg-rose-100 text-[11px] font-bold text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                          {index + 1}
                        </span>
                        <ImageIcon className="h-4 w-4 text-rose-500 flex-shrink-0" />
                        <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                          {item.name}
                        </span>
                        <span className="text-zinc-400">({formatBytes(item.size)})</span>
                      </div>

                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <button
                          disabled={index === 0}
                          onClick={() => handleMove(index, 'up')}
                          className="rounded p-1 text-zinc-500 hover:bg-white disabled:opacity-30 dark:hover:bg-zinc-700"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          disabled={index === files.length - 1}
                          onClick={() => handleMove(index, 'down')}
                          className="rounded p-1 text-zinc-500 hover:bg-white disabled:opacity-30 dark:hover:bg-zinc-700"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleRemoveFile(item.id)}
                          className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-950/40"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end pt-2">
                <Button
                  onClick={handleConvert}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
                >
                  <FilePlus className="mr-2 h-4 w-4" />
                  <span>Convert to PDF</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </PdfToolLayout>
  );
};
