import { describe, expect, test } from "bun:test";
import { getCountdown, isCountdownFinished } from "../src/countdown";

describe("getCountdown", () => {
	test("tách phần thời gian còn lại thành ngày, giờ, phút và giây", () => {
		const now = new Date("2026-12-04T06:58:59+07:00").getTime();
		const target = "2026-12-06T09:00:00+07:00";

		expect(getCountdown(target, now)).toEqual({
			days: 2,
			hours: 2,
			minutes: 1,
			seconds: 1,
		});
	});

	test("dừng ở không khi ngày cưới đã qua", () => {
		const now = new Date("2026-12-07T09:00:00+07:00").getTime();

		expect(getCountdown("2026-12-06T09:00:00+07:00", now)).toEqual({
			days: 0,
			hours: 0,
			minutes: 0,
			seconds: 0,
		});
	});

	test("nhận biết countdown đã kết thúc", () => {
		expect(
			isCountdownFinished({ days: 0, hours: 0, minutes: 0, seconds: 0 }),
		).toBe(true);
		expect(
			isCountdownFinished({ days: 0, hours: 0, minutes: 0, seconds: 1 }),
		).toBe(false);
	});
});
