import { expect, test } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS } from "../../src/features/form-builder/constants/labels";

const paletteFieldLabels = Object.values(FORM_BUILDER_LABELS.palette.fields);

test.describe("Bảng thành phần của trình thiết kế @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
    await expect(page.locator('[data-droppable-id="canvas"]')).toBeVisible();
  });

  test("hiển thị đủ loại trường và có thể thu gọn, mở lại bảng thành phần", async ({ page }) => {
    for (const label of paletteFieldLabels) {
      await expect(page.locator(`[title="${label}"]`)).toBeVisible();
    }

    await page.getByRole("button", { name: FORM_BUILDER_LABELS.palette.collapse }).click();
    await expect(page.locator(`[title="${paletteFieldLabels[0]}"]`)).toHaveCount(0);
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.palette.expand }).click();
    await expect(page.locator(`[title="${paletteFieldLabels[0]}"]`)).toBeVisible();
  });

  for (const label of paletteFieldLabels) {
    test(`thêm trường “${label}” vào vùng thiết kế`, async ({ page }) => {
      await dragPaletteItemToCanvas(page, page.locator(`[title="${label}"]`));
      await expect(page.locator("[data-field-id]")).toHaveCount(1);
      await expect(page.locator('[data-droppable-id="canvas"] [data-field-id]')).toBeVisible();
    });
  }
});
