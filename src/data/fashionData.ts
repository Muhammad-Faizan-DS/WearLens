import { OutfitPreset, StylistRecommendation, WardrobeItem } from '../types/fashion';

export const OUTFIT_PRESETS: OutfitPreset[] = [
  {
    id: 'charcoal-overcoat',
    number: '01',
    name: 'Charcoal Tailored Overcoat',
    prompt: 'a double-breasted charcoal melton wool overcoat, crisp white poplin shirt, relaxed pleat trousers',
    fabric: '650g Melton Virgin Wool',
    fabricWeight: '650 g/m²',
    colorName: 'Charcoal Obsidian',
    colorHex: '#1e1f24',
    accentHex: '#c8aa6e',
    silhouette: 'Oversized structured shoulder with straight drape',
    drapePhysics: 'Heavy stiffness, structural drop, minimal wind flutter'
  },
  {
    id: 'sand-trench',
    number: '02',
    name: 'Raw Silk Atelier Trench',
    prompt: 'an architectural sand beige silk-faille trench coat, ivory fine-gauge cashmere crewneck, obsidian denim',
    fabric: 'Raw Silk Faille & Cashmere',
    fabricWeight: '380 g/m²',
    colorName: 'Sand Desert & Bone',
    colorHex: '#8e8271',
    accentHex: '#d8c8a8',
    silhouette: 'Fluid storm-flap drape with cinched storm-belt line',
    drapePhysics: 'Medium fluid bias, liquid surface drape, soft ripple'
  },
  {
    id: 'velvet-smoking',
    number: '03',
    name: 'Midnight Velvet Smoking Jacket',
    prompt: 'a sculptural midnight velvet dinner jacket, grosgrain shawl collar, silk shirting, sharp evening trousers',
    fabric: 'Italian Cotton Velvet & Grosgrain',
    fabricWeight: '520 g/m²',
    colorName: 'Midnight Noir & Jet',
    colorHex: '#121422',
    accentHex: '#d1b988',
    silhouette: 'Sculpted waistline, broad shawl lapel, tapered evening break',
    drapePhysics: 'High surface absorption, deep shadow wells, weighted fall'
  },
  {
    id: 'minimalist-bomber',
    number: '04',
    name: 'Bonded Wool Tech Minimalist',
    prompt: 'a minimalist bonded wool bomber jacket in deep espresso, seamless mockneck, wide-leg tailored trousers',
    fabric: 'Double-Faced Bonded Wool',
    fabricWeight: '460 g/m²',
    colorName: 'Espresso Monochrome',
    colorHex: '#25211e',
    accentHex: '#baa17b',
    silhouette: 'Boxy crop with clean geometric seam architecture',
    drapePhysics: 'Zero-wrinkle memory, crisp cylindrical sleeve fold'
  }
];

