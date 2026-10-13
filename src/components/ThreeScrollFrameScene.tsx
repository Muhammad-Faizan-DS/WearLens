import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeScrollFrameSceneProps {
  progress: number; // 0 to 1
  isScrollingDown: boolean;
}

export function ThreeScrollFrameScene({ progress }: ThreeScrollFrameSceneProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // References
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const figureGroupRef = useRef<THREE.Group | null>(null);
  const visorMeshRef = useRef<THREE.Mesh | null>(null);
  const visorGlowRef = useRef<THREE.PointLight | null>(null);
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null);
  const rimLightLeftRef = useRef<THREE.SpotLight | null>(null);
  const rimLightRightRef = useRef<THREE.SpotLight | null>(null);

  const targetProgressRef = useRef(progress);
  const currentProgressRef = useRef(progress);

  useEffect(() => {
    targetProgressRef.current = progress;
  }, [progress]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = null; // Transparent to blend with the white studio gradient

    // 2. Camera: Centered framing matching Zenrixa / Azentos
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 50);
    camera.position.set(0, 1.48, 4.3);
    camera.lookAt(0, 1.35, 0);
    cameraRef.current = camera;

    // 3. Renderer with ACES Filmic tonemapping
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Lighting Rig calibrated for White Studio Canvas (Zenrixa back-lit aesthetic)
    const ambientLight = new THREE.AmbientLight(0xdde2eb, 1.2);
    scene.add(ambientLight);

    // Soft front fill keeping model deep and silhouette-focused
    const frontFill = new THREE.DirectionalLight(0xa5acb8, 0.55);
    frontFill.position.set(0, 2.5, 3.5);
    scene.add(frontFill);

    // Key Light sweeps across model with scroll
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 1.6);
    keyLight.position.set(2.5, 3.5, 2.0);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);
    keyLightRef.current = keyLight;

    // Back-Rim Spotlights (carving silhouette edges against light background)
    const rimLeft = new THREE.SpotLight(0xffffff, 9.5);
    rimLeft.position.set(-2.6, 2.4, -2.0);
    rimLeft.target.position.set(0, 1.4, 0);
    rimLeft.angle = Math.PI / 4;
    rimLeft.penumbra = 0.85;
    scene.add(rimLeft);
    scene.add(rimLeft.target);
    rimLightLeftRef.current = rimLeft;

    const rimRight = new THREE.SpotLight(0xfff6ec, 9.0);
    rimRight.position.set(2.6, 2.4, -2.0);
    rimRight.target.position.set(0, 1.4, 0);
    rimRight.angle = Math.PI / 4;
    rimRight.penumbra = 0.85;
    scene.add(rimRight);
    scene.add(rimRight.target);
    rimLightRightRef.current = rimRight;

    // 5. Studio Floor with soft shadow receiver on light floor
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, shadowMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    scene.add(floor);

    // 6. Centered Model Figure Group (Matte Black Silhouette with Amber Visor)
    const figureGroup = new THREE.Group();
    figureGroup.position.set(0, 0, 0);
    figureGroupRef.current = figureGroup;
    scene.add(figureGroup);

    // Deep Obsidian Silhouette Material
    const silhouetteMat = new THREE.MeshStandardMaterial({
      color: 0x090a0f,
      roughness: 0.65,
      metalness: 0.15,
    });

    const coatMat = new THREE.MeshPhysicalMaterial({
      color: 0x07080c,
      roughness: 0.6,
      metalness: 0.25,
      clearcoat: 0.2,
      sheen: 0.7,
      sheenColor: new THREE.Color(0x383a48),
    });

    // High-Tech Amber Visor (Zenrixa Signature glowing visor)
    const visorMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xff6600),
      emissive: new THREE.Color(0xff4400),
      emissiveIntensity: 0.6,
      roughness: 0.08,
      metalness: 0.1,
      transmission: 0.55,
      ior: 1.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
    });

    const visorFrameMat = new THREE.MeshStandardMaterial({
      color: 0x111216,
      roughness: 0.25,
      metalness: 0.95,
    });

    // Shoulders
    const shouldersGeo = new THREE.CylinderGeometry(0.38, 0.34, 0.45, 32);
    const shoulders = new THREE.Mesh(shouldersGeo, coatMat);
    shoulders.position.y = 1.35;
    shoulders.scale.set(1.45, 1.0, 0.8);
    shoulders.castShadow = true;
    figureGroup.add(shoulders);

    // High Structured Collar
    const collarGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.22, 32);
    const collar = new THREE.Mesh(collarGeo, coatMat);
    collar.position.y = 1.62;
    collar.castShadow = true;
    figureGroup.add(collar);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.25, 24);
    const neck = new THREE.Mesh(neckGeo, silhouetteMat);
    neck.position.y = 1.74;
    neck.castShadow = true;
    figureGroup.add(neck);

    // Head
    const headGeo = new THREE.SphereGeometry(0.18, 32, 24);
    const head = new THREE.Mesh(headGeo, silhouetteMat);
    head.scale.set(0.9, 1.25, 1.05);
    head.position.set(0, 1.95, 0.02);
    head.castShadow = true;
    figureGroup.add(head);

    // Amber Visor Assembly
    const visorGroup = new THREE.Group();
    visorGroup.position.set(0, 1.96, 0.15);
    figureGroup.add(visorGroup);

    const visorLensGeo = new THREE.CylinderGeometry(
      0.17,
      0.17,
      0.08,
      32,
      1,
      true,
      -Math.PI * 0.45,
      Math.PI * 0.9
    );
    const visorLens = new THREE.Mesh(visorLensGeo, visorMat);
    visorLens.rotation.y = Math.PI / 2;
    visorGroup.add(visorLens);
    visorMeshRef.current = visorLens;

    // Visor Bridge Light Bar
    const bridgeGeo = new THREE.BoxGeometry(0.04, 0.008, 0.02);
    const bridgeMat = new THREE.MeshBasicMaterial({ color: 0xffaa44 });
    const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
    bridge.position.set(0, 0.045, 0.165);
    visorGroup.add(bridge);

    const frameGeo = new THREE.TorusGeometry(0.175, 0.006, 8, 32, Math.PI * 0.9);
    const frameMesh = new THREE.Mesh(frameGeo, visorFrameMat);
    frameMesh.rotation.x = Math.PI / 2;
    frameMesh.position.set(0, 0.04, 0);
    visorGroup.add(frameMesh);

    // Visor Amber Radiance Light
    const visorGlow = new THREE.PointLight(0xff6600, 1.4, 1.8);
    visorGlow.position.set(0, 1.96, 0.35);
    scene.add(visorGlow);
    visorGlowRef.current = visorGlow;

    // 7. 60fps Bidirectional Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const time = clock.getElapsedTime();

      // Lerp progress smoothly
      currentProgressRef.current += (targetProgressRef.current - currentProgressRef.current) * 0.08;
      const p = currentProgressRef.current;

      // A. Camera Dolly & Elevation driven by scroll
      camera.position.z = 4.3 - p * 1.2;
      camera.position.y = 1.48 + p * 0.15;
      camera.position.x = Math.sin(p * Math.PI) * 0.14;
      camera.lookAt(0, 1.35 + p * 0.1, 0);

      // B. 3D Figure 360° Rotation: turns as user scrolls down, reverses up!
      if (figureGroupRef.current) {
        figureGroupRef.current.rotation.y = Math.sin(p * Math.PI * 0.8) * 0.45;
        figureGroupRef.current.position.y = Math.sin(time * 0.8) * 0.003;
      }

      // C. Lighting Sweeps
      if (keyLightRef.current) {
        keyLightRef.current.position.x = 2.5 - p * 4.5;
        keyLightRef.current.intensity = 1.6 + Math.sin(p * Math.PI) * 1.0;
      }

      if (rimLightLeftRef.current && rimLightRightRef.current) {
        rimLightLeftRef.current.intensity = 9.5 + Math.sin(p * Math.PI) * 3.0;
        rimLightRightRef.current.intensity = 9.0 + Math.cos(p * Math.PI) * 3.0;
      }

      // D. Visor Pulse
      if (visorGlowRef.current) {
        visorGlowRef.current.intensity = 1.4 + Math.sin(time * 2.0) * 0.25 + p * 0.8;
      }

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
      window.removeEventListener('resize', handleResize);
      if (rendererRef.current && rendererRef.current.domElement) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      className="w-full h-full cursor-default select-none pointer-events-auto"
      aria-label="Three.js centered silhouette model with amber visor"
    />
  );
}
