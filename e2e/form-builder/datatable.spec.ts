import { expect, test } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS as L } from "../../src/features/form-builder/constants/labels";

test.describe("Bảng dữ liệu trong trình thiết kế @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${L.palette.fields.datatable}"]`));
  });

  test("nhập nội dung vào ô bảng", async ({ page }) => {
    const cell = page.locator("[data-field-id] th").first();
    await cell.getByText("Cột 1", { exact: true }).dblclick();
    const editor = page.locator('[data-field-id] .ProseMirror[contenteditable="true"]');
    await expect(editor).toBeFocused();
    await editor.press("End");
    await editor.pressSequentially(" Nội dung kiểm tra", { delay: 40 });
    await expect(cell).toContainText("Nội dung kiểm tra");
  });

  test("thêm và xóa hàng, cột bằng toolbar bảng", async ({ page }) => {
    const table = page.locator("[data-field-id] table");
    const initialRows = await table.locator("tr").count();
    const initialColumns = await table.locator("tr").first().locator("th, td").count();
    await page.locator("[data-field-id] td, [data-field-id] th").first().click();

    await page.getByTitle(L.fields.datatable.rowActions).click();
    await page.getByRole("menuitem", { name: L.fields.datatable.addRowBelow }).click();
    await expect(table.locator("tr")).toHaveCount(initialRows + 1);
    await page.getByTitle(L.fields.datatable.rowActions).click();
    await page.getByRole("menuitem", { name: L.fields.datatable.deleteRow }).click();
    await expect(table.locator("tr")).toHaveCount(initialRows);

    await page.getByTitle(L.fields.datatable.columnActions).click();
    await page.getByRole("menuitem", { name: L.fields.datatable.addColumnRight }).click();
    await expect(table.locator("tr").first().locator("th, td")).toHaveCount(initialColumns + 1);
    await page.getByTitle(L.fields.datatable.columnActions).click();
    await page.getByRole("menuitem", { name: L.fields.datatable.deleteColumn }).click();
    await expect(table.locator("tr").first().locator("th, td")).toHaveCount(initialColumns);
  });

  test("gộp hai ô liền kề đang chọn rồi tách ô đã gộp", async ({ page }) => {
    const cells = page.locator("[data-field-id] tr").nth(1).locator("td");
    const left = await cells.nth(0).boundingBox();
    const right = await cells.nth(1).boundingBox();
    if (!left || !right) throw new Error("Không tìm thấy hai ô cần gộp.");

    await page.mouse.move(left.x + left.width / 2, left.y + left.height / 2);
    await page.mouse.down();
    await page.mouse.move(right.x + right.width / 2, right.y + right.height / 2, { steps: 5 });
    await page.mouse.up();
    await expect(page.locator("[data-field-id] .selectedCell")).toHaveCount(2);

    await page.getByTitle(L.fields.datatable.mergeSplitTitle).click();
    const mergedCell = page.locator("[data-field-id] tr").nth(1).locator("td[colspan='2']");
    await expect(mergedCell).toBeVisible();

    await mergedCell.click();
    await page.getByTitle(L.fields.datatable.mergeSplitTitle).click();
    await expect(page.locator("[data-field-id] tr").nth(1).locator("td[colspan='2']")).toHaveCount(0);
    await expect(page.locator("[data-field-id] tr").nth(1).locator("td")).toHaveCount(2);
  });

  test("chiều cao bảng đổi theo số hàng", async ({ page }) => {
    const field = page.locator("[data-field-id]");
    const before = await field.boundingBox();
    if (!before) throw new Error("Không tìm thấy bảng trên canvas.");
    const cell = page.locator("[data-field-id] td").first();
    await cell.click();
    await page.getByTitle(L.fields.datatable.rowActions).click();
    await page.getByRole("menuitem", { name: L.fields.datatable.addRowBelow }).click();
    await expect.poll(async () => (await field.boundingBox())?.height ?? before.height).toBeGreaterThan(before.height);
  });

  test("undo và redo thêm cột không làm mất nội dung các ô", async ({ page }) => {
    const table = page.locator("[data-field-id] table");
    const firstCell = page.locator("[data-field-id] td").first();
    await firstCell.click();
    const row = table.locator("tr").first();
    const originalCount = await row.locator("th, td").count();
    await page.getByTitle(L.fields.datatable.columnActions).click();
    await page.getByRole("menuitem", { name: L.fields.datatable.addColumnRight }).click();
    await expect(row.locator("th, td")).toHaveCount(originalCount + 1);
    await page.getByTitle(L.canvas.undo).click();
    await expect(row.locator("th, td")).toHaveCount(originalCount);
    await page.getByTitle(L.canvas.redo).click();
    await expect(row.locator("th, td")).toHaveCount(originalCount + 1);
    await expect(firstCell).toContainText("Hàng 1");
  });

  test("resize ngang bảng và giữ chiều cao theo số hàng", async ({ page }) => {
    const field = page.locator("[data-field-id]").first();
    const before = await field.boundingBox();
    if (!before) throw new Error("Không tìm thấy bảng cần resize.");
    await expect(field.locator('[data-resize-handle="true"]')).toHaveCount(2);
    const east = field.locator('[data-resize-handle="true"]').first();
    const handle = await east.boundingBox();
    if (!handle) throw new Error("Không tìm thấy handle resize bảng.");
    await page.mouse.move(handle.x + handle.width / 2, handle.y + handle.height / 2);
    await page.mouse.down();
    await page.mouse.move(handle.x + handle.width / 2 + 50, handle.y + handle.height / 2, { steps: 6 });
    await page.mouse.up();
    await expect.poll(async () => (await field.boundingBox())?.width ?? before.width).toBeGreaterThan(before.width + 20);
    await expect.poll(async () => (await field.boundingBox())?.height ?? before.height).toBeGreaterThan(0);
  });
});
