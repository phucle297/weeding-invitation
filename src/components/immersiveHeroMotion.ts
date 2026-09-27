type Bounds = Pick<DOMRect, "left" | "top" | "width" | "height">;

function clamp(value: number, minimum: number, maximum: number) {
	return Math.min(maximum, Math.max(minimum, value));
}

export function normalizePointer(
	clientX: number,
	clientY: number,
	bounds: Bounds,
) {
	return {
		x: clamp(
			((clientX - bounds.left) / Math.max(bounds.width, 1)) * 2 - 1,
			-1,
			1,
		),
		y: clamp(
			1 - ((clientY - bounds.top) / Math.max(bounds.height, 1)) * 2,
			-1,
			1,
		),
	};
}

export function damp(current: number, target: number, amount: number) {
	return current + (target - current) * clamp(amount, 0, 1);
}
