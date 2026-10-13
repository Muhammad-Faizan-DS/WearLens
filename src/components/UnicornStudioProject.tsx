import { useEffect, useRef } from 'react';

declare global {
  interface Window {
    UnicornStudio?: {
      isInitialized?: boolean;
      init?: () => void;
      destroy?: () => void;
    };
  }
}

export function UnicornStudioProject() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Run the exact script provided by the user
    const initUnicorn = () => {
      const u = window.UnicornStudio;
      if (u && typeof u.init === 'function') {
        try {
          u.init();
        } catch (e) {
          console.warn('UnicornStudio init note:', e);
        }
      }
    };

    if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUnicorn);
      } else {
        initUnicorn();
      }
    } else {
      window.UnicornStudio = { isInitialized: false, init: () => {} };
      const i = document.createElement('script');
      i.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.3.0/dist/unicornStudio.umd.js';
      i.async = true;
      i.onload = function () {
        if (document.readyState === 'loading') {
          document.addEventListener('DOMContentLoaded', function () {
            if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
              window.UnicornStudio.init();
            }
          });
        } else {
          if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
            window.UnicornStudio.init();
          }
        }
      };
      (document.head || document.body).appendChild(i);
    }

    const timer = setTimeout(() => {
      if (window.UnicornStudio && typeof window.UnicornStudio.init === 'function') {
        window.UnicornStudio.init();
      }
    }, 200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-lg aspect-[4/3] sm:aspect-[16/11] min-h-[420px] rounded-2xl overflow-hidden shadow-2xl hairline-border bg-[#0a0a0f] relative flex items-center justify-center">
      {/* Exact HTML element requested by user */}
      <div
        ref={containerRef}
        style={{ width: '100%', height: '100%', minHeight: '400px' }}
        data-us-project="nW3tMeZIGoPSbp6UT1s2"
        className="w-full h-full relative z-10"
      />
    </div>
  );
}
