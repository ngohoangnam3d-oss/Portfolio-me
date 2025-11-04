```markdown
# portfolio-cá nhân

Scaffold cho portfolio gallery + trang upload ảnh (drag & drop) để thêm nhiều ảnh vào repo.

Hướng dẫn nhanh:
1. Tạo repository private tên `portfolio-me` trên GitHub trong tài khoản `ngohoangnam3d-oss`.
2. Thêm các file từ repo (index.html, upload.html, styles.css, script.js, upload.js, gallery.json, README.md).
3. Tạo branch `main` (mặc định).
4. (Tùy chọn) Thêm placeholder images vào `images/projects/` và `images/banners/` theo gallery.json mẫu.
5. Mở `upload.html` trên trình duyệt (mở file local hoặc host tĩnh). Dán Personal Access Token (scope: repo) vào ô Token, đảm bảo repo field là `ngohoangnam3d-oss/portfolio-cá nhân`, chọn branch (main), kéo thả nhiều ảnh và nhấn "Bắt đầu upload".
6. Sau khi upload xong, ảnh sẽ được thêm vào thư mục `images/<timestamp>/`. Mở và cập nhật `gallery.json` để thêm entry cho ảnh mới (URL: `images/<timestamp>/<filename>`).

Bảo mật:
- Token chỉ dùng tạm trên trình duyệt. Sau khi upload xong, hãy revoke token (Settings -> Developer settings -> Personal access tokens).
- Không chia sẻ token cho người khác.

Muốn mình tạo script Node để tự động cập nhật gallery.json sau khi upload không? Hoặc muốn mình hướng dẫn chi tiết cách push toàn bộ scaffold vào repo bằng GitHub web / GitHub Desktop / git CLI? 
```
