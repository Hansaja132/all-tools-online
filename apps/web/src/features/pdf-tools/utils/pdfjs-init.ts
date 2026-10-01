'use client';

// Client-side loader for pdfjs-dist that safely sets worker source
let pdfjsPromise: Promise<any> | null = null;

export async function getPdfJs() {
  if (typeof window === 'undefined') return null;

  if (!pdfjsPromise) {
    pdfjsPromise = (async () => {
      // Dynamic import to prevent SSR bundling issues
      const pdfjs = await import('pdfjs-dist');
      if (pdfjs && !pdfjs.GlobalWorkerOptions.workerSrc) {
        // Use CDN worker matching version for Turbopack compatibility
        pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version || '3.11.174'}/pdf.worker.min.js`;
      }
      return pdfjs;
    })();
  }

  return pdfjsPromise;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

export function downloadBytes(bytes: Uint8Array, filename: string, mimeType = 'application/pdf') {
  const blob = new Blob([bytes as any], { type: mimeType });
  downloadBlob(blob, filename);
}
