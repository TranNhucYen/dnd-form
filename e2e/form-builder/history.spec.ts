import { expect, test } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS as L } from "../../src/features/form-builder/constants/labels";

test.describe("Lịch sử thao tác trong trình thiết kế @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
  });

  test("undo và redo thao tác thêm trường", async ({ page }) => {
    const undo = page.getByTitle(L.canvas.undo);
    const redo = page.getByTitle(L.canvas.redo);
    await expect(undo).toBeDisabled();
    await expect(redo).toBeDisabled();

    await dragPaletteItemToCanvas(page, page.locator(`[title="${L.palette.fields.label}"]`));
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    await expect(undo).toBeEnabled();
    await undo.click();
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
    await expect(redo).toBeEnabled();
    await redo.click();
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
  });

  test("undo và redo thao tác xóa trường", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${L.palette.fields.label}"]`));
    const field = page.locator("[data-field-id]").first();
    await field.getByTitle(L.canvas.deleteField).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(0);

    await page.getByTitle(L.canvas.undo).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    await page.getByTitle(L.canvas.redo).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
  });

  test("undo và redo nội dung TipTap của bảng dữ liệu", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${L.palette.fields.datatable}"]`));
    const table = page.locator("[data-field-id] table");
    const cell = page.locator("[data-field-id] th").first();
    await cell.getByText("Cột 1", { exact: true }).dblclick();
    const editor = page.locator('[data-field-id] .ProseMirror[contenteditable="true"]');
    await expect(editor).toBeFocused();
    await editor.press("End");
    await editor.pressSequentially(" kiểm tra lịch sử", { delay: 40 });
    await expect(table).toContainText("kiểm tra lịch sử");
    await page.getByTitle(L.canvas.undo).click();
    await expect(table).not.toContainText("kiểm tra lịch sử");
    await page.getByTitle(L.canvas.redo).click();
    await expect(table).toContainText("kiểm tra lịch sử");
  });
});
