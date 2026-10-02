'use client';

import * as React from 'react';
import Script from 'next/script';
import { adConfig } from './ad-config';

/**
 * Global Ad Network Scripts (Head/Body Injection)
 * 
 * Manages global ad network scripts for:
 * 1. Monetag MultiTag (All-in-one AI Tag)
 * 2. Monetag In-Page Push (IPP)
 * 3. Adsterra Social Bar (Sleek floating in-page push widget)
 * 4. Adsterra Popunder / OnClick (with UX frequency capping guidelines)
 * 
 * UX Protection Rules:
 * - Always load asynchronously (`strategy="afterInteractive"` or `async`).
 * - Never block initial page render or tool hydration.
 * - If using popunders, configure frequency capping in your Adsterra dashboard to 1 click per 24 hours.
 */

export function AdGlobalScripts() {
  if (!adConfig.enabled) {
    return null;
  }

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. MONETAG MULTITAG SCRIPT                                                */}
      {/* Paste your Monetag MultiTag code from your Monetag dashboard here.       */}
      {/* Example:                                                                  */}
      {/* <script src="https://alwingulla.com/88/tag.min.js" data-zone="YOUR_ZONE" async data-cfasync="false"></script> */}
      {/* ========================================================================= */}
      {adConfig.monetag.enabled && adConfig.monetag.multiTagZoneId && (
        <Script
          id="monetag-multitag"
          src={`https://alwingulla.com/88/tag.min.js`}
          data-zone={adConfig.monetag.multiTagZoneId}
          strategy="afterInteractive"
          data-cfasync="false"
        />
      )}

      {/* ========================================================================= */}
      {/* 2. ADSTERRA SOCIAL BAR SCRIPT                                             */}
      {/* Social Bar is an in-page push notification format. It floats gently in     */}
      {/* the corner and has high CTR without opening unwanted browser tabs.        */}
      {/* Example script URL from Adsterra: //pl12345678.effectivegate.com/.../invoke.js */}
      {/* ========================================================================= */}
      {adConfig.adsterra.enabled && adConfig.adsterra.socialBarScriptUrl && (
        <Script
          id="adsterra-social-bar"
          src={adConfig.adsterra.socialBarScriptUrl}
          strategy="afterInteractive"
        />
      )}

      {/* ========================================================================= */}
      {/* 3. ADSTERRA POPUNDER SCRIPT (OPTIONAL)                                    */}
      {/* WARNING FOR UX: Popunders trigger new background tabs. If enabled, ensure  */}
      {/* you set "Frequency Capping" to 1 impression per 24h in Adsterra.          */}
      {/* ========================================================================= */}
      {adConfig.adsterra.enabled && adConfig.adsterra.popunderScriptUrl && (
        <Script
          id="adsterra-popunder"
          src={adConfig.adsterra.popunderScriptUrl}
          strategy="lazyOnload"
        />
      )}
    </>
  );
}
