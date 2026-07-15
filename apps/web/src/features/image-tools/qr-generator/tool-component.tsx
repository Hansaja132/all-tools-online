'use client';

import * as React from 'react';
import { Button, Input, Select } from '@tools-website/ui';
import { Download } from 'lucide-react';

export const QRGenerator: React.FC = () => {
  const [data, setData] = React.useState('https://google.com');
  const [size, setSize] = React.useState(300);
  const [qrUrl, setQrUrl] = React.useState('');

  const handleGenerate = () => {
    if (!data.trim()) return;
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(data)}`;
    setQrUrl(url);
  };

  React.useEffect(() => {
    handleGenerate();
  }, [size]);

  const handleDownload = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${Date.now()}.png`;
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      alert('Failed to download QR code image.');
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {/* Configuration */}
      <div className="rounded-xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900/50 flex flex-col space-y-4">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">QR Code Options</h3>

        <Input
          label="Data / Link / Text"
          value={data}
          onChange={(e) => setData(e.target.value)}
          placeholder="Enter text or URL to convert..."
        />

        <div>
          <label className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">Dimension (px)</label>
          <Select
            value={size}
            onChange={(e) => setSize(Number(e.target.value))}
            options={[
              { label: '150 x 150', value: 150 },
              { label: '300 x 300', value: 300 },
              { label: '500 x 500', value: 500 },
            ]}
          />
        </div>

        <Button onClick={handleGenerate} className="w-full">
          Generate QR Code
        </Button>
      </div>

      {/* Output preview */}
      <div className="md:col-span-2 flex flex-col items-center justify-center border border-zinc-200 rounded-xl bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-950/50">
        {qrUrl ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800">
              <img
                src={qrUrl}
                alt="QR Code Preview"
                style={{ width: `${size}px`, height: `${size}px` }}
                className="max-w-full"
              />
            </div>
            <Button onClick={handleDownload} className="flex items-center space-x-2">
              <Download className="h-4.5 w-4.5" />
              <span>Download PNG</span>
            </Button>
          </div>
        ) : (
          <p className="text-zinc-500">Preview will display here...</p>
        )}
      </div>
    </div>
  );
};
