<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { weddingContent as content } from "./content";
import { getCountdown, isCountdownFinished } from "./countdown";

const remaining = ref(getCountdown(content.wedding.isoDate));
// biome-ignore lint/correctness/noUnusedVariables: Vue template binding.
const submitted = ref(false);
let timer: ReturnType<typeof setInterval> | undefined;

// biome-ignore lint/correctness/noUnusedVariables: Vue template binding.
const countdownItems = computed(() => [
	{ value: remaining.value.days, label: content.countdown.labels[0] },
	{ value: remaining.value.hours, label: content.countdown.labels[1] },
	{ value: remaining.value.minutes, label: content.countdown.labels[2] },
	{ value: remaining.value.seconds, label: content.countdown.labels[3] },
]);

onMounted(() => {
	document.title = `${content.meta.title} | ${content.wedding.date}`;
	document
		.querySelector('meta[name="description"]')
		?.setAttribute("content", content.meta.description);

	if (!isCountdownFinished(remaining.value)) {
		timer = setInterval(() => {
			remaining.value = getCountdown(content.wedding.isoDate);
			if (isCountdownFinished(remaining.value)) {
				clearInterval(timer);
				timer = undefined;
			}
		}, 1_000);
	}
});

onBeforeUnmount(() => clearInterval(timer));
</script>

