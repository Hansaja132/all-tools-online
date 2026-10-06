'use client';

import * as React from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { Button, Input } from '@tools-website/ui';
import { Unlock, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
} from '../components';
import { downloadBytes, formatBytes } from '../utils/pdfjs-init';

export const UnlockPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const [loading, setLoading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const [statusText, setStatusText] = React.useState('');
  const [unlockedBytes, setUnlockedBytes] = React.useState<Uint8Array | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleFilesSelected = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setError(null);
  };

  const handleUnlock = async () => {
    if (!file) return;

    if (!password) {
      setError('Please provide the authorized password for this document.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(20);
      setStatusText('Validating password and decrypting PDF streams...');

      const buffer = await file.arrayBuffer();

      // Load document with user password
      const pdfDoc = await PDFDocument.load(buffer, {
        password: password,
      });

      setStatusText('Removing password restrictions...');
      setProgress(70);

      // Saving without calling .encrypt() removes password protection
      const cleanBytes = await pdfDoc.save();
      setProgress(100);

      setUnlockedBytes(cleanBytes);
    } catch (err: any) {
      console.error('Unlock error:', err);
      const msg = err?.message?.toLowerCase() || '';
      if (msg.includes('password') || msg.includes('incorrect') || msg.includes('decrypt')) {
        setError('Incorrect password. Please verify the credentials and try again.');
      } else {
        setError(
          'Failed to decrypt PDF. Please ensure you entered the correct password for this document.'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!unlockedBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(unlockedBytes, `${baseName}-unlocked.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
    setUnlockedBytes(null);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout
      error={error}
      privacyNotice="Decryption is performed locally in your browser. Your password and files are never transmitted to external servers."
    >
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : unlockedBytes ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-unlocked.pdf`}
          originalSize={file?.size}
          newSize={unlockedBytes.length}
          message="Password removed successfully! The PDF can now be opened without credentials."
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your password-protected PDF here"
          description="Remove password restrictions from documents you are authorized to modify"
        />
      ) : (
        <div className="max-w-xl mx-auto rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/40 space-y-6">
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

          <div className="space-y-2">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              Enter Current Document Password
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter authorized password..."
                className="pr-10 text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div className="rounded-xl bg-zinc-50 p-3.5 text-xs text-zinc-600 dark:bg-zinc-800/60 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">
            <p className="font-semibold mb-1 flex items-center space-x-1 text-zinc-800 dark:text-zinc-200">
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>Authorization Requirement</span>
            </p>
            <p className="leading-relaxed">
              This utility is designed for users who own or are authorized to access the document.
              It uses your authorized password to permanently decrypt and save an unlocked copy. It
              does not attempt to bypass or brute-force unknown passwords.
            </p>
          </div>

          <Button
            onClick={handleUnlock}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
          >
            <Unlock className="mr-2 h-4 w-4" />
            <span>Unlock PDF</span>
          </Button>
        </div>
      )}
    </PdfToolLayout>
  );
};
