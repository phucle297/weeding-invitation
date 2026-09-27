import { describe, expect, test } from "bun:test";
import { damp, normalizePointer } from "../src/components/immersiveHeroMotion";

describe("immersive hero motion", () => {
	test("normalizes pointer coordinates around the hero center", () => {
		expect(
			normalizePointer(100, 50, { left: 0, top: 0, width: 200, height: 100 }),
		).toEqual({
			x: 0,
			y: 0,
		});
		expect(
			normalizePointer(200, 0, { left: 0, top: 0, width: 200, height: 100 }),
		).toEqual({
			x: 1,
			y: 1,
		});
	});

	test("clamps pointer coordinates outside the hero", () => {
		expect(
			normalizePointer(-40, 150, { left: 0, top: 0, width: 200, height: 100 }),
		).toEqual({
			x: -1,
			y: -1,
		});
	});

	test("damps motion toward its target without overshooting", () => {
		expect(damp(0, 1, 0.2)).toBeCloseTo(0.2);
		expect(damp(1, -1, 2)).toBe(-1);
	});
});
