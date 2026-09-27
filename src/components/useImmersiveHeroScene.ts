import { damp, normalizePointer } from "./immersiveHeroMotion";
import type {
	HeroPhase,
	HeroProgressPayload,
	HeroSceneReadyPayload,
} from "./immersiveHeroTypes";

interface HeroSceneOptions {
	root: HTMLElement;
	canvas: HTMLCanvasElement;
	onReady: (payload: HeroSceneReadyPayload) => void;
	onProgress: (payload: HeroProgressPayload) => void;
	onEnter: () => void;
	onLeave: (progress: number) => void;
}

interface Disposable {
	dispose: () => void;
}

const phaseAt = (progress: number): HeroPhase => {
	if (progress < 0.28) return "arrival";
	if (progress < 0.78) return "reveal";
	return "handoff";
};

function createFallbackJourney(
	root: HTMLElement,
	onProgress: HeroSceneOptions["onProgress"],
	onEnter: HeroSceneOptions["onEnter"],
	onLeave: HeroSceneOptions["onLeave"],
) {
	let lastProgress = 0;
	let insideChapter = false;
	const updateScroll = () => {
		const bounds = root.getBoundingClientRect();
		const progress = Math.min(
			1,
			Math.max(0, -bounds.top / Math.max(bounds.height, 1)),
		);
		const difference = progress - lastProgress;
		onProgress({
			progress,
			cameraProgress: progress,
			phase: phaseAt(progress),
			direction: Math.abs(difference) < 0.0001 ? 0 : difference > 0 ? 1 : -1,
		});
		lastProgress = progress;
	};
	const observer = new IntersectionObserver(([entry]) => {
		const visible = entry?.isIntersecting ?? false;
		if (visible && !insideChapter) {
			insideChapter = true;
			onEnter();
		}
		if (!visible && insideChapter) {
			insideChapter = false;
			onLeave(lastProgress);
		}
	});
	observer.observe(root);
	window.addEventListener("scroll", updateScroll, { passive: true });
	updateScroll();

	return () => {
		observer.disconnect();
		window.removeEventListener("scroll", updateScroll);
	};
}

