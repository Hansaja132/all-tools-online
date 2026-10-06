'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@tools-website/ui';
import { Crop, Eye, Scissors } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPreview,
} from '../components';
import { downloadBytes } from '../utils/pdfjs-init';

export const CropPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [cropTop, setCropTop] = React.useState(30);
  const [cropBottom, setCropBottom] = React.useState(30);
  const [cropLeft, setCropLeft] = React.useState(30);
  const [cropRight, setCropRight] = React.useState(30);
  const [applyToAll, setApplyToAll] = React.useState(true);

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

  const handleCrop = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(15);
      setStatusText('Reading document coordinate system...');

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        if (!applyToAll && i > 0) break;

        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();

        // Calculate new crop box
        const newX = Math.max(0, cropLeft);
        const newY = Math.max(0, cropBottom);
        const newWidth = Math.max(50, width - cropLeft - cropRight);
        const newHeight = Math.max(50, height - cropTop - cropBottom);

        page.setCropBox(newX, newY, newWidth, newHeight);
        setProgress(Math.round(15 + ((i + 1) / totalPages) * 75));
      }

      setStatusText('Saving cropped PDF...');
      setProgress(95);

      const savedBytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(savedBytes);
    } catch (err: any) {
      console.error('Crop error:', err);
      setError(err?.message || 'Failed to crop PDF document.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-cropped.pdf`);
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
          filename={`${file?.name.replace(/\.pdf$/i, '')}-cropped.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          message="PDF margins cropped successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to crop margins"
          description="Trim blank borders and crop page boundaries with live visual preview"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Margin Configuration */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Margin Trim Settings
              </h3>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                Change File
              </Button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Top Margin Trim</span>
                  <span>{cropTop} pt</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={cropTop}
                  onChange={(e) => setCropTop(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Bottom Margin Trim</span>
                  <span>{cropBottom} pt</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={cropBottom}
                  onChange={(e) => setCropBottom(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Left Margin Trim</span>
                  <span>{cropLeft} pt</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={cropLeft}
                  onChange={(e) => setCropLeft(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  <span>Right Margin Trim</span>
                  <span>{cropRight} pt</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="150"
                  value={cropRight}
                  onChange={(e) => setCropRight(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={applyToAll}
                    onChange={(e) => setApplyToAll(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-500"
                  />
                  <span>Apply crop settings to all pages in document</span>
                </label>
              </div>
            </div>

            <Button
              onClick={handleCrop}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
            >
              <Scissors className="mr-2 h-4 w-4" />
              <span>Crop PDF Margins</span>
            </Button>
          </div>

          {/* Live Preview with Crop Boundary overlay */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Crop Preview
            </h4>
            <PdfPreview
              pdfFile={file}
              renderOverlay={(ctx, w, h) => {
                // Scale factor between PDF points and preview canvas
                const factorX = w / 600;
                const factorY = h / 800;

                const t = cropTop * factorY;
                const b = cropBottom * factorY;
                const l = cropLeft * factorX;
                const r = cropRight * factorX;

                // Draw translucent gray overlay on trimmed area
                ctx.save();
                ctx.fillStyle = 'rgba(239, 68, 68, 0.2)';
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 2;
                ctx.setLineDash([6, 4]);

                // Active uncropped boundary box
                const cropBoxW = Math.max(10, w - l - r);
                const cropBoxH = Math.max(10, h - t - b);
                ctx.strokeRect(l, t, cropBoxW, cropBoxH);

                // Tint outside areas
                ctx.fillRect(0, 0, w, t); // top
                ctx.fillRect(0, h - b, w, b); // bottom
                ctx.fillRect(0, t, l, h - t - b); // left
                ctx.fillRect(w - r, t, r, h - t - b); // right

                ctx.restore();
              }}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
