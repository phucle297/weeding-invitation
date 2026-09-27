export function getCountdown(target: string, now = Date.now()) {
	const distance = Math.max(0, new Date(target).getTime() - now);

	return {
		days: Math.floor(distance / 86_400_000),
		hours: Math.floor((distance / 3_600_000) % 24),
		minutes: Math.floor((distance / 60_000) % 60),
		seconds: Math.floor((distance / 1_000) % 60),
	};
}

export function isCountdownFinished(
	countdown: ReturnType<typeof getCountdown>,
) {
	return Object.values(countdown).every((value) => value === 0);
}
