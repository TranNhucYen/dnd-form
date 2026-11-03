import { expect, test, type Page } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS } from "../../src/features/form-builder/constants/labels";

test.describe("Tương tác với vùng thiết kế @canvas @form-builder", () => {
  test.beforeEach(async ({ context, baseURL }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
  });

  test("thêm, sửa, di chuyển, undo, redo và xóa một trường trong vùng thiết kế", async ({
    page,
  }) => {
    const canvas = page.locator('[data-droppable-id="canvas"]');
    const field = page.locator("[data-field-id]").first();

    await test.step("Mở trình soạn thảo", async () => {
      await page.goto("/editor");
      await expect(canvas).toBeVisible();
    });

    await test.step("Kéo 'Nhãn' từ bảng thành phần vào vùng thiết kế", async () => {
      await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
      await expect(field).toBeVisible();
      await expect(field.locator('[data-toolbar="true"]')).toBeVisible();
    });

    await test.step("Nhấp chuột một lần chỉ chọn trường, chưa mở chế độ sửa", async () => {
      await field.click();
      await expect(field.locator("textarea")).toHaveCount(0);
    });

    await test.step("Nhấp đúp rồi sửa nội dung trường", async () => {
      await field.dblclick({ position: { x: 30, y: 10 } });
      const inlineEditor = field.locator("textarea");
      await expect(inlineEditor).toBeVisible();
      await inlineEditor.fill("Playwright field");
      await inlineEditor.press("Control+Enter");
      await expect(field).toContainText("Playwright field");
    });

    const originalBox = await test.step("Ghi nhận vị trí ban đầu", async () => {
      const box = await field.boundingBox();
      if (!box) throw new Error("The new field has no visible bounding box.");
      return box;
    });

    const movedBox = await test.step("Di chuyển trường trong vùng thiết kế", async () => {
      await moveFieldBy(page, originalBox, 70, 45);
      await expect
        .poll(async () => (await field.boundingBox())?.x ?? originalBox.x)
        .toBeGreaterThan(originalBox.x + 20);
      const box = await field.boundingBox();
      if (!box) throw new Error("The moved field has no visible bounding box.");
      return box;
    });

    await test.step("Hoàn tác để đưa trường về vị trí cũ", async () => {
      await page.getByTitle(FORM_BUILDER_LABELS.canvas.undo).click();
      await expect
        .poll(async () => (await field.boundingBox())?.x ?? movedBox.x)
        .toBeLessThan(movedBox.x - 20);
    });

    await test.step("Làm lại để đưa trường về vị trí mới", async () => {
      await page.getByTitle(FORM_BUILDER_LABELS.canvas.redo).click();
      await expect
        .poll(async () => (await field.boundingBox())?.x ?? originalBox.x)
        .toBeGreaterThan(originalBox.x + 20);
    });

    await test.step("Xóa trường", async () => {
      await field.getByTitle(FORM_BUILDER_LABELS.canvas.deleteField).click();
      await expect(page.locator("[data-field-id]")).toHaveCount(0);
    });
  });

  test("bỏ chọn trường khi nhấp vào vùng trống của canvas", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    await expect(field.locator('[data-toolbar="true"]')).toBeVisible();
    const canvas = page.locator('[data-droppable-id="canvas"]');
    const blankPoint = await canvas.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      for (let y = 20; y < rect.height - 20; y += 20) {
        for (let x = 20; x < rect.width - 20; x += 20) {
          if (document.elementFromPoint(rect.left + x, rect.top + y) === element) {
            return { x, y };
          }
        }
      }
      return null;
    });
    if (!blankPoint) throw new Error("Không tìm thấy điểm trống có thể nhấp trên canvas.");
    await canvas.click({ position: blankPoint });
    await expect(field.locator('[data-toolbar="true"]')).toHaveCount(0);
  });

  test("hủy sửa nhãn bằng Escape và giữ lại nội dung cũ", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    await field.dblclick();
    const editor = field.locator("textarea");
    await editor.fill("Nội dung cần hủy");
    await editor.press("Escape");
    await expect(field).toContainText("Nhãn văn bản");
    await expect(field).not.toContainText("Nội dung cần hủy");
  });

  test("chỉ hiện handle resize ngang cho trường Văn bản", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.text}"]`));
    const field = page.locator("[data-field-id]").first();
    await expect(field.locator('[data-resize-handle="true"]')).toHaveCount(2);
    await expect(field.locator('[data-resize-handle="true"]').first()).toHaveAttribute("class", /cursor-ew-resize/);
  });

  test("không hiện handle resize cho trường không hỗ trợ resize", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.checkbox}"]`));
    const field = page.locator("[data-field-id]").first();
    await field.click();
    await expect(field.locator('[data-resize-handle="true"]')).toHaveCount(0);
  });

  test("resize trường tám hướng thay đổi kích thước", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    const before = await field.boundingBox();
    if (!before) throw new Error("Không tìm thấy trường cần resize.");
    await expect(field.locator('[data-resize-handle="true"]')).toHaveCount(8);
    const east = field.locator('[data-resize-handle="true"]').nth(3);
    const handle = await east.boundingBox();
    if (!handle) throw new Error("Không tìm thấy handle bên phải.");
    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
    await page.mouse.down();
    await page.mouse.move(handle.x + handle.width / 2 + 50, handle.y + handle.height / 2, { steps: 6 });
    await page.mouse.up();
    await expect.poll(async () => (await field.boundingBox())?.width ?? before.width).toBeGreaterThan(before.width + 20);
  });

  test("resize trường Đường kẻ theo chiều ngang", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.line}"]`));
    const field = page.locator("[data-field-id]").first();
    const before = await field.boundingBox();
    if (!before) throw new Error("Không tìm thấy đường kẻ.");
    await expect(field.locator('[data-resize-handle="true"]')).toHaveCount(2);
    const east = field.locator('[data-resize-handle="true"]').first();
    const handle = await east.boundingBox();
    if (!handle) throw new Error("Không tìm thấy handle resize đường kẻ.");
    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
    await page.mouse.down();
    await page.mouse.move(handle.x + handle.width / 2 + 50, handle.y + handle.height / 2, { steps: 6 });
    await page.mouse.up();
    await expect.poll(async () => (await field.boundingBox())?.width ?? before.width).toBeGreaterThan(before.width + 20);
  });

  test("từ chối thả trường đè lên một trường khác", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const fields = page.locator("[data-field-id]");
    await fields.first().getByTitle(FORM_BUILDER_LABELS.canvas.duplicateField).click();
    await expect(fields).toHaveCount(2);
    const source = await fields.first().boundingBox();
    const duplicate = await fields.nth(1).boundingBox();
    if (!source || !duplicate) throw new Error("Không tìm thấy hai trường cần kéo.");
    await moveFieldBy(page, duplicate, source.x - duplicate.x + 20, source.y - duplicate.y);
    await expect
      .poll(async () => (await fields.nth(1).boundingBox())?.x ?? duplicate.x)
      .toBeCloseTo(duplicate.x, 0);
    await expect(fields).toHaveCount(2);
  });

  test("từ chối thả trường ra ngoài canvas", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    const canvas = await page.locator('[data-droppable-id="canvas"]').boundingBox();
    const before = await field.boundingBox();
    if (!canvas || !before) throw new Error("Không tìm thấy canvas hoặc trường cần kéo.");
    await moveFieldBy(page, before, canvas.width + 100, 0);
    await expect
      .poll(async () => {
        const box = await field.boundingBox();
        return Boolean(box && box.x >= canvas.x && box.x + box.width <= canvas.x + canvas.width);
      })
      .toBe(true);
  });

  test("hiển thị đường gióng khi kéo trường thẳng hàng với trường khác", async ({ page }) => {
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const fields = page.locator("[data-field-id]");
    await fields.first().getByTitle(FORM_BUILDER_LABELS.canvas.duplicateField).click();
    await expect(fields).toHaveCount(2);
    const first = await fields.first().boundingBox();
    const second = await fields.nth(1).boundingBox();
    if (!first || !second) throw new Error("Không tìm thấy trường để kiểm tra đường gióng.");

    const startX = second.x + second.width / 2;
    const startY = second.y + second.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.waitForTimeout(250);
    await page.mouse.move(startX + first.x - second.x, startY, { steps: 8 });
    await expect(page.locator('[data-droppable-id="canvas"] .border-green-500')).toHaveCount(1);
    await page.mouse.up();
  });
});

// Kéo field bằng chuột thủ công, có chờ để dnd-kit kích hoạt (delay activation).
async function moveFieldBy(
  page: Page,
  box: { x: number; y: number; width: number; height: number },
  dx: number,
  dy: number,
) {
  const cx = box.x + box.width / 2;
  const cy = box.y + box.height / 2;
  await page.mouse.move(cx, cy);
  await page.mouse.down();
  await page.waitForTimeout(250); // giữ yên cho tới khi hết delay của dnd-kit
  await page.mouse.move(cx + dx, cy + dy, { steps: 10 });
  await page.mouse.up();
}
