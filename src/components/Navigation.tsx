import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

interface NavigationProps {
  onTryOn: () => void;
}

// Absolute paths so the links also work from the try-on shop page.
const NAV_ITEMS = [
  { href: '/#atelier', label: 'Atelier' },
  { href: '/#philosophy', label: 'Philosophy' },
  { href: '/#result', label: 'Result' },
  { href: '/try-on/', label: 'Shop' },
];

export function Navigation({ onTryOn }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = () => {
    setMobileMenuOpen(false);
  };

  const handleTryOnClick = () => {
    onTryOn();
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-colors pointer-events-none">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between pointer-events-auto">
        {/* Brand Wordmark in system font */}
        <a
          href="/"
          className="font-headline text-xl font-semibold text-[#1d1d1f] hover:text-[#000000] transition-colors whitespace-nowrap flex items-center gap-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#1d1d1f]" />
          <span>WearLens</span>
        </a>

        {/* Center Floating Segmented Pill Bar */}
        <nav className="hidden md:flex items-center gap-1 p-1 glass-pill rounded-full shadow-sm font-subline text-[13px] text-[#86868b] font-medium">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className="px-4 py-1.5 rounded-full hover:bg-black/5 hover:text-[#1d1d1f] transition-all"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Right Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleTryOnClick}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 text-[13px] font-subline font-medium text-white bg-[#1d1d1f] hover:bg-[#000000] active:scale-95 rounded-full transition-all duration-200 whitespace-nowrap shadow-sm cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try It On</span>
          </button>

          {/* Mobile Menu Trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2.5 rounded-full glass-pill text-[#0a0a0f] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden pointer-events-auto bg-white/95 backdrop-blur-2xl border-b border-black/5 px-6 py-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex flex-col space-y-3 font-subline text-sm font-medium text-[#1d1d1f]">
            {NAV_ITEMS.map((item) => (
              <a key={item.href} href={item.href} onClick={handleNavClick} className="py-2 border-b border-black/[0.05]">
                {item.label}
              </a>
            ))}
          </div>

          <div className="pt-2">
            <button
              onClick={handleTryOnClick}
              className="w-full py-3 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[13px] font-subline font-medium rounded-full shadow-sm flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Try It On Now</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
