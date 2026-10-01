'use client';

import * as React from 'react';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Button, Input } from '@tools-website/ui';
import { Hash } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPreview,
} from '../components';
import { downloadBytes } from '../utils/pdfjs-init';

type VerticalPos = 'bottom' | 'top';
type HorizontalPos = 'center' | 'left' | 'right';
type NumberFormat = 'page-x-of-y' | 'page-x' | 'x';

export const AddPageNumbersTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [vertPos, setVertPos] = React.useState<VerticalPos>('bottom');
  const [horizPos, setHorizPos] = React.useState<HorizontalPos>('center');
  const [format, setFormat] = React.useState<NumberFormat>('page-x-of-y');
  const [startNumber, setStartNumber] = React.useState(1);
  const [fontSize, setFontSize] = React.useState(11);
  const [margin, setMargin] = React.useState(30);

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [pdfBytes, setPdfBytes] = React.useState<Uint8Array | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setError(null);
  };

  const getLabel = (pageNum: number, total: number) => {
    const num = pageNum + startNumber - 1;
    const tot = total + startNumber - 1;
    if (format === 'page-x-of-y') return `Page ${num} of ${tot}`;
    if (format === 'page-x') return `Page ${num}`;
    return `${num}`;
  };

  const handleApplyNumbers = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Embedding typography font...');

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const label = getLabel(i + 1, totalPages);
        const textWidth = font.widthOfTextAtSize(label, fontSize);

        let x = width / 2 - textWidth / 2;
        if (horizPos === 'left') x = margin;
        if (horizPos === 'right') x = width - margin - textWidth;

        let y = margin;
        if (vertPos === 'top') y = height - margin;

        page.drawText(label, {
          x,
          y,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });

        setProgress(Math.round(10 + ((i + 1) / totalPages) * 80));
      }

      setStatusText('Saving paginated document...');
      setProgress(95);

      const savedBytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(savedBytes);
    } catch (err: any) {
      console.error('Pagination error:', err);
      setError(err?.message || 'Failed to add page numbers to PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-numbered.pdf`);
  };

  const handleReset = () => {
    setFile(null);
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
          filename={`${file?.name.replace(/\.pdf$/i, '')}-numbered.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          message="Page numbers added successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to add page numbers"
          description="Insert customizable page numbering in headers or footers with precise alignments"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Settings Panel */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Numbering Settings
              </h3>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                Change File
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Vertical Placement
                </label>
                <select
                  value={vertPos}
                  onChange={(e) => setVertPos(e.target.value as VerticalPos)}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="bottom">Bottom (Footer)</option>
                  <option value="top">Top (Header)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Horizontal Alignment
                </label>
                <select
                  value={horizPos}
                  onChange={(e) => setHorizPos(e.target.value as HorizontalPos)}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="center">Center</option>
                  <option value="right">Right</option>
                  <option value="left">Left</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Numbering Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value as NumberFormat)}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="page-x-of-y">Page X of Y</option>
                  <option value="page-x">Page X</option>
                  <option value="x">Simple (X)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Starting Page Number
                </label>
                <Input
                  type="number"
                  min="1"
                  value={startNumber}
                  onChange={(e) => setStartNumber(parseInt(e.target.value, 10) || 1)}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Font Size ({fontSize}pt)
                </label>
                <input
                  type="range"
                  min="8"
                  max="20"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Margin Offset ({margin}pt)
                </label>
                <input
                  type="range"
                  min="15"
                  max="60"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleApplyNumbers}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
              >
                <Hash className="mr-2 h-4 w-4" />
                <span>Add Page Numbers</span>
              </Button>
            </div>
          </div>

          {/* Live Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Preview
            </h4>
            <PdfPreview
              pdfFile={file}
              renderOverlay={(ctx, w, h, pageNum) => {
                ctx.save();
                ctx.font = `${fontSize * 0.9}px sans-serif`;
                ctx.fillStyle = '#3f3f46';
                ctx.textBaseline = vertPos === 'top' ? 'top' : 'bottom';
                ctx.textAlign = horizPos;

                const label = getLabel(pageNum, 10);
                const x = horizPos === 'center' ? w / 2 : horizPos === 'left' ? margin : w - margin;
                const y = vertPos === 'top' ? margin : h - margin;

                ctx.fillText(label, x, y);
                ctx.restore();
              }}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
