import { useState } from 'react';
import { Sparkles, Copy, Check, ShoppingBag, Calculator } from 'lucide-react';
import { useScrollReveal } from '../hooks/useScrollReveal';

interface ForStoresSectionProps {
  onOpenFittingRoom: () => void;
}

export function ForStoresSection({ onOpenFittingRoom }: ForStoresSectionProps) {
  const [copied, setCopied] = useState(false);
  const [simulatedStoreTryOnOpen, setSimulatedStoreTryOnOpen] = useState(false);
  const [widgetTheme, setWidgetTheme] = useState<'obsidian' | 'cream' | 'slate'>('obsidian');
  const sectionRef = useScrollReveal<HTMLElement>({ stagger: 0.14, yOffset: 24, duration: 0.9 });

  // ROI Calculator States
  const [monthlyOrders, setMonthlyOrders] = useState<number>(3500);
  const [aov, setAov] = useState<number>(850);

  // Dynamic calculations:
  // Industry baseline luxury return rate is ~30%. LOOKBOOK reduces it by 38% (-11.4 percentage points).
  // Return processing cost is ~$45 per item.
  const returnsSaved = Math.round(monthlyOrders * 0.30 * 0.38);
  const annualSavings = Math.round(returnsSaved * 45 * 12);
  const projectedConversionGain = Math.round(monthlyOrders * 0.035 * aov * 12);

  const embedCode = `<script src="https://cdn.lookbook.ai/tryon.js" data-atelier="couture_88" data-theme="${widgetTheme}" defer></script>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section 
      ref={sectionRef} 
      id="for-stores" 
      className="py-28 bg-[#070709] border-t border-white/[0.06] relative overflow-hidden"
    >
      {/* Soft studio light gradient */}
      <div className="absolute inset-0 bg-radial-gradient from-white/[0.015] via-transparent to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="reveal-child text-center max-w-2xl mx-auto mb-16">
          <div className="text-xs uppercase tracking-[0.22em] text-[#c8aa6e] font-medium mb-3">
            Atelier SDK For Online Boutiques
          </div>
          <h2 className="text-3xl sm:text-5xl font-editorial font-light tracking-tight text-neutral-100 mb-4">
            The Embeddable Try-On
          </h2>
          <p className="text-sm text-neutral-400 font-light leading-relaxed">
            One line of code embeds a private virtual fitting room directly into your luxury storefront.
          </p>
        </div>

        {/* Live Interactive Luxury PDP Simulation */}
        <div className="reveal-child bg-[#0b0b10] hairline-border p-6 sm:p-10 rounded-sm mb-16 shadow-[0_20px_60px_rgba(0,0,0,0.7)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Storefront Product Preview Frame */}
            <div className="lg:col-span-6 bg-[#0e0e14] hairline-border p-6 rounded-sm relative">
              {/* Fake Luxury Browser / PDP Bar */}
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/[0.06] text-xs font-mono text-neutral-400">
                <span className="tracking-widest uppercase text-[11px] text-[#c8aa6e]">
                  MAISON VANEAU PARIS
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-neutral-500">THEME:</span>
                  <button
                    onClick={() => setWidgetTheme('obsidian')}
                    className={`px-1.5 py-0.5 text-[9px] font-mono rounded-sm ${widgetTheme === 'obsidian' ? 'bg-[#222230] text-[#c8aa6e]' : 'text-neutral-400'}`}
                  >
                    Noir
                  </button>
                  <button
                    onClick={() => setWidgetTheme('cream')}
                    className={`px-1.5 py-0.5 text-[9px] font-mono rounded-sm ${widgetTheme === 'cream' ? 'bg-[#222230] text-[#c8aa6e]' : 'text-neutral-400'}`}
                  >
                    Cream
                  </button>
                  <button
                    onClick={() => setWidgetTheme('slate')}
                    className={`px-1.5 py-0.5 text-[9px] font-mono rounded-sm ${widgetTheme === 'slate' ? 'bg-[#222230] text-[#c8aa6e]' : 'text-neutral-400'}`}
                  >
                    Slate
                  </button>
                </div>
              </div>

              {/* Garment Hero Card */}
              <div className="relative aspect-[4/3] bg-[#14141d] rounded-sm mb-6 flex flex-col items-center justify-center p-6 border border-white/[0.06] overflow-hidden group">
                <div className="w-40 h-52 bg-gradient-to-b from-[#21212c] to-[#121219] rounded-t-xl relative border-t-2 border-[#c8aa6e]/60 flex flex-col items-center justify-between p-4 shadow-2xl">
                  <div className="w-14 h-14 border-r-2 border-b-2 border-[#c8aa6e]/40 -rotate-45" />
                  <div className="w-full text-center">
                    <span className="text-[10px] font-mono tracking-widest text-[#c8aa6e] uppercase">
                      Virgin Melton Cashmere 650g
                    </span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-[#070709]/80 px-2.5 py-1 text-[10px] font-mono text-neutral-300 border border-white/10 backdrop-blur-md">
                  LIMITED RUN 24 EDITIONS
                </div>
              </div>

              {/* Product Info & Embed Button */}
              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h4 className="text-xl font-editorial font-light text-neutral-100">
                      The Midnight Double-Breasted Coat
                    </h4>
                    <p className="text-xs text-neutral-400 font-light mt-0.5">
                      Sculptural peak lapel Uncut horn closures
                    </p>
                  </div>
                  <div className="text-base font-editorial text-neutral-100 font-normal">
                    &euro;2,400
                  </div>
                </div>

                {/* The LOOKBOOK Live Widget Button (Themed) */}
                <div className="pt-2 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => setSimulatedStoreTryOnOpen(true)}
                    className={`flex-1 py-3 px-4 rounded-sm flex items-center justify-center gap-2 text-xs uppercase tracking-[0.16em] font-medium transition-all cursor-pointer shadow-lg ${
                      widgetTheme === 'cream'
                        ? 'bg-[#ece6d8] text-[#070709] hover:bg-white border border-[#c8aa6e]'
                        : widgetTheme === 'slate'
                        ? 'bg-[#252830] text-white hover:bg-[#30343e] border border-white/10'
                        : 'bg-[#181822] text-[#e8e4d9] hover:bg-[#20202c] hairline-border-gold shadow-[0_0_20px_rgba(200,170,110,0.12)]'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#c8aa6e]" />
                    <span>Try On Yourself (Lookbook)</span>
                  </button>

                  <button className="py-3 px-5 bg-neutral-200 hover:bg-white text-[#070709] rounded-sm text-xs uppercase tracking-[0.16em] font-medium flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Bag</span>
                  </button>
                </div>

                {/* Simulated Store Popup Drawer */}
                {simulatedStoreTryOnOpen && (
                  <div className="mt-4 p-4 bg-[#14141d] hairline-border-gold rounded-sm text-xs space-y-3 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center text-[#c8aa6e] font-mono text-[10px] tracking-wider uppercase">
                      <span>Live In-Store Fitting Drawer</span>
                      <button
                        onClick={() => setSimulatedStoreTryOnOpen(false)}
                        className="text-neutral-400 hover:text-white cursor-pointer"
                      >
                        Close &times;
                      </button>
                    </div>
                    <p className="text-neutral-300 font-light">
                      The customer uploads a photo or enables camera directly on your product page. In 3 seconds, they see this exact &euro;2,400 coat draped onto their physique.
                    </p>
                    <button
                      onClick={() => {
                        setSimulatedStoreTryOnOpen(false);
                        onOpenFittingRoom();
                      }}
                      className="w-full py-2 bg-[#ece6d8] text-[#070709] text-[11px] uppercase tracking-widest font-medium rounded-sm cursor-pointer"
                    >
                      Open Full Screen Atelier Experience
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Developer Integration & Commercial Performance */}
            <div className="lg:col-span-6 space-y-6">
              <div className="text-xs uppercase tracking-widest text-[#c8aa6e] font-mono">
                One-Line Implementation
              </div>

              <h3 className="text-2xl sm:text-3xl font-editorial font-light text-neutral-100">
                Zero Friction for Luxury Maisons
              </h3>

              <p className="text-sm text-neutral-300 font-light leading-relaxed">
                LOOKBOOK integrates seamlessly into Shopify Plus, Salesforce Commerce Cloud, or custom headless React storefronts. Your design team retains total CSS control over widget typography, button styles, and privacy disclosures.
              </p>

              {/* Code Snippet Box */}
              <div className="p-4 bg-[#0a0a0f] hairline-border rounded-sm font-mono text-xs text-neutral-300 relative">
                <div className="flex justify-between items-center pb-2 mb-2 border-b border-white/5 text-[10px] text-neutral-500">
                  <span>HTML HEADER SNIPPET</span>
                  <button
                    onClick={handleCopy}
                    className="inline-flex items-center gap-1.5 text-[#c8aa6e] hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Script</span>
                      </>
                    )}
                  </button>
                </div>
                <code className="text-[#d8c8a8] block break-all leading-relaxed">
                  {embedCode}
                </code>
              </div>

              {/* Quantitative Metrics Adjacent to Claims */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/[0.06]">
                <div className="space-y-1">
                  <div className="text-2xl font-editorial font-light text-neutral-100">
                    -38%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                    Return Rate
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-editorial font-light text-neutral-100">
                    +54%
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                    Add-to-Bag
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-2xl font-editorial font-light text-neutral-100">
                    &lt; 200ms
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono">
                    Script Load
                  </div>
                </div>
              </div>

              {/* Attributable Luxury Director Endorsement */}
              <div className="pt-2 border-l border-[#c8aa6e]/40 pl-4 space-y-1">
                <p className="text-xs text-neutral-300 font-light italic font-sans">
                  "LOOKBOOK elevated our digital boutique from a flat catalog into an intimate fitting salon. Our sizing inquiries halved in forty-eight hours."
                </p>
                <div className="text-[11px] text-neutral-400 font-mono">
                  &mdash; H&eacute;l&egrave;ne De Vries, Digital Director, Maison Vaneau Paris
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interactive Boutique ROI & Returns Calculator (UI-UX Pro Max Feature) */}
        <div className="reveal-child bg-[#09090e] hairline-border p-6 sm:p-8 rounded-sm">
          <div className="flex items-center gap-2 pb-4 mb-6 border-b border-white/[0.06]">
            <Calculator className="w-4 h-4 text-[#c8aa6e]" />
            <span className="text-xs uppercase tracking-[0.2em] font-mono text-neutral-200">
              Boutique Impact Calculator
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-neutral-400">Monthly Boutique Orders:</span>
                  <span className="text-[#c8aa6e]">{monthlyOrders.toLocaleString()} orders</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={monthlyOrders}
                  onChange={(e) => setMonthlyOrders(Number(e.target.value))}
                  className="w-full h-1 bg-[#1a1a24] accent-[#c8aa6e] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono mb-2">
                  <span className="text-neutral-400">Average Order Value (AOV):</span>
                  <span className="text-[#c8aa6e]">&euro;{aov.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="200"
                  max="3500"
                  step="50"
                  value={aov}
                  onChange={(e) => setAov(Number(e.target.value))}
                  className="w-full h-1 bg-[#1a1a24] accent-[#c8aa6e] cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#0d0d14] rounded-sm hairline-border space-y-1">
                <div className="text-[10px] uppercase font-mono text-neutral-500">
                  Est. Returns Saved / Yr
                </div>
                <div className="text-2xl font-editorial text-neutral-100 font-light">
                  {(returnsSaved * 12).toLocaleString()} units
                </div>
                <div className="text-[11px] font-mono text-[#c8aa6e]">
                  &asymp; &euro;{annualSavings.toLocaleString()} logistics saved
                </div>
              </div>

              <div className="p-4 bg-[#0d0d14] rounded-sm hairline-border space-y-1">
                <div className="text-[10px] uppercase font-mono text-neutral-500">
                  Projected Net Added GMV
                </div>
                <div className="text-2xl font-editorial text-neutral-100 font-light">
                  +&euro;{projectedConversionGain.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono text-[#c8aa6e]">
                  via +54% try-on conversion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
