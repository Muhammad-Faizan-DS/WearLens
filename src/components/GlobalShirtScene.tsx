import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Models are compressed with glTF-Transform (Meshopt geometry, WebP textures, simplified
// meshes); the uncompressed originals are kept in the project root. To add or re-export one:
//   npx @gltf-transform/cli optimize in.glb public/models/out.glb --texture-compress webp --texture-size 1024 --simplify-error 0.001
// Listed in scroll order, which is also the order they're loaded in.
// `yaw` turns each export so its front faces the camera (free_shirt is modelled side-on).
const MODELS = [
  { url: '/models/free_shirt.glb', yaw: -Math.PI / 2 },
  { url: '/models/racks_airlines.glb', yaw: 0 },
  { url: '/models/shirt.glb', yaw: 0 },
  { url: '/models/realistic_dress_shirt.glb', yaw: 0 },
];

// Every model is normalised so its largest dimension is this many world units.
const MODEL_SIZE = 2.6;

// Where the shirt can sit. 'philosophy' / 'result' resolve to the empty column
// marked with data-shirt-anchor in that section.
type Anchor = 'center' | 'philosophy' | 'result' | 'fitting';

// Scroll keyframes. As the page scrolls the scene's "stage" runs 0 → POSES.length - 1
// and the shirt is interpolated between neighbouring poses.
const POSES: { anchor: Anchor; turn: number; model: number }[] = [
  { anchor: 'center', turn: 0, model: 0 },                       // 0 hero
  { anchor: 'philosophy', turn: Math.PI * 2 + 0.6, model: 1 },   // 1 lands left, angled toward the copy
  { anchor: 'philosophy', turn: Math.PI * 2 - 0.2, model: 1 },   // 2 slow turn while the copy scrolls by
  { anchor: 'result', turn: Math.PI * 4 - 0.6, model: 2 },       // 3 lands right, angled toward the copy
  { anchor: 'result', turn: Math.PI * 4 + 0.2, model: 2 },       // 4 slow turn while the copy scrolls by
  { anchor: 'fitting', turn: Math.PI * 6, model: 3 },            // 5 fitting
];

// On the two-column layout each glide starts while the next section is still 30% of a
// screen below the fold, so the shirt crosses over ~105vh of scroll instead of 75vh.
// Single-column sections are too short for that, so they glide over the plain 75vh.
const isTwoColumn = () => window.matchMedia('(min-width: 1024px)').matches;
const glideFrom = () => (isTwoColumn() ? 'top 130%' : 'top bottom');
const holdUntil = () => (isTwoColumn() ? 'bottom 130%' : 'bottom bottom');

// One ScrollTrigger range per step between poses. The ranges are back-to-back,
// so exactly one step is in progress at any scroll position.
const glide = gsap.parseEase('power2.inOut');
const hold = gsap.parseEase('none');
const STEPS = [
  { trigger: '#philosophy', start: glideFrom, end: 'top 25%', ease: glide },  // 0 → 1
  { trigger: '#philosophy', start: 'top 25%', end: holdUntil, ease: hold },   // 1 → 2
  { trigger: '#result', start: glideFrom, end: 'top 25%', ease: glide },      // 2 → 3
  { trigger: '#result', start: 'top 25%', end: holdUntil, ease: hold },       // 3 → 4
  { trigger: '#fitting', start: glideFrom, end: 'top 25%', ease: glide },     // 4 → 5
];

// How quickly the shirt catches up with the scroll position (higher = snappier).
const FOLLOW_SPEED = 4;

// Models fade in over this long once loaded instead of popping in.
const FADE_IN_MS = 600;

interface LoadedModel {
  wrapper: THREE.Group;
  materials: THREE.Material[];
  addedAt: number;
  // Whether its textures and geometry have been uploaded to the GPU yet.
  uploaded: boolean;
}

export function GlobalShirtScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const container = mountRef.current;
    let disposed = false;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    container.appendChild(renderer.domElement);

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambient);

    const dirLight = new THREE.DirectionalLight(0xffffff, 2);
    dirLight.position.set(2, 5, 3);
    scene.add(dirLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 1.5);
    backLight.position.set(-2, 3, -4);
    scene.add(backLight);

    const modelsGroup = new THREE.Group();
    scene.add(modelsGroup);

    const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
    const loadedModels: LoadedModel[] = [];

    const addModel = async (model: THREE.Group, i: number) => {
      // Normalise size and centre the model on the wrapper's origin. The wrapper's own
      // scale is driven per frame, so the normalisation must live on the inner model only.
      const box = new THREE.Box3().setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const scale = MODEL_SIZE / Math.max(size.x, size.y, size.z);
      model.scale.setScalar(scale);
      model.position.sub(center.multiplyScalar(scale));

      const wrapper = new THREE.Group();
      wrapper.add(model);
      wrapper.visible = false;
      wrapper.userData.yaw = MODELS[i].yaw;

      const materials: THREE.Material[] = [];
      model.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh || !mesh.material) return;
        const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
        mats.forEach((mat) => {
          mat.userData.baseTransparent = mat.transparent;
          materials.push(mat);
        });
      });

      modelsGroup.add(wrapper);

      // Compile both shader variants up front: transparent while crossfading, opaque while
      // resting. Left to the first draw, compiling froze the page for 100–400ms right as
      // each shirt started to appear.
      for (const fading of [true, false]) {
        materials.forEach((mat) => {
          mat.transparent = fading || mat.userData.baseTransparent;
          mat.needsUpdate = true;
        });
        await renderer.compileAsync(wrapper, camera, scene);
        if (disposed) return;
      }

      loadedModels[i] = { wrapper, materials, addedAt: performance.now(), uploaded: false };
    };

    // One at a time, in scroll order, so the hero shirt isn't sharing bandwidth with
    // models the visitor won't see until further down the page.
    (async () => {
      for (let i = 0; i < MODELS.length; i++) {
        try {
          const gltf = await loader.loadAsync(MODELS[i].url);
          if (disposed) return;
          // Not awaited: shader compilation runs alongside the next download.
          addModel(gltf.scene, i).catch((err) => console.error(`Failed to prepare ${MODELS[i].url}`, err));
        } catch (err) {
          console.error(`Failed to load ${MODELS[i].url}`, err);
        }
      }
    })();

    // Opacity is only enabled while a model is actually fading. Leaving every material
    // transparent all the time breaks depth sorting between the shirt's own meshes.
    const setOpacity = ({ materials }: LoadedModel, opacity: number) => {
      const fading = opacity < 0.999;
      materials.forEach((mat) => {
        const transparent = fading || mat.userData.baseTransparent;
        if (mat.transparent !== transparent) {
          mat.transparent = transparent;
          mat.needsUpdate = true;
        }
        mat.opacity = opacity;
      });
    };

    // Resolve each anchor to a world-space x position, a fit-to-column scale, and an opacity.
    // Re-measured on resize / ScrollTrigger refresh since the columns move with the layout.
    const CENTERED = { x: 0, fit: 1, alpha: 1 };
    // Single-column layout: no empty column to park in, so sit behind the copy, dimmed.
    const DIMMED = { x: 0, fit: 0.8, alpha: 0.25 };

    const anchors: Record<Anchor, { x: number; fit: number; alpha: number }> = {
      center: CENTERED,
      philosophy: CENTERED,
      result: CENTERED,
      fitting: CENTERED,
    };

    const measureAnchors = () => {
      const halfHeight = camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const halfWidth = halfHeight * camera.aspect;

      (['philosophy', 'result'] as const).forEach((name) => {
        const el = document.querySelector<HTMLElement>(`[data-shirt-anchor="${name}"]`);
        const rect = el?.getBoundingClientRect();
        if (!rect || rect.width === 0) {
          anchors[name] = DIMMED;
          return;
        }
        const centerNdc = ((rect.left + rect.width / 2) / window.innerWidth) * 2 - 1;
        const columnWorldWidth = (rect.width / window.innerWidth) * halfWidth * 2;
        anchors[name] = {
          x: centerNdc * halfWidth,
          fit: THREE.MathUtils.clamp((columnWorldWidth * 0.95) / MODEL_SIZE, 0.5, 1),
          alpha: 1,
        };
      });

      // Fitting has an opaque background that slides over the shirt. On single-column layouts
      // stay dimmed so the shirt doesn't brighten over the Result copy on its way there.
      anchors.fitting = anchors.result === DIMMED ? DIMMED : CENTERED;
    };

    measureAnchors();
    ScrollTrigger.addEventListener('refresh', measureAnchors);

    const triggers = STEPS.map(({ trigger, start, end }) =>
      ScrollTrigger.create({ trigger, start, end })
    );

    // Active once Fitting has scrolled past the top of the viewport: from there on the
    // solid sections below hide the canvas completely.
    const covered = ScrollTrigger.create({ trigger: '#fitting', start: 'top top', end: 'max' });

    // Interactive cursor tracking
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };

    const onMouseMove = (e: MouseEvent) => {
      // Normalize to -1 to 1
      targetMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      targetMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', onMouseMove);

    // Animation loop
    let reqId: number;
    let stage = -1;
    let lastBlur = -1;
    // The first frames step through every blur size while the canvas is still empty, so the
    // browser has them all ready before the first transition needs them.
    let blurWarmUp = 8;
    let lastCanvasOpacity = -1;
    let lastTime = performance.now();
    const startTime = lastTime;

    const tick = () => {
      reqId = requestAnimationFrame(tick);
      const now = performance.now();
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      const time = (now - startTime) / 1000;
      lastTime = now;

      // Nothing visible to draw; skip the work until the visitor scrolls back up.
      if (covered.isActive) return;

      // Scroll position → stage, eased toward so fast scrolls and nav jumps glide instead of snapping.
      const targetStage = triggers.reduce((sum, st) => sum + st.progress, 0);
      stage = stage < 0 ? targetStage : stage + (targetStage - stage) * (1 - Math.exp(-dt * FOLLOW_SPEED));

      const step = Math.min(Math.floor(stage), STEPS.length - 1);
      const t = STEPS[step].ease(stage - step);
      const from = POSES[step];
      const to = POSES[step + 1];
      const a = anchors[from.anchor];
      const b = anchors[to.anchor];

      const xPos = THREE.MathUtils.lerp(a.x, b.x, t);
      const fit = THREE.MathUtils.lerp(a.fit, b.fit, t);
      const alpha = THREE.MathUtils.lerp(a.alpha, b.alpha, t);
      const turn = THREE.MathUtils.lerp(from.turn, to.turn, t);
      const modelIndex = THREE.MathUtils.lerp(from.model, to.model, t);

      // Smoothly lerp mouse position
      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Add subtle parallax to the whole group based on mouse
      modelsGroup.position.x = xPos + mouse.x * 0.5;
      modelsGroup.position.y = mouse.y * 0.2;

      // Transition phase for Blur & Morph (0 = resting on a model, 1 = halfway between two)
      const fractional = modelIndex % 1;
      const transitionPhase = 1 - Math.abs(fractional * 2 - 1);

      // Whole pixels only: the browser builds a new blur shader for every distinct radius it
      // sees, and fractional steps made the first transition stutter while it built dozens.
      const blur = blurWarmUp > 0 ? blurWarmUp-- : Math.round(transitionPhase * 8);
      if (blur !== lastBlur) {
        container.style.filter = blur > 0 ? `blur(${blur}px)` : '';
        lastBlur = blur;
      }

      // Dim the whole canvas rather than the materials: a garment's layers overlap, so
      // per-material opacity stacks up and comes out much darker than intended.
      const canvasOpacity = Math.round(alpha * 100) / 100;
      if (canvasOpacity !== lastCanvasOpacity) {
        container.style.opacity = canvasOpacity < 1 ? String(canvasOpacity) : '';
        lastCanvasOpacity = canvasOpacity;
      }

      loadedModels.forEach((entry, i) => {
        if (!entry) return;
        const { wrapper } = entry;

        // First frame after it's ready: draw it once at zero opacity so its textures and
        // geometry are uploaded now, not on the frame it first has to appear.
        if (!entry.uploaded) {
          entry.uploaded = true;
          wrapper.visible = true;
          setOpacity(entry, 0);
          return;
        }

        // Smoother opacity crossfade calculation
        const distance = Math.abs(modelIndex - i);
        const rawTargetOpacity = Math.max(0, 1 - distance);
        const fadeIn = Math.min(1, (now - entry.addedAt) / FADE_IN_MS);
        const targetOpacity = Math.pow(rawTargetOpacity, 3) * fadeIn;

        wrapper.visible = targetOpacity > 0.001;
        if (!wrapper.visible) return;

        // Base rotation + scroll rotation + slight idle float + cursor interaction
        wrapper.rotation.y = wrapper.userData.yaw + turn + Math.sin(time) * 0.1 + mouse.x * 0.3;
        wrapper.rotation.x = -mouse.y * 0.2;
        wrapper.position.y = Math.sin(time * 2 + i) * 0.1;

        // Morph & warp while crossfading
        const fadeBump = 1 + (1 - rawTargetOpacity) * 0.1;
        const morphStretchY = 1 + transitionPhase * 0.2;
        const morphSqueezeXZ = 1 - transitionPhase * 0.1;

        wrapper.scale.set(
          fit * fadeBump * morphSqueezeXZ,
          fit * fadeBump * morphStretchY,
          fit * fadeBump * morphSqueezeXZ
        );

        setOpacity(entry, targetOpacity);
      });

      renderer.render(scene, camera);
    };

    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      measureAnchors();
    };
    window.addEventListener('resize', onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(reqId);
      triggers.forEach((st) => st.kill());
      covered.kill();
      ScrollTrigger.removeEventListener('refresh', measureAnchors);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 z-0 pointer-events-none"
      aria-hidden="true"
    />
  );
}
