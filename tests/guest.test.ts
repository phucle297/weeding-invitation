import { expect, test } from "bun:test";
import { getGuestName } from "../src/guest";

test("cá nhân hóa lời mời từ URL, thiếu tên dùng Quý khách", () => {
	expect(getGuestName("?name=Nguy%E1%BB%85n+An")).toBe("Nguyễn An");
	expect(getGuestName("?name=%20ABC%20")).toBe("ABC");
	for (const search of ["", "?other=ABC", "?name=", "?name=+++ "]) {
		expect(getGuestName(search)).toBe("Quý khách");
	}
	expect(getGuestName("?name=%3Cb%3EABC%3C%2Fb%3E")).toBe("<b>ABC</b>");
});
