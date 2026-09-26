'use client';

import * as React from 'react';
import { Button, Textarea } from '@tools-website/ui';
import { Check, Clipboard, AlertCircle, Key, FileCode, CheckCircle2, XCircle } from 'lucide-react';

const SAMPLE_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyMzkwMjJ9.45P6...';

export const JWTDecoder: React.FC = () => {
  const [jwt, setJwt] = React.useState('');
  const [header, setHeader] = React.useState<string | null>(null);
  const [payload, setPayload] = React.useState<string | null>(null);
  const [signature, setSignature] = React.useState<string | null>(null);
  const [claims, setClaims] = React.useState<{
    exp?: number;
    iat?: number;
    iss?: string;
    sub?: string;
    aud?: string | string[];
    [key: string]: any;
  } | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [copiedHeader, setCopiedHeader] = React.useState(false);
  const [copiedPayload, setCopiedPayload] = React.useState(false);

  const decodeBase64Url = (str: string): string => {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const decoded = atob(base64);
    return decodeURIComponent(
      Array.from(decoded)
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
  };

  const handleParse = (token: string) => {
    const trimmed = token.trim();
    if (!trimmed) {
      setHeader(null);
      setPayload(null);
      setSignature(null);
      setClaims(null);
      setError(null);
      return;
    }

    const parts = trimmed.split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT structure. A valid JWT must consist of three dot-separated parts (Header.Payload.Signature).');
      setHeader(null);
      setPayload(null);
      setSignature(null);
      setClaims(null);
      return;
    }

    try {
      const headerStr = decodeBase64Url(parts[0]);
      const headerObj = JSON.parse(headerStr);
      setHeader(JSON.stringify(headerObj, null, 2));

      const payloadStr = decodeBase64Url(parts[1]);
      const payloadObj = JSON.parse(payloadStr);
      setPayload(JSON.stringify(payloadObj, null, 2));
      setClaims(payloadObj);

      setSignature(parts[2]);
      setError(null);
    } catch (e: any) {
      setError('Failed to decode Base64URL payload or parse JSON content.');
      setHeader(null);
      setPayload(null);
      setSignature(null);
      setClaims(null);
    }
  };

  React.useEffect(() => {
    handleParse(jwt);
  }, [jwt]);

  const handleCopyHeader = () => {
    if (!header) return;
    navigator.clipboard.writeText(header);
    setCopiedHeader(true);
    setTimeout(() => setCopiedHeader(false), 2000);
  };

  const handleCopyPayload = () => {
    if (!payload) return;
    navigator.clipboard.writeText(payload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const loadSample = () => {
    setJwt(SAMPLE_JWT);
  };

  // Expiration check helper
  const renderExpStatus = () => {
    if (!claims || typeof claims.exp !== 'number') return null;
    const now = Math.floor(Date.now() / 1000);
    const isExpired = now > claims.exp;
    const expDate = new Date(claims.exp * 1000).toLocaleString();

    return (
      <div
        className={`flex items-center space-x-2 rounded-xl p-3 border text-xs font-semibold ${
          isExpired
            ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900'
            : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900'
        }`}
      >
        {isExpired ? <XCircle className="h-4 w-4 flex-shrink-0" /> : <CheckCircle2 className="h-4 w-4 flex-shrink-0" />}
        <span>
          {isExpired ? `Expired on ${expDate}` : `Valid (Expires on ${expDate})`}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Token Input Section */}
      <div className="flex flex-col space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center space-x-2">
            <Key className="h-4 w-4 text-violet-500" />
            <span>Encoded JWT Token</span>
          </label>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={loadSample}>
              Load Sample Token
            </Button>
            {jwt && (
              <Button variant="ghost" size="sm" onClick={() => setJwt('')} className="text-zinc-400 hover:text-zinc-600">
                Clear
              </Button>
            )}
          </div>
        </div>
        <Textarea
          value={jwt}
          onChange={(e) => setJwt(e.target.value)}
          placeholder="Paste encoded JSON Web Token (ey...)"
          className="font-mono text-xs min-h-[110px] resize-y"
        />
        {error && (
          <div className="flex items-center space-x-2 rounded-lg bg-red-50 p-3 text-red-600 dark:bg-red-950/20 dark:text-red-400 text-xs font-medium">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Expiration Banner */}
      {renderExpStatus()}

      {/* Output Grid: Header & Payload */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Header Output */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-red-500 dark:text-red-400 flex items-center space-x-1.5">
              <FileCode className="h-3.5 w-3.5" />
              <span>Header: Algorithm & Token Type</span>
            </span>
            {header && (
              <Button variant="ghost" size="sm" onClick={handleCopyHeader} className="h-7 text-xs px-2">
                {copiedHeader ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}
                <span className="ml-1">{copiedHeader ? 'Copied' : 'Copy'}</span>
              </Button>
            )}
          </div>
          <Textarea
            readOnly
            value={header || ''}
            placeholder="Decoded header JSON..."
            className="font-mono text-xs min-h-[220px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-red-600 dark:text-red-400"
          />
        </div>

        {/* Payload Output */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400 flex items-center space-x-1.5">
              <FileCode className="h-3.5 w-3.5" />
              <span>Payload: Claims & User Data</span>
            </span>
            {payload && (
              <Button variant="ghost" size="sm" onClick={handleCopyPayload} className="h-7 text-xs px-2">
                {copiedPayload ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Clipboard className="h-3.5 w-3.5" />}
                <span className="ml-1">{copiedPayload ? 'Copied' : 'Copy'}</span>
              </Button>
            )}
          </div>
          <Textarea
            readOnly
            value={payload || ''}
            placeholder="Decoded payload JSON..."
            className="font-mono text-xs min-h-[220px] bg-zinc-50 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-purple-600 dark:text-purple-400"
          />
        </div>
      </div>

      {/* Signature Section */}
      {signature && (
        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/40">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-500 dark:text-cyan-400">
              Signature Hash
            </span>
            <span className="text-[11px] text-zinc-400">Client-side verify signature preview</span>
          </div>
          <p className="font-mono text-xs text-cyan-600 dark:text-cyan-400 break-all bg-white p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 dark:bg-zinc-950">
            {signature}
          </p>
        </div>
      )}
    </div>
  );
};
