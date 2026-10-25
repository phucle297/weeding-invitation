export const weddingContent = {
	couple: {
		groom: "Lê Đàm Duy Phúc",
		bride: "Phạm Nguyễn Linh Đan",
		groomShort: "Duy Phúc",
		brideShort: "Linh Đan",
	},
	wedding: {
		isoDate: "2026-12-06T09:30:00+07:00",
		date: "06 . 12 . 2026",
		day: "Chủ Nhật",
		lunarDate: "Nhằm ngày 28 tháng 10 năm Bính Ngọ",
	},
	families: [
		{
			label: "Nhà trai",
			father: "Ông: Lê Đàm Duy Minh",
			mother: "Bà: Trần Thị Đức Hạnh",
			address: "P. Hòa Cường, TP. Đà Nẵng",
		},
		{
			label: "Nhà gái",
			father: "Ông: Phạm Đình Toàn",
			mother: "Bà: Nguyễn Thị Hồng Nhung",
			address: "P. Tam Hiệp, TP. Đồng Nai",
		},
	],
	venue: {
		name: "Minh Toàn Galaxy Hotel",
		room: "Sảnh Venus – Tầng 2",
		address: "306 đường 2/9, phường Hòa Cường, TP. Đà Nẵng",
		mapUrl:
			"https://www.google.com/maps/search/?api=1&query=Minh+Toan+Galaxy+Hotel+Da+Nang",
	},
	// Ảnh cưới mẫu. Thay src bằng ảnh thật (WebP/JPEG/AVIF), giữ tỷ lệ 2:3.
	photos: [
		{ src: "/images/wedding-01.webp", alt: "Ảnh cưới mẫu 1" },
		{ src: "/images/wedding-02.webp", alt: "Ảnh cưới mẫu 2" },
		{ src: "/images/wedding-03.webp", alt: "Ảnh cưới mẫu 3" },
		{ src: "/images/wedding-04.webp", alt: "Ảnh cưới mẫu 4" },
		{ src: "/images/wedding-05.webp", alt: "Ảnh cưới mẫu 5" },
	],
} as const;
