// Giai điệu chuông tự tạo; không dùng bản ghi âm hoặc nhạc từ video tham chiếu.
export function createWeddingMusic() {
	let context: AudioContext | undefined;
	let timer: ReturnType<typeof setInterval> | undefined;
	let output: GainNode | undefined;
	let beat = 0;
	let next = 0;
	const melody = [
		72, 76, 79, 76, 74, 77, 81, 77, 71, 74, 79, 74, 72, 76, 79, 84,
	];
	const bass = [48, 53, 55, 48];

	function schedule() {
		if (!context || !output) return;
		while (next < context.currentTime + 0.3) {
			const note = melody[beat % melody.length] ?? 72;
			for (const [midi, volume] of [
				[note, 0.12],
				[bass[Math.floor((beat % 16) / 4)] ?? 48, 0.045],
			]) {
				if (midi === undefined || volume === undefined) continue;
				const oscillator = context.createOscillator();
				const gain = context.createGain();
				oscillator.type = "sine";
				oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
				gain.gain.setValueAtTime(0, next);
				gain.gain.linearRampToValueAtTime(volume, next + 0.025);
				gain.gain.exponentialRampToValueAtTime(0.0001, next + 2.6);
				oscillator.connect(gain).connect(output);
				oscillator.start(next);
				oscillator.stop(next + 2.7);
				oscillator.onended = () => {
					oscillator.disconnect();
					gain.disconnect();
				};
			}
			next += 0.7;
			beat++;
		}
	}

	return {
		async play(): Promise<boolean> {
			try {
				context ??= new AudioContext();
				if (!output) {
					output = context.createGain();
					output.gain.value = 0.5;
					output.connect(context.destination);
				}
				await context.resume();
				if (context.state !== "running") return false;
				if (!timer) {
					next = context.currentTime + 0.05;
					schedule();
					timer = setInterval(schedule, 120);
				}
				return true;
			} catch {
				return false;
			}
		},
		async pause() {
			clearInterval(timer);
			timer = undefined;
			await context?.suspend();
		},
		dispose() {
			clearInterval(timer);
			void context?.close();
		},
	};
}
