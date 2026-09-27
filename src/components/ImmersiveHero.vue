<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import type {
	HeroChapterPayload,
	HeroProgressPayload,
	HeroSceneReadyPayload,
} from "./immersiveHeroTypes";
import { createImmersiveHeroScene } from "./useImmersiveHeroScene";

interface Props {
	bride: string;
	groom: string;
	date: string;
	eyebrow: string;
	scrollLabel: string;
	image?: string;
}

withDefaults(defineProps<Props>(), { image: "" });

const emit = defineEmits<{
	"scroll-request": [];
	progress: [payload: HeroProgressPayload];
	"scene-ready": [payload: HeroSceneReadyPayload];
	"chapter-enter": [payload: HeroChapterPayload];
	"chapter-leave": [payload: HeroChapterPayload];
}>();

const root = ref<HTMLElement>();
const canvas = ref<HTMLCanvasElement>();
const webglReady = ref(false);

let disposeScene: (() => void) | undefined;
let unmounted = false;

onMounted(async () => {
	if (!root.value || !canvas.value) return;

	const dispose = await createImmersiveHeroScene({
		root: root.value,
		canvas: canvas.value,
		onReady: (payload) => {
			webglReady.value = payload.webgl;
			emit("scene-ready", payload);
		},
		onProgress: (payload) => {
			root.value?.style.setProperty(
				"--hero-progress",
				String(payload.progress),
			);
			emit("progress", payload);
		},
		onEnter: () => emit("chapter-enter", { chapter: "hero" }),
		onLeave: (progress) => emit("chapter-leave", { chapter: "hero", progress }),
	});

	if (unmounted) dispose();
	else disposeScene = dispose;
});

onBeforeUnmount(() => {
	unmounted = true;
	disposeScene?.();
});
</script>

<template>
	<section ref="root" class="immersive-hero" :class="{ 'immersive-hero--webgl': webglReady }">
		<div class="immersive-hero__backdrop" aria-hidden="true">
			<img v-if="image" class="immersive-hero__image" :src="image" alt="" />
			<div class="immersive-hero__wash"></div>
			<div class="immersive-hero__halo immersive-hero__halo--outer"></div>
			<div class="immersive-hero__halo immersive-hero__halo--inner"></div>
			<div class="immersive-hero__silk immersive-hero__silk--left"></div>
			<div class="immersive-hero__silk immersive-hero__silk--right"></div>
		</div>

		<canvas ref="canvas" class="immersive-hero__canvas" aria-hidden="true"></canvas>

		<div class="immersive-hero__frame" aria-hidden="true">
			<span class="immersive-hero__corner immersive-hero__corner--tl"></span>
			<span class="immersive-hero__corner immersive-hero__corner--tr"></span>
			<span class="immersive-hero__corner immersive-hero__corner--bl"></span>
			<span class="immersive-hero__corner immersive-hero__corner--br"></span>
		</div>

		<div class="immersive-hero__content">
			<p class="immersive-hero__eyebrow"><span>{{ eyebrow }}</span></p>
			<h1 class="immersive-hero__names">
				<span class="immersive-hero__name immersive-hero__name--groom">{{ groom }}</span>
				<span class="immersive-hero__conjunction" aria-hidden="true">&</span>
				<span class="immersive-hero__sr-only">và</span>
				<span class="immersive-hero__name immersive-hero__name--bride">{{ bride }}</span>
			</h1>
			<div class="immersive-hero__date">
				<span aria-hidden="true"></span>
				<time>{{ date }}</time>
				<span aria-hidden="true"></span>
			</div>
		</div>

		<button class="immersive-hero__scroll" type="button" @click="emit('scroll-request')">
			<span>{{ scrollLabel }}</span>
			<i aria-hidden="true"></i>
		</button>
	</section>
</template>

