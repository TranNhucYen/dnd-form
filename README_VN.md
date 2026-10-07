# DragForm - Ứng dụng Thiết kế & Xuất bản Biểu mẫu

---

# PHẦN 1: GIỚI THIỆU VÀ CÁC CHỨC NĂNG CHÍNH

## 1. Giới thiệu chung
- DragForm là ứng dụng hỗ trợ tạo, quản lý và in ấn các loại biểu mẫu, đơn từ hoặc phiếu khảo sát trên trình duyệt web. 

- Người dùng thao tác trực tiếp trên giao diện trang giấy: chọn các thành phần cần thiết và đặt vào vị trí tương ứng thay vì phải tự căn chỉnh bố cục thủ công.

---

## 2. Các chức năng chính

### 1. Tạo biểu mẫu bằng thao tác kéo thả
* **Giao diện trang giấy**: Hiển thị tương tự trang giấy in thực tế. Hỗ trợ các khổ giấy thông dụng (A4, A3, A5) theo hướng dọc hoặc ngang và cho phép tùy chỉnh khoảng cách lề.
* **Các thành phần cơ bản**:
  * Tiêu đề, đoạn chữ hướng dẫn.
  * Các ô điền thông tin (chữ, số, ngày tháng).
  * Danh sách chọn (menu thả xuống), ô đánh dấu (checkbox).
  * Bảng dữ liệu.
  * Hình ảnh, mã QR.
  * Khung ký tên.
* **Hỗ trợ căn hàng**: Khi di chuyển các phần tử, hệ thống hiển thị đường gióng để giúp các mục thẳng hàng với nhau.

### 2. Soạn thảo biểu mẫu nhiều trang
* Hỗ trợ tạo biểu mẫu gồm một hoặc nhiều trang.
* Cho phép chuyển đổi qua lại giữa các trang trong lúc làm việc, thêm trang mới hoặc xóa bớt trang khi cần.
* Khi in hoặc xuất file, các trang được sắp xếp lần lượt theo đúng thứ tự.

### 3. Thư viện biểu mẫu mẫu
* Cung cấp một số mẫu có sẵn như đơn xin nghỉ phép, phiếu khảo sát, thỏa thuận cơ bản.
* Người dùng có thể xem trước nội dung mẫu, sau đó tạo một bản sao về tài khoản của mình để chỉnh sửa lại.

### 4. Quản lý biểu mẫu cá nhân
* Danh sách lưu các biểu mẫu người dùng đã tạo.
* Cho phép tìm kiếm theo tên, mở lại để sửa đổi, nhân bản thành biểu mẫu mới hoặc xóa khi không còn nhu cầu sử dụng.

### 5. Chia sẻ và cộng tác
* **Liên kết xem trực tuyến**: Có thể tạo đường link để người khác xem và in biểu mẫu trên trình duyệt mà không bắt buộc phải đăng nhập.
* **Mời qua email**: Chia sẻ quyền xem hoặc quyền chỉnh sửa biểu mẫu với tài khoản khác.

### 6. In ấn và xuất file PDF
* Cho phép xem lại trang trước khi in.
* Hỗ trợ in trực tiếp từ trình duyệt hoặc tải về dưới dạng tệp PDF theo kích thước khổ giấy đã chọn.

### 7. Gửi biểu mẫu lên cộng đồng
* Người dùng có thể gửi biểu mẫu do mình thiết kế để ban quản trị xem xét.
* Biểu mẫu sau khi được duyệt sẽ hiển thị trên thư viện chung để người dùng khác có thể tham khảo.

---

# PHẦN 2: CÔNG NGHỆ VÀ HƯỚNG HƯỚNG DẪN CÀI ĐẶT

## 1. Các Công nghệ (Tech Stack)

