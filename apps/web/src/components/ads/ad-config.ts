/**
 * Ad Configuration & Zone Management
 * 
 * Centralized configuration for monetizing with networks like Adsterra, Monetag, Google AdSense, etc.
 * 
 * UX Best Practice:
 * - Keep ads transparent with "Sponsored" or "Advertisement" labels.
 * - Always reserve min-height in CSS to eliminate Cumulative Layout Shift (CLS).
 * - Never place ads over interactive tool controls, dropzones, or primary action buttons.
 */

export interface AdConfig {
  /** Master switch to enable or disable ads site-wide */
  enabled: boolean;
  /** Whether to show visual placeholder outlines when ad codes/keys are empty */
  showPlaceholders: boolean;

  /** Monetag Configuration */
  monetag: {
    enabled: boolean;
    /** Monetag MultiTag script URL or Zone ID */
    multiTagZoneId: string;
    /** Monetag In-Page Push (IPP) Zone ID */
    inPagePushZoneId: string;
    /** Monetag Vignette banner enabled */
    vignetteEnabled: boolean;
    /** Monetag Banner Zone IDs */
    bannerZones: {
      leaderboard: string; // 728x90
      rectangle: string;   // 300x250
    };
  };

  /** Adsterra Configuration */
  adsterra: {
    enabled: boolean;
    /** Social Bar (In-page notification bar - high CTR, non-intrusive) */
    socialBarScriptUrl: string;
    /** Popunder Script URL (Use with strict frequency capping for UX!) */
    popunderScriptUrl: string;
    /** Direct Link / SmartLink URL */
    directLinkUrl: string;
    /** Adsterra Display Banner Keys */
    bannerKeys: {
      leaderboard728x90: string;
      rectangle300x250: string;
      mobile320x50: string;
      nativeWidget: string;
    };
  };
}

export const adConfig: AdConfig = {
  // Enabled by default in production, can be toggled via NEXT_PUBLIC_ENABLE_ADS=false
  enabled: process.env.NEXT_PUBLIC_ENABLE_ADS !== 'false',

  // Show placeholder wireframes in development or when keys are not yet configured
  showPlaceholders: process.env.NODE_ENV === 'development' || process.env.NEXT_PUBLIC_SHOW_AD_PLACEHOLDERS === 'true',

  monetag: {
    enabled: process.env.NEXT_PUBLIC_MONETAG_ENABLED === 'true',
    // Paste your Monetag MultiTag script or Zone ID here:
    multiTagZoneId: process.env.NEXT_PUBLIC_MONETAG_ZONE_ID || '',
    inPagePushZoneId: process.env.NEXT_PUBLIC_MONETAG_IPP_ZONE || '',
    vignetteEnabled: false, // Set to true if you wish to enable Vignette overlay transitions
    bannerZones: {
      leaderboard: process.env.NEXT_PUBLIC_MONETAG_LEADERBOARD || '',
      rectangle: process.env.NEXT_PUBLIC_MONETAG_RECTANGLE || '',
    },
  },

  adsterra: {
    enabled: process.env.NEXT_PUBLIC_ADSTERRA_ENABLED === 'true',
    // Paste your Adsterra Social Bar script URL here:
    socialBarScriptUrl: process.env.NEXT_PUBLIC_ADSTERRA_SOCIAL_BAR_URL || '',
    // Popunder script (Caution: frequency cap to 1 per 24 hours to prevent UX fatigue)
    popunderScriptUrl: process.env.NEXT_PUBLIC_ADSTERRA_POPUNDER_URL || '',
    // Direct link URL for optional sponsored bonus links:
    directLinkUrl: process.env.NEXT_PUBLIC_ADSTERRA_DIRECT_LINK || '',
    bannerKeys: {
      // Paste your Adsterra 728x90 banner key here:
      leaderboard728x90: process.env.NEXT_PUBLIC_ADSTERRA_728x90_KEY || '',
      // Paste your Adsterra 300x250 medium rectangle banner key here:
      rectangle300x250: process.env.NEXT_PUBLIC_ADSTERRA_300x250_KEY || '',
      // Paste your Adsterra 320x50 mobile banner key here:
      mobile320x50: process.env.NEXT_PUBLIC_ADSTERRA_320x50_KEY || '',
      // Paste your Adsterra Native banner widget key here:
      nativeWidget: process.env.NEXT_PUBLIC_ADSTERRA_NATIVE_KEY || '',
    },
  },
};