<template>
	<header class="site-header">
		<a class="monogram" href="#top">{{ content.meta.monogram }}</a>
		<nav :aria-label="content.meta.navigationLabel">
			<a v-for="item in content.navigation" :key="item.href" :href="item.href">
				{{ item.label }}
			</a>
		</nav>
	</header>

	<main>
		<section id="top" class="hero">
			<img
				v-if="content.images.hero"
				class="hero-image"
				:src="content.images.hero"
				:alt="content.hero.imageAlt"
			/>
			<div v-else class="hero-placeholder" aria-hidden="true">
				<span class="hero-orbit hero-orbit-one"></span>
				<span class="hero-orbit hero-orbit-two"></span>
			</div>
			<div class="hero-shade"></div>
			<div class="hero-corner hero-corner-left" aria-hidden="true"></div>
			<div class="hero-corner hero-corner-right" aria-hidden="true"></div>
			<div class="hero-content reveal">
				<p class="eyebrow hero-eyebrow">{{ content.hero.eyebrow }}</p>
				<p class="hero-invitation">{{ content.hero.invitation }}</p>
				<h1>
					<span>{{ content.couple.groomShort }}</span>
					<span class="sr-only">{{ content.meta.conjunction }}</span>
					<i class="hero-ampersand" aria-hidden="true">&</i>
					<span>{{ content.couple.brideShort }}</span>
				</h1>
				<div class="hero-date">
					<span>{{ content.wedding.day }}</span>
					<strong>{{ content.wedding.date }}</strong>
					<span>{{ content.wedding.location }}</span>
				</div>
			</div>
			<a class="scroll-cue" href="#welcome">
				<span>{{ content.hero.scroll }}</span>
				<b aria-hidden="true">↓</b>
			</a>
		</section>

		<section id="welcome" class="section welcome-section">
			<div class="section-inner welcome-grid">
				<div class="welcome-mark" aria-hidden="true">
					<span>{{ content.meta.doubleHappiness }}</span>
				</div>
				<div class="welcome-copy reveal">
					<p class="eyebrow">{{ content.welcome.eyebrow }}</p>
					<h2>{{ content.welcome.title }}</h2>
					<div class="rings" aria-hidden="true"><i></i><i></i></div>
					<p class="lead">{{ content.welcome.body }}</p>
					<p class="script-note">{{ content.welcome.note }}</p>
				</div>
				<div class="families reveal">
					<article v-for="family in content.families" :key="family.label" class="family-card">
						<p class="eyebrow">{{ family.label }}</p>
						<strong>{{ family.father }}</strong>
						<strong>{{ family.mother }}</strong>
						<span>{{ family.address }}</span>
					</article>
				</div>
			</div>
		</section>

		<section id="story" class="section story-section">
			<div class="section-inner story-grid">
				<div class="story-visual reveal">
					<img v-if="content.images.story" :src="content.images.story" :alt="content.story.imageAlt" />
					<div v-else class="image-placeholder story-placeholder" role="img" :aria-label="content.story.imageAlt">
						<span aria-hidden="true">{{ content.meta.monogram }}</span>
					</div>
					<div class="story-stamp" aria-hidden="true">{{ content.wedding.date }}</div>
				</div>
				<div class="story-copy reveal">
					<p class="eyebrow">{{ content.story.eyebrow }}</p>
					<h2>{{ content.story.title }}</h2>
					<p class="lead">{{ content.story.intro }}</p>
					<div class="timeline">
						<article v-for="milestone in content.story.milestones" :key="milestone.year">
							<span class="timeline-year">{{ milestone.year }}</span>
							<div>
								<h3>{{ milestone.title }}</h3>
								<p>{{ milestone.text }}</p>
							</div>
						</article>
					</div>
				</div>
			</div>
		</section>

		<section class="countdown-section">
			<div class="countdown-decoration" aria-hidden="true">{{ content.meta.doubleHappiness }}</div>
			<div class="section-inner countdown-inner reveal">
				<p class="eyebrow">{{ content.countdown.eyebrow }}</p>
				<h2>{{ content.countdown.title }}</h2>
				<div class="countdown-grid">
					<div v-for="item in countdownItems" :key="item.label" class="countdown-unit">
						<strong>{{ String(item.value).padStart(2, "0") }}</strong>
						<span>{{ item.label }}</span>
					</div>
				</div>
				<p class="countdown-date">{{ content.wedding.date }}</p>
			</div>
		</section>

		<section id="events" class="section events-section">
			<div class="section-inner">
				<header class="section-heading reveal">
					<p class="eyebrow">{{ content.events.eyebrow }}</p>
					<h2>{{ content.events.title }}</h2>
				</header>
				<div class="events-grid">
					<article v-for="(event, index) in content.events.items" :key="event.time" class="event-card reveal">
						<span class="event-index">0{{ index + 1 }}</span>
						<time>{{ event.time }}</time>
						<h3>{{ event.title }}</h3>
						<strong>{{ event.place }}</strong>
						<p>{{ event.description }}</p>
					</article>
				</div>
			</div>
		</section>

		<section id="gallery" class="section gallery-section">
			<div class="section-inner">
				<header class="section-heading reveal">
					<p class="eyebrow">{{ content.gallery.eyebrow }}</p>
					<h2>{{ content.gallery.title }}</h2>
					<p>{{ content.gallery.description }}</p>
				</header>
				<div class="gallery-grid">
					<figure v-for="(item, index) in content.gallery.items" :key="item.alt" class="gallery-item reveal">
						<img v-if="content.images.gallery[index]" :src="content.images.gallery[index]" :alt="item.alt" />
						<div v-else class="image-placeholder gallery-placeholder" role="img" :aria-label="item.alt">
							<span aria-hidden="true">{{ content.meta.doubleHappiness }}</span>
						</div>
						<figcaption>{{ item.caption }}</figcaption>
					</figure>
				</div>
			</div>
		</section>

		<section class="section location-section">
			<div class="section-inner location-card reveal">
				<div class="map-art" aria-hidden="true">
					<div class="map-lines"></div>
					<span class="map-pin">●</span>
					<small>{{ content.location.mapPlaceholder }}</small>
				</div>
				<div class="location-copy">
					<p class="eyebrow">{{ content.location.eyebrow }}</p>
					<h2>{{ content.location.title }}</h2>
					<strong>{{ content.location.room }}</strong>
					<p>{{ content.location.address }}</p>
					<a class="button" :href="content.location.mapUrl" target="_blank" rel="noopener">
						{{ content.location.mapLabel }} <span aria-hidden="true">↗</span>
					</a>
				</div>
			</div>
		</section>

		<section id="rsvp" class="section rsvp-section">
			<div class="rsvp-decoration" aria-hidden="true">{{ content.meta.doubleHappiness }}</div>
			<div class="rsvp-card reveal">
				<div class="rsvp-heading">
					<p class="eyebrow">{{ content.rsvp.eyebrow }}</p>
					<h2>{{ content.rsvp.title }}</h2>
					<p>{{ content.rsvp.description }}</p>
				</div>
				<div v-if="submitted" class="success-message" role="status">
					<div class="success-rings" aria-hidden="true"><i></i><i></i></div>
					<h3>{{ content.rsvp.successTitle }}</h3>
					<p>{{ content.rsvp.successMessage }}</p>
					<button class="text-button" type="button" @click="submitted = false">
						{{ content.rsvp.resetLabel }}
					</button>
				</div>
				<form v-else @submit.prevent="submitted = true">
					<label>
						<span>{{ content.rsvp.nameLabel }}</span>
						<input type="text" name="name" required :placeholder="content.rsvp.namePlaceholder" />
					</label>
					<fieldset>
						<legend>{{ content.rsvp.attendanceLabel }}</legend>
						<label v-for="option in content.rsvp.attendanceOptions" :key="option.value" class="radio-option">
							<input type="radio" name="attendance" :value="option.value" required />
							<span>{{ option.label }}</span>
						</label>
					</fieldset>
					<label>
						<span>{{ content.rsvp.guestsLabel }}</span>
						<input type="number" name="guests" min="1" max="10" value="1" required />
					</label>
					<label class="full-field">
						<span>{{ content.rsvp.messageLabel }}</span>
						<textarea name="message" rows="4" :placeholder="content.rsvp.messagePlaceholder"></textarea>
					</label>
					<button class="button full-field" type="submit">{{ content.rsvp.submitLabel }}</button>
				</form>
			</div>
		</section>
	</main>

	<footer class="closing-section">
		<div class="closing-flower" aria-hidden="true"></div>
		<p class="eyebrow">{{ content.closing.eyebrow }}</p>
		<h2>{{ content.couple.groomShort }} <i>&</i> {{ content.couple.brideShort }}</h2>
		<p>{{ content.closing.message }}</p>
		<strong>{{ content.closing.signature }}</strong>
		<time>{{ content.wedding.date }}</time>
	</footer>
</template>
