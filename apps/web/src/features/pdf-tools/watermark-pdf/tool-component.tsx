'use client';

import * as React from 'react';
import { PDFDocument, StandardFonts, rgb, degrees } from 'pdf-lib';
import { Button, Input } from '@tools-website/ui';
import { Stamp, Sparkles } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPreview,
} from '../components';
import { downloadBytes } from '../utils/pdfjs-init';

type TargetPages = 'all' | 'odd' | 'even';
type WatermarkPosition = 'center' | 'top' | 'bottom';

export const WatermarkPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [text, setText] = React.useState('CONFIDENTIAL');
  const [fontSize, setFontSize] = React.useState(48);
  const [opacity, setOpacity] = React.useState(0.3);
  const [rotation, setRotation] = React.useState(45);
  const [position, setPosition] = React.useState<WatermarkPosition>('center');
  const [targetPages, setTargetPages] = React.useState<TargetPages>('all');
  const [color, setColor] = React.useState('#ef4444'); // red default

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

  const hexToRgb = (hex: string) => {
    const clean = hex.replace('#', '');
    const r = parseInt(clean.substring(0, 2), 16) / 255;
    const g = parseInt(clean.substring(2, 4), 16) / 255;
    const b = parseInt(clean.substring(4, 6), 16) / 255;
    return rgb(isNaN(r) ? 0.8 : r, isNaN(g) ? 0.2 : g, isNaN(b) ? 0.2 : b);
  };

  const handleApplyWatermark = async () => {
    if (!file || !text.trim()) {
      setError('Please provide watermark text.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Embedding watermark font...');

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const watermarkColor = hexToRgb(color);

      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        const pageNum = i + 1;
        if (targetPages === 'odd' && pageNum % 2 === 0) continue;
        if (targetPages === 'even' && pageNum % 2 !== 0) continue;

        setStatusText(`Applying watermark to page ${pageNum} of ${totalPages}...`);
        setProgress(Math.round(10 + (pageNum / totalPages) * 75));

        const page = pdfDoc.getPage(i);
        const { width, height } = page.getSize();
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = font.heightAtSize(fontSize);

        let x = width / 2;
        let y = height / 2;

        if (position === 'top') {
          y = height - 100;
        } else if (position === 'bottom') {
          y = 100;
        }

        page.drawText(text, {
          x: x - textWidth / 2,
          y: y - textHeight / 2,
          size: fontSize,
          font,
          color: watermarkColor,
          opacity,
          rotate: degrees(rotation),
        });
      }

      setStatusText('Saving document...');
      setProgress(95);

      const savedBytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(savedBytes);
    } catch (err: any) {
      console.error('Watermark error:', err);
      setError(err?.message || 'Failed to apply watermark to PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-watermarked.pdf`);
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
          filename={`${file?.name.replace(/\.pdf$/i, '')}-watermarked.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          message="Watermark applied successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to add watermark"
          description="Add custom text watermarks with control over opacity, angle, and position"
        />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Settings Panel */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Watermark Options
              </h3>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                Change File
              </Button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Watermark Text
              </label>
              <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. CONFIDENTIAL, DRAFT, SAMPLE"
                className="text-xs font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Font Size ({fontSize}px)
                </label>
                <input
                  type="range"
                  min="16"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Opacity ({Math.round(opacity * 100)}%)
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="1.0"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-rose-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Rotation Angle ({rotation}°)
                </label>
                <input
                  type="range"
                  min="-90"
                  max="90"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value, 10))}
                  className="w-full accent-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Watermark Color
                </label>
                <div className="flex items-center space-x-2">
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="h-8 w-12 cursor-pointer rounded border border-zinc-200 bg-transparent p-0.5"
                  />
                  <span className="text-xs font-mono text-zinc-500">{color}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="center">Center Diagonal</option>
                  <option value="top">Top Header</option>
                  <option value="bottom">Bottom Footer</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Apply To Pages
                </label>
                <select
                  value={targetPages}
                  onChange={(e) => setTargetPages(e.target.value as TargetPages)}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-rose-500"
                >
                  <option value="all">All Pages</option>
                  <option value="odd">Odd Pages Only</option>
                  <option value="even">Even Pages Only</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button
                onClick={handleApplyWatermark}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
              >
                <Stamp className="mr-2 h-4 w-4" />
                <span>Apply Watermark</span>
              </Button>
            </div>
          </div>

          {/* Interactive Live Document Preview with simulated watermark */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
              Live Preview
            </h4>
            <PdfPreview
              pdfFile={file}
              renderOverlay={(ctx, w, h) => {
                ctx.save();
                ctx.translate(w / 2, position === 'top' ? 80 : position === 'bottom' ? h - 80 : h / 2);
                ctx.rotate((rotation * Math.PI) / 180);
                ctx.font = `bold ${fontSize * 0.7}px sans-serif`;
                ctx.fillStyle = color;
                ctx.globalAlpha = opacity;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(text, 0, 0);
                ctx.restore();
              }}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
