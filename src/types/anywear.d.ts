// Global installed by the Anywear try-on widget script in index.html / try-on/index.html.
declare global {
  interface Window {
    DecartWidget?: {
      open: (options?: { mobileCamera?: boolean }) => void;
    };
  }
}

export {};
