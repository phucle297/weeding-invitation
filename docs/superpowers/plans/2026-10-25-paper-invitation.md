# Ivory Invitation Implementation Plan

**Goal:** Triển khai wireframe đã chốt, gồm minh họa khách sạn mới và mở thiệp kéo/zoom.

**Architecture:** Vue giữ trạng thái mở, countdown, tên khách và nhạc. CSS/SVG giữ lớp giấy và animation; không thư viện runtime mới. Năm ảnh WebP mock vẫn dùng tỷ lệ 2:3.

**Tech Stack:** Vue 3, TypeScript, Vite, Bun, CSS/SVG, Web Audio.

## Ràng buộc

Theo `../specs/2026-10-25-paper-invitation-design.md`. Không ảnh xòe, không xoay thiệp, không dấu sáp tách rời. Không tự thêm dịch vụ tracking. Hai commit theo yêu cầu: thiết kế trước; implementation sau khi kiểm tra; push branch hiện tại, không tự merge/deploy.

## Thực hiện theo thứ tự

- [x] Lưu wireframe responsive, storyboard và minh họa trong `docs/design/`; commit riêng phần thiết kế và xóa kế hoạch cũ.
- [x] Thêm regression test cho `?name=` gồm tên tiếng Việt, fallback, whitespace và chuỗi HTML giữ nguyên dạng text. Kiểm tra trước implementation thất bại vì chưa có module; browser contract thất bại vì chưa hiển thị ABC.
- [x] Thay `src/App.vue` và `src/styles.css` bằng trang giấy liên tục, animation đúng ba lớp, photo strip năm ảnh 2:3, lễ/tiệc/countdown, skip và reduced motion.
- [x] Thêm `src/guest.ts`, `src/music.ts`; tên chỉ đọc URL, nhạc không bản quyền tự tạo, có dọn tài nguyên. Tối ưu minh họa thành WebP cục bộ và ghi nguồn trong README.
- [x] Chạy `bun test`, `bun run check`, `bun run build`. Dùng Chromium để thao tác thật và kiểm tra DOM/audio/ảnh/lịch/focus ở mobile/desktop/reduced motion. Xem screenshot đóng, mở trung gian và nội dung; sửa lỗi nếu có.
- [x] Đọc diff, cập nhật README và kết quả kiểm tra; chuẩn bị commit implementation.

## Kết quả xác minh

- Biome: không lỗi/cảnh báo; Bun: 4 tests đạt; TypeScript + Vite production build đạt.
- Chromium 1440 × 1000, 390 × 844, 320 × 844: chỉ phong bì/sáp khi đóng; Enter mở; lớp nắp/thiệp/túi 2/3/4; focus đúng; đủ năm ảnh tải được và đo đúng 2:3; không tràn ngang, không lỗi JavaScript; Google Maps dùng URL thật.
- Tên tiếng Việt, tên trống và chuỗi HTML render thành text; reduced motion và skip mở ngay, không chạy feed animation.
- Web Audio thực phát tín hiệu khác 0 qua AnalyserNode, pause chuyển suspended, resume chuyển running. Audio bị chặn không chặn mở thiệp và có thông báo thử lại.
- Đã xem screenshot và video thực. Sửa ngắt tên Linh Đan, tách vùng nhạc mobile khỏi chữ, làm mờ chi tiết thiệp trước zoom lớn và fade vào trang ảnh để bỏ giật thanh khe.
- Preview production port 4173: mở thiệp, tên ABC và mọi ảnh tải thành công, không HTTP lỗi nội bộ/JS lỗi.
- Chưa kiểm tra trên thiết bị iOS/Android thật. Chưa có tracking backend hoặc cấu hình domain/deployment.

## Giao mã nguồn

Sau commit implementation: `git push -u origin dn`. Không merge vào `main` hoặc tự triển khai production.
