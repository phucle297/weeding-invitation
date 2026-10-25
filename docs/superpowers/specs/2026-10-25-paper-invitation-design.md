# Thiệp cưới trắng ngà · thiết kế đã chốt

## Wireframe và tài nguyên

- [Wireframe responsive](../../design/wireframe.html): mở bằng Vite ở `/docs/design/wireframe.html`, xem ở 390px và 1440px.
- [Storyboard mở thiệp](../../design/assets/opening-storyboard.png).
- [Minh họa Minh Toàn Galaxy theo ảnh người dùng](../../design/assets/minh-toan-galaxy.png).
- [Bố cục tham khảo mobile/desktop](../../design/assets/layout-reference.png). Ảnh tham khảo không quyết định tỷ lệ khung ảnh; bản chạy bắt buộc 2:3.

## Ngôn ngữ thiết kế

Trắng ngà chiếm phần lớn bề mặt. Vàng cổ cho tiêu đề, nâu ấm đủ tương phản cho nội dung, dấu sáp bạc. Không đỏ, không nền taupe, không menu, không thư viện ảnh xòe. Một trang giấy liên tục với khoảng trắng, đường kẻ vàng mảnh, hoa văn tiết chế ngoài vùng đọc.

## Mở thiệp — thay thế mọi mô tả chuyển động cũ

Màn đầu chỉ có phong bì trắng và sáp bạc. Nhấn sáp để mở nắp trên; sáp luôn gắn với nắp. Tấm thiệp thẳng đứng trượt dần lên và zoom đều, không xoay. Thứ tự lớp: nắp mở/lưng phong bì → tấm thiệp → túi phong bì phía dưới. Thiệp che nắp trên nhưng vẫn bị túi phía trước che ở phần dưới. Khi thiệp tiến lên/phóng lớn, phong bì đi khỏi khung hình; không tách sáp sang bên, không đổi sang tấm thiệp khác.

Sau đó năm ảnh cấp dần từ khe ngang xuống thành một dải dọc liên tục. Mỗi ảnh đúng 2:3 (4672:7008); không ép năm ảnh vào một viewport. Người xem có thể bỏ qua hoạt ảnh. Reduced motion mở nội dung ngay. Focus chuyển vào tiêu đề sau khi mở. Chặn cuộn/tab vào nội dung khi đang đóng.

## Trang nội dung

1. Dải năm ảnh cưới mock cục bộ, trắng viền mảnh. Khe ảnh và song hỷ tiết chế phía trên.
2. “Trân trọng kính mời” và tên lấy từ `?name=ABC`, mặc định “Quý khách”; render dạng text, không HTML. Sau đó tên đôi và ngày.
3. Lễ thành hôn: hai gia đình, hai tên đầy đủ trên hai dòng riêng, 09:30 ngày Chủ Nhật 06.12.2026 tại tư gia P. Hòa Cường, Đà Nẵng.
4. Tiệc cưới: minh họa đúng khách sạn được cung cấp; desktop hai cột hình/nội dung, mobile xếp dọc. Minh Toàn Galaxy, Sảnh Venus – Tầng 2; 11:00 đón khách, 12:00 khai tiệc. Địa chỉ và link Google Maps thật.
5. Đếm ngược và lời kết, nút nhạc cố định ở vùng an toàn không che nội dung.

## Nhạc và dữ liệu

Nhạc nền không lời nhẹ bắt đầu từ thao tác mở, có nút bật/tắt và xử lý trình duyệt không cho phát. Dùng bản giai điệu tự tạo bằng Web Audio, không lấy nhạc bản quyền từ video. Tạm dừng khi tab ẩn; dọn audio/timer khi unmount.

`name` chỉ cá nhân hóa. Không tự ý gửi tên hoặc lượt mở sang bên thứ ba. Chưa có dịch vụ lưu lượt truy cập; cần chốt consent, nơi lưu và định nghĩa lượt mở riêng trước khi triển khai tracking.

## Nghiệm thu

Bun tests, Biome, type-check và production build đạt. Trình duyệt thực: 1440px, 390px, 320px, reduced motion; kiểm tra đóng → nắp mở → kéo/zoom → dải ảnh → nội dung; đúng lớp che, đủ năm ảnh tải được/tỷ lệ 2:3; URL cá nhân hóa, ký tự đặc biệt/thiếu tên; nhạc bật/tắt; skip; focus/bàn phím; không tràn ngang/lỗi console. Chụp và xem ảnh các trạng thái thực, không coi storyboard là bằng chứng animation.