* **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19).
* **Ngôn ngữ**: TypeScript.
* **Giao diện**: Tailwind CSS, Radix UI, Lucide React, Sonner.
* **Kéo thả**: `@dnd-kit/react`.
* **Trình soạn thảo văn bản / bảng**: TipTap Editor (`@tiptap/react`, `@tiptap/starter-kit`, `@tiptap/extension-table`).
* **Quản lý trạng thái client**: Zustand (cho vùng làm việc Form Builder).
* **Cơ sở dữ liệu & ORM**: MySQL 8.x, [Drizzle ORM](https://orm.drizzle.team/).
* **Xác thực**: JWT (Jose) lưu trong HttpOnly Cookie.
* **Xuất file PDF**: Headless Chromium thông qua [Puppeteer](https://pptr.dev/).
* **Lưu trữ tệp tin**: Hỗ trợ ổ đĩa cục bộ (`local`) hoặc lưu trữ tương thích S3 (`s3`).

---

## 2. Kiến trúc Hệ thống

### 2.1. Phân tầng kiến trúc (4 Layers)

Mã nguồn được tổ chức theo 4 tầng phân tách trách nhiệm:

```text
╭───────────────────────╮      ╭───────────────────────╮      ╭───────────────────────╮      ╭───────────────────────╮
│      Repository       │ ───> │        Service        │ ───> │     Server Action     │ ───> │       Hook / UI       │
├───────────────────────┤      ├───────────────────────┤      ├───────────────────────┤      ├───────────────────────┤
│ • Truy vấn CSDL / Mock│      │ • Xử lý nghiệp vụ     │      │ • Xác thực quyền hạn  │      │ • Quản lý state UI    │
│ • Chuyển đổi URL ảnh  │      │ • Kiểm tra dữ liệu    │      │ • Bắt lỗi đồng nhất   │      │ • Tương tác người dùng│
│ • Tương tác Drizzle   │      │ • Ném lỗi (AppError)  │      │ • Trả ActionResponse  │      │ • Render Canvas       │
╰───────────────────────╯      ╰───────────────────────╯      ╰───────────────────────╯      ╰───────────────────────╯
```

### 2.2. Đơn vị đo lường nội bộ (Internal Units)

Để giảm thiểu sai số làm tròn điểm ảnh giữa màn hình hiển thị và trang in thực tế:
* **Quy ước**:
  $$\mathbf{100\text{ Internal Units} = 1\text{ mm}}$$
  *(Ví dụ: Khổ A4 kích thước $210 \times 297\text{ mm}$ được biểu diễn là $21000 \times 29700\text{ units}$)*.
* **Hiển thị trên màn hình**: Quy đổi theo tỷ lệ CSS tiêu chuẩn `CSS_PX_PER_MM = 96 / 25.4` (~`3.7795 px/mm`).
* Tọa độ ($x, y$), kích thước và lề trang lưu trong cơ sở dữ liệu đều sử dụng kiểu số nguyên `InternalUnit`.

---

## 3. Cấu trúc Dữ liệu Biểu mẫu (`FormSchemaJson`)

Cấu trúc JSON lưu trữ tài liệu biểu mẫu hỗ trợ nhiều trang:

```typescript
// Cấu hình trang
export interface SchemaPageSettings {
  preset: "A3" | "A4" | "A5";
  orientation: "PORTRAIT" | "LANDSCAPE";
  margins: {
    top: InternalUnit;
    bottom: InternalUnit;
    left: InternalUnit;
    right: InternalUnit;
  };
  dimensions: {
    width: InternalUnit;
    height: InternalUnit;
  };
}

// Cấu trúc một trường dữ liệu
export interface BaseSchemaField<T extends FieldType> {
  id: string;
  type: T;
  x: InternalUnit;
  y: InternalUnit;
  width?: InternalUnit;
  height?: InternalUnit;
  style?: FieldStyle;
  data?: FieldDataMap[T];
}

// Đại diện cho một trang độc lập
export interface FormPageSchema {
  id: string;
  pageNumber: number;
  name?: string;
  page: SchemaPageSettings;
  fields: SchemaField[];
}

// Cấu trúc schema lưu trong bảng schema_json (cột content)
export interface FormSchemaJson {
  pages: FormPageSchema[];
}
```

---

## 4. Các Phân hệ Kỹ thuật Trọng tâm

### 4.1. Trình thiết kế biểu mẫu (Form Builder Engine)
* **Zustand Store (`useFormBuilderStore`)**: 
  * Quản lý danh sách `pages`, trang đang kích hoạt `activePageId` và các thuộc tính tương ứng của trang đó.
  * Đồng bộ dữ liệu hai chiều giữa trang hiện hành và mảng `pages`.
  * Hỗ trợ lưu lịch sử Undo/Redo cho thao tác kéo thả và nội dung bảng TipTap.
* **Các loại trường thành phần**:
  Bao gồm 12 loại: `label`, `text`, `textarea`, `number`, `date`, `select`, `checkbox`, `line`, `datatable`, `image`, `qrcode`, `signature`.
* **Đường gióng vị trí (Smart Guides)**:
  So sánh tọa độ của phần tử đang di chuyển với các phần tử xung quanh theo trục ngang và dọc để hỗ trợ căn lề (ngưỡng bắt dính: `5px`).

### 4.2. Bộ máy Xuất PDF (Puppeteer Engine)
* **Quy chuẩn trang in CSS**:
  * Thiết lập `@page { size: ${w}mm ${h}mm; margin: 0mm !important; }`.
  * Sử dụng thuộc tính `break-after: page` để phân tách vật lý giữa các trang in.
* **Thời điểm chụp bản in (`usePrintReadiness`)**:
  Puppeteer theo dõi cờ `window.__DRAGFORM_RENDER_READY__`, chờ phông chữ (`document.fonts.ready`), bảng và hình ảnh tải xong trước khi xuất file.
* **Quản lý phiên làm việc**:
  Tái sử dụng một instance trình duyệt dùng chung và mở ngữ cảnh riêng biệt cho từng yêu cầu xuất PDF để tiết kiệm bộ nhớ RAM/CPU.

### 4.3. Quản lý & Đồng bộ Media (Storage Driver & Hydration)
* **Tách biệt dữ liệu Schema và tệp tin**:
  Schema chỉ lưu mã định danh tệp tin (`fileKey`).
* **Cơ chế Hydrate động khi đọc (`hydrateImageUrls`)**:
  Khi tải dữ liệu biểu mẫu để hiển thị trên Canvas hoặc để xuất PDF, hệ thống tự động chuyển đổi `fileKey` thành đường dẫn URL tương ứng với driver lưu trữ hiện hành.
* **Hỗ trợ linh hoạt Storage Driver**:
  Cho phép chuyển đổi giữa lưu trữ tệp tin trên ổ đĩa cục bộ (`local`) và dịch vụ lưu trữ đám mây chuẩn S3 (`s3` R2 Object Storage, RustFS) thông qua cấu hình môi trường.

---

## 5. Hướng dẫn Cài đặt & Khởi chạy

### 5.1. Yêu cầu môi trường
* **Node.js**: Phiên bản `>= 20.x`.
* **Package Manager**: `pnpm` (phiên bản `>= 9.x`).
* **Cơ sở dữ liệu**: MySQL `>= 8.0` hoặc tương đương.

### 5.2. Các bước cài đặt

**1. Cài đặt các gói phụ thuộc:**
```bash
pnpm install
```

**2. Thiết lập tệp cấu hình môi trường (`.env`):**
```bash
cp .env.example .env
```
Cấu hình các tham số cần thiết trong `.env`:
```env
# Kết nối cơ sở dữ liệu
DATABASE_URL="mysql://root:password@localhost:3306/dragform_db"

# Chế độ dữ liệu (false: dùng MySQL thật, true: dùng mock data trong bộ nhớ)
USE_MOCK_DATA=false

# Khóa JWT (tối thiểu 32 ký tự)
JWT_SECRET="your_jwt_secret_key_at_least_32_characters"

# Tài khoản quản trị (super_admin) khởi tạo
SUPER_ADMIN_FULL_NAME="Super Admin"
SUPER_ADMIN_EMAIL="admin@dragform.io"
SUPER_ADMIN_PASSWORD="YourPassword123!"

# Nơi lưu trữ tệp tin ('local' hoặc 's3')
STORAGE_DRIVER=local
LOCAL_STORAGE_DIR=storage/uploads
LOCAL_PUBLIC_URL=/api/files
```

**3. Khởi tạo cấu trúc bảng và dữ liệu ban đầu:**
```bash
# Đẩy schema vào MySQL
pnpm db:push

# Nạp dữ liệu mặc định (vai trò, tài khoản quản trị)
pnpm db:seed
```

**4. Chạy ứng dụng ở môi trường phát triển:**
```bash
pnpm dev
```
Địa chỉ mặc định: `http://localhost:3000`

### 5.3. Các lệnh thường dùng khác
* `pnpm typecheck`: Kiểm tra kiểu dữ liệu TypeScript.
* `pnpm lint`: Kiểm tra định dạng và quy chuẩn mã nguồn.
* `pnpm build`: Đóng gói ứng dụng để triển khai.
