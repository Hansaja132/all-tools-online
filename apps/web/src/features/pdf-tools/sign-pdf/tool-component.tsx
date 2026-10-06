'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button, Input } from '@tools-website/ui';
import { PenTool, Type, Upload, FileCheck, Eraser, Crosshair } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
  PdfPreview,
} from '../components';
import { downloadBytes, formatBytes } from '../utils/pdfjs-init';

type SignMode = 'draw' | 'type' | 'upload';
type SignaturePlacement = 'bottom-right' | 'bottom-left' | 'bottom-center' | 'top-right' | 'custom';

export const SignPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [signMode, setSignMode] = React.useState<SignMode>('draw');
  const [typedName, setTypedName] = React.useState('');
  const [typedFont, setTypedFont] = React.useState<'cursive' | 'serif' | 'script'>('cursive');
  const [inkColor, setInkColor] = React.useState('#0f172a');
  const [targetPage, setTargetPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);
  const [placement, setPlacement] = React.useState<SignaturePlacement>('bottom-right');
  const [customCoords, setCustomCoords] = React.useState<{ xPercent: number; yPercent: number } | null>(null);
  const [signatureScale, setSignatureScale] = React.useState(1.0);

  // Drawing canvas
  const drawCanvasRef = React.useRef<HTMLCanvasElement>(null);
  const lastPointRef = React.useRef<{ x: number; y: number } | null>(null);
  const [isDrawing, setIsDrawing] = React.useState(false);
  const [hasDrawn, setHasDrawn] = React.useState(false);

  // Uploaded signature
  const [uploadedSigUrl, setUploadedSigUrl] = React.useState<string | null>(null);

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
      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const count = pdfDoc.getPageCount();
      setTotalPages(count);
      setTargetPage(count); // Default to last page for signatures
    } catch (e) {
      console.error(e);
    }
  };

  const handleLoadSamplePdf = async () => {
    try {
      const sampleDoc = await PDFDocument.create();
      const page = sampleDoc.addPage([595, 842]);
      const font = await sampleDoc.embedStandardFont('Helvetica' as any);
      const boldFont = await sampleDoc.embedStandardFont('Helvetica-Bold' as any);

      page.drawText('Sample Document for Electronic Signature', {
        x: 50,
        y: 780,
        size: 18,
        font: boldFont,
      });
      page.drawText('This sample document is provided to test the PDF signing tool.', {
        x: 50,
        y: 745,
        size: 11,
        font,
      });
      page.drawText('All processing happens locally in your browser with zero server uploads.', {
        x: 50,
        y: 725,
        size: 11,
        font,
      });

      page.drawText('Terms & Acknowledgment', {
        x: 50,
        y: 500,
        size: 14,
        font: boldFont,
      });
      page.drawText('By signing below, you acknowledge placement and cursor accuracy.', {
        x: 50,
        y: 475,
        size: 11,
        font,
      });

      page.drawLine({
        start: { x: 50, y: 220 },
        end: { x: 320, y: 220 },
        thickness: 1,
      });
      page.drawText('Authorized Signature', {
        x: 50,
        y: 200,
        size: 10,
        font,
      });

      const sampleBytes = await sampleDoc.save();
      const sampleFile = new File([sampleBytes as any], 'sample-agreement.pdf', {
        type: 'application/pdf',
      });
      await handleFilesSelected([sampleFile]);
    } catch (err: any) {
      console.error('Failed to create sample PDF:', err);
    }
  };

  // Accurate coordinate calculation accounting for canvas resolution vs CSS rendered size
  const getCanvasCoordinates = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  // Canvas drawing handlers using Pointer Events with pointer capture
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    setIsDrawing(true);
    setHasDrawn(true);
    const coords = getCanvasCoordinates(e);
    lastPointRef.current = coords;

    // Draw initial dot at cursor tip
    ctx.fillStyle = inkColor;
    ctx.beginPath();
    ctx.arc(coords.x, coords.y, 1.8, 0, Math.PI * 2);
    ctx.fill();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPointRef.current) return;
    e.preventDefault();
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const coords = getCanvasCoordinates(e);

    ctx.lineWidth = 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = inkColor;

    ctx.beginPath();
    ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    lastPointRef.current = coords;
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    setIsDrawing(false);
    lastPointRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {}
  };

  const clearCanvas = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    lastPointRef.current = null;
    setHasDrawn(false);
  };

  const handleSignatureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const imgFile = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedSigUrl(event.target?.result as string);
      };
      reader.readAsDataURL(imgFile);
    }
  };

  // Crop transparent whitespace around the drawn or typed signature so placement is centered on ink
  const getTrimmedCanvas = (canvas: HTMLCanvasElement): HTMLCanvasElement => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    const width = canvas.width;
    const height = canvas.height;
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;

    let minX = width;
    let minY = height;
    let maxX = -1;
    let maxY = -1;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const alpha = data[(y * width + x) * 4 + 3];
        if (alpha > 15) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
          if (y < minY) minY = y;
          if (y > maxY) maxY = y;
        }
      }
    }

    if (maxX === -1) return canvas;

    const pad = 8;
    const startX = Math.max(0, minX - pad);
    const startY = Math.max(0, minY - pad);
    const endX = Math.min(width, maxX + pad + 1);
    const endY = Math.min(height, maxY + pad + 1);

    const trimW = endX - startX;
    const trimH = endY - startY;

    const trimmed = document.createElement('canvas');
    trimmed.width = trimW;
    trimmed.height = trimH;
    const trimmedCtx = trimmed.getContext('2d');
    if (trimmedCtx) {
      trimmedCtx.drawImage(canvas, startX, startY, trimW, trimH, 0, 0, trimW, trimH);
    }
    return trimmed;
  };

  // Convert current signature (drawn, typed, or uploaded) to PNG bytes with trimmed dimensions
  const getSignaturePngData = async (): Promise<{
    buffer: ArrayBuffer;
    width: number;
    height: number;
  } | null> => {
    if (signMode === 'draw') {
      const canvas = drawCanvasRef.current;
      if (!canvas || !hasDrawn) return null;
      const trimmed = getTrimmedCanvas(canvas);
      const dataUrl = trimmed.toDataURL('image/png');
      const buffer = await fetch(dataUrl).then((r) => r.arrayBuffer());
      return { buffer, width: trimmed.width, height: trimmed.height };
    } else if (signMode === 'type') {
      if (!typedName.trim()) return null;
      const canvas = document.createElement('canvas');
      canvas.width = 500;
      canvas.height = 140;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const fontFam =
        typedFont === 'cursive'
          ? 'cursive, "Brush Script MT", "Caveat", sans-serif'
          : typedFont === 'serif'
          ? 'Georgia, serif'
          : '"Segoe Script", "Dancing Script", cursive';

      ctx.font = `italic bold 44px ${fontFam}`;
      ctx.fillStyle = inkColor;
      ctx.textBaseline = 'middle';
      ctx.textAlign = 'center';
      ctx.fillText(typedName, canvas.width / 2, canvas.height / 2);

      const trimmed = getTrimmedCanvas(canvas);
      const dataUrl = trimmed.toDataURL('image/png');
      const buffer = await fetch(dataUrl).then((r) => r.arrayBuffer());
      return { buffer, width: trimmed.width, height: trimmed.height };
    } else {
      if (!uploadedSigUrl) return null;
      const buffer = await fetch(uploadedSigUrl).then((r) => r.arrayBuffer());
      return { buffer, width: 200, height: 80 };
    }
  };

  // Handle clicking or dragging on preview document to place signature
  const handlePreviewClick = (normX: number, normY: number) => {
    setCustomCoords({ xPercent: normX, yPercent: normY });
    setPlacement('custom');
  };

  const handleApplySignature = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(10);
      setStatusText('Rasterizing signature artwork...');

      const sigData = await getSignaturePngData();
      if (!sigData) {
        setError('Please draw, type, or upload a signature first.');
        setLoading(false);
        return;
      }

      setStatusText('Embedding signature in PDF document...');
      setProgress(40);

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });
      const total = pdfDoc.getPageCount();

      const pageIdx = Math.max(0, Math.min(total - 1, targetPage - 1));
      const page = pdfDoc.getPage(pageIdx);
      const { width: pageW, height: pageH } = page.getSize();

      const pngImage = await pdfDoc.embedPng(sigData.buffer);
      const baseW = 140 * signatureScale;
      const baseH = (baseW * pngImage.height) / pngImage.width;

      let x = pageW - baseW - 50;
      let y = 60;

      if (placement === 'custom' && customCoords) {
        // Convert screen normalized coordinates (top-left origin) to PDF coordinates (bottom-left origin)
        // Ensure signature center matches cursor exactly
        x = customCoords.xPercent * pageW - baseW / 2;
        y = (1 - customCoords.yPercent) * pageH - baseH / 2;
      } else if (placement === 'bottom-left') {
        x = 50;
        y = 60;
      } else if (placement === 'bottom-center') {
        x = pageW / 2 - baseW / 2;
        y = 60;
      } else if (placement === 'top-right') {
        x = pageW - baseW - 50;
        y = pageH - baseH - 60;
      }

      // Clamp within page boundary
      x = Math.max(5, Math.min(pageW - baseW - 5, x));
      y = Math.max(5, Math.min(pageH - baseH - 5, y));

      page.drawImage(pngImage, {
        x,
        y,
        width: baseW,
        height: baseH,
      });

      setStatusText('Finalizing signed PDF...');
      setProgress(90);

      const savedBytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(savedBytes);
    } catch (err: any) {
      console.error('Signature embedding error:', err);
      setError(err?.message || 'Failed to apply signature to PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-signed.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setPdfBytes(null);
    clearCanvas();
    setUploadedSigUrl(null);
    setTypedName('');
    setCustomCoords(null);
    setPlacement('bottom-right');
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout
      error={error}
      privacyNotice="Your signature and documents are processed locally in your browser and are never uploaded to any remote server."
    >
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : pdfBytes ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-signed.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          message="Signature applied to PDF document successfully!"
        />
      ) : !file ? (
        <div className="space-y-4">
          <PdfUploader
            onFilesSelected={handleFilesSelected}
            title="Drop your PDF here to sign"
            description="Draw, type, or upload an electronic signature to stamp onto any page in your document"
          />
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              onClick={handleLoadSamplePdf}
              className="text-xs text-zinc-600 dark:text-zinc-300"
            >
              Or load a Sample Agreement PDF to test signing
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Signature Configuration */}
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                Signature Configuration
              </h3>
              <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
                Change File
              </Button>
            </div>

            {/* Mode Tabs */}
            <div className="flex rounded-xl bg-zinc-100 p-1 dark:bg-zinc-800">
              <button
                type="button"
                onClick={() => setSignMode('draw')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 ${
                  signMode === 'draw'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                <PenTool className="h-3.5 w-3.5" />
                <span>Draw</span>
              </button>

              <button
                type="button"
                onClick={() => setSignMode('type')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 ${
                  signMode === 'type'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                <Type className="h-3.5 w-3.5" />
                <span>Type</span>
              </button>

              <button
                type="button"
                onClick={() => setSignMode('upload')}
                className={`flex-1 rounded-lg py-1.5 text-xs font-semibold transition-colors flex items-center justify-center space-x-1.5 ${
                  signMode === 'upload'
                    ? 'bg-white text-zinc-900 shadow-sm dark:bg-zinc-900 dark:text-zinc-100'
                    : 'text-zinc-500 hover:text-zinc-900 dark:text-zinc-400'
                }`}
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload</span>
              </button>
            </div>

            {/* Mode Content */}
            {signMode === 'draw' && (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Draw Signature Below (1:1 Direct Tracking)
                  </label>
                  <div className="flex items-center space-x-2">
                    {/* Ink Color Selector */}
                    <div className="flex items-center rounded-lg border border-zinc-200 bg-zinc-50 p-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                      <button
                        type="button"
                        onClick={() => setInkColor('#0f172a')}
                        title="Black Ink"
                        className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                          inkColor === '#0f172a' ? 'ring-2 ring-rose-500 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full bg-slate-900 border border-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInkColor('#1d4ed8')}
                        title="Royal Blue Ink"
                        className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                          inkColor === '#1d4ed8' ? 'ring-2 ring-rose-500 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full bg-blue-700 border border-blue-600" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInkColor('#0369a1')}
                        title="Executive Navy Ink"
                        className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                          inkColor === '#0369a1' ? 'ring-2 ring-rose-500 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full bg-sky-700 border border-sky-600" />
                      </button>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearCanvas}
                      className="text-xs h-7 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                    >
                      <Eraser className="mr-1 h-3 w-3" />
                      <span>Clear</span>
                    </Button>
                  </div>
                </div>

                {/* Always high-contrast paper surface for crystal-clear signatures in both light and dark mode */}
                <div className="relative rounded-xl border-2 border-zinc-200 bg-white p-1 shadow-sm dark:border-zinc-700 dark:bg-white overflow-hidden">
                  {/* Subtle background guideline */}
                  <div className="pointer-events-none absolute bottom-4 left-6 right-6 border-b border-dashed border-zinc-200 flex items-center justify-between z-0 select-none">
                    <span className="text-[10px] font-mono text-zinc-400">✕ Sign on the line</span>
                    <span className="text-[10px] font-mono text-zinc-300">Electronic Signature Pad</span>
                  </div>

                  <canvas
                    ref={drawCanvasRef}
                    width={600}
                    height={180}
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{ touchAction: 'none' }}
                    className="w-full cursor-crosshair rounded-lg bg-transparent select-none block relative z-10"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Sign with mouse, trackpad, finger, or stylus.</span>
                  <span className="text-zinc-500 font-medium">1:1 High-Precision Ink</span>
                </div>
              </div>
            )}

            {signMode === 'type' && (
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                      Type Your Full Name
                    </label>
                    {/* Ink Color Selector */}
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => setInkColor('#0f172a')}
                        title="Black Ink"
                        className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                          inkColor === '#0f172a' ? 'ring-2 ring-rose-500 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full bg-slate-900 border border-slate-700" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setInkColor('#1d4ed8')}
                        title="Royal Blue Ink"
                        className={`h-5 w-5 rounded-md flex items-center justify-center transition-all ${
                          inkColor === '#1d4ed8' ? 'ring-2 ring-rose-500 scale-110' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full bg-blue-700 border border-blue-600" />
                      </button>
                    </div>
                  </div>
                  <Input
                    value={typedName}
                    onChange={(e) => setTypedName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="text-sm font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                    Calligraphy Style
                  </label>
                  <select
                    value={typedFont}
                    onChange={(e) => setTypedFont(e.target.value as any)}
                    className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                  >
                    <option value="cursive">Classic Cursive Script</option>
                    <option value="script">Elegant Handwriting</option>
                    <option value="serif">Formal Serif</option>
                  </select>
                </div>

                {typedName && (
                  <div className="rounded-xl border-2 border-zinc-200 bg-white p-4 text-center dark:border-zinc-700 dark:bg-white shadow-sm">
                    <span
                      style={{
                        fontFamily:
                          typedFont === 'cursive'
                            ? 'cursive, "Brush Script MT", "Caveat"'
                            : typedFont === 'serif'
                            ? 'Georgia, serif'
                            : '"Segoe Script", cursive',
                        color: inkColor,
                      }}
                      className="text-2xl font-bold italic"
                    >
                      {typedName}
                    </span>
                  </div>
                )}
              </div>
            )}

            {signMode === 'upload' && (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Upload Signature Image (PNG or JPG)
                </label>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleSignatureUpload}
                  className="block w-full text-xs text-zinc-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 dark:file:bg-rose-950 dark:file:text-rose-300"
                />
                {uploadedSigUrl && (
                  <div className="rounded-xl border border-zinc-200 p-3 bg-white text-center dark:border-zinc-800 dark:bg-zinc-900">
                    <img
                      src={uploadedSigUrl}
                      alt="Uploaded Signature"
                      className="max-h-24 mx-auto object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Placement & Target Page */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Target Page (1 to {totalPages})
                </label>
                <Input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={targetPage}
                  onChange={(e) =>
                    setTargetPage(
                      Math.max(1, Math.min(totalPages, parseInt(e.target.value, 10) || 1))
                    )
                  }
                  className="text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                  Signature Position
                </label>
                <select
                  value={placement}
                  onChange={(e) => {
                    const val = e.target.value as SignaturePlacement;
                    setPlacement(val);
                    if (val !== 'custom') setCustomCoords(null);
                  }}
                  className="h-9 w-full rounded-lg border border-zinc-200 bg-white px-2.5 text-xs text-zinc-900 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                >
                  <option value="bottom-right">Bottom-Right (Standard)</option>
                  <option value="bottom-left">Bottom-Left</option>
                  <option value="bottom-center">Bottom-Center</option>
                  <option value="top-right">Top-Right</option>
                  {placement === 'custom' && <option value="custom">Custom Clicked Location</option>}
                </select>
              </div>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center space-x-1">
              <Crosshair className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />
              <span>Tip: Click directly on the document preview to position the signature anywhere!</span>
            </p>

            {/* Scale Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                <span>Signature Size</span>
                <span>{Math.round(signatureScale * 100)}%</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.8"
                step="0.1"
                value={signatureScale}
                onChange={(e) => setSignatureScale(parseFloat(e.target.value))}
                className="w-full accent-rose-500"
              />
            </div>

            {/* Legal disclaimer */}
            <div className="rounded-xl bg-zinc-50 p-3 text-[11px] text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
              <p className="font-semibold text-zinc-700 dark:text-zinc-300 mb-0.5">
                Electronic Signature Disclaimer
              </p>
              This tool applies an electronic graphical signature. It does not generate a legally
              certified cryptographic digital certificate (PKI / Qualified Electronic Signature).
            </div>

            <Button
              onClick={handleApplySignature}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
            >
              <FileCheck className="mr-2 h-4 w-4" />
              <span>Apply Signature to PDF</span>
            </Button>
          </div>

          {/* Interactive Document Preview with live signature overlay */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                Target Page Preview (Page {targetPage})
              </h4>
              <span className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">
                Click anywhere to place signature
              </span>
            </div>

            <PdfPreview
              pdfFile={file}
              initialPage={targetPage}
              onPageChange={(p) => setTargetPage(p)}
              onCanvasClick={handlePreviewClick}
              renderOverlay={(ctx, w, h) => {
                let trimmedCanvas: HTMLCanvasElement | null = null;
                let sigAspect = 0.35;

                if (signMode === 'draw' && drawCanvasRef.current && hasDrawn) {
                  trimmedCanvas = getTrimmedCanvas(drawCanvasRef.current);
                  sigAspect = trimmedCanvas.height / trimmedCanvas.width;
                } else if (signMode === 'type' && typedName.trim()) {
                  sigAspect = 0.3;
                }

                const baseW = 140 * signatureScale;
                const baseH = Math.max(28, baseW * sigAspect);

                let posX = w - baseW - 35;
                let posY = h - baseH - 35;

                if (placement === 'custom' && customCoords) {
                  posX = customCoords.xPercent * w - baseW / 2;
                  posY = customCoords.yPercent * h - baseH / 2;
                } else if (placement === 'bottom-left') {
                  posX = 35;
                  posY = h - baseH - 35;
                } else if (placement === 'bottom-center') {
                  posX = w / 2 - baseW / 2;
                  posY = h - baseH - 35;
                } else if (placement === 'top-right') {
                  posX = w - baseW - 35;
                  posY = 35;
                }

                // Clamp within preview
                posX = Math.max(5, Math.min(w - baseW - 5, posX));
                posY = Math.max(5, Math.min(h - baseH - 5, posY));

                ctx.save();

                // Draw dashed signature placement box
                ctx.strokeStyle = '#ef4444';
                ctx.lineWidth = 1.5;
                ctx.setLineDash([4, 3]);
                ctx.strokeRect(posX, posY, baseW, baseH);

                // Draw crosshair at target center point if custom placement
                if (placement === 'custom' && customCoords) {
                  const cx = posX + baseW / 2;
                  const cy = posY + baseH / 2;
                  ctx.strokeStyle = 'rgba(239, 68, 68, 0.5)';
                  ctx.lineWidth = 1;
                  ctx.setLineDash([]);
                  ctx.beginPath();
                  ctx.moveTo(cx - 8, cy);
                  ctx.lineTo(cx + 8, cy);
                  ctx.moveTo(cx, cy - 8);
                  ctx.lineTo(cx, cy + 8);
                  ctx.stroke();
                }

                // Draw signature badge label
                ctx.fillStyle = '#ef4444';
                ctx.font = 'bold 9px sans-serif';
                ctx.fillText('Signature Placement', posX + 4, posY - 4);

                // Draw live representation if drawn, typed, or uploaded
                if (signMode === 'draw' && trimmedCanvas && hasDrawn) {
                  try {
                    ctx.drawImage(trimmedCanvas, posX, posY, baseW, baseH);
                  } catch (e) {}
                } else if (signMode === 'type' && typedName.trim()) {
                  ctx.font = `italic bold ${Math.max(14, 22 * signatureScale)}px cursive`;
                  ctx.fillStyle = inkColor;
                  ctx.textBaseline = 'middle';
                  ctx.textAlign = 'center';
                  ctx.fillText(typedName, posX + baseW / 2, posY + baseH / 2);
                } else {
                  ctx.fillStyle = 'rgba(239, 68, 68, 0.08)';
                  ctx.fillRect(posX, posY, baseW, baseH);
                  ctx.fillStyle = '#ef4444';
                  ctx.font = 'bold 11px sans-serif';
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillText('Sign Here', posX + baseW / 2, posY + baseH / 2);
                }

                ctx.restore();
              }}
            />
          </div>
        </div>
      )}
    </PdfToolLayout>
  );
};
