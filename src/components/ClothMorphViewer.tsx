import { useEffect, useRef, useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';

interface GarmentStyle {
  id: string;
  name: string;
  fabric: string;
  weight: string;
  accentColor: string;
  baseColor: string;
  lapelType: 'peak' | 'shawl' | 'storm' | 'stand';
  shoulderWidth: number;
  waistTaper: number;
  coatLength: number;
}

const GARMENTS: GarmentStyle[] = [
  {
    id: 'melton-coat',
    name: 'Melton Wool Overcoat',
    fabric: 'Charcoal Melton 650g',
    weight: '650g/m²',
    accentColor: '#ff7711',
    baseColor: '#0c0d12',
    lapelType: 'peak',
    shoulderWidth: 84,
    waistTaper: 56,
    coatLength: 170,
  },
  {
    id: 'velvet-tux',
    name: 'Evening Velvet Smoking',
    fabric: 'Midnight Cotton Velvet',
    weight: '520g/m²',
    accentColor: '#d4af37',
    baseColor: '#0a0d18',
    lapelType: 'shawl',
    shoulderWidth: 78,
    waistTaper: 50,
    coatLength: 140,
  },
  {
    id: 'silk-trench',
    name: 'Raw Silk Storm Trench',
    fabric: 'Ivory Silk Faille',
    weight: '380g/m²',
    accentColor: '#ffaa44',
    baseColor: '#1c1b22',
    lapelType: 'storm',
    shoulderWidth: 88,
    waistTaper: 64,
    coatLength: 185,
  },
  {
    id: 'bonded-shell',
    name: 'Bonded Merino Shell',
    fabric: 'Bonded Tech Wool',
    weight: '460g/m²',
    accentColor: '#ff5500',
    baseColor: '#141416',
    lapelType: 'stand',
    shoulderWidth: 76,
    waistTaper: 58,
    coatLength: 130,
  },
];

interface ClothMorphViewerProps {
  onGarmentChange?: (name: string) => void;
}

export function ClothMorphViewer({ onGarmentChange }: ClothMorphViewerProps) {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isMorphing, setIsMorphing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const unicornContainerRef = useRef<HTMLDivElement | null>(null);

  // Animation values for smooth morphing interpolation
  const currentGarment = GARMENTS[selectedIdx];
  const prevGarmentRef = useRef<GarmentStyle>(currentGarment);
  const morphProgressRef = useRef(1); // 0 to 1

  // Load Unicorn Studio project if available
  useEffect(() => {
    const scriptId = 'unicorn-studio-script';
    const initUnicorn = () => {
      const u = (window as unknown as { UnicornStudio?: { init: () => void } }).UnicornStudio;
      if (u && typeof u.init === 'function') {
        try {
          u.init();
        } catch (e) {
          console.warn('UnicornStudio init note:', e);
        }
      }
    };

    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.3.0/dist/unicornStudio.umd.js';
      script.async = true;
      script.onload = () => {
        initUnicorn();
      };
      (document.head || document.body).appendChild(script);
    } else {
      initUnicorn();
    }
  }, []);

  const handleSelectGarment = (idx: number) => {
    if (idx === selectedIdx || isMorphing) return;
    prevGarmentRef.current = GARMENTS[selectedIdx];
    setSelectedIdx(idx);
    setIsMorphing(true);
    morphProgressRef.current = 0;
    if (onGarmentChange) {
      onGarmentChange(GARMENTS[idx].name);
    }
  };

  // Canvas Cloth Morphing Engine (Fluid vertex interpolation, wave displacement & thread re-synthesis)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const cx = width / 2;
      const cy = height * 0.42;

      // Progress morph interpolation
      if (morphProgressRef.current < 1) {
        morphProgressRef.current = Math.min(1, morphProgressRef.current + 0.04);
        if (morphProgressRef.current >= 1) {
          setIsMorphing(false);
        }
      }

      const p = morphProgressRef.current;
      // Easing
      const ease = p < 0.5 ? 2 * p * p : -1 + (4 - 2 * p) * p;

      const fromG = prevGarmentRef.current;
      const toG = currentGarment;

      // Interpolate attributes
      const shoulders = fromG.shoulderWidth + (toG.shoulderWidth - fromG.shoulderWidth) * ease;
      const waist = fromG.waistTaper + (toG.waistTaper - fromG.waistTaper) * ease;
      const coatLen = fromG.coatLength + (toG.coatLength - fromG.coatLength) * ease;

      // Clear with subtle dark backdrop
      ctx.clearRect(0, 0, width, height);

      // Studio floor gradient reflection
      const grad = ctx.createRadialGradient(cx, cy + 50, 20, cx, cy + 50, 180);
      grad.addColorStop(0, 'rgba(255, 119, 17, 0.08)');
      grad.addColorStop(0.6, 'rgba(10, 10, 15, 0.02)');
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Morph Wave Distortion: during morphing, ripples displace cloth vertices
      const wave = Math.sin(t * 4) * (1 - p) * 12;

      // 1. Draw Sculpted Mannequin Neck & Torso Core
      ctx.save();
      // Stand Rod
      ctx.fillStyle = '#1c1d24';
      ctx.fillRect(cx - 3, cy - 20, 6, 260);

      // Neck
      ctx.fillStyle = '#22232e';
      ctx.beginPath();
      ctx.ellipse(cx, cy - 75, 16, 26, 0, 0, Math.PI * 2);
      ctx.fill();

      // Neck finial brass
      ctx.fillStyle = '#ffaa44';
      ctx.beginPath();
      ctx.arc(cx, cy - 105, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Draw Morphing Coat Garment Silhouette
      ctx.save();

      // Fluid path with wave distortion
      ctx.beginPath();
      const topY = cy - 65;
      const collarLeft = cx - 22;
      const collarRight = cx + 22;

      // Left shoulder
      const leftShoulderX = cx - shoulders + Math.sin(t * 2) * 1.5;
      const leftShoulderY = cy - 40;

      // Left hem
      const leftHemX = cx - waist - 10 + wave;
      const leftHemY = cy + coatLen;

      // Right hem
      const rightHemX = cx + waist + 10 - wave;
      const rightHemY = cy + coatLen;

      // Right shoulder
      const rightShoulderX = cx + shoulders - Math.sin(t * 2) * 1.5;
      const rightShoulderY = cy - 40;

      // Trace coat outer path
      ctx.moveTo(collarLeft, topY);
      ctx.lineTo(leftShoulderX, leftShoulderY);
      // Left arm drop
      ctx.quadraticCurveTo(leftShoulderX - 25, cy + 30, leftHemX - 12, cy + coatLen * 0.7);
      ctx.lineTo(leftHemX, leftHemY);
      // Bottom hem curve
      ctx.quadraticCurveTo(cx, leftHemY + 12 + wave * 0.5, rightHemX, rightHemY);
      // Right arm drop
      ctx.lineTo(rightHemX + 12, cy + coatLen * 0.7);
      ctx.quadraticCurveTo(rightShoulderX + 25, cy + 30, rightShoulderX, rightShoulderY);
      ctx.lineTo(collarRight, topY);
      ctx.closePath();

      // Fill with dynamic lighting gradient
      const coatGrad = ctx.createLinearGradient(cx - shoulders, topY, cx + shoulders, leftHemY);
      coatGrad.addColorStop(0, toG.baseColor);
      coatGrad.addColorStop(0.5, '#161822');
      coatGrad.addColorStop(1, '#07080b');
      ctx.fillStyle = coatGrad;
      ctx.fill();

      // Stroke with glowing accent seam during morph
      ctx.lineWidth = isMorphing ? 2.5 : 1.2;
      ctx.strokeStyle = isMorphing ? toG.accentColor : 'rgba(255, 119, 17, 0.4)';
      ctx.stroke();

      // 3. Draw Lapels (morphing based on lapelType)
      ctx.beginPath();
      if (toG.lapelType === 'peak') {
        // Broad Peak Lapel
        ctx.moveTo(collarLeft, topY);
        ctx.lineTo(cx - 36 + wave * 0.5, cy - 10);
        ctx.lineTo(cx - 18, cy + 25);
        ctx.lineTo(cx, cy + 50);
        ctx.lineTo(cx + 18, cy + 25);
        ctx.lineTo(cx + 36 - wave * 0.5, cy - 10);
        ctx.lineTo(collarRight, topY);
      } else if (toG.lapelType === 'shawl') {
        // Continuous Curved Shawl Lapel
        ctx.moveTo(collarLeft, topY);
        ctx.quadraticCurveTo(cx - 30, cy + 10, cx, cy + 55);
        ctx.quadraticCurveTo(cx + 30, cy + 10, collarRight, topY);
      } else if (toG.lapelType === 'storm') {
        // Asymmetric Storm Flap
        ctx.moveTo(collarLeft, topY);
        ctx.lineTo(cx - 40, cy);
        ctx.lineTo(cx + 25, cy + 35);
        ctx.lineTo(cx, cy + 60);
        ctx.lineTo(collarRight, topY);
      } else {
        // Stand Collar
        ctx.moveTo(collarLeft, topY - 10);
        ctx.lineTo(collarLeft, topY + 10);
        ctx.lineTo(cx, cy + 70);
        ctx.lineTo(collarRight, topY + 10);
        ctx.lineTo(collarRight, topY - 10);
      }

      ctx.strokeStyle = toG.accentColor;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Center Seam Tape / Buttons
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 55);
      ctx.lineTo(cx, leftHemY);
      ctx.stroke();

      // Buttons
      for (let b = 0; b < 3; b++) {
        ctx.fillStyle = toG.accentColor;
        ctx.beginPath();
        ctx.arc(cx - 14, cy + 70 + b * 32, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Thread particles scattering during active morph
      if (isMorphing) {
        for (let i = 0; i < 18; i++) {
          const px = cx + (Math.sin(i * 1.7 + t * 6) * (shoulders + 20));
          const py = cy + (Math.cos(i * 2.3 + t * 4) * (coatLen * 0.6));
          ctx.fillStyle = toG.accentColor;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [selectedIdx, currentGarment, isMorphing]);

  return (
    <div className="relative w-full max-w-sm aspect-[3/4] bg-[#0c0d14] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-between p-5 border border-black/20 text-white select-none">
      {/* 1. Unicorn Studio Container Embed Integration */}
      <div
        ref={unicornContainerRef}
        data-us-project="nW3tMeZIGoPSbp6UT1s2"
        className="absolute inset-0 w-full h-full pointer-events-none opacity-40 z-0"
        style={{ width: '100%', height: '100%' }}
      />

      {/* Top HUD Telemetry */}
      <div className="relative z-10 flex items-center justify-between font-subline text-[10px] text-white/70">
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff7711] animate-pulse" />
          <span className="text-[#ffaa44] font-bold uppercase tracking-wider">
            {isMorphing ? 'MORPHING CLOTH...' : 'MORPH READY'}
          </span>
        </div>
        <span className="font-mono text-white/50">{currentGarment.weight}</span>
      </div>

      {/* Center Morph Canvas */}
      <div className="relative my-auto w-full flex items-center justify-center z-10">
        <canvas
          ref={canvasRef}
          width={320}
          height={380}
          className="w-full max-h-[340px] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.9)]"
        />

        {/* Morphing Indicator Badge */}
        {isMorphing && (
          <div className="absolute top-2 right-2 px-2.5 py-1 bg-black/80 hairline-border-amber rounded-full text-[9px] font-subline text-[#ffaa44] flex items-center gap-1 backdrop-blur-md">
            <RefreshCw className="w-2.5 h-2.5 animate-spin" />
            <span>Resynthesizing Weave</span>
          </div>
        )}
      </div>

      {/* Interactive Outfit Morph Selector Buttons */}
      <div className="relative z-10 space-y-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-[11px] font-subline">
          <span className="text-white/60">Active Silhouette:</span>
          <span className="font-headline font-bold text-white uppercase text-xs">
            {currentGarment.name}
          </span>
        </div>

        {/* 4 Clickable Garment Pills that Trigger Morph Effect */}
        <div className="grid grid-cols-2 gap-1.5">
          {GARMENTS.map((g, idx) => (
            <button
              key={g.id}
              onClick={() => handleSelectGarment(idx)}
              className={`px-2.5 py-1.5 rounded-lg text-[10px] font-subline font-bold transition-all text-left truncate flex items-center justify-between cursor-pointer ${
                selectedIdx === idx
                  ? 'bg-white text-[#0a0a0f] shadow-md'
                  : 'bg-white/10 text-white/70 hover:bg-white/15 hover:text-white'
              }`}
            >
              <span className="truncate">{g.name.split(' ')[0]} {g.name.split(' ')[1]}</span>
              {selectedIdx === idx && <Sparkles className="w-2.5 h-2.5 text-[#ff7711] shrink-0 ml-1" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
