# Báo Cáo Phân Tích & Đề Xuất Refactor Module Form-Builder

> **Mục tiêu**: Đánh giá chất lượng mã nguồn module `src/features/form-builder`, xác định các điểm cần cải thiện về mặt cấu trúc, tính nhất quán, hiệu năng và khả năng bảo trì.
> **Nguyên tắc**: 
> 1. Tuyệt đối không thay đổi logic hay quy tắc nghiệp vụ hiện tại.
> 2. Không over-engineering, không áp dụng các pattern phức tạp làm code khó đọc / khó hiểu.
> 3. Tôn trọng kiến trúc sẵn có và chỉ tinh gọn những chỗ thật sự mang lại giá trị.

---

## 1. Tổng Quan Kiến Trúc Module `form-builder`

Module hiện tại được tổ chức tương đối mạch lạc theo phân lớp chức năng:
- **`store/`**: Quản lý trạng thái toàn cục với Zustand (`useFormBuilderStore`, `useEditorStore`).
- **`canvas/`**: Quản lý không gian vẽ, viewport, drag & drop (@dnd-kit), snapping, resize, context menu, smart guides.
- **`fields/`**: Thành phần các trường dữ liệu (12 field types), chia tách theo từng thư mục kèm toolbar riêng, kết nối qua `FieldRenderer` và `FieldToolbarRenderer` (Registry Pattern).
- **`left-sidebar/`**: Thanh danh mục Palette chứa các trường kéo thả.
- **`toolbar/`**: Thanh công cụ đỉnh (Home tab định dạng text/align/color; Page tab khổ giấy/lề; Tools lưu/tạo mới/undo/redo).
- **`domain/`**: Các module thuần tính toán (geometry, đơn vị đo lường internal unit, schema transformers).
- **`print/`**: Kết xuất trang in 1:1 sang đơn vị mm phục vụ in ấn / xuất PDF qua Puppeteer.

Nhìn chung, module đã có kiến trúc nền tảng tốt. Tuy nhiên, vẫn còn một số điểm bất cập, code lặp và lỗi tiềm ẩn cần được rà soát và cải thiện.

---

## 2. Chi Tiết Các Điểm Cần Refactor

### Nhóm 1: Lỗi Tiềm Ẩn & Bất Cập Logic (Bugs & Inconsistencies)

#### 1.1. Lỗi action `copyField` không cập nhật State trong `useFormBuilderStore.ts`
- **Hiện trạng (`src/features/form-builder/store/useFormBuilderStore.ts` dòng 590-594)**:
  ```typescript
  copyField: (fieldId) => {
    const target = get().fields.find((field) => field.id === fieldId);
    return target ? { clipboardField: { ...target } } : get();
  },
  ```
- **Vấn đề**: Hàm `copyField` là một action trong Zustand store nhưng lại dùng lệnh `return ...` thay vì gọi `set({ clipboardField: { ...target } })` như `cutField`. Do đó, khi người dùng nhấn `Ctrl+C` hoặc chọn "Sao chép" từ Context Menu, `clipboardField` **hoàn toàn không được lưu vào store**, khiến thao tác `pasteField` (`Ctrl+V`) không hoạt động như mong đợi.
- **Giải pháp**: Sửa thành gọi `set({ clipboardField: { ...target } })`. Đây là bản sửa lỗi trực tiếp, không làm thay đổi hành vi nghiệp vụ dự kiến.

#### 1.2. Thao tác rỗng `selectAllFields` gây hiểu lầm trong `CanvasContextMenu.tsx`
- **Hiện trạng**:
  - Trong `store/useFormBuilderStore.ts`: `selectAllFields: () => {}` (hàm rỗng).
  - Trong `canvas/components/CanvasContextMenu.tsx`: Có mục menu "Chọn tất cả" (`Ctrl+A`) gọi `selectAllFields()`.
  - Toàn bộ store hiện tại chỉ thiết kế quản lý 1 phần tử được chọn (`selectedFieldId: string | null`), không hỗ trợ multi-selection.
- **Vấn đề**: Menu item hiển thị phím tắt `Ctrl+A` nhưng click vào không có bất kỳ tác dụng nào, gây hiểu nhầm cho người dùng.
- **Giải pháp**:
  - Tạm thời ẩn / loại bỏ mục "Chọn tất cả" khỏi context menu cho đến khi store hỗ trợ multi-selection, hoặc ghi chú rõ ràng trạng thái chưa khả dụng để tránh dead code.

