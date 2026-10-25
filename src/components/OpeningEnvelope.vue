<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const emit = defineEmits<{
	start: [];
	opened: [skipMotion: boolean];
}>();
const opening = ref(false);
let fallback: ReturnType<typeof setTimeout> | undefined;

function finish(skipMotion = false) {
	clearTimeout(fallback);
	emit("opened", skipMotion);
}

function open() {
	if (opening.value) return;
	emit("start");
	if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
		finish(true);
		return;
	}
	opening.value = true;
	// Fallback nếu animationend không được phát (đổi cài đặt motion/tab nền).
	fallback = setTimeout(() => finish(), 5200);
}

onBeforeUnmount(() => clearTimeout(fallback));
// Biome chưa theo dõi binding từ Vue template.
defineExpose({ open, finish });
</script>

<template>
	<section class="opening-stage" :class="{ 'is-opening': opening }" aria-label="Thiệp mời cưới">
		<div class="envelope-scene">
			<div class="envelope-back"></div>
			<div class="opening-letter" aria-hidden="true" @animationend.self="finish()">
				<div class="letter-details"><img src="/double-happiness.svg" alt="" width="60" height="60" /><div class="letter-slot"></div></div>
			</div>
			<div class="envelope-pocket" aria-hidden="true">
				<svg viewBox="0 0 640 420" preserveAspectRatio="none" fill="none">
					<path d="M0 0L268 200Q320 244 372 200L640 0V420H0Z" fill="#fcfaf6" />
					<path d="M0 0L291 238L0 420Z" fill="#fffdf9" />
					<path d="M640 0L349 238L640 420Z" fill="#f8f5ef" />
					<path d="M0 420L275 211Q320 250 365 211L640 420Z" fill="#fffdf9" />
					<path d="M0 420L275 211M365 211L640 420" stroke="#d9d0c2" stroke-opacity=".55" />
				</svg>
			</div>
			<div class="flap-hinge">
				<svg class="envelope-flap" viewBox="0 0 640 320" aria-hidden="true">
					<path d="M1 1H639Q628 42 590 58Q586 94 545 101Q532 141 491 141Q469 183 428 177Q401 219 362 210Q320 262 278 210Q239 219 212 177Q171 183 149 141Q108 141 95 101Q54 94 50 58Q12 42 1 1Z" fill="#fffdf9" stroke="#cdb88f" stroke-width="1.5" />
				</svg>
				<button class="wax-seal" type="button" aria-label="Mở thiệp mời" :disabled="opening" @click="open">
					<svg viewBox="0 0 110 110" fill="none" aria-hidden="true">
						<defs><linearGradient id="silver" x1="15" y1="5" x2="91" y2="110" gradientUnits="userSpaceOnUse"><stop stop-color="#f2f1ec" /><stop offset=".3" stop-color="#b5b4af" /><stop offset=".58" stop-color="#eeeae3" /><stop offset="1" stop-color="#92958f" /></linearGradient></defs>
						<path d="M54 4C63 0 69 8 77 8C88 6 91 17 96 23C107 29 103 38 107 46C113 57 103 63 104 72C105 82 94 85 90 92C86 102 75 97 67 104C58 111 50 103 42 106C31 108 28 98 20 95C9 93 12 81 6 75C-1 67 7 58 3 49C0 39 10 34 12 25C14 15 26 18 32 10C39 2 47 9 54 4Z" fill="url(#silver)" />
						<circle cx="55" cy="55" r="40" stroke="#8f938d" stroke-width="2" /><circle cx="55" cy="55" r="36" stroke="#fffdf5" stroke-width="1.5" />
						<path d="M49 70C43 64 28 54 28 44C28 32 43 29 49 40C56 29 71 32 71 44C71 54 56 64 49 70ZM63 70C57 64 42 54 42 44C42 32 57 29 63 40C70 29 85 32 85 44C85 54 70 64 63 70Z" stroke="#8c918a" stroke-width="2" />
					</svg>
				</button>
			</div>
		</div>
		<button v-if="opening" class="skip-opening" type="button" @click="finish(true)">Bỏ qua chuyển động <span aria-hidden="true">↗</span></button>
	</section>
</template>
