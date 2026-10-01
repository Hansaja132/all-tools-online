'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Loader2 } from 'lucide-react';
import { Button } from '@tools-website/ui';
import { getPdfJs } from '../utils/pdfjs-init';

interface PdfPreviewProps {
  pdfFile: File | null;
  initialPage?: number;
  onPageChange?: (page: number) => void;
  renderOverlay?: (context: CanvasRenderingContext2D, width: number, height: number, page: number) => void;
  onCanvasClick?: (normalizedX: number, normalizedY: number) => void;
}

export const PdfPreview: React.FC<PdfPreviewProps> = ({
  pdfFile,
  initialPage = 1,
  onPageChange,
  renderOverlay,
  onCanvasClick,
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [currentPage, setCurrentPage] = React.useState(initialPage);
  const [totalPages, setTotalPages] = React.useState(0);
  const [scale, setScale] = React.useState(1.0);
  const [loading, setLoading] = React.useState(false);
  const pdfDocRef = React.useRef<any>(null);

  // Load document
  React.useEffect(() => {
    let isCancelled = false;

    async function loadPdf() {
      if (!pdfFile) {
        setTotalPages(0);
        return;
      }

      try {
        setLoading(true);
        const pdfjs = await getPdfJs();
        if (!pdfjs) return;

        const arrayBuffer = await pdfFile.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;

        if (!isCancelled) {
          pdfDocRef.current = pdf;
          setTotalPages(pdf.numPages);
          setCurrentPage(1);
        }
      } catch (err) {
        console.error('Error loading PDF for preview:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    loadPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfFile]);

  // Render current page
  React.useEffect(() => {
    let renderTask: any = null;

    async function renderPage() {
      const pdf = pdfDocRef.current;
      const canvas = canvasRef.current;
      if (!pdf || !canvas) return;

      try {
        const page = await pdf.getPage(currentPage);
        const viewport = page.getViewport({ scale });
        const context = canvas.getContext('2d');
        if (!context) return;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        renderTask = page.render({ canvasContext: context, viewport });
        await renderTask.promise;

        if (renderOverlay) {
          renderOverlay(context, viewport.width, viewport.height, currentPage);
        }
      } catch (err: any) {
        if (err?.name !== 'RenderingCancelledException') {
          console.error('Error rendering page preview:', err);
        }
      }
    }

    renderPage();

    return () => {
      if (renderTask) renderTask.cancel();
    };
  }, [currentPage, scale, renderOverlay]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const next = currentPage - 1;
      setCurrentPage(next);
      onPageChange?.(next);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const next = currentPage + 1;
      setCurrentPage(next);
      onPageChange?.(next);
    }
  };

  const [isPointerDragging, setIsPointerDragging] = React.useState(false);

  const handleCanvasPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!onCanvasClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    try {
      canvas.setPointerCapture(e.pointerId);
    } catch {}
    setIsPointerDragging(true);
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const normX = Math.max(0, Math.min(1, clickX / rect.width));
    const normY = Math.max(0, Math.min(1, clickY / rect.height));
    onCanvasClick(normX, normY);
  };

  const handleCanvasPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isPointerDragging || !onCanvasClick) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const normX = Math.max(0, Math.min(1, clickX / rect.width));
    const normY = Math.max(0, Math.min(1, clickY / rect.height));
    onCanvasClick(normX, normY);
  };

  const handleCanvasPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isPointerDragging) {
      setIsPointerDragging(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch {}
    }
  };

  if (!pdfFile) return null;

  return (
    <div className="flex flex-col items-center rounded-2xl border border-zinc-200 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
      {/* Controls Bar */}
      <div className="flex w-full items-center justify-between border-b border-zinc-200 pb-3 mb-4 text-xs dark:border-zinc-800">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage <= 1}
            onClick={handlePrevPage}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <span className="font-semibold text-zinc-700 dark:text-zinc-300">
            Page {currentPage} of {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={handleNextPage}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={scale <= 0.6}
            onClick={() => setScale((s) => Math.max(0.6, s - 0.2))}
            className="h-8 w-8 p-0"
            title="Zoom Out"
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-zinc-500 font-mono">{Math.round(scale * 100)}%</span>

          <Button
            variant="ghost"
            size="sm"
            disabled={scale >= 2.0}
            onClick={() => setScale((s) => Math.min(2.0, s + 0.2))}
            className="h-8 w-8 p-0"
            title="Zoom In"
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="relative max-h-[600px] max-w-full overflow-auto rounded-lg border border-zinc-200 bg-white shadow-sm dark:border-zinc-700 dark:bg-zinc-950 p-2">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm dark:bg-zinc-900/70 z-10">
            <Loader2 className="h-6 w-6 animate-spin text-rose-500" />
          </div>
        )}
        <canvas
          ref={canvasRef}
          onPointerDown={handleCanvasPointerDown}
          onPointerMove={handleCanvasPointerMove}
          onPointerUp={handleCanvasPointerUp}
          onPointerCancel={handleCanvasPointerUp}
          style={{ touchAction: 'none' }}
          className={`mx-auto block max-w-full shadow-sm rounded ${
            onCanvasClick ? 'cursor-crosshair' : ''
          }`}
        />
      </div>
    </div>
  );
};
