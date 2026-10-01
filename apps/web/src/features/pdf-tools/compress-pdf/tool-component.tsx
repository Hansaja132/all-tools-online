'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button } from '@tools-website/ui';
import { Minimize2, Zap, Shield, Sparkles } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
} from '../components';
import { downloadBytes, formatBytes, getPdfJs } from '../utils/pdfjs-init';

type CompressionLevel = 'low' | 'medium' | 'high';

export const CompressPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [level, setLevel] = React.useState<CompressionLevel>('medium');
  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [compressedBytes, setCompressedBytes] = React.useState<Uint8Array | null>(null);
  const [stats, setStats] = React.useState<{ original: number; compressed: number } | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Analyzing PDF structure...');

      const arrayBuffer = await file.arrayBuffer();

      if (level === 'low') {
        // Structural optimization: strip unreferenced objects, compress streams, clean catalog
        setStatusText('Optimizing object streams and metadata...');
        setProgress(40);

        const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
        // Clean metadata bloat
        pdfDoc.setProducer('MultiTools Client Compressor');
        pdfDoc.setCreator('MultiTools');

        setStatusText('Re-encoding streams...');
        setProgress(70);

        const savedBytes = await pdfDoc.save({ useObjectStreams: true });
        setProgress(100);

        setCompressedBytes(savedBytes);
        setStats({ original: file.size, compressed: savedBytes.length });
      } else {
        // Medium or High: Render pages via canvas and recompress images
        setStatusText('Loading rendering engine...');
        setProgress(20);

        const pdfjs = await getPdfJs();
        if (!pdfjs) throw new Error('PDF rendering engine could not be loaded.');

        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;

        const newPdf = await PDFDocument.create();

        // Parameters based on level
        const scale = level === 'medium' ? 1.4 : 1.1;
        const quality = level === 'medium' ? 0.78 : 0.6;

        for (let i = 1; i <= numPages; i++) {
          setStatusText(`Optimizing page ${i} of ${numPages}...`);
          setProgress(Math.round(20 + (i / numPages) * 70));

          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (ctx) {
            await page.render({ canvasContext: ctx, viewport }).promise;
            const dataUrl = canvas.toDataURL('image/jpeg', quality);
            const jpgBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
            const embeddedJpg = await newPdf.embedJpg(jpgBytes);

            // Match original page dimensions (unscaled)
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

        setStatusText('Finalizing compressed PDF...');
        setProgress(95);

        const savedBytes = await newPdf.save({ useObjectStreams: true });
        setProgress(100);

        setCompressedBytes(savedBytes);
        setStats({ original: file.size, compressed: savedBytes.length });
      }
    } catch (err: any) {
      console.error('Compression error:', err);
      setError(
        err?.message ||
          'Failed to compress PDF. The document may be encrypted or contain unsupported elements.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!compressedBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(compressedBytes, `${baseName}-compressed.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setCompressedBytes(null);
    setStats(null);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout error={error}>
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : compressedBytes && stats ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-compressed.pdf`}
          originalSize={stats.original}
          newSize={stats.compressed}
          message="PDF compressed successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to compress"
          description="Reduce PDF file size while balancing visual quality"
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {file.name}
                </h3>
                <p className="text-xs text-zinc-500">
                  Current File Size: {formatBytes(file.size)}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                Change File
              </Button>
            </div>

            {/* Compression Tier Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Select Compression Level
              </label>

              <div className="grid gap-3 sm:grid-cols-3">
                {/* Low Compression */}
                <div
                  onClick={() => setLevel('low')}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    level === 'low'
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500'
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <Shield className="h-4 w-4 text-emerald-500" />
                    <span>Low</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    Highest Quality
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
                    Optimizes internal streams and strips redundant metadata without altering images.
                  </p>
                </div>

                {/* Medium Compression */}
                <div
                  onClick={() => setLevel('medium')}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all relative ${
                    level === 'medium'
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500'
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800'
                  }`}
                >
                  <span className="absolute -top-2.5 right-3 rounded-full bg-rose-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">
                    Recommended
                  </span>
                  <div className="flex items-center space-x-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <Sparkles className="h-4 w-4 text-rose-500" />
                    <span>Medium</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-rose-600 dark:text-rose-400">
                    Balanced Savings
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
                    Ideal balance between file size reduction and clear visual readability.
                  </p>
                </div>

                {/* High Compression */}
                <div
                  onClick={() => setLevel('high')}
                  className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                    level === 'high'
                      ? 'border-rose-500 bg-rose-50/50 dark:bg-rose-950/20 ring-1 ring-rose-500'
                      : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center space-x-2 font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    <Zap className="h-4 w-4 text-amber-500" />
                    <span>High</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-amber-600 dark:text-amber-400">
                    Maximum Reduction
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-500 leading-relaxed">
                    Maximum compression for heavy scanned PDFs to easily pass strict email limits.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end pt-2">
              <Button
                onClick={handleCompress}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
              >
                <Minimize2 className="mr-2 h-4 w-4" />
                <span>Compress PDF</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
