'use client';

import * as React from 'react';
import QRCode from 'qrcode';
import { Button, Input, Select } from '@tools-website/ui';
import { Download } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const [data, setData] = React.useState('https://www.multi-tools.app/');
  const [size, setSize] = React.useState(300);
  const [pngUrl, setPngUrl] = React.useState('');
  const [svgMarkup, setSvgMarkup] = React.useState('');
  const [error, setError] = React.useState('');

  const generateQrCode = React.useCallback(async () => {
    if (!data.trim()) {
      setPngUrl('');
      setSvgMarkup('');
      setError('Enter text or a URL to create a QR code.');
      return;
    }

    try {
      const options = { width: size, margin: 2, errorCorrectionLevel: 'M' as const };
      const [nextPngUrl, nextSvgMarkup] = await Promise.all([
        QRCode.toDataURL(data, options),
        QRCode.toString(data, { ...options, type: 'svg' }),
      ]);
      setPngUrl(nextPngUrl);
      setSvgMarkup(nextSvgMarkup);
      setError('');
    } catch {
      setPngUrl('');
      setSvgMarkup('');
      setError('This content is too long to encode as a QR code. Try shorter text.');
    }
  }, [data, size]);

  React.useEffect(() => {
    void generateQrCode();
  }, [generateQrCode]);

  const downloadData = (content: string, type: string, extension: 'png' | 'svg') => {
    const link = document.createElement('a');
    link.href = extension === 'png' ? content : URL.createObjectURL(new Blob([content], { type }));
    link.download = `qr-code-${Date.now()}.${extension}`;
    link.click();
    if (extension === 'svg') URL.revokeObjectURL(link.href);
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">QR Code Options</h3>

        <Input
          label="Text or URL"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter text or a URL..."
        />

        <div>
          <label htmlFor="qr-size" className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">PNG dimensions</label>
          <Select
            id="qr-size"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            options={[
              { label: '150 x 150 px', value: 150 },
              { label: '300 x 300 px', value: 300 },
              { label: '500 x 500 px', value: 500 },
            ]}
          />
        </div>

        <Button onClick={() => void generateQrCode()} className="w-full">
          Generate QR Code
        </Button>
        <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
          Generated locally in your browser. Your text and links are not sent to a QR service.
        </p>
      </div>

      <div className="md:col-span-2 flex flex-col items-center justify-center border border-zinc-200 rounded-xl bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
        {error ? (
          <p role="alert" className="text-sm text-red-600 dark:text-red-400">{error}</p>
        ) : pngUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800">
              <img
                src={pngUrl}
                alt={`QR code preview for ${data.slice(0, 80)}`}
                width={size}
                height={size}
                className="max-w-full"
              />
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Button onClick={() => downloadData(pngUrl, 'image/png', 'png')} className="flex items-center space-x-2">
                <Download className="h-4.5 w-4.5" />
                <span>Download PNG</span>
              </Button>
              <Button variant="outline" onClick={() => downloadData(svgMarkup, 'image/svg+xml', 'svg')} className="flex items-center space-x-2">
                <Download className="h-4.5 w-4.5" />
                <span>Download SVG</span>
              </Button>
            </div>
          </div>
        ) : (
          <p className="text-zinc-500">Preview will display here.</p>
        )}
      </div>
    </div>
  );
};
