'use client';

import * as React from 'react';
import { PDFDocument } from 'pdf-lib';
import { Button, Input } from '@tools-website/ui';
import { FileEdit, Save, Info } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
} from '../components';
import { downloadBytes, formatBytes } from '../utils/pdfjs-init';

interface MetadataFields {
  title: string;
  author: string;
  subject: string;
  keywords: string;
  creator: string;
  producer: string;
}

export const EditPdfMetadataTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [metadata, setMetadata] = React.useState<MetadataFields>({
    title: '',
    author: '',
    subject: '',
    keywords: '',
    creator: '',
    producer: '',
  });

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
      setLoading(true);
      setStatusText('Reading document information dictionary...');
      setProgress(30);

      const buffer = await selected.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      const rawKeywords = pdfDoc.getKeywords();
      const keywordsFormatted = Array.isArray(rawKeywords)
        ? rawKeywords.join(', ')
        : typeof rawKeywords === 'string'
        ? rawKeywords
        : '';

      setMetadata({
        title: pdfDoc.getTitle() || '',
        author: pdfDoc.getAuthor() || '',
        subject: pdfDoc.getSubject() || '',
        keywords: keywordsFormatted,
        creator: pdfDoc.getCreator() || '',
        producer: pdfDoc.getProducer() || '',
      });
    } catch (err: any) {
      console.error('Error reading PDF metadata:', err);
      setError('Could not extract PDF metadata. The document may be corrupted or protected.');
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field: keyof MetadataFields, val: string) => {
    setMetadata((prev) => ({ ...prev, [field]: val }));
  };

  const handleSaveMetadata = async () => {
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setProgress(20);
      setStatusText('Updating document properties...');

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      pdfDoc.setTitle(metadata.title);
      pdfDoc.setAuthor(metadata.author);
      pdfDoc.setSubject(metadata.subject);

      const keywordList = metadata.keywords
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);
      pdfDoc.setKeywords(keywordList);

      pdfDoc.setCreator(metadata.creator);
      pdfDoc.setProducer(metadata.producer);

      setStatusText('Re-serializing PDF catalog...');
      setProgress(80);

      const savedBytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(savedBytes);
    } catch (err: any) {
      console.error('Metadata update error:', err);
      setError(err?.message || 'Failed to update PDF metadata.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-updated-metadata.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setMetadata({
      title: '',
      author: '',
      subject: '',
      keywords: '',
      creator: '',
      producer: '',
    });
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
          filename={`${file?.name.replace(/\.pdf$/i, '')}-updated-metadata.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          message="PDF metadata updated successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to edit metadata"
          description="View and update Title, Author, Subject, Keywords, Creator, and Producer properties"
        />
      ) : (
        <div className="max-w-2xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                {file.name}
              </h3>
              <p className="text-xs text-zinc-500">
                File Size: {formatBytes(file.size)}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-xs">
              Change File
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Document Title
              </label>
              <Input
                value={metadata.title}
                onChange={(e) => handleFieldChange('title', e.target.value)}
                placeholder="e.g. Annual Financial Report 2026"
                className="text-xs font-medium"
              />
              <p className="text-[11px] text-zinc-400">
                Displays in browser tabs and PDF reader header bars.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Author
              </label>
              <Input
                value={metadata.author}
                onChange={(e) => handleFieldChange('author', e.target.value)}
                placeholder="e.g. John Doe, Acme Corp"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Subject
              </label>
              <Input
                value={metadata.subject}
                onChange={(e) => handleFieldChange('subject', e.target.value)}
                placeholder="e.g. Financial Statements & Analysis"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Keywords (Comma Separated)
              </label>
              <Input
                value={metadata.keywords}
                onChange={(e) => handleFieldChange('keywords', e.target.value)}
                placeholder="e.g. finance, quarterly report, 2026, statements"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Creator (Application)
              </label>
              <Input
                value={metadata.creator}
                onChange={(e) => handleFieldChange('creator', e.target.value)}
                placeholder="e.g. Adobe InDesign, Microsoft Word"
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Producer (PDF Converter)
              </label>
              <Input
                value={metadata.producer}
                onChange={(e) => handleFieldChange('producer', e.target.value)}
                placeholder="e.g. Quartz PDFContext, MultiTools"
                className="text-xs"
              />
            </div>
          </div>

          <Button
            onClick={handleSaveMetadata}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
          >
            <Save className="mr-2 h-4 w-4" />
            <span>Save Updated Metadata</span>
          </Button>
        </div>
      )}
    </PdfToolLayout>
  );
};