#### 1.3. Thiếu extension `Underline` trong TipTap Editor
- **Hiện trạng**:
  - Gói `@tiptap/extension-underline` đã được khai báo trong `package.json`.
  - Trong `toolbar/hooks/useActiveToolbarState.ts` có gọi toggle gạch chân: `(editor.chain().focus() as any).toggleUnderline().run()`.
  - Nhưng trong `DatatableField.tsx` và `TextareaField.tsx`, danh sách `extensions` khởi tạo cho `useEditor` **chưa thêm extension `Underline`**.
- **Vấn đề**: Nút Gạch chân (U) trên thanh công cụ không có tác dụng với các trường rich-text (Textarea, Datatable) vì TipTap không đăng ký mark `underline`.
- **Giải pháp**: Bổ sung `Underline` vào mảng `extensions` của `DatatableField` và `TextareaField`.

---

### Nhóm 2: Trùng Lặp Mã Nguồn (DRY - Don't Repeat Yourself)

#### 2.1. Hàm `getEffectivePageDimensions` bị khai báo trùng lặp
- **Hiện trạng**:
  - Được khai báo tại `src/features/form-builder/domain/transformers.ts` (dòng 26).
  - Được khai báo lại y hệt tại `src/features/form-builder/store/useFormBuilderStore.ts` (dòng 720).
- **Vấn đề**: Trùng lặp code tính toán khổ giấy (`baseSize.width`, `baseSize.height` theo `PORTRAIT`/`LANDSCAPE`). `useFormBuilderStore.ts` vốn dĩ đã import các helper khác từ `transformers.ts`.
- **Giải pháp**: Xóa bỏ khai báo trùng ở `useFormBuilderStore.ts`, import trực tiếp `getEffectivePageDimensions` từ `../domain/transformers` và re-export nếu cần.

#### 2.2. Trùng lặp logic tải ảnh giữa `ImageField.tsx` và `ImageToolbar.tsx`
- **Hiện trạng**:
  - `ImageField.tsx` (dòng 18-51) và `ImageToolbar.tsx` (dòng 17-49) đều có đoạn code ~35 dòng xử lý:
    - Quản lý state `isUploading`, `inputRef`.
    - Gọi `validateImageFile(file)`.
    - Tạo `FormData` và gọi Server Action `uploadMediaAction`.
    - Xử lý thông báo toast (`toast.error`, `toast.success`).
    - Khối `try/catch/finally` và dọn dẹp `inputRef.current.value = ""`.
- **Vấn đề**: Bất kỳ thay đổi nào về validation kích thước ảnh, định dạng cho phép, hoặc API upload đều phải sửa ở 2 file riêng biệt, dễ quên hoặc lệch logic.
- **Giải pháp**: Trích xuất một custom hook đơn giản `useImageUpload({ onUploaded })` đặt tại `fields/image/useImageUpload.ts`. Cả 2 component chỉ cần gọi hook này, đồng thời chuẩn hóa hiển thị `toast.success("Tải ảnh lên thành công")` cho cả hai nơi. Việc này giúp code mỗi file ngắn đi ~30 dòng và tập trung vào phần UI.

#### 2.3. Trùng lặp tính toán kích thước lề (Margin px) giữa `FormCanvas` và `MarginCornerMarks`
- **Hiện trạng**:
  - `FormCanvas.tsx` đã tính `marginPx` (chuyển đổi `margins` từ mm sang screen px) và truyền xuống các hook kéo thả.
  - `MarginCornerMarks.tsx` (dòng 21-29) lại tự đọc `margins` từ store và thực hiện lại toàn bộ 4 phép tính chuyển đổi đơn vị (`toScreenPx(toInternalUnit(Number.parseFloat(...)))`).
- **Giải pháp**: Truyền thẳng prop `margins={marginPx}` từ `FormCanvas` vào `MarginCornerMarks`, loại bỏ việc đọc store dư thừa và tránh tính toán lại mỗi lần render.

---

### Nhóm 3: Tinh Chỉnh React Patterns & Hiệu Năng (Clean Code)

#### 3.1. Loại bỏ Mirror State thừa trong `SignatureField.tsx`
- **Hiện trạng (`src/features/form-builder/fields/signature/SignatureField.tsx`)**:
  ```typescript
  const [signatureUrl, setSignatureUrl] = useState<string | null>(data?.value ?? null);
  useEffect(() => {
    setSignatureUrl(data?.value ?? null);
  }, [data?.value]);
  ```
- **Vấn đề**: `signatureUrl` chỉ sao chép lại prop `data?.value`. Việc dùng `useState` kèm `useEffect` để đồng bộ lại prop là anti-pattern trong React, làm tăng thêm 1 chu kỳ re-render không cần thiết và dễ gây bất đồng bộ state.
- **Giải pháp**: Bỏ state `signatureUrl` và `useEffect`. Khai báo trực tiếp:
  ```typescript
  const signatureUrl = data?.value ?? null;
  ```
  Khi xóa chữ ký hoặc lưu từ modal, chỉ cần gọi `onDataChange?.({ value: ... })`.

