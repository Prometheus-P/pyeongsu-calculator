/// <reference path="../.astro/types.d.ts" />

interface ImportMetaEnv {
  readonly PUBLIC_GOOGLE_SITE_VERIFICATION: string;
  readonly PUBLIC_NAVER_SITE_VERIFICATION: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }

  // For Material Web Components
  namespace JSX {
    interface IntrinsicElements {
      'md-outlined-text-field': any;
      'md-filled-tonal-button': any;
      'md-filled-button': any;
      'md-outlined-button': any;
    }
  }
}

export {};