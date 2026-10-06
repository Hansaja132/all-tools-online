'use client';

import * as React from 'react';
import { RotateCw, Check, ArrowLeft, ArrowRight, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@tools-website/ui';
import { getPdfJs } from '../utils/pdfjs-init';

export interface PageThumbnailItem {
  pageNumber: number; // 1-indexed original page
  rotation: number; // 0, 90, 180, 270
  selected?: boolean;
  thumbnailUrl?: string;
}

interface PdfPageGridProps {
  pdfFile: File | null;
  pages: PageThumbnailItem[];
  onPageToggle?: (pageIndex: number) => void;
  onPageRotate?: (pageIndex: number) => void;
  onPageMove?: (fromIndex: number, toIndex: number) => void;
  onPageDelete?: (pageIndex: number) => void;
  selectable?: boolean;
  rotatable?: boolean;
  reorderable?: boolean;
  deletable?: boolean;
  onSelectAll?: () => void;
  onDeselectAll?: () => void;
  customBadge?: (pageIndex: number) => React.ReactNode;
}

export const PdfPageGrid: React.FC<PdfPageGridProps> = ({
  pdfFile,
  pages,
  onPageToggle,
  onPageRotate,
  onPageMove,
  onPageDelete,
  selectable = false,
  rotatable = false,
  reorderable = false,
  deletable = false,
  onSelectAll,
  onDeselectAll,
  customBadge,
}) => {
  const [thumbnails, setThumbnails] = React.useState<Record<number, string>>({});
  const [rendering, setRendering] = React.useState(false);
  const [renderProgress, setRenderProgress] = React.useState(0);

  // Render thumbnails using pdfjs
  React.useEffect(() => {
    let isCancelled = false;

    async function loadThumbnails() {
      if (!pdfFile) {
        setThumbnails({});
        return;
      }

      try {
        setRendering(true);
        const pdfjs = await getPdfJs();
        if (!pdfjs) return;

        const arrayBuffer = await pdfFile.arrayBuffer();
        const loadingTask = pdfjs.getDocument({ data: new Uint8Array(arrayBuffer) });
        const pdf = await loadingTask.promise;
        const total = pdf.numPages;

        const newThumbs: Record<number, string> = {};

        for (let i = 1; i <= total; i++) {
          if (isCancelled) return;
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 0.35 });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          if (context) {
            await page.render({ canvasContext: context, viewport }).promise;
            newThumbs[i] = canvas.toDataURL('image/jpeg', 0.8);
          }
          setRenderProgress(Math.round((i / total) * 100));
        }

        if (!isCancelled) {
          setThumbnails(newThumbs);
        }
      } catch (err) {
        console.error('Error generating PDF thumbnails:', err);
      } finally {
        if (!isCancelled) {
          setRendering(false);
        }
      }
    }

    loadThumbnails();

    return () => {
      isCancelled = true;
    };
  }, [pdfFile]);

  if (!pdfFile && pages.length === 0) {
    return null;
  }

  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className="w-full space-y-4">
      {/* Header controls (Select All / Deselect All / Count) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-200 pb-3 dark:border-zinc-800">
        <div className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
          Total Pages: {pages.length}
          {selectable && (
            <span className="ml-2 text-rose-600 dark:text-rose-400">
              ({selectedCount} Selected)
            </span>
          )}
        </div>

        {selectable && onSelectAll && onDeselectAll && (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={onSelectAll} className="text-xs h-7">
              Select All
            </Button>
            <Button variant="ghost" size="sm" onClick={onDeselectAll} className="text-xs h-7">
              Deselect All
            </Button>
          </div>
        )}
      </div>

      {rendering && (
        <div className="flex items-center space-x-2 text-xs text-zinc-500 py-1">
          <Loader2 className="h-3.5 w-3.5 animate-spin text-rose-500" />
          <span>Generating page previews ({renderProgress}%)...</span>
        </div>
      )}

      {/* Grid of Pages */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {pages.map((page, index) => {
          const thumbUrl = thumbnails[page.pageNumber] || page.thumbnailUrl;
          const isSelected = page.selected ?? true;

          return (
            <div
              key={`${page.pageNumber}-${index}`}
              onClick={() => selectable && onPageToggle && onPageToggle(index)}
              className={`relative flex flex-col items-center rounded-xl border bg-white p-2.5 transition-all dark:bg-zinc-900 ${
                selectable ? 'cursor-pointer' : ''
              } ${
                selectable && isSelected
                  ? 'border-rose-500 ring-2 ring-rose-500/20 shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Checkbox badge */}
              {selectable && (
                <div
                  className={`absolute top-2 left-2 z-10 flex h-5 w-5 items-center justify-center rounded-md border text-white transition-colors ${
                    isSelected
                      ? 'border-rose-500 bg-rose-500'
                      : 'border-zinc-300 bg-white dark:border-zinc-600 dark:bg-zinc-800'
                  }`}
                >
                  {isSelected && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                </div>
              )}

              {/* Custom Badge or Page Number Badge */}
              <div className="absolute top-2 right-2 z-10 rounded-md bg-zinc-900/80 px-1.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-sm">
                #{index + 1}
              </div>

              {/* Page Thumbnail Canvas/Image */}
              <div
                className="flex aspect-[1/1.414] w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 transition-transform duration-200"
                style={{
                  transform: `rotate(${page.rotation || 0}deg)`,
                }}
              >
                {thumbUrl ? (
                  <img
                    src={thumbUrl}
                    alt={`Page ${page.pageNumber}`}
                    className="h-full w-full object-contain pointer-events-none select-none shadow-sm"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-zinc-400">
                    <Loader2 className="h-4 w-4 animate-spin mb-1 text-zinc-400" />
                    <span className="text-[10px]">Loading...</span>
                  </div>
                )}
              </div>

              {/* Extra badges */}
              {customBadge && <div className="mt-1.5">{customBadge(index)}</div>}

              {/* Action Toolbar on thumbnail */}
              {(rotatable || reorderable || deletable) && (
                <div
                  className="mt-2.5 flex items-center justify-between w-full border-t border-zinc-100 pt-1.5 dark:border-zinc-800 text-xs"
                  onClick={(e) => e.stopPropagation()}
                >
                  {reorderable && (
                    <div className="flex items-center space-x-1">
                      <button
                        disabled={index === 0}
                        onClick={() => onPageMove && onPageMove(index, index - 1)}
                        className="rounded p-1 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                        title="Move Left"
                        aria-label="Move Page Left"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" />
                      </button>
                      <button
                        disabled={index === pages.length - 1}
                        onClick={() => onPageMove && onPageMove(index, index + 1)}
                        className="rounded p-1 text-zinc-500 hover:bg-zinc-100 disabled:opacity-30 dark:hover:bg-zinc-800"
                        title="Move Right"
                        aria-label="Move Page Right"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {rotatable && (
                    <button
                      onClick={() => onPageRotate && onPageRotate(index)}
                      className="rounded p-1 text-zinc-600 hover:bg-zinc-100 hover:text-rose-600 dark:text-zinc-400 dark:hover:bg-zinc-800"
                      title="Rotate 90° Clockwise"
                      aria-label="Rotate Page 90°"
                    >
                      <RotateCw className="h-3.5 w-3.5" />
                    </button>
                  )}

                  {deletable && (
                    <button
                      disabled={pages.length <= 1}
                      onClick={() => onPageDelete && onPageDelete(index)}
                      className="rounded p-1 text-zinc-400 hover:bg-red-50 hover:text-red-500 disabled:opacity-20 dark:hover:bg-red-950/30"
                      title="Remove Page"
                      aria-label="Remove Page"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
