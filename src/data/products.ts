import { Product } from '../types/fashion';

// Catalogue for the try-on shop (/try-on/). Product shots live in public/products and are
// rendered from the 3D models in public/models: `<slug>-front.jpg` and `<slug>-back.jpg`.
// Prices are placeholders.
export const PRODUCTS: Product[] = [
  {
    slug: 'atelier-band-collar-shirt',
    name: 'Atelier Band-Collar Shirt',
    category: 'Shirts',
    tagline: 'Crisp poplin with a minimal band collar.',
    description:
      'A clean long-sleeve shirt in crisp cotton poplin, finished with a band collar, a concealed placket and a tonal monogram at the chest.',
    price: 185,
    currency: 'USD',
    colorName: 'Optic White',
    colorHex: '#f4f4f2',
    details: [
      { title: 'Fabric & care', body: '100% cotton poplin. Machine wash cold, hang to dry, warm iron.' },
      { title: 'Fit', body: 'Regular fit through the body with a softly rounded hem. True to size.' },
    ],
    tryOnPrompt:
      'Substitute the current top with a crisp white long-sleeve cotton poplin shirt with a band collar, a concealed button placket and a small black monogram on the left chest',
  },
  {
    slug: 'boarding-pass-oversized-tee',
    name: 'Boarding Pass Oversized Tee',
    category: 'T-Shirts',
    tagline: 'Heavyweight jersey with a boarding-pass print on the back.',
    description:
      'An oversized tee in heavyweight cotton jersey, with a small chest logo and a full boarding-pass graphic printed across the back.',
    price: 85,
    currency: 'USD',
    colorName: 'Washed Black',
    colorHex: '#2a2a2c',
    details: [
      { title: 'Fabric & care', body: '240 gsm cotton jersey. Machine wash cold inside out, do not tumble dry.' },
      { title: 'Fit', body: 'Oversized with dropped shoulders. Size down for a closer fit.' },
    ],
    tryOnPrompt:
      'Substitute the current top with an oversized black heavyweight cotton t-shirt with dropped shoulders and a small white airline logo on the left chest',
  },
  {
    slug: 'noir-floral-camp-shirt',
    name: 'Noir Floral Camp Shirt',
    category: 'Shirts',
    tagline: 'Tonal floral jacquard with a relaxed camp collar.',
    description:
      'A short-sleeve camp-collar shirt in a fluid tonal floral jacquard that only shows in the light, with contrast buttons down the front.',
    price: 145,
    currency: 'USD',
    colorName: 'Noir',
    colorHex: '#111113',
    details: [
      { title: 'Fabric & care', body: 'Viscose-blend jacquard. Hand wash cold or dry clean, cool iron on reverse.' },
      { title: 'Fit', body: 'Relaxed fit with a straight hem, designed to be worn untucked.' },
    ],
    tryOnPrompt:
      'Substitute the current top with a black short-sleeve camp-collar shirt in a tonal floral jacquard, with white buttons down the front',
  },
  {
    slug: 'midnight-oxford-shirt',
    name: 'Midnight Oxford Shirt',
    category: 'Shirts',
    tagline: 'Brushed oxford cloth with a single chest pocket.',
    description:
      'A long-sleeve shirt in soft brushed oxford cloth, with a point collar, a single patch pocket and buttoned barrel cuffs.',
    price: 165,
    currency: 'USD',
    colorName: 'Midnight Navy',
    colorHex: '#1c2433',
    details: [
      { title: 'Fabric & care', body: '100% cotton oxford. Machine wash warm, tumble dry low, warm iron.' },
      { title: 'Fit', body: 'Tailored through the chest and waist. Size up for a relaxed fit.' },
    ],
    tryOnPrompt:
      'Substitute the current top with a dark navy long-sleeve oxford shirt with a point collar, a single chest pocket and buttoned cuffs',
  },
];

export const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export function productImages(product: Product) {
  return {
    front: `/products/${product.slug}-front.jpg`,
    back: `/products/${product.slug}-back.jpg`,
  };
}

export function getProduct(slug: string | null): Product {
  return PRODUCTS.find((p) => p.slug === slug) ?? PRODUCTS[0];
}

export function formatPrice(product: Product) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: product.currency, maximumFractionDigits: 0 }).format(product.price);
}