export const STYLIST_RECOMMENDATIONS: StylistRecommendation[] = [
  {
    id: 'venice-biennale',
    promptTrigger: 'Evening vernissage at Palazzo Grassi in late October',
    occasion: 'Art Exhibition & Black-Tie Vernissage',
    headline: 'Low-sheen tactile elegance against Venetian canal humidity',
    editorialProse: 'For a damp autumn evening along the Grand Canal, avoid synthetic sheen. We construct a tactile silhouette in heavy midnight wool with soft grosgrain lapels to capture museum spotlights with muted restraint.',
    lookTitle: 'The Canal Nocturne',
    outfitBreakdown: [
      { piece: 'Outer Layer', material: 'Midnight double-faced cashgora wrap coat', cut: 'Drop-shoulder relaxed wrap with horn closure' },
      { piece: 'Evening Jacket', material: 'Unstructured barathea wool smoking jacket', cut: 'Soft natural shoulder, single button' },
      { piece: 'Base & Trousers', material: 'Silk-linen voile collarless shirt & pleated slacks', cut: 'High rise, single reverse pleat, clean pooling break' }
    ],
    palette: [
      { name: 'Lagoon Midnight', hex: '#0e121a' },
      { name: 'Charcoal Slag', hex: '#23252a' },
      { name: 'Parchment Silk', hex: '#ece6d8' },
      { name: 'Antique Brass', hex: '#9f8554' }
    ],
    fabricSpec: 'Barathea 420g Silk Voile 110g Cashgora 560g'
  },
  {
    id: 'tokyo-autumn',
    promptTrigger: '4-day architectural exploration in Tokyo during November',
    occasion: 'Transitional Travel & Daily Gallery Walk',
    headline: 'Modular thermal layering with razor-sharp Japanese tailoring',
    editorialProse: 'Tokyo transit demands quick temperature adaptation between climate-controlled galleries and brisk Shibuya streets. We balance featherweight thermal silk underpinnings with a water-repellent bonded wool car coat.',
    lookTitle: 'Metropolitan Monolith',
    outfitBreakdown: [
      { piece: 'Car Coat', material: 'Bonded compact wool in slate ash', cut: 'Minimal fly-front with magnetic hidden placket' },
      { piece: 'Knitwear', material: '18-gauge ultrafine Merino seamless crew', cut: 'Form-following tubular knit, ribless hem' },
      { piece: 'Trouser', material: 'Tropical wool wide-leg with elasticated internal waistband', cut: 'Deep volume, cropped cleanly above ankle boot' }
    ],
    palette: [
      { name: 'Slate Ash', hex: '#2b2d31' },
      { name: 'Soot Black', hex: '#111215' },
      { name: 'Paper White', hex: '#f0ede6' },
      { name: 'Smoked Quartz', hex: '#635d56' }
    ],
    fabricSpec: 'Bonded Merino 480g Seamless Silk-Wool 180g Tropical Worsted 260g'
  },
  {
    id: 'copenhagen-atelier',
    promptTrigger: 'Private collector salon in Copenhagen mid-winter',
    occasion: 'Intimate Creative Salon & Dinner',
    headline: 'Sculptural organic geometry with unbleached organic textures',
    editorialProse: 'Nordic candlelight flatters tactile matte fibers. An architectural boiled-wool cardigan jacket anchored by raw silk shirting creates quiet intellectual authority without stiff corporate rigidity.',
    lookTitle: 'Nordic Chiaroscuro',
    outfitBreakdown: [
      { piece: 'Atelier Jacket', material: 'Boiled alpaca-wool blend in warm peat', cut: 'Collarless kimono construction, blind hems' },
      { piece: 'Turtleneck', material: 'Raw spun mulberry silk ribbed rollneck', cut: 'Generous neck collapse, extended cuffs' },
      { piece: 'Tailoring', material: 'Heavy cotton-linen cavalry twill in espresso', cut: 'Relaxed taper with side adjusters' }
    ],
    palette: [
      { name: 'Warm Peat', hex: '#2f2824' },
      { name: 'Raw Mulberry', hex: '#dfd7c8' },
      { name: 'Espresso Twill', hex: '#1d1715' },
      { name: 'Muted Amber', hex: '#8a6a3b' }
    ],
    fabricSpec: 'Boiled Alpaca 540g Raw Mulberry Silk 210g Cavalry Twill 480g'
  }
];

export const SAVED_WARDROBE: WardrobeItem[] = [
  {
    id: 'w-01',
    title: 'Minimalist Charcoal Overcoat',
    prompt: 'a charcoal wool overcoat, white tee, tapered trousers',
    collection: 'Capsule A/W',
    fabric: 'Melton Wool 650g',
    dateCreated: 'Saved 2 days ago',
    specs: { drape: 'Architectural', lighting: 'Moody Key 3200K', silhouette: 'Straight Line' }
  },
  {
    id: 'w-02',
    title: 'Double-Breasted Silk Tuxedo',
    prompt: 'obsidian silk dinner jacket, grosgrain lapels, poplin tuxedo shirt',
    collection: 'Evening Atelier',
    fabric: 'Barathea Silk 460g',
    dateCreated: 'Saved 5 days ago',
    specs: { drape: 'Weighted Shawl', lighting: 'Studio Spot 4500K', silhouette: 'Sculpted Waist' }
  },
  {
    id: 'w-03',
    title: 'Sand Raw Faille Storm Trench',
    prompt: 'sand silk-faille oversized storm coat, ivory cashmere mockneck',
    collection: 'Transitional',
    fabric: 'Silk Faille 380g',
    dateCreated: 'Saved 1 week ago',
    specs: { drape: 'Fluid Bias', lighting: 'Ambient Soft 3000K', silhouette: 'Cinched Storm' }
  },
  {
    id: 'w-04',
    title: 'Espresso Bonded Minimal Shell',
    prompt: 'espresso bonded wool jacket, seamless merino knit, wide trouser',
    collection: 'Capsule A/W',
    fabric: 'Bonded Merino 460g',
    dateCreated: 'Saved 2 weeks ago',
    specs: { drape: 'Cylindrical Memory', lighting: 'Low Angle Rim', silhouette: 'Boxy Cropped' }
  }
];
