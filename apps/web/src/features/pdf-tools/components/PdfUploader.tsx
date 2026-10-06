'use client';

import * as React from 'react';
import { UploadCloud, File, X, AlertCircle } from 'lucide-react';
import { Button } from '@tools-website/ui';
import { formatBytes } from '../utils/pdfjs-init';

export interface UploadedFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

interface PdfUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  onFilesSelected: (files: File[]) => void;
  files?: UploadedFile[];
  onRemoveFile?: (id: string) => void;
  onClearFiles?: () => void;
  title?: string;
  description?: string;
}

export const PdfUploader: React.FC<PdfUploaderProps> = ({
  accept = '.pdf,application/pdf',
  multiple = false,
  maxFiles = 50,
  onFilesSelected,
  files = [],
  onRemoveFile,
  onClearFiles,
  title = 'Drop your PDF files here',
  description = 'or click to browse from your device',
}) => {
  const [isDragging, setIsDragging] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const validateAndAddFiles = (fileList: FileList | File[]) => {
    setError(null);
    const validFiles: File[] = [];
    const isImageUploader = accept.includes('image');

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      if (isImageUploader) {
        if (!file.type.startsWith('image/')) {
          setError(`File "${file.name}" is not a supported image file.`);
          continue;
        }
      } else {
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
          setError(`File "${file.name}" is not a valid PDF document.`);
          continue;
        }
      }
      validFiles.push(file);
    }

    if (validFiles.length > 0) {
      if (!multiple) {
        onFilesSelected([validFiles[0]]);
      } else {
        if (files.length + validFiles.length > maxFiles) {
          setError(`You can upload a maximum of ${maxFiles} files.`);
          onFilesSelected(validFiles.slice(0, maxFiles - files.length));
        } else {
          onFilesSelected(validFiles);
        }
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndAddFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndAddFiles(e.target.files);
      // Reset input value so same file can be re-selected if deleted
      e.target.value = '';
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label="Upload PDF files"
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/50 ${
          isDragging
            ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/20 scale-[0.99]'
            : 'border-zinc-300 hover:border-rose-400 bg-zinc-50/50 hover:bg-zinc-100/50 dark:border-zinc-700 dark:bg-zinc-900/30 dark:hover:bg-zinc-900/60'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-zinc-200 dark:bg-zinc-800 dark:ring-zinc-700">
          <UploadCloud className="h-8 w-8 text-rose-600 dark:text-rose-400" />
        </div>

        <p className="mt-4 text-base font-semibold text-zinc-900 dark:text-zinc-100">
          {title}
        </p>
        <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
          {description} {multiple ? '(Multi-file upload supported)' : ''}
        </p>

        <span className="mt-4 inline-flex items-center rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-zinc-800 shadow-sm border border-zinc-200 dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200 hover:bg-zinc-50 transition-colors">
          Browse Files
        </span>
      </div>

      {error && (
        <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-400 text-sm">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected Files List (if multiple) */}
      {files.length > 0 && (
        <div className="rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-zinc-100 dark:border-zinc-800">
            <span className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Selected Files ({files.length})
            </span>
            {onClearFiles && (
              <Button variant="ghost" size="sm" onClick={onClearFiles} className="text-xs h-7">
                Clear All
              </Button>
            )}
          </div>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {files.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-zinc-50 p-2 text-xs dark:bg-zinc-800/60"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <File className="h-4 w-4 text-rose-500 flex-shrink-0" />
                  <span className="truncate font-medium text-zinc-800 dark:text-zinc-200">
                    {item.name}
                  </span>
                  <span className="text-zinc-400 flex-shrink-0">
                    ({formatBytes(item.size)})
                  </span>
                </div>
                {onRemoveFile && (
                  <button
                    onClick={() => onRemoveFile(item.id)}
                    className="p-1 text-zinc-400 hover:text-red-500 transition-colors rounded"
                    aria-label={`Remove ${item.name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
