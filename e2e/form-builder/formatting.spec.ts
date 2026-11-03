import { expect, test } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS } from "../../src/features/form-builder/constants/labels";

test.describe("Định dạng trong trình thiết kế @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
  });

  test("bật công cụ định dạng khi chọn trường và áp dụng chữ đậm", async ({ page }) => {
    const bold = page.getByRole("button", { name: FORM_BUILDER_LABELS.formatting.bold });
    await expect(bold).toBeDisabled();

    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    const field = page.locator('[data-field-id]').first().locator(':scope > div:not([data-toolbar="true"])');
    await expect(bold).toBeEnabled();
    await bold.click();
    await expect(field).toHaveCSS("font-weight", "700");
    await expect(bold).toHaveAttribute("data-state", "on");
  });

  test("đổi căn lề cho trường đang chọn", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByRole("radio", { name: FORM_BUILDER_LABELS.formatting.alignCenter }).click();
    await expect(field).toHaveCSS("text-align", "center");
  });

  test("áp dụng chữ nghiêng cho trường đang chọn", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.formatting.italic }).click();
    await expect(field).toHaveCSS("font-style", "italic");
  });

  test("gạch chân chữ của trường đang chọn", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.formatting.underline }).click();
    await expect(field).toHaveCSS("text-decoration-line", "underline");
  });

  test("đổi màu chữ của trường đang chọn", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByTitle(FORM_BUILDER_LABELS.toolbar.colorText).click();
    await page.getByTitle("#ef4444").click();
    await expect(field).toHaveCSS("color", "rgb(239, 68, 68)");
  });

  test("đổi màu nền của trường đang chọn", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByTitle(FORM_BUILDER_LABELS.toolbar.colorBackground).click();
    await page.getByTitle("#3b82f6").click();
    await expect(field).toHaveCSS("background-color", "rgb(59, 130, 246)");
  });

  test("đặt màu nền về trong suốt", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByTitle(FORM_BUILDER_LABELS.toolbar.colorBackground).click();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.toolbar.noColor }).click();
    await expect(field).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  });

  test("đổi font và cỡ chữ của trường đang chọn", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByRole("combobox").click();
    await page.getByRole("option", { name: FORM_BUILDER_LABELS.toolbar.fonts.arial }).click();
    await expect(field).toHaveCSS("font-family", "Arial");

    await page.getByTitle(FORM_BUILDER_LABELS.toolbar.openOptions).click();
    await page.getByRole("button", { name: "20", exact: true }).click();
    await expect(field).toHaveCSS("font-size", "20px");
  });

  test("giữ định dạng khi chuyển sang trang khác rồi quay lại", async ({ page }) => {
    const field = await addLabelField(page);
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.formatting.bold }).click();
    const firstPage = page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) });
    await firstPage.hover();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.page.insert }).click();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) }).click();
    await expect(field).toHaveCSS("font-weight", "700");
  });

});

async function addLabelField(page: import("@playwright/test").Page) {
  await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
  return page.locator('[data-field-id]').first().locator(':scope > div:not([data-toolbar="true"])');
}
