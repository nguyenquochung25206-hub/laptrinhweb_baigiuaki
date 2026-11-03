# 🌳 Our Little World – Web 3D của nhóm

Ngôi làng hoạt hình 3D, mỗi thành viên là một nhân vật con vật.
Bấm vào nhân vật để xem web cá nhân, hoặc bấm **🎮 ĐIỀU KHIỂN** để chạy quanh vườn.

## 1. Cấu trúc thư mục

```
lang-3d/
├── index.html              ← trang chính (mở file này)
├── README.md               ← file hướng dẫn này
│
├── data/
│   └── members.js          ★ FILE DUY NHẤT BẠN CẦN SỬA: tên, ảnh, web, màu, con vật
│
├── assets/
│   └── avatars/            ★ BỎ ẢNH THÀNH VIÊN VÀO ĐÂY (1.jpg … 6.jpg)
│
├── members/                ★ BỎ WEB CÁ NHÂN VÀO ĐÂY
│   ├── thanhvien1/index.html
│   ├── thanhvien2/index.html
│   ├── thanhvien3/index.html
│   ├── thanhvien4/index.html
│   ├── thanhvien5/index.html
│   └── thanhvien6/index.html
│
├── css/
│   └── style.css           giao diện (nút, thẻ thông tin, màn hình mở đầu…)
│
└── js/                     code 3D (giữ nguyên thứ tự khi nối trong index.html)
    ├── core.js             hàm tiện ích, scene, camera, ánh sáng
    ├── world.js            ngôi làng: cây, hoa, cỏ, nhà, hồ, thác, đèn, chim, bướm…
    ├── characters.js       dựng 6 nhân vật + bảng tên
    ├── interaction.js      bấm nhân vật, camera bay, chế độ WASD/Space, mở portfolio
    ├── audio.js            nhạc nền, bật/tắt, âm lượng
    └── main.js             màn hình mở đầu, ngày/đêm, vòng lặp hoạt ảnh
```

## 2. Thêm ảnh thành viên
1. Chuẩn bị ảnh vuông (khoảng 256×256 trở lên), định dạng `.jpg` hoặc `.png`.
2. Chép vào `assets/avatars/`. Đặt tên `1.jpg`, `2.jpg`… (hoặc tên khác).
3. Nếu tên/đuôi file khác, sửa `avatar:` tương ứng trong `data/members.js`.

## 3. Thêm web cá nhân của thành viên
**Cách A – web nằm trong project:** chép toàn bộ web của bạn đó (index.html, css, ảnh…)
vào `members/thanhvienX/`. File chính phải tên là `index.html`. Giữ nguyên `url` trong `data/members.js`.

**Cách B – web đã đưa lên mạng (GitHub Pages, Netlify…):** sửa `url` thành link đầy đủ:
```js
url:"https://ten-ban.github.io/portfolio/"
```
Một số trang chặn không cho nhúng; khi đó dùng nút **Mở tab mới** trong cửa sổ portfolio.

## 4. Đổi tên, màu, con vật
Mở `data/members.js` và sửa từng dòng:
```js
{name:"Minh", avatar:"assets/avatars/1.jpg", url:"members/thanhvien1/index.html",
 color:0xffd93b, animal:"duck", trait:"glasses", text:"Vịt vàng đeo kính"}
```
- `animal`: `duck` · `bear` · `cat` · `rabbit` · `frog`
- `trait`: `glasses` (kính) · `hat` (mũ) · `wings` (cánh) · `backpack` (balo) · `bow` (nơ) · `ears` (tai dài, dùng cho thỏ)
- `color`: mã màu dạng `0xRRGGBB`
Đổi tiêu đề trang ở khối `SITE` cuối file.

## 5. Chạy thử
Phải chạy bằng server, **không bấm đúp** mở file (trình duyệt chặn tải ảnh làm texture):
- VS Code → cài **Live Server** → chuột phải `index.html` → *Open with Live Server*.
- Hoặc trong thư mục project chạy: `python -m http.server 8000` rồi mở http://localhost:8000
Cần có internet để tải thư viện three.js.

## 6. Điều khiển
| Thao tác | Kết quả |
|---|---|
| Kéo chuột / lăn chuột | Xoay / zoom camera |
| WASD hoặc mũi tên | Di chuyển góc nhìn |
| Bấm nhân vật | Camera bay tới, hiện thẻ thông tin |
| 🎮 ĐIỀU KHIỂN | Chơi nhân vật: WASD chạy, Space nhảy, Esc thoát |
| XEM PORTFOLIO | Mở web cá nhân |
| 🔊 / thanh trượt / 🌙 | Nhạc, âm lượng, ngày/đêm |

## 7. Đưa lên mạng (tùy chọn)
Đẩy cả thư mục lên GitHub rồi bật GitHub Pages, hoặc kéo-thả vào Netlify.