export async function createImmersiveHeroScene(options: HeroSceneOptions) {
	const { root, canvas, onReady, onProgress, onEnter, onLeave } = options;
	const reduceMotion = window.matchMedia(
		"(prefers-reduced-motion: reduce)",
	).matches;
	let partialRenderer: Disposable | undefined;
	let partialIntersectionObserver: IntersectionObserver | undefined;
	let partialResizeObserver: ResizeObserver | undefined;
	let partialEventCleanup: (() => void) | undefined;
	const partialResources: Disposable[] = [];

	try {
		const THREE = await import("three");
		const isMobile = window.matchMedia("(max-width: 767px)").matches;
		const renderer = new THREE.WebGLRenderer({
			canvas,
			alpha: true,
			antialias: !isMobile,
			powerPreference: isMobile ? "low-power" : "high-performance",
		});
		partialRenderer = renderer;
		renderer.setClearColor(0x000000, 0);
		renderer.setPixelRatio(
			Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75),
		);
		renderer.outputColorSpace = THREE.SRGBColorSpace;

		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(isMobile ? 42 : 34, 1, 0.1, 100);
		const world = new THREE.Group();
		scene.add(world);

		const cameraPath = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(0, 0.25, 12.5),
				new THREE.Vector3(-0.18, 0.08, 11.2),
				new THREE.Vector3(0.25, -0.32, 9.7),
				new THREE.Vector3(0, -0.82, 8.15),
			],
			false,
			"catmullrom",
			0.35,
		);
		const lookPath = new THREE.CatmullRomCurve3(
			[
				new THREE.Vector3(0, 0, -1.8),
				new THREE.Vector3(0.12, -0.05, -2.5),
				new THREE.Vector3(-0.16, -0.2, -3.4),
				new THREE.Vector3(0, -0.65, -5.1),
			],
			false,
			"catmullrom",
			0.35,
		);
		const cameraPoint = new THREE.Vector3();
		const lookPoint = new THREE.Vector3();

		scene.add(new THREE.AmbientLight(0xfff3df, 1.65));
		const keyLight = new THREE.DirectionalLight(0xffcf94, 4.5);
		keyLight.position.set(4, 5, 8);
		scene.add(keyLight);

		const ringGeometry = new THREE.TorusGeometry(3.1, 0.016, 8, 192);
		const ringMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xddb979,
			metalness: 0.82,
			roughness: 0.22,
			transparent: true,
			opacity: 0.42,
		});
		partialResources.push(ringGeometry, ringMaterial);
		const portal = new THREE.Group();
		portal.position.z = -2.8;
		world.add(portal);

		const ring = new THREE.Mesh(ringGeometry, ringMaterial);
		ring.rotation.set(1.1, 0.04, -0.18);
		portal.add(ring);
		const outerRing = ring.clone();
		outerRing.scale.setScalar(1.34);
		outerRing.rotation.set(1.24, -0.08, 0.32);
		outerRing.position.z = -0.65;
		portal.add(outerRing);

		const petalShape = new THREE.Shape();
		petalShape.moveTo(0, -0.78);
		petalShape.bezierCurveTo(-0.62, -0.2, -0.5, 0.54, 0, 0.9);
		petalShape.bezierCurveTo(0.5, 0.54, 0.62, -0.2, 0, -0.78);
		const petalGeometry = new THREE.ShapeGeometry(petalShape, 8);
		const petalMaterial = new THREE.MeshPhysicalMaterial({
			color: 0xcfaa72,
			metalness: 0.22,
			roughness: 0.48,
			transparent: true,
			opacity: 0.48,
			side: THREE.DoubleSide,
		});
		partialResources.push(petalGeometry, petalMaterial);
		const petalCount = isMobile ? 16 : 40;
		const botanicals = new THREE.InstancedMesh(
			petalGeometry,
			petalMaterial,
			petalCount,
		);
		botanicals.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
		const petalDummy = new THREE.Object3D();
		const petalData = Array.from({ length: petalCount }, (_, index) => ({
			x: (index % 2 === 0 ? -1 : 1) * (3.7 + ((index * 1.71) % 3.8)),
			y: ((index * 2.13) % 10) - 5,
			z: -0.6 - (index % 7) * 0.82,
			rotation: index * 0.63,
			phase: index * 0.78,
			scale: 0.24 + (index % 6) * 0.035,
		}));
		world.add(botanicals);

		const dustCount = isMobile ? 48 : 110;
		const dustPositions = new Float32Array(dustCount * 3);
		for (let index = 0; index < dustCount; index += 1) {
			dustPositions[index * 3] = ((index * 7.31) % 17) - 8.5;
			dustPositions[index * 3 + 1] = ((index * 5.17) % 11) - 5.5;
			dustPositions[index * 3 + 2] = -0.5 - (index % 9);
		}
		const dustGeometry = new THREE.BufferGeometry();
		dustGeometry.setAttribute(
			"position",
			new THREE.BufferAttribute(dustPositions, 3),
		);
		const dustMaterial = new THREE.PointsMaterial({
			color: 0xffdca5,
			size: isMobile ? 0.018 : 0.025,
			transparent: true,
			opacity: 0.5,
			depthWrite: false,
		});
		partialResources.push(dustGeometry, dustMaterial);
		const dust = new THREE.Points(dustGeometry, dustMaterial);
		world.add(dust);

		let frame = 0;
		let destroyed = false;
		let visible = true;
		let insideChapter = false;
		let elapsed = 0;
		let lastTime = performance.now();
		let lastProgress = 0;
		let scrollProgress = 0;
		let cameraProgress = reduceMotion ? 0.42 : 0;
		const pointer = { x: 0, y: 0 };
		const pointerTarget = { x: 0, y: 0 };

		const updateBotanicals = () => {
			for (let index = 0; index < petalCount; index += 1) {
				const petal = petalData[index];
				if (!petal) continue;
				petalDummy.position.set(
					petal.x,
					petal.y + Math.sin(elapsed * 0.38 + petal.phase) * 0.08,
					petal.z,
				);
				petalDummy.rotation.set(
					petal.rotation + elapsed * 0.025,
					petal.rotation * 0.74 + elapsed * 0.038,
					petal.rotation * 0.42,
				);
				petalDummy.scale.setScalar(petal.scale);
				petalDummy.updateMatrix();
				botanicals.setMatrixAt(index, petalDummy.matrix);
			}
			botanicals.instanceMatrix.needsUpdate = true;
		};

		const positionCamera = (progress: number) => {
			cameraPath.getPointAt(progress, cameraPoint);
			lookPath.getPointAt(progress, lookPoint);
			camera.position.copy(cameraPoint);
			camera.position.x += pointer.x * 0.22;
			camera.position.y += pointer.y * 0.15;
			lookPoint.x += pointer.x * 0.08;
			lookPoint.y += pointer.y * 0.055;
			camera.lookAt(lookPoint);
		};

		const resize = () => {
			const bounds = root.getBoundingClientRect();
			renderer.setSize(
				Math.max(1, bounds.width),
				Math.max(1, bounds.height),
				false,
			);
			camera.aspect = Math.max(1, bounds.width) / Math.max(1, bounds.height);
			camera.updateProjectionMatrix();
			positionCamera(cameraProgress);
			updateBotanicals();
			renderer.render(scene, camera);
			updateScroll();
		};

		const emitProgress = (progress: number, actualCameraProgress: number) => {
			const difference = progress - lastProgress;
			const direction: -1 | 0 | 1 =
				Math.abs(difference) < 0.0001 ? 0 : difference > 0 ? 1 : -1;
			onProgress({
				progress,
				cameraProgress: actualCameraProgress,
				phase: phaseAt(progress),
				direction,
			});
			lastProgress = progress;
		};

		const updateScroll = () => {
			const bounds = root.getBoundingClientRect();
			const nextProgress = Math.min(
				1,
				Math.max(0, -bounds.top / Math.max(bounds.height, 1)),
			);
			scrollProgress = nextProgress;
			emitProgress(nextProgress, reduceMotion ? 0.42 : cameraProgress);
		};

		const onPointerMove = (event: PointerEvent) => {
			const normalized = normalizePointer(
				event.clientX,
				event.clientY,
				root.getBoundingClientRect(),
			);
			pointerTarget.x = normalized.x;
			pointerTarget.y = normalized.y;
		};

		const onPointerLeave = () => {
			pointerTarget.x = 0;
			pointerTarget.y = 0;
		};

		const render = (time: number) => {
			if (destroyed || !visible) return;
			const delta = Math.min(0.05, (time - lastTime) / 1_000);
			lastTime = time;
			elapsed += delta;
			pointer.x = damp(pointer.x, pointerTarget.x, 0.055);
			pointer.y = damp(pointer.y, pointerTarget.y, 0.055);
			cameraProgress = damp(cameraProgress, scrollProgress, 0.075);
			emitProgress(scrollProgress, cameraProgress);
			positionCamera(cameraProgress);
			updateBotanicals();
			portal.rotation.z = scrollProgress * 0.11 + elapsed * 0.004;
			ring.rotation.z += delta * 0.018;
			outerRing.rotation.z -= delta * 0.014;
			dust.rotation.z = elapsed * 0.003;
			renderer.render(scene, camera);
			frame = requestAnimationFrame(render);
		};

		const start = () => {
			if (destroyed || reduceMotion || frame) return;
			lastTime = performance.now();
			frame = requestAnimationFrame(render);
		};

		const stop = () => {
			cancelAnimationFrame(frame);
			frame = 0;
		};

		const intersectionObserver = new IntersectionObserver(
			([entry]) => {
				const nextVisible = entry?.isIntersecting ?? false;
				visible = nextVisible;
				if (nextVisible && !insideChapter) {
					insideChapter = true;
					onEnter();
				}
				if (!nextVisible && insideChapter) {
					insideChapter = false;
					onLeave(scrollProgress);
				}
				if (nextVisible) start();
				else stop();
			},
			{ threshold: 0.01 },
		);
		partialIntersectionObserver = intersectionObserver;
		intersectionObserver.observe(root);

		const resizeObserver = new ResizeObserver(resize);
		partialResizeObserver = resizeObserver;
		resizeObserver.observe(root);
		root.addEventListener("pointermove", onPointerMove, { passive: true });
		root.addEventListener("pointerleave", onPointerLeave, { passive: true });
		window.addEventListener("scroll", updateScroll, { passive: true });
		partialEventCleanup = () => {
			root.removeEventListener("pointermove", onPointerMove);
			root.removeEventListener("pointerleave", onPointerLeave);
			window.removeEventListener("scroll", updateScroll);
		};
		updateScroll();
		resize();
		start();
		onReady({ webgl: true, reducedMotion: reduceMotion });

		return () => {
			destroyed = true;
			stop();
			intersectionObserver.disconnect();
			resizeObserver.disconnect();
			partialEventCleanup?.();
			petalGeometry.dispose();
			petalMaterial.dispose();
			ringGeometry.dispose();
			ringMaterial.dispose();
			dustGeometry.dispose();
			dustMaterial.dispose();
			renderer.dispose();
		};
	} catch {
		partialIntersectionObserver?.disconnect();
		partialResizeObserver?.disconnect();
		partialEventCleanup?.();
		for (const resource of partialResources) resource.dispose();
		partialRenderer?.dispose();
		const disposeFallback = createFallbackJourney(
			root,
			onProgress,
			onEnter,
			onLeave,
		);
		onReady({ webgl: false, reducedMotion: reduceMotion });
		return disposeFallback;
	}
}
