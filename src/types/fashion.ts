export interface OutfitPreset {
  id: string;
  number: string;
  name: string;
  prompt: string;
  fabric: string;
  fabricWeight: string;
  colorName: string;
  colorHex: string;
  accentHex: string;
  silhouette: string;
  drapePhysics: string;
}

export interface StylistRecommendation {
  id: string;
  promptTrigger: string;
  occasion: string;
  headline: string;
  editorialProse: string;
  lookTitle: string;
  outfitBreakdown: {
    piece: string;
    material: string;
    cut: string;
  }[];
  palette: {
    name: string;
    hex: string;
  }[];
  fabricSpec: string;
}

export interface Product {
  slug: string;
  name: string;
  category: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  colorName: string;
  colorHex: string;
  details: {
    title: string;
    body: string;
  }[];
  // Sent to the live try-on model with the front product shot. Decart's guide recommends the
  // "Substitute the current top with …" pattern plus a precise description of the garment.
  tryOnPrompt: string;
}

export interface WardrobeItem {
  id: string;
  title: string;
  prompt: string;
  collection: string;
  fabric: string;
  dateCreated: string;
  specs: {
    drape: string;
    lighting: string;
    silhouette: string;
  };
}
