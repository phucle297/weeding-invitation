<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref } from "vue";
// biome-ignore lint/correctness/noUnusedImports: Component được dùng trong template Vue.
import OpeningEnvelope from "./components/OpeningEnvelope.vue";
import { weddingContent as content } from "./content";
import { getCountdown, isCountdownFinished } from "./countdown";
import { getGuestName } from "./guest";
import { createWeddingMusic } from "./music";

const opened = ref(false);
const started = ref(false);
const skipMotion = ref(false);
const title = ref<HTMLElement>();
const guestName = getGuestName(window.location.search);
const remaining = ref(getCountdown(content.wedding.isoDate));
const music = createWeddingMusic();
const musicPlaying = ref(false);
const musicWanted = ref(false);
const musicNotice = ref("");
let clock: ReturnType<typeof setInterval> | undefined;

const countdown = computed(() => [
	{ value: remaining.value.days, label: "Ngày" },
	{ value: remaining.value.hours, label: "Giờ" },
	{ value: remaining.value.minutes, label: "Phút" },
	{ value: remaining.value.seconds, label: "Giây" },
]);

async function playMusic() {
	musicWanted.value = true;
	musicPlaying.value = await music.play();
	musicNotice.value = musicPlaying.value
		? ""
		: "Chạm nút nhạc để thử phát lại.";
}

function startOpening() {
	started.value = true;
	void playMusic();
}

async function finishOpening(skip: boolean) {
	if (opened.value) return;
	skipMotion.value = skip;
	opened.value = true;
	document.body.classList.remove("invitation-locked");
	await nextTick();
	title.value?.focus({ preventScroll: true });
}

async function toggleMusic() {
	if (musicWanted.value && musicPlaying.value) {
		musicWanted.value = false;
		await music.pause();
		musicPlaying.value = false;
	} else {
		await playMusic();
	}
}

async function handleVisibility() {
	if (document.hidden) {
		await music.pause();
		musicPlaying.value = false;
	} else if (musicWanted.value) {
		await playMusic();
	}
}

onMounted(() => {
	document.body.classList.add("invitation-locked");
	document.addEventListener("visibilitychange", handleVisibility);
	if (!isCountdownFinished(remaining.value)) {
		clock = setInterval(() => {
			remaining.value = getCountdown(content.wedding.isoDate);
			if (isCountdownFinished(remaining.value)) clearInterval(clock);
		}, 1000);
	}
});

onBeforeUnmount(() => {
	clearInterval(clock);
	music.dispose();
	document.body.classList.remove("invitation-locked");
	document.removeEventListener("visibilitychange", handleVisibility);
});

// Các binding dưới được dùng trong template; expose giúp Biome nhận diện.
defineExpose({
	countdown,
	guestName,
	startOpening,
	finishOpening,
	toggleMusic,
});
</script>

