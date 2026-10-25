# Thiệp cưới · Duy Phúc & Linh Đan

Website thiệp cưới tiếng Việt: trắng ngà, chữ vàng cổ, dấu sáp bạc; mở nắp, kéo thiệp lên và zoom, sau đó năm ảnh cưới trượt xuống thành một dải dọc. Vue 3 + TypeScript + Vite; không WebGL, không thư viện hoạt ảnh. Hỗ trợ màn hình nhỏ, bàn phím, bỏ qua hoạt ảnh và chế độ giảm chuyển động.

## Chạy tại máy

```sh
bun install
bun dev -- --host 0.0.0.0
```

```sh
bun test
bun run check
bun run build
bun run preview
```

## Thay năm ảnh cưới

- Ảnh mẫu nằm tại `public/images/wedding-01.webp` đến `wedding-05.webp`.
- Thay các file này bằng ảnh thật cùng tên, hoặc sửa năm trường `photos[].src` trong `src/content.ts`. Sửa `alt` để mô tả ảnh thật.
- Khung ảnh luôn có tỷ lệ **2:3**, đúng với **4672 × 7008**. Không cần tải file gốc nặng lên web: WebP khoảng 800 × 1200 hoặc 1200 × 1800 là đủ cho bố cục hiện tại.
- Chấp nhận WebP, JPEG, AVIF và các định dạng trình duyệt hỗ trợ. Nếu đổi đuôi file, cập nhật `src` tương ứng.
- CSS dùng `object-fit: cover`; ảnh khác tỷ lệ sẽ bị cắt để lấp đầy khung. Chuẩn bị ảnh 2:3 để giữ nguyên bố cục ảnh.

Thông tin đôi, gia đình, ngày cưới và địa điểm ở `src/content.ts`. Nội dung lịch trình trình bày tại `src/App.vue`, phong cách và hoạt ảnh tại `src/styles.css`.

## Nguồn ảnh tạm

Năm ảnh cưới stock từ Unsplash chỉ để dựng bố cục, **không phải ảnh của Duy Phúc và Linh Đan**. Bản tải cục bộ 640 × 960 WebP, thay trước khi phát hành thiệp thật:

1. https://images.unsplash.com/photo-1519741497674-611481863552
2. https://images.unsplash.com/photo-1511285560929-80b456fea0bc
3. https://images.unsplash.com/photo-1591604466107-ec97de577aff
4. https://images.unsplash.com/photo-1532712938310-34cb3982ef74
5. https://images.unsplash.com/photo-1523438885200-e635ba2c371e

Minh họa khách sạn được tạo theo ảnh Minh Toàn Galaxy người dùng cung cấp, không phải ảnh khách sạn chụp thật. Bản nguồn: `docs/design/assets/minh-toan-galaxy.png`; bản web tối ưu: `public/images/minh-toan-galaxy.webp` (900 × 1125, khoảng 184 KB).

Font Google Fonts: Cormorant Garamond, Great Vibes, Be Vietnam Pro. Website cần kết nối để tải font; có font hệ thống dự phòng.

## Tên khách và nhạc

- Mở `/?name=Nguy%E1%BB%85n%20An` để hiện “Trân trọng kính mời Nguyễn An”. Thiếu tên hoặc chỉ khoảng trắng sẽ dùng “Quý khách”. Tên luôn render thành text, không HTML.
- Không có backend hoặc analytics; URL không đồng nghĩa với lưu lượt mở. Chưa cấu hình domain, DNS hay dịch vụ theo dõi.
- Nhạc chuông không lời tự tạo bằng Web Audio (`src/music.ts`), chỉ bắt đầu sau thao tác mở thiệp, có nút bật/tắt và tạm dừng khi tab ẩn. Không lấy nhạc từ video tham khảo. Có thông báo thử lại nếu trình duyệt chặn âm thanh.
- Đổi nội dung cưới ở `src/content.ts`; chuyển động phong bì ở `src/components/OpeningEnvelope.vue` và `src/styles.css`.

## Thiết kế hiện tại

- [Wireframe responsive, gồm storyboard và khách sạn mới](docs/design/wireframe.html) — khi chạy Vite: `/docs/design/wireframe.html`.
- [Đặc tả](docs/superpowers/specs/2026-10-25-paper-invitation-design.md)
- [Kế hoạch](docs/superpowers/plans/2026-10-25-paper-invitation.md)

Thiết kế, hero 3D và kế hoạch cũ đã được thay thế; utility countdown được giữ vì vẫn phục vụ chức năng đếm ngược.
