import { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, Check, ChevronDown, ShoppingBag, Sparkles } from 'lucide-react';
import { Navigation } from './Navigation';
import { LiveTryOn } from './LiveTryOn';
import { PRODUCTS, SIZES, formatPrice, getProduct, productImages } from '../data/products';
import { playMicroClick } from '../utils/audioFeedback';

export function TryOnProductPage() {
  const product = getProduct(new URLSearchParams(window.location.search).get('product'));
  const images = productImages(product);
  const others = PRODUCTS.filter((p) => p.slug !== product.slug);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const closeTryOn = useCallback(() => setTryOnOpen(false), []);
  const [size, setSize] = useState('M');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timeout = window.setTimeout(() => setAdded(false), 2500);
    return () => window.clearTimeout(timeout);
  }, [added]);

  const openTryOn = () => {
    playMicroClick(1400, 0.04);
    setTryOnOpen(true);
  };

  const addToBag = () => {
    playMicroClick(1200, 0.04);
    setAdded(true);
  };

  // schema.org Product data, for search results and link previews.
  const origin = window.location.origin;
  const productUrl = `${origin}/try-on/?product=${product.slug}`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.slug,
    category: product.category,
    color: product.colorName,
    image: [origin + images.front, origin + images.back],
    brand: { '@type': 'Brand', name: 'Lookbook' },
    offers: {
      '@type': 'Offer',
      url: productUrl,
      price: product.price.toFixed(2),
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
    },
  };

  return (
    <div className="min-h-screen bg-[#f5f6f9] text-[#111218] selection:bg-[#ff7711]/20 selection:text-[#0a0a0f] font-subline">
      <title>{`${product.name} — Try On · Lookbook`}</title>
      <meta name="description" content={product.description} />
      <meta property="og:title" content={product.name} />
      <meta property="og:url" content={productUrl} />
      <meta property="og:image" content={origin + images.front} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <Navigation onTryOn={openTryOn} />

      <main className="max-w-7xl mx-auto px-6 pt-28 pb-24">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-8 flex items-center gap-2 whitespace-nowrap text-[13px] text-[#86868b] font-medium">
          <a href="/" className="hover:text-[#1d1d1f] transition-colors">Lookbook</a>
          <span className="text-black/20">/</span>
          <a href="/try-on/" className="hover:text-[#1d1d1f] transition-colors">Try-On Shop</a>
          <span className="text-black/20">/</span>
          <span className="min-w-0 text-[#1d1d1f] truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Gallery: front & back shots, swipeable on mobile and stacked on desktop. */}
          <div className="lg:col-span-7 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0 lg:flex-col lg:gap-4 lg:overflow-visible">
            {(['front', 'back'] as const).map((view) => (
              <div
                key={view}
                className="snap-center shrink-0 w-[82%] sm:w-[60%] lg:w-full rounded-3xl overflow-hidden bg-[#f3f3f5] hairline-border"
              >
                <img
                  src={images[view]}
                  alt={`${product.name}, ${view} view`}
                  width={1200}
                  height={1500}
                  className="block w-full h-auto"
                />
              </div>
            ))}
          </div>

          {/* Product info */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-28 space-y-8">
              <div className="space-y-3">
                <div className="text-[13px] text-[#86868b] font-medium">{product.category}</div>
                <h1 className="font-headline text-4xl sm:text-5xl font-semibold tracking-tight text-[#1d1d1f] leading-tight text-balance">
                  {product.name}
                </h1>
                <div className="font-headline text-2xl font-medium text-[#1d1d1f]">{formatPrice(product)}</div>
                <p className="text-[15px] sm:text-[17px] text-[#86868b] leading-relaxed">{product.description}</p>
              </div>

              {/* Colour */}
              <div className="flex items-center gap-3 text-[13px]">
                <span
                  className="w-5 h-5 rounded-full ring-1 ring-black/10"
                  style={{ backgroundColor: product.colorHex }}
                />
                <span className="text-[#86868b]">Colour</span>
                <span className="text-[#1d1d1f] font-medium">{product.colorName}</span>
              </div>

              {/* Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="text-[#86868b]">Size</span>
                  <span className="text-[#1d1d1f] font-medium">{size}</span>
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {SIZES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      className={`py-2.5 rounded-xl text-[13px] font-medium border transition-colors cursor-pointer ${
                        size === s
                          ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                          : 'bg-white text-[#1d1d1f] border-black/10 hover:border-black/30'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={openTryOn}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-[#1d1d1f] hover:bg-[#000000] text-white text-[15px] font-medium rounded-full transition-all shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try it on live</span>
                </button>

                <button
                  onClick={addToBag}
                  className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] text-[15px] font-medium rounded-full hairline-border-dark transition-colors shadow-sm active:scale-[0.98] cursor-pointer"
                >
                  {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  <span>{added ? 'Added to bag' : 'Add to bag'}</span>
                </button>
                <p role="status" className="sr-only">
                  {added ? `${product.name}, size ${size}, added to bag` : ''}
                </p>

                <p className="text-[12px] text-[#86868b] text-center leading-relaxed">
                  See it on you in real time with your camera. Live try-on powered by Decart.
                </p>
              </div>

              {/* Details */}
              <div className="border-t border-black/[0.08] divide-y divide-black/[0.08]">
                {product.details.map((detail) => (
                  <details key={detail.title} className="group py-4">
                    <summary className="flex items-center justify-between cursor-pointer list-none [&::-webkit-details-marker]:hidden text-[15px] font-medium text-[#1d1d1f]">
                      {detail.title}
                      <ChevronDown className="w-4 h-4 text-[#86868b] transition-transform group-open:rotate-180" />
                    </summary>
                    <p className="pt-3 text-[13px] text-[#86868b] leading-relaxed">{detail.body}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* More to try on */}
        <section className="mt-24 space-y-8">
          <h2 className="font-headline text-2xl sm:text-3xl font-semibold tracking-tight text-[#1d1d1f]">
            More to try on
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {others.map((p) => (
              <a key={p.slug} href={`/try-on/?product=${p.slug}`} className="group block space-y-3">
                <div className="rounded-3xl overflow-hidden bg-[#f3f3f5] hairline-border">
                  <img
                    src={productImages(p).front}
                    alt={p.name}
                    loading="lazy"
                    width={1200}
                    height={1500}
                    className="block w-full h-auto group-hover:scale-[1.02] transition-transform duration-500"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-3 text-[15px]">
                  <span className="font-medium text-[#1d1d1f]">{p.name}</span>
                  <span className="text-[#86868b] shrink-0">{formatPrice(p)}</span>
                </div>
              </a>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] text-[#86868b] font-medium">
          <a
            href="/"
            className="font-headline text-[17px] font-semibold tracking-tight text-[#1d1d1f] hover:opacity-70 transition-opacity"
          >
            Lookbook
          </a>
          <a href="/" className="inline-flex items-center gap-1.5 hover:text-[#1d1d1f] transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to the atelier</span>
          </a>
          <div>&copy; 2026 Lookbook Atelier</div>
        </div>
      </footer>

      {tryOnOpen && <LiveTryOn product={product} onClose={closeTryOn} />}
    </div>
  );
}
