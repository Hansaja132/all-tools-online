'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@tools-website/ui';
import { Palette, Layers } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
} from '../components';
import { downloadBytes, formatBytes, getPdfJs } from '../utils/pdfjs-init';

export const GrayscalePdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [pdfBytes, setPdfBytes] = React.useState<Uint8Array | null>(null);
  const [stats, setStats] = React.useState<{ original: number; converted: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setError(null);
  };

  const handleConvertToGrayscale = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(5);
      setStatusText('Initializing grayscale renderer...');

      const pdfjs = await getPdfJs();
      if (!pdfjs) throw new Error('PDF rendering engine could not be loaded.');

      const arrayBuffer = await file.arrayBuffer();
      const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const numPages = pdf.numPages;

      const newPdf = await PDFDocument.create();

      for (let i = 1; i <= numPages; i++) {
        setStatusText(`Converting page ${i} of ${numPages} to grayscale...`);
        setProgress(Math.round(5 + (i / numPages) * 85));

        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 }); // Crisp 1.5x resolution

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (ctx) {
          await page.render({ canvasContext: ctx, viewport }).promise;

          // Convert canvas image data to grayscale using Rec. 709 luminance
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let j = 0; j < data.length; j += 4) {
            const gray = Math.round(0.299 * data[j] + 0.587 * data[j + 1] + 0.114 * data[j + 2]);
            data[j] = gray; // R
            data[j + 1] = gray; // G
            data[j + 2] = gray; // B
          }
          ctx.putImageData(imgData, 0, 0);

          const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
          const jpgBytes = await fetch(dataUrl).then((r) => r.arrayBuffer());
          const embeddedJpg = await newPdf.embedJpg(jpgBytes);

          const origViewport = page.getViewport({ scale: 1.0 });
          const newPage = newPdf.addPage([origViewport.width, origViewport.height]);
          newPage.drawImage(embeddedJpg, {
            x: 0,
            y: 0,
            width: origViewport.width,
            height: origViewport.height,
          });
        }
      }

      setStatusText('Saving monochrome PDF...');
      setProgress(95);

      const savedBytes = await newPdf.save({ useObjectStreams: true });
      setProgress(100);

      setPdfBytes(savedBytes);
      setStats({ original: file.size, converted: savedBytes.length });
    } catch (err: any) {
      console.error('Grayscale error:', err);
      setError(err?.message || 'Failed to convert PDF to grayscale.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-grayscale.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setPdfBytes(null);
    setStats(null);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : pdfBytes && stats ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-grayscale.pdf`}
          originalSize={stats.original}
          newSize={stats.converted}
          message="Color PDF successfully converted to grayscale!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your color PDF here to convert to grayscale"
          description="Convert document pages into clean black-and-white / monochrome tones to save printer ink"
        />
      ) : (
        <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {file.name}
              </h3>
              <p className="text-xs text-zinc-500">
                Current Size: {formatBytes(file.size)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
              Change File
            </Button>
          </div>

          <div className="rounded-xl bg-zinc-50 p-4 text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 space-y-2">
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">
              Why Convert to Grayscale?
            </p>
            <ul className="list-disc pl-4 space-y-1">
              <li>Save expensive color toner and prevent printer color warnings.</li>
              <li>Ensure consistent, legible black-and-white contrast for legal filings.</li>
              <li>Often reduces document size by stripping chromatic color channels.</li>
            </ul>
          </div>

          <Button
            onClick={handleConvertToGrayscale}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
          >
            <Palette className="mr-2 h-4 w-4" />
            <span>Convert Document to Grayscale</span>
          </Button>
        </div>
      )}
    </PdfToolLayout>
  );
};
