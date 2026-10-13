import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OutfitPreset } from '../types/fashion';

export type CameraAngle = 'full' | 'lapel' | 'profile';
export type StudioLighting = 'warm' | 'daylight' | 'chiaroscuro';

interface ThreeMannequinSceneProps {
  currentOutfit: OutfitPreset;
  isResolving: boolean;
  cameraAngle?: CameraAngle;
  lightingMode?: StudioLighting;
  tensileStiffness?: number; // 0.1 to 1.0
}

export function ThreeMannequinScene({
  currentOutfit,
  isResolving,
  cameraAngle = 'full',
  lightingMode = 'warm',
  tensileStiffness = 0.8,
}: ThreeMannequinSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep across re-renders
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const garmentMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const lapelMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const innerMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const fillLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightRef = useRef<THREE.SpotLight | null>(null);
  const overheadSpotRef = useRef<THREE.SpotLight | null>(null);
  const mannequinGroupRef = useRef<THREE.Group | null>(null);
  const coatGroupRef = useRef<THREE.Group | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetRotationRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollOffsetRef = useRef<number>(0);

  // Target camera position based on angle
  const targetCameraPosRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.45, 4.4));
  const targetCameraLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 1.25, 0));

  // Update camera angle target
  useEffect(() => {
    if (cameraAngle === 'lapel') {
      targetCameraPosRef.current.set(0.15, 1.68, 2.2);
      targetCameraLookAtRef.current.set(0, 1.62, 0.2);
    } else if (cameraAngle === 'profile') {
      targetCameraPosRef.current.set(2.4, 1.4, 3.2);
      targetCameraLookAtRef.current.set(0, 1.25, 0);
    } else {
      // 'full'
      targetCameraPosRef.current.set(0, 1.45, 4.4);
      targetCameraLookAtRef.current.set(0, 1.25, 0);
    }
  }, [cameraAngle]);

  // Update studio lighting mode
  useEffect(() => {
    if (!keyLightRef.current || !fillLightRef.current || !rimLightRef.current || !overheadSpotRef.current) return;

    if (lightingMode === 'daylight') {
      keyLightRef.current.color.setHex(0xf4f6fb);
      keyLightRef.current.intensity = 2.8;
      fillLightRef.current.color.setHex(0xd0d8e8);
      fillLightRef.current.intensity = 1.1;
      rimLightRef.current.color.setHex(0xe8eef8);
      rimLightRef.current.intensity = 3.0;
      overheadSpotRef.current.color.setHex(0xffffff);
      overheadSpotRef.current.intensity = 2.5;
    } else if (lightingMode === 'chiaroscuro') {
      keyLightRef.current.color.setHex(0xd4af37);
      keyLightRef.current.intensity = 1.2;
      fillLightRef.current.color.setHex(0x181824);
      fillLightRef.current.intensity = 0.2;
      rimLightRef.current.color.setHex(0xffffff);
      rimLightRef.current.intensity = 5.5;
      overheadSpotRef.current.color.setHex(0xc8aa6e);
      overheadSpotRef.current.intensity = 1.0;
    } else {
      // 'warm' atelier
      keyLightRef.current.color.setHex(0xfff5e6);
      keyLightRef.current.intensity = 2.4;
      fillLightRef.current.color.setHex(0x7688a8);
      fillLightRef.current.intensity = 0.85;
      rimLightRef.current.color.setHex(0xc8aa6e);
      rimLightRef.current.intensity = 3.8;
      overheadSpotRef.current.color.setHex(0xfff0d8);
      overheadSpotRef.current.intensity = 2.2;
    }
  }, [lightingMode]);

  // Update materials when outfit changes
  useEffect(() => {
    if (!garmentMaterialRef.current) return;

    const targetColor = new THREE.Color(currentOutfit.colorHex);
    const targetAccent = new THREE.Color(currentOutfit.accentHex);

    const duration = 750;
    const start = performance.now();
    const initialGarmentColor = garmentMaterialRef.current.color.clone();
    const initialLapelColor = lapelMaterialRef.current?.color.clone() || targetAccent;

    let frameId: number;

    const animateTransition = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      if (garmentMaterialRef.current) {
        garmentMaterialRef.current.color.lerpColors(initialGarmentColor, targetColor, ease);
        garmentMaterialRef.current.roughness = currentOutfit.id === 'velvet-smoking' ? 0.95 : 0.62;
        garmentMaterialRef.current.metalness = currentOutfit.id === 'sand-trench' ? 0.16 : 0.04;
        garmentMaterialRef.current.clearcoat = currentOutfit.id === 'sand-trench' ? 0.28 : 0.02;
        garmentMaterialRef.current.sheenRoughness = 0.45;
      }

      if (lapelMaterialRef.current) {
        lapelMaterialRef.current.color.lerpColors(initialLapelColor, targetAccent, ease);
      }

      if (progress < 1) {
        frameId = requestAnimationFrame(animateTransition);
      }
    };

    frameId = requestAnimationFrame(animateTransition);

    return () => cancelAnimationFrame(frameId);
  }, [currentOutfit]);

  // Scroll listener for subtle parallax rotation
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      scrollOffsetRef.current = scrollY * 0.0007; // gentle continuous rotation
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 700;

    // 1. Scene & Dark Atmosphere
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x070709);
    scene.fog = new THREE.FogExp2(0x070709, 0.075);

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 50);
    camera.position.set(0, 1.45, 4.4);
    camera.lookAt(0, 1.25, 0);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0x181820, 0.65);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfff5e6, 2.4);
    keyLight.position.set(2.4, 3.6, 2.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    const fillLight = new THREE.DirectionalLight(0x7688a8, 0.85);
    fillLight.position.set(-3.0, 1.8, 1.5);
    scene.add(fillLight);
    fillLightRef.current = fillLight;

    const rimLight = new THREE.SpotLight(0xc8aa6e, 3.8);
    rimLight.position.set(-1.8, 2.8, -2.5);
    rimLight.target.position.set(0, 1.3, 0);
    rimLight.angle = Math.PI / 4.5;
    rimLight.penumbra = 0.8;
    scene.add(rimLight);
    scene.add(rimLight.target);
    rimLightRef.current = rimLight;

    const overheadSpot = new THREE.SpotLight(0xfff0d8, 2.2);
    overheadSpot.position.set(0, 4.5, 0.5);
    overheadSpot.target.position.set(0, 1.0, 0);
    overheadSpot.angle = Math.PI / 6;
    overheadSpot.penumbra = 0.9;
    scene.add(overheadSpot);
    scene.add(overheadSpot.target);
    overheadSpotRef.current = overheadSpot;

    // 5. Studio Floor
    const floorGeo = new THREE.PlaneGeometry(20, 20);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x09090c,
      roughness: 0.65,
      metalness: 0.28,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // Decorative Studio Floor Ring
    const ringGeo = new THREE.RingGeometry(0.85, 0.865, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x282834,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.002;
    scene.add(ring);

    // 6. Mannequin Assembly Group
    const mannequinGroup = new THREE.Group();
    mannequinGroupRef.current = mannequinGroup;
    scene.add(mannequinGroup);

    // A. Pedestal & Cast Metal Stand
    const standMaterial = new THREE.MeshStandardMaterial({
      color: 0x18181f,
      roughness: 0.35,
      metalness: 0.85,
    });
    const brassAccents = new THREE.MeshStandardMaterial({
      color: 0xa0854d,
      roughness: 0.28,
      metalness: 0.92,
    });

    const baseTier1 = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.04, 32), standMaterial);
    baseTier1.position.y = 0.02;
    baseTier1.receiveShadow = true;
    baseTier1.castShadow = true;
    mannequinGroup.add(baseTier1);

    const baseTier2 = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.30, 0.04, 32), standMaterial);
    baseTier2.position.y = 0.06;
    baseTier2.castShadow = true;
    mannequinGroup.add(baseTier2);

    const baseCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 0.06, 24), brassAccents);
    baseCollar.position.y = 0.11;
    mannequinGroup.add(baseCollar);

    const standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 1.35, 24), standMaterial);
    standRod.position.y = 0.78;
    standRod.castShadow = true;
    mannequinGroup.add(standRod);

    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16), brassAccents);
    knob.rotation.z = Math.PI / 2;
    knob.position.set(0.04, 0.85, 0);
    mannequinGroup.add(knob);

    // B. Tailor's Linen Dress Form
    const linenMaterial = new THREE.MeshStandardMaterial({
      color: 0x202026,
      roughness: 0.85,
      metalness: 0.05,
    });

    const hips = new THREE.Mesh(new THREE.CylinderGeometry(0.23, 0.25, 0.35, 32), linenMaterial);
    hips.position.y = 1.05;
    hips.castShadow = true;
    hips.receiveShadow = true;
    mannequinGroup.add(hips);

    const waist = new THREE.Mesh(new THREE.CylinderGeometry(0.20, 0.23, 0.25, 32), linenMaterial);
    waist.position.y = 1.32;
    waist.castShadow = true;
    waist.receiveShadow = true;
    mannequinGroup.add(waist);

    const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.20, 0.40, 32), linenMaterial);
    chest.position.y = 1.62;
    chest.castShadow = true;
    chest.receiveShadow = true;
    mannequinGroup.add(chest);

    const shoulders = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.27, 0.16, 32), linenMaterial);
    shoulders.position.y = 1.82;
    shoulders.castShadow = true;
    shoulders.receiveShadow = true;
    mannequinGroup.add(shoulders);

    const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.10, 0.12, 0.18, 24), linenMaterial);
    neck.position.y = 1.96;
    neck.castShadow = true;
    mannequinGroup.add(neck);

    const finialCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.09, 0.03, 24), brassAccents);
    finialCollar.position.y = 2.06;
    mannequinGroup.add(finialCollar);

    const finialAcorn = new THREE.Mesh(new THREE.SphereGeometry(0.065, 24, 16), brassAccents);
    finialAcorn.scale.set(0.9, 1.4, 0.9);
    finialAcorn.position.y = 2.13;
    mannequinGroup.add(finialAcorn);

    // Seam Line Tapes
    const seamTapeMat = new THREE.MeshBasicMaterial({ color: 0x48423a, transparent: true, opacity: 0.6 });
    const centerFrontTape = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.95, 0.01), seamTapeMat);
    centerFrontTape.position.set(0, 1.45, 0.25);
    mannequinGroup.add(centerFrontTape);

    const bustLineTape = new THREE.Mesh(new THREE.TorusGeometry(0.275, 0.004, 8, 36), seamTapeMat);
    bustLineTape.rotation.x = Math.PI / 2;
    bustLineTape.position.set(0, 1.64, 0);
    mannequinGroup.add(bustLineTape);

    // C. Draped Garment
    const garmentMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(currentOutfit.colorHex),
      roughness: 0.68,
      metalness: 0.08,
      sheen: 0.8,
      sheenColor: new THREE.Color(0xffffff),
    });
    garmentMaterialRef.current = garmentMat;

    const lapelMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(currentOutfit.accentHex),
      roughness: 0.5,
      metalness: 0.2,
    });
    lapelMaterialRef.current = lapelMat;

    const innerMat = new THREE.MeshStandardMaterial({
      color: 0xf0ede6,
      roughness: 0.85,
    });
    innerMaterialRef.current = innerMat;

    const innerBase = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.14, 0.12, 24), innerMat);
    innerBase.position.y = 1.91;
    mannequinGroup.add(innerBase);

    const innerPlacket = new THREE.Mesh(new THREE.PlaneGeometry(0.12, 0.42), innerMat);
    innerPlacket.position.set(0, 1.62, 0.245);
    mannequinGroup.add(innerPlacket);

    // Garment Coat Group
    const coatGroup = new THREE.Group();
    coatGroup.position.set(0, 1.48, 0);
    mannequinGroup.add(coatGroup);
    coatGroupRef.current = coatGroup;

    const leftPanel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.36, 0.95, 24, 1, false, Math.PI * 0.18, Math.PI * 0.7),
      garmentMat
    );
    leftPanel.castShadow = true;
    leftPanel.receiveShadow = true;
    coatGroup.add(leftPanel);

    const rightPanel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.325, 0.365, 0.95, 24, 1, false, Math.PI * 1.12, Math.PI * 0.7),
      garmentMat
    );
    rightPanel.castShadow = true;
    rightPanel.receiveShadow = true;
    coatGroup.add(rightPanel);

    const backPanel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.32, 0.36, 0.95, 24, 1, false, -Math.PI * 0.4, Math.PI * 0.8),
      garmentMat
    );
    backPanel.castShadow = true;
    coatGroup.add(backPanel);

    // Lapels
    const lapelGeo = new THREE.BufferGeometry();
    const lapelVerts = new Float32Array([
      0.03, 0.40, 0.28,
      0.18, 0.25, 0.30,
      0.04, 0.05, 0.31,
      0.03, 0.40, 0.28,
      0.22, 0.36, 0.27,
      0.18, 0.25, 0.30,
    ]);
    lapelGeo.setAttribute('position', new THREE.BufferAttribute(lapelVerts, 3));
    lapelGeo.computeVertexNormals();
    const leftLapel = new THREE.Mesh(lapelGeo, lapelMat);
    coatGroup.add(leftLapel);

    const rightLapelGeo = new THREE.BufferGeometry();
    const rightLapelVerts = new Float32Array([
      -0.03, 0.40, 0.28,
      -0.04, 0.05, 0.31,
      -0.18, 0.25, 0.30,
      -0.03, 0.40, 0.28,
      -0.18, 0.25, 0.30,
      -0.22, 0.36, 0.27,
    ]);
    rightLapelGeo.setAttribute('position', new THREE.BufferAttribute(rightLapelVerts, 3));
    rightLapelGeo.computeVertexNormals();
    const rightLapel = new THREE.Mesh(rightLapelGeo, lapelMat);
    coatGroup.add(rightLapel);

    // Sleeves
    const sleeveGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.72, 24);
    const leftSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
    leftSleeve.position.set(0.38, -0.05, 0.02);
    leftSleeve.rotation.z = -0.16;
    leftSleeve.rotation.x = 0.08;
    leftSleeve.castShadow = true;
    coatGroup.add(leftSleeve);

    const rightSleeve = new THREE.Mesh(sleeveGeo, garmentMat);
    rightSleeve.position.set(-0.38, -0.05, 0.02);
    rightSleeve.rotation.z = 0.16;
    rightSleeve.rotation.x = 0.08;
    rightSleeve.castShadow = true;
    coatGroup.add(rightSleeve);

    // Particles
    const particleCount = 85;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 3;
      particlePositions[i + 1] = 0.5 + Math.random() * 2.2;
      particlePositions[i + 2] = (Math.random() - 0.5) * 2.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xdec085,
      size: 0.015,
      transparent: true,
      opacity: 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Pointer Interaction (Subtle Parallax)
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mousePosRef.current = { x: normX, y: normY };
      targetRotationRef.current = {
        x: normY * 0.04,
        y: normX * 0.14,
      };
    };

    const handleMouseLeave = () => {
      targetRotationRef.current = { x: 0, y: 0 };
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();
    const currentCameraLookAt = new THREE.Vector3(0, 1.25, 0);

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Smooth Camera Transition to target position
      if (cameraRef.current) {
        cameraRef.current.position.lerp(targetCameraPosRef.current, 0.05);
        currentCameraLookAt.lerp(targetCameraLookAtRef.current, 0.05);
        cameraRef.current.lookAt(currentCameraLookAt);
      }

      // Parallax + Scroll Rotation
      if (mannequinGroupRef.current) {
        const breath = Math.sin(time * 0.8) * 0.003;
        mannequinGroupRef.current.position.y = breath;

        // Combine pointer parallax + scroll-driven rotation
        const totalTargetY = targetRotationRef.current.y + scrollOffsetRef.current;
        mannequinGroupRef.current.rotation.y += (totalTargetY - mannequinGroupRef.current.rotation.y) * 0.05;
        mannequinGroupRef.current.rotation.x += (targetRotationRef.current.x - mannequinGroupRef.current.rotation.x) * 0.05;
      }

      // Dynamic Fabric Drape Ripple based on tensile stiffness
      if (coatGroupRef.current) {
        const rippleSpeed = 1.2;
        const rippleAmp = (1 - tensileStiffness) * 0.012; // softer fabric has more ripple
        coatGroupRef.current.rotation.z = Math.sin(time * rippleSpeed) * rippleAmp;
      }

      // Particle float
      const positions = particleGeo.attributes.position.array as Float32Array;
      for (let i = 1; i < positions.length; i += 3) {
        positions[i] += Math.sin(time + i) * 0.0006;
      }
      particleGeo.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container || !rendererRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);

      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[580px] sm:h-[640px] lg:h-[720px] flex items-center justify-center overflow-hidden">
      <div 
        ref={mountRef} 
        className="w-full h-full cursor-default select-none pointer-events-auto"
        aria-label="Interactive 3D couture mannequin preview in photo studio"
      />

      <div className="absolute inset-0 pointer-events-none studio-spotlight" />
      <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-[#070709] via-[#070709]/80 to-transparent pointer-events-none" />
      <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-[#070709] to-transparent pointer-events-none" />

      {isResolving && (
        <div className="absolute inset-0 bg-[#c8aa6e]/5 backdrop-blur-[1px] transition-opacity duration-300 pointer-events-none flex items-center justify-center">
          <div className="text-[11px] uppercase tracking-[0.25em] text-[#d6b77c] font-medium bg-[#070709]/85 px-4 py-2 border border-[#c8aa6e]/30 backdrop-blur-md shadow-2xl">
            Neural drape resolving 3.0s
          </div>
        </div>
      )}
    </div>
  );
}