<style scoped>
.immersive-hero {
	--hero-ivory: #f8f0e5;
	--hero-burgundy: #671b2a;
	--hero-wine: #280a13;
	--hero-gold: #d3ad76;
	--hero-gold-pale: #ead8bc;
	--hero-script: var(--script, "Cormorant Garamond", "Times New Roman", serif);
	--hero-serif: var(--serif, "Cormorant Garamond", "Times New Roman", serif);
	position: relative;
	display: grid;
	min-height: clamp(720px, 100svh, 1080px);
	place-items: center;
	isolation: isolate;
	overflow: clip;
	background: var(--hero-wine);
	color: var(--hero-ivory);
	font-family: var(--hero-serif);
	text-align: center;
}

.immersive-hero__backdrop,
.immersive-hero__wash,
.immersive-hero__image,
.immersive-hero__canvas,
.immersive-hero__frame {
	position: absolute;
	inset: 0;
	width: 100%;
	height: 100%;
}

.immersive-hero__backdrop {
	z-index: -3;
	overflow: hidden;
	background:
		radial-gradient(circle at 50% 38%, rgb(157 67 76 / 34%), transparent 30%),
		linear-gradient(145deg, #541724 0%, #310b16 53%, #1c080e 100%);
}

.immersive-hero__image {
	object-fit: cover;
	object-position: center;
	filter: saturate(0.72) sepia(0.08) contrast(1.03);
	transform: scale(1.035);
	animation: immersive-hero-breathe 14s ease-in-out infinite alternate;
}

.immersive-hero__wash {
	background:
		linear-gradient(180deg, rgb(27 4 11 / 62%) 0%, rgb(38 7 15 / 23%) 42%, rgb(28 5 12 / 76%) 100%),
		radial-gradient(circle at 50% 45%, transparent 0 24%, rgb(30 5 12 / 46%) 68% 100%);
}

.immersive-hero__backdrop::after {
	position: absolute;
	inset: 0;
	background: repeating-linear-gradient(
		112deg,
		transparent 0 3px,
		rgb(255 255 255 / 1.5%) 3px 4px
	);
	content: "";
	mix-blend-mode: soft-light;
	opacity: 0.35;
}

.immersive-hero__halo {
	position: absolute;
	top: 50%;
	left: 50%;
	aspect-ratio: 1;
	border: 1px solid rgb(234 216 188 / 15%);
	border-radius: 50%;
	transform: translate(-50%, -50%);
}

.immersive-hero__halo::before,
.immersive-hero__halo::after {
	position: absolute;
	inset: 7%;
	border: 1px dotted rgb(234 216 188 / 13%);
	border-radius: inherit;
	content: "";
}

.immersive-hero__halo::after {
	inset: 15%;
	border-style: solid;
}

.immersive-hero__halo--outer {
	width: min(104vw, 980px);
}

.immersive-hero__halo--inner {
	width: min(70vw, 650px);
	border-color: rgb(211 173 118 / 22%);
}

.immersive-hero__silk {
	position: absolute;
	width: min(52vw, 620px);
	aspect-ratio: 0.72;
	border: 1px solid rgb(234 216 188 / 13%);
	border-radius: 49% 51% 37% 63% / 56% 35% 65% 44%;
	filter: blur(0.2px);
}

.immersive-hero__silk--left {
	bottom: -42%;
	left: -25%;
	box-shadow: 70px -35px 0 -1px rgb(234 216 188 / 4%);
	transform: rotate(26deg);
}

.immersive-hero__silk--right {
	top: -43%;
	right: -28%;
	box-shadow: -75px 45px 0 -1px rgb(234 216 188 / 4%);
	transform: rotate(-32deg);
}

.immersive-hero__canvas {
	z-index: -1;
	pointer-events: none;
	opacity: 0;
	transition: opacity 1.2s ease;
}

.immersive-hero--webgl .immersive-hero__canvas {
	opacity: 1;
}

.immersive-hero__frame {
	z-index: 2;
	inset: clamp(14px, 2.4vw, 34px);
	width: auto;
	height: auto;
	pointer-events: none;
	border: 1px solid rgb(234 216 188 / 22%);
	clip-path: polygon(
		0 0,
		43% 0,
		46% 8px,
		54% 8px,
		57% 0,
		100% 0,
		100% 100%,
		57% 100%,
		54% calc(100% - 8px),
		46% calc(100% - 8px),
		43% 100%,
		0 100%
	);
}

.immersive-hero__corner {
	position: absolute;
	width: 64px;
	height: 64px;
}

.immersive-hero__corner::before,
.immersive-hero__corner::after {
	position: absolute;
	background: var(--hero-gold);
	content: "";
	opacity: 0.65;
}

.immersive-hero__corner::before {
	width: 1px;
	height: 22px;
}

.immersive-hero__corner::after {
	width: 22px;
	height: 1px;
}

.immersive-hero__corner--tl {
	top: -1px;
	left: -1px;
}

.immersive-hero__corner--tr {
	top: -1px;
	right: -1px;
	transform: rotate(90deg);
}

.immersive-hero__corner--br {
	right: -1px;
	bottom: -1px;
	transform: rotate(180deg);
}

.immersive-hero__corner--bl {
	bottom: -1px;
	left: -1px;
	transform: rotate(270deg);
}

.immersive-hero__content {
	position: relative;
	z-index: 3;
	width: min(1120px, calc(100% - 54px));
	padding: 110px 0 150px;
	filter: drop-shadow(0 16px 44px rgb(12 0 4 / 22%));
	opacity: calc(1 - var(--hero-progress, 0) * 0.52);
	transform: translateY(calc(var(--hero-progress, 0) * -7vh));
}

.immersive-hero__eyebrow {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 18px;
	margin: 0 0 42px;
	color: var(--hero-gold-pale);
	font-family: var(--hero-serif);
	font-size: 10px;
	font-weight: 500;
	letter-spacing: 0.48em;
	line-height: 1.5;
	text-transform: uppercase;
	animation: immersive-hero-rise 1s 100ms both;
}

.immersive-hero__eyebrow::before,
.immersive-hero__eyebrow::after {
	width: clamp(35px, 8vw, 96px);
	height: 1px;
	background: linear-gradient(90deg, transparent, var(--hero-gold));
	content: "";
}

.immersive-hero__eyebrow::after {
	transform: scaleX(-1);
}

.immersive-hero__names {
	display: grid;
	grid-template-columns: 1fr auto 1fr;
	align-items: center;
	margin: 0;
	font-family: var(--hero-script);
	font-weight: 400;
	letter-spacing: -0.035em;
	line-height: 0.82;
}

.immersive-hero__name {
	display: block;
	font-size: clamp(64px, 10vw, 154px);
	text-wrap: balance;
	animation: immersive-hero-name 1.4s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.immersive-hero__name--groom {
	justify-self: end;
	animation-delay: 180ms;
}

.immersive-hero__name--bride {
	justify-self: start;
	animation-delay: 320ms;
}

.immersive-hero__conjunction {
	position: relative;
	z-index: 1;
	margin: 0 0.17em;
	color: var(--hero-gold);
	font-family: var(--hero-serif);
	font-size: clamp(40px, 5vw, 78px);
	font-style: italic;
	font-weight: 400;
	transform: translateY(-0.05em);
	animation: immersive-hero-seal 1.2s 520ms both;
}

.immersive-hero__date {
	display: grid;
	grid-template-columns: minmax(38px, 140px) auto minmax(38px, 140px);
	align-items: center;
	justify-content: center;
	gap: clamp(14px, 2.5vw, 34px);
	margin: clamp(48px, 8vh, 86px) auto 0;
	color: var(--hero-gold-pale);
	font-size: clamp(13px, 1.2vw, 17px);
	font-weight: 500;
	letter-spacing: 0.42em;
	text-transform: uppercase;
	animation: immersive-hero-rise 1s 650ms both;
}

.immersive-hero__date span {
	height: 1px;
	background: linear-gradient(90deg, transparent, rgb(234 216 188 / 65%));
}

.immersive-hero__date span:last-child {
	transform: scaleX(-1);
}

.immersive-hero__scroll {
	position: absolute;
	bottom: clamp(42px, 6vh, 66px);
	left: 50%;
	z-index: 4;
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 12px;
	padding: 8px 16px;
	border: 0;
	background: transparent;
	color: var(--hero-gold-pale);
	cursor: pointer;
	font-family: var(--hero-serif);
	font-size: 8px;
	font-weight: 500;
	letter-spacing: 0.32em;
	text-transform: uppercase;
	transform: translateX(-50%);
	opacity: calc(1 - var(--hero-progress, 0) * 3);
}

.immersive-hero__scroll i {
	position: relative;
	display: block;
	width: 1px;
	height: 38px;
	overflow: hidden;
	background: rgb(234 216 188 / 24%);
}

.immersive-hero__scroll i::after {
	position: absolute;
	top: -100%;
	left: 0;
	width: 100%;
	height: 100%;
	background: var(--hero-gold-pale);
	content: "";
	animation: immersive-hero-scroll 2.2s ease-in-out infinite;
}

.immersive-hero__scroll:focus-visible {
	outline: 1px solid var(--hero-gold);
	outline-offset: 6px;
}

.immersive-hero__sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	padding: 0;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
	border: 0;
}

@keyframes immersive-hero-rise {
	from {
		opacity: 0;
		transform: translateY(18px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

@keyframes immersive-hero-name {
	from {
		opacity: 0;
		filter: blur(8px);
		transform: translateY(34px) scale(0.96);
	}
	to {
		opacity: 1;
		filter: blur(0);
		transform: translateY(0) scale(1);
	}
}

@keyframes immersive-hero-seal {
	from {
		opacity: 0;
		transform: translateY(-0.05em) rotate(-18deg) scale(0.7);
	}
	to {
		opacity: 1;
		transform: translateY(-0.05em) rotate(0) scale(1);
	}
}

@keyframes immersive-hero-scroll {
	0% {
		transform: translateY(0);
	}
	55%,
	100% {
		transform: translateY(200%);
	}
}

@keyframes immersive-hero-breathe {
	to {
		transform: scale(1.075);
	}
}

@media (max-width: 767px) {
	.immersive-hero {
		min-height: max(720px, 100svh);
	}

	.immersive-hero__content {
		width: calc(100% - 42px);
		padding: 105px 0 150px;
	}

	.immersive-hero__eyebrow {
		gap: 10px;
		margin-bottom: 34px;
		font-size: 9px;
		letter-spacing: 0.36em;
	}

	.immersive-hero__names {
		display: flex;
		flex-direction: column;
		line-height: 0.78;
	}

	.immersive-hero__name {
		font-size: clamp(68px, 22vw, 100px);
	}

	.immersive-hero__name--groom,
	.immersive-hero__name--bride {
		align-self: center;
	}

	.immersive-hero__conjunction {
		margin: 0.08em 0 -0.02em;
		font-size: 42px;
	}

	.immersive-hero__date {
		grid-template-columns: 34px auto 34px;
		gap: 12px;
		margin-top: 58px;
		font-size: 13px;
		letter-spacing: 0.26em;
	}

	.immersive-hero__halo--outer {
		width: 152vw;
	}

	.immersive-hero__halo--inner {
		width: 102vw;
	}
}

@media (prefers-reduced-motion: reduce) {
	.immersive-hero__image,
	.immersive-hero__eyebrow,
	.immersive-hero__name,
	.immersive-hero__conjunction,
	.immersive-hero__date,
	.immersive-hero__scroll i::after {
		animation: none;
	}

	.immersive-hero__canvas {
		transition: none;
	}

	.immersive-hero__content {
		opacity: 1;
		transform: none;
	}

	.immersive-hero__scroll {
		opacity: 1;
	}
}
</style>
