# Ivory Invitation Implementation Plan

**Goal:** Triển khai wireframe đã chốt, gồm minh họa khách sạn mới và mở thiệp kéo/zoom.

**Architecture:** Vue giữ trạng thái mở, countdown, tên khách và nhạc. CSS/SVG giữ lớp giấy và animation; không thư viện runtime mới. Năm ảnh WebP mock vẫn dùng tỷ lệ 2:3.

**Tech Stack:** Vue 3, TypeScript, Vite, Bun, CSS/SVG, Web Audio.

## Ràng buộc

Theo `../specs/2026-10-25-paper-invitation-design.md`. Không ảnh xòe, không xoay thiệp, không dấu sáp tách rời. Không tự thêm dịch vụ tracking. Hai commit theo yêu cầu: thiết kế trước; implementation sau khi kiểm tra; push branch hiện tại, không tự merge/deploy.

## Thực hiện theo thứ tự

- [ ] Lưu wireframe responsive, storyboard và minh họa trong `docs/design/`; commit riêng phần thiết kế và xóa kế hoạch cũ.
- [ ] Thêm regression test cho `?name=` gồm tên tiếng Việt, fallback, whitespace và chuỗi HTML giữ nguyên dạng text. Chạy `bun test` trước implementation để xác nhận test chưa có module.
- [ ] Thay `src/App.vue` và `src/styles.css` bằng trang giấy liên tục, animation đúng ba lớp, photo strip năm ảnh 2:3, lễ/tiệc/countdown, skip và reduced motion.
- [ ] Thêm `src/guest.ts`, `src/music.ts`; tên chỉ đọc URL, nhạc không bản quyền tự tạo, có dọn tài nguyên. Tối ưu minh họa thành WebP cục bộ và ghi nguồn trong README.
- [ ] Chạy `bun test`, `bun run check`, `bun run build`. Dùng Chromium để thao tác thật và kiểm tra DOM/audio/ảnh/lịch/focus ở mobile/desktop/reduced motion. Xem screenshot đóng, mở trung gian và nội dung; sửa lỗi nếu có.
- [ ] Đọc diff, cập nhật README và kết quả kiểm tra; commit implementation rồi push branch `dn` lên `origin`.