<template>
	<div class="invitation" :class="{ 'is-open': opened, 'skip-motion': skipMotion }">
		<OpeningEnvelope v-if="!opened" @start="startOpening" @opened="finishOpening" />
		<main v-if="opened" class="paper-page" aria-label="Nội dung thiệp mời">
			<section class="photo-chapter" aria-label="Năm khoảnh khắc của đôi mình">
				<img class="happiness" src="/double-happiness.svg" alt="Song hỷ" width="60" height="60" />
				<div class="photo-feed">
					<div class="feed-slot" aria-hidden="true"></div>
					<div class="strip-window">
						<div class="photo-strip">
							<figure v-for="(photo, index) in content.photos" :key="photo.src">
								<img :src="photo.src" :alt="photo.alt" width="640" height="960" :fetchpriority="index === 0 ? 'high' : 'auto'" />
								<figcaption>0{{ index + 1 }} <span>·</span> một đời có nhau</figcaption>
							</figure>
						</div>
					</div>
				</div>
				<div class="guest-invitation">
					<p class="eyebrow">Trân trọng kính mời</p>
					<p class="guest-name">{{ guestName }}</p>
					<div class="little-rule" aria-hidden="true">✧</div>
					<h1 ref="title" tabindex="-1" class="script"><span class="couple-name">{{ content.couple.groomShort }}</span> <span class="ampersand">&amp;</span> <span class="couple-name">{{ content.couple.brideShort }}</span></h1>
					<p class="wedding-date">{{ content.wedding.date }}</p>
					<a class="read-link" href="#thanh-hon">Cùng chung niềm hạnh phúc <span aria-hidden="true">↓</span></a>
				</div>
			</section>

			<section id="thanh-hon" class="ceremony chapter" aria-labelledby="ceremony-title">
				<p class="eyebrow">Trân trọng báo tin</p>
				<h2 id="ceremony-title">Lễ thành hôn</h2>
				<div class="families">
					<div v-for="family in content.families" :key="family.label">
						<h3>{{ family.label }}</h3>
						<p>{{ family.father }}<br />{{ family.mother }}</p>
						<p class="family-address">{{ family.address }}</p>
					</div>
				</div>
				<p class="eyebrow children-label">Của con chúng tôi</p>
				<div class="full-names script"><p>{{ content.couple.groom }}</p><span>&amp;</span><p>{{ content.couple.bride }}</p></div>
				<div class="ceremony-details">
					<p>09:30 <span aria-hidden="true">·</span> {{ content.wedding.day }}</p>
					<time class="event-date" datetime="2026-12-06T09:30:00+07:00">{{ content.wedding.date }}</time>
					<p class="lunar-date">{{ content.wedding.lunarDate }}</p>
					<h3>Tư gia</h3><p>P. Hòa Cường, TP. Đà Nẵng</p>
				</div>
			</section>

			<section class="reception chapter" aria-labelledby="reception-title">
				<p class="eyebrow">Một lời mời, trọn yêu thương</p>
				<h2 id="reception-title">Tiệc cưới</h2>
				<div class="venue-grid">
					<figure class="venue-figure"><img class="venue-illustration" src="/images/minh-toan-galaxy.webp" alt="Minh họa khách sạn Minh Toàn Galaxy, mặt góc bo tròn và hàng cọ" width="900" height="1125" loading="lazy" /><figcaption>Minh Toàn Galaxy · Đà Nẵng</figcaption></figure>
					<div class="venue-copy">
						<h3>{{ content.venue.name }}</h3><p class="room script">{{ content.venue.room }}</p><p class="venue-address">{{ content.venue.address }}</p>
						<time class="event-date" datetime="2026-12-06T11:00:00+07:00">{{ content.wedding.date }}</time>
						<div class="reception-times"><p><strong>11:00</strong>Đón khách</p><p><strong>12:00</strong>Khai tiệc</p></div>
						<a class="map-link" :href="content.venue.mapUrl" target="_blank" rel="noopener noreferrer">Xem chỉ đường <span aria-hidden="true">↗</span></a>
					</div>
				</div>
			</section>

			<section class="countdown-section chapter" aria-labelledby="countdown-title">
				<p id="countdown-title" class="eyebrow">Cùng chờ ngày chung đôi</p>
				<div class="countdown" role="timer" aria-label="Thời gian còn lại đến lễ thành hôn"><div v-for="unit in countdown" :key="unit.label"><strong>{{ String(unit.value).padStart(2, '0') }}</strong><span>{{ unit.label }}</span></div></div>
				<p class="invitation-note">Sự hiện diện của bạn<br />là niềm hạnh phúc của chúng mình.</p>
			</section>
			<footer class="closing"><p class="script">Hẹn gặp bạn ngày chung đôi</p><p class="signature script">Duy Phúc &amp; Linh Đan</p><span class="footer-date">06 . 12 . 2026</span></footer>
		</main>
		<aside v-if="started" class="music-dock" aria-label="Nhạc nền">
			<button type="button" class="music-toggle" :class="{ playing: musicPlaying }" :aria-pressed="musicPlaying" :aria-label="musicPlaying ? 'Tắt nhạc' : 'Bật nhạc'" @click="toggleMusic"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M9 17V6l11-3v11M9 9l11-3" stroke="currentColor" stroke-width="1.5" /><ellipse cx="6" cy="18" rx="3" ry="2" fill="currentColor" /><ellipse cx="17" cy="15" rx="3" ry="2" fill="currentColor" /><path v-if="!musicPlaying" d="M3 3l18 18" stroke="currentColor" stroke-width="1.5" /></svg></button>
			<p v-if="musicNotice" role="status">{{ musicNotice }}</p>
		</aside>
	</div>
</template>