#### 3.2. Chuẩn hóa việc reset `isEditing` trong `TextareaField.tsx`
- **Hiện trạng (`src/features/form-builder/fields/textarea/TextareaField.tsx` dòng 22-30)**:
  ```typescript
  const [prevSelectedFieldId, setPrevSelectedFieldId] = useState(selectedFieldId);
  if (prevSelectedFieldId !== selectedFieldId) {
    setPrevSelectedFieldId(selectedFieldId);
    if (!isFieldSelected && isEditing) {
      setIsEditing(false);
    }
  }
  ```
- **Vấn đề**: Gọi `setState` trực tiếp trong quá trình render để phát hiện props đổi (render-phase state update) là cách viết phức tạp không cần thiết, làm code khó theo dõi.
- **Giải pháp**: Thay bằng `useEffect` đơn giản và trực quan:
  ```typescript
  useEffect(() => {
    if (!isFieldSelected) {
      setIsEditing(false);
    }
  }, [isFieldSelected]);
  ```
  Cách này đảm bảo tuân thủ lifecycle chuẩn mực của React, dễ đọc và không kích hoạt cảnh báo render lặp.

#### 3.3. Tối ưu Event Listener trong `useCanvasKeyboardShortcuts.ts`
- **Hiện trạng**:
  - `useEffect` đăng ký sự kiện `keydown` trên `window` có dependency array chứa `selectedFieldId`, `isReadOnly`, cùng toàn bộ các hàm action (`undo`, `redo`, `copyField`, `pasteField`, v.v.).
  - Mỗi lần người dùng click chọn 1 field khác trên Canvas, `selectedFieldId` thay đổi khiến toàn bộ event listener trên `window` bị remove và add lại liên tục.
- **Giải pháp**:
  - Vì các action và state đều có thể truy cập trực tiếp thông qua `useFormBuilderStore.getState()` trong event handler, dependency array có thể được tối giản (hoặc dùng ref cho state thường đổi). Listener chỉ cần đăng ký duy nhất 1 lần khi Canvas mount và gỡ bỏ khi unmount, giảm thiểu churn của DOM event.

#### 3.4. Dọn dẹp biến không dùng trong `useActiveToolbarState.ts`
- **Hiện trạng (`src/features/form-builder/toolbar/hooks/useActiveToolbarState.ts` dòng 7)**:
  ```typescript
  const selectedFieldId = useFormBuilderStore((state) => state.selectedFieldId);
  const selectedField = useFormBuilderStore((state) =>
    state.fields.find((f) => f.id === state.selectedFieldId)
  );
  ```
- **Vấn đề**: `selectedFieldId` ở dòng 7 được lấy nhưng không hề được sử dụng ở bất kỳ dòng nào tiếp theo trong hook.
- **Giải pháp**: Xóa dòng khai báo thừa này để tránh re-render không đáng có khi chỉ cần `selectedField`.

---

### Nhóm 4: Tái Sử Dụng Hook Chỉnh Sửa Trực Tiếp (`useInlineEdit`)

#### 4.1. Mở rộng `useInlineEdit` để `LabelField` có thể tái sử dụng
- **Hiện trạng**:
  - `useInlineEdit.ts` hiện đang fix cứng kiểu `inputRef: useRef<HTMLInputElement>(null)`.
  - Trong khi đó, `LabelField.tsx` (dòng 10-35) cũng cần tính năng inline edit tương tự nhưng dùng thẻ `textarea` (`HTMLTextAreaElement`). Do hook không hỗ trợ textarea, `LabelField` buộc phải tự viết lại toàn bộ logic double-click, autofocus, selection range, enter/escape handler.
- **Giải pháp**:
  - Mở rộng kiểu phần tử của `useInlineEdit`: cho phép ref trỏ tới `HTMLInputElement | HTMLTextAreaElement`.
  - Nhờ vậy, `LabelField.tsx` có thể sử dụng trực tiếp `useInlineEdit`, lược bỏ hơn 25 dòng code thủ công và đảm bảo trải nghiệm double-click chỉnh sửa văn bản đồng nhất trên mọi field.

---

## 3. Những Điểm Tốt CẦN GIỮ NGUYÊN (Không Nên Refactor)

Tuân thủ chặt chẽ yêu cầu **"không cố refactor khiến code trở nên khó hiểu"** của người dùng, các thành phần sau hoạt động rất tốt và **KHÔNG NÊN** thay đổi:

1. **Cấu trúc Dual-State của `useFormBuilderStore` (`pages` song song với `fields` của active page)**:
   - *Lý do giữ nguyên*: Việc lưu song song `fields` ở root store giúp các component con lấy trực tiếp dữ liệu mà không cần phải chạy selector `pages.find(...)` trên từng thao tác kéo thả/gõ chữ (tần suất cao). Các actions hiện tại đã đồng bộ 2 chiều chặt chẽ qua `updateActivePageFields`. Không nên chuẩn hóa (normalize) lại store vì sẽ làm phức tạp hóa selector và tăng độ trễ render.
2. **Cơ chế Snapshot Undo/Redo**:
   - *Lý do giữ nguyên*: Lưu snapshot mảng `pages` với giới hạn 50 bước (`MAX_HISTORY_STEPS`) là phương án đơn giản, tin cậy, dễ debug nhất. Không nên đưa Immer patches hay Command Pattern phức tạp vào.
3. **Cơ chế Snap & Alignment Guides (`snap.utils.ts`)**:
   - *Lý do giữ nguyên*: Các hàm toán học tính tọa độ hít và đường gióng được viết thuần túy (pure functions), logic rõ ràng, độ chính xác cao.
4. **Registry Pattern cho Fields (`FieldRenderer`, `FieldToolbarRenderer`)**:
   - *Lý do giữ nguyên*: Dễ dàng mở rộng thêm loại trường mới trong tương lai mà không làm ảnh hưởng đến các trường cũ.

---

## 4. Bảng Kế Hoạch Đề Xuất Thực Hiện (Khi Được Cho Phép Code)

| Thứ tự | Hạng mục | Tệp tin liên quan | Độ phức tạp | Tác động |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Sửa bug action `copyField` | `store/useFormBuilderStore.ts` | Rất thấp (1 dòng) | Sửa tính năng Sao chép / Dán |
| **2** | Gộp định nghĩa trùng `getEffectivePageDimensions` | `domain/transformers.ts`, `store/useFormBuilderStore.ts` | Rất thấp | Tránh duplicate code |
| **3** | Bổ sung extension `Underline` cho TipTap | `fields/textarea/TextareaField.tsx`, `fields/datatable/DatatableField.tsx` | Rất thấp | Kích hoạt tính năng gạch chân |
| **4** | Tạm thời vô hiệu hóa item rỗng `selectAllFields` | `canvas/components/CanvasContextMenu.tsx` | Rất thấp | Tránh gây hiểu lầm UI |
| **5** | Bỏ mirror state thừa `signatureUrl` | `fields/signature/SignatureField.tsx` | Rất thấp | Loại bỏ re-render dư thừa |
| **6** | Chuẩn hóa `isEditing` với `useEffect` | `fields/textarea/TextareaField.tsx` | Thấp | Code sạch, đúng chuẩn React |
| **7** | Trích xuất hook `useImageUpload` | `fields/image/useImageUpload.ts`, `ImageField.tsx`, `ImageToolbar.tsx` | Thấp | Loại bỏ ~30 dòng code trùng |
| **8** | Mở rộng `useInlineEdit` cho textarea | `fields/shared/useInlineEdit.ts`, `LabelField.tsx` | Thấp | Tái sử dụng logic, giảm code thừa |
| **9** | Truyền `margins` đã tính vào `MarginCornerMarks` | `canvas/FormCanvas.tsx`, `MarginCornerMarks.tsx` | Rất thấp | Tiết kiệm tính toán lại đơn vị |
| **10** | Dọn dẹp biến thừa `selectedFieldId` | `toolbar/hooks/useActiveToolbarState.ts` | Rất thấp | Code gọn gàng |
| **11** | Tối ưu hóa listener phím tắt | `canvas/hooks/useCanvasKeyboardShortcuts.ts` | Thấp | Giảm re-bind event listener |

---

## 5. Kết Luận

Module `src/features/form-builder` đã được lập trình với tư duy module hóa tốt, phân định ranh giới rõ ràng giữa Canvas, Toolbar và Field components. Các đề xuất refactor nêu trên hoàn toàn tập trung vào việc:
- Sửa lỗi tiềm ẩn (`copyField`, `Underline`).
- Khử trùng lặp logic (`upload image`, `getEffectivePageDimensions`).
- Tối ưu hóa các React pattern (`mirror state`, `render-phase setState`, `event listeners`).

Tất cả các đề xuất đều tuân thủ nguyên tắc **an toàn, giữ nguyên toàn bộ hành vi nghiệp vụ hiện tại, và giữ code dễ hiểu, sáng sủa.**
