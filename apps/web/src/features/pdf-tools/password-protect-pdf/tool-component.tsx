'use client';

import * as React from 'react';
import { PDFDocument } from '@cantoo/pdf-lib';
import { Button, Input } from '@tools-website/ui';
import { Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import {
  PdfUploader,
  PdfProgress,
  PdfDownload,
  PdfToolLayout,
} from '../components';
import { downloadBytes, formatBytes } from '../utils/pdfjs-init';

export const PasswordProtectPdfTool: React.FC = () => {
  const [file, setFile] = React.useState<File | null>(null);
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

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

  const handleProtect = async () => {
    if (!file) return;

    if (!password) {
      setError('Please enter a password to protect the document.');
      return;
    }

    if (password.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('The passwords you entered do not match. Please verify.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setProgress(15);
      setStatusText('Reading PDF document...');

      const buffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(buffer, { ignoreEncryption: true });

      setStatusText('Applying client-side AES-256 encryption...');
      setProgress(60);

      // Encrypt with user and owner passwords locally in memory
      pdfDoc.encrypt({
        userPassword: password,
        ownerPassword: `${password}-owner-${Date.now()}`,
      });

      setStatusText('Generating encrypted PDF...');
      setProgress(85);

      const encryptedBytes = await pdfDoc.save();
      setProgress(100);

      setPdfBytes(encryptedBytes);
    } catch (err: any) {
      console.error('Password protection error:', err);
      setError(err?.message || 'Failed to encrypt PDF document.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!pdfBytes || !file) return;
    const baseName = file.name.replace(/\.pdf$/i, '');
    downloadBytes(pdfBytes, `${baseName}-protected.pdf`);
  };

  const handleReset = () => {
    setFile(null);
    setPassword('');
    setConfirmPassword('');
    setPdfBytes(null);
    setError(null);
    setProgress(0);
  };

  return (
    <PdfToolLayout
      error={error}
      privacyNotice="Password encryption is executed 100% locally in your browser. Your password and files are never sent over the internet."
    >
      {loading ? (
        <PdfProgress progress={progress} statusText={statusText} />
      ) : pdfBytes ? (
        <PdfDownload
          onDownload={handleDownload}
          onReset={handleReset}
          filename={`${file?.name.replace(/\.pdf$/i, '')}-protected.pdf`}
          originalSize={file?.size}
          newSize={pdfBytes.length}
          message="PDF encrypted and protected successfully!"
        />
      ) : !file ? (
        <PdfUploader
          onFilesSelected={handleFilesSelected}
          title="Drop your PDF here to password protect"
          description="Add strong AES encryption to secure your document against unauthorized viewing"
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

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Choose Document Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter a strong password..."
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
                Confirm Password
              </label>
              <Input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-type password..."
                className="text-sm"
              />
            </div>
          </div>

          <div className="rounded-xl bg-amber-50/60 p-3.5 text-xs text-amber-800 dark:bg-amber-950/20 dark:text-amber-300 border border-amber-200/60 dark:border-amber-900/40">
            <p className="font-semibold mb-1 flex items-center space-x-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>Important Security Notice</span>
            </p>
            <p className="leading-relaxed">
              Because encryption is performed client-side using industry-standard AES encryption,
              forgotten passwords cannot be recovered or reset by anyone. Please save your password
              securely.
            </p>
          </div>

          <Button
            onClick={handleProtect}
            className="w-full bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow-sm"
          >
            <Lock className="mr-2 h-4 w-4" />
            <span>Encrypt & Protect PDF</span>
          </Button>
        </div>
      )}
    </PdfToolLayout>
  );
};
