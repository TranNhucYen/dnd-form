import { expect, test } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS as L } from "../../src/features/form-builder/constants/labels";

test.describe("Nền PDF trong trình thiết kế @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
    await page.getByRole("tab", { name: L.toolbarTabs.background }).click();
  });

  test("tắt chỉnh độ mờ khi chưa có nền PDF", async ({ page }) => {
    await expect(page.locator('input[type="range"]')).toBeDisabled();
    await expect(page.getByText(L.toolbar.pdf.emptyOpacity)).toBeVisible();
  });

  test("từ chối file không phải PDF và giữ canvas hiện tại", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${L.palette.fields.label}"]`));
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: "khong-phai-pdf.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("not a pdf"),
    });
    await expect(page.getByText(L.toolbar.pdf.invalid)).toBeVisible();
    await expect(page.locator('[data-droppable-id="canvas"]')).toBeVisible();
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    await expect(page.locator('input[type="range"]')).toBeDisabled();
  });

  test("từ chối PDF lớn hơn giới hạn 20 MB trước khi tải lên", async ({ page }) => {
    const input = page.locator('input[type="file"]');
    await input.setInputFiles({
      name: "qua-gioi-han.pdf",
      mimeType: "application/pdf",
      buffer: Buffer.alloc(20 * 1024 * 1024 + 1),
    });
    await expect(page.getByText(L.toolbar.pdf.tooLarge)).toBeVisible();
    await expect(page.locator('input[type="range"]')).toBeDisabled();
  });

});
