import { expect, test } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS } from "../../src/features/form-builder/constants/labels";

test.describe("Thao tác trong vùng thiết kế @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
    await expect(page.locator('[data-droppable-id="canvas"]')).toBeVisible();
  });

  test("sao chép và xóa trường bằng thanh công cụ nổi", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const fields = page.locator("[data-field-id]");
    await expect(fields).toHaveCount(1);
    await fields.first().getByTitle(FORM_BUILDER_LABELS.canvas.duplicateField).click();
    await expect(fields).toHaveCount(2);
    await expect(fields.nth(1)).toBeVisible();
    await fields.nth(1).getByTitle(FORM_BUILDER_LABELS.canvas.deleteField).click();
    await expect(fields).toHaveCount(1);
  });

  test("xóa trường đang chọn bằng phím Delete", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await page.locator("[data-field-id]").click();
    await page.keyboard.press("Delete");
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
  });

  test("xóa trường đang chọn bằng phím Backspace", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await page.locator("[data-field-id]").click();
    await page.keyboard.press("Backspace");
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
  });

  test("nhân bản trường bằng Ctrl+D", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await page.locator("[data-field-id]").click();
    await page.keyboard.press("Control+d");
    await expect(page.locator("[data-field-id]")).toHaveCount(2);
  });

  test("copy và paste trường bằng Ctrl+C, Ctrl+V", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await page.locator("[data-field-id]").click();
    await page.keyboard.press("Control+c");
    await page.keyboard.press("Control+v");
    await expect(page.locator("[data-field-id]")).toHaveCount(2);
    await expect(page.locator("[data-field-id]").nth(1)).toContainText("Nhãn văn bản");
  });

  test("cut và paste trường bằng Ctrl+X, Ctrl+V", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await page.locator("[data-field-id]").click();
    await page.keyboard.press("Control+x");
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
    await page.keyboard.press("Control+v");
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
  });

  test("copy từ context menu rồi paste bằng Ctrl+V", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    await field.click({ button: "right" });
    await page.getByRole("menuitem", { name: FORM_BUILDER_LABELS.canvasMenu.copy }).click();
    await page.keyboard.press("Control+v");
    await expect(page.locator("[data-field-id]")).toHaveCount(2);
    await expect(page.locator("[data-field-id]").nth(1)).toContainText("Nhãn văn bản");
  });

  test("cut từ context menu rồi dán bằng context menu canvas", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    await field.click({ button: "right" });
    await page.getByRole("menuitem", { name: FORM_BUILDER_LABELS.canvasMenu.cut }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(0);

    const canvas = page.locator('[data-droppable-id="canvas"]');
    const box = await canvas.boundingBox();
    if (!box) throw new Error("Không tìm thấy canvas.");
    await page.locator('[data-droppable-id="canvas"]').click({
      position: { x: 360, y: 450 },
      button: "right",
    });
    await page.getByRole("menuitem", { name: FORM_BUILDER_LABELS.canvasMenu.paste }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
  });

  test("nhân bản và xóa trường từ context menu", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    await field.click({ button: "right" });
    await page.getByRole("menuitem", { name: FORM_BUILDER_LABELS.canvasMenu.duplicate }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(2);
    await page.locator("[data-field-id]").last().click({ button: "right" });
    await page.getByRole("menuitem", { name: FORM_BUILDER_LABELS.canvasMenu.remove }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
  });

  test("phím tắt không xóa trường khi đang nhập văn bản", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    await field.dblclick();
    const editor = field.locator("textarea");
    await editor.fill("Đang nhập nội dung");
    await editor.press("Delete");
    await editor.press("Backspace");
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    await expect(editor).toBeFocused();
    await editor.press("Escape");
  });

  test.fixme("chọn tất cả trường từ menu chuột phải trong vùng thiết kế", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`), 220, 140);
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.text}"]`), 500, 180);
    const canvas = page.locator('[data-droppable-id="canvas"]');
    const box = await canvas.boundingBox();
    if (!box) throw new Error("Canvas has no visible bounding box.");
    await page.mouse.click(box.x + 20, box.y + 400, { button: "right" });
    await page.getByRole("menuitem", { name: FORM_BUILDER_LABELS.canvas.selectAll }).click();

    await expect
      .poll(() =>
        page.locator("[data-field-id]").evaluateAll((fields) =>
          fields.filter(
            (field) => getComputedStyle(field).outlineColor === "rgb(37, 99, 235)",
          ).length,
        ),
      )
      .toBe(2);
  });
});
