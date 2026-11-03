import { expect, test, type Locator, type Page } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS } from "../../src/features/form-builder/constants/labels";

test.describe("Bố cục và quản lý trang @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
  });

  test("thêm trang, chuyển qua lại và xóa trang mà vẫn giữ trang cuối", async ({ page }) => {
    const firstPage = page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1), exact: true });
    await expect(firstPage).toBeVisible();
    await (await revealPageActions(page, firstPage)).click();

    const secondPage = page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(2), exact: true });
    await expect(secondPage).toBeVisible();
    await secondPage.click();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.page.previous }).click();
    await expect(page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) })).toBeVisible();

    await secondPage.click();
    await revealPageActions(page, secondPage);
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.page.delete, exact: true }).click();
    await expect(secondPage).toHaveCount(0);
    await expect(page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1), exact: true })).toBeVisible();
  });

  test("mở được từng thẻ công cụ của biểu mẫu", async ({ page }) => {
    for (const tab of Object.values(FORM_BUILDER_LABELS.toolbarTabs)) {
      await page.getByRole("tab", { name: tab }).click();
      await expect(page.getByRole("tab", { name: tab })).toHaveAttribute("data-state", "active");
    }
  });

  test("đổi khổ giấy, hướng và lề trang", async ({ page }) => {
    await page.getByRole("tab", { name: FORM_BUILDER_LABELS.toolbarTabs.page }).click();
    const canvas = page.locator('[data-droppable-id="canvas"]');
    const initial = await canvas.boundingBox();
    if (!initial) throw new Error("Không tìm thấy canvas.");

    await page.getByRole("button").filter({ hasText: /^A4/ }).click();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.toolbar.pageSizeA3 }).click();
    await expect.poll(async () => (await canvas.boundingBox())?.width ?? 0).toBeGreaterThan(initial.width);

    await page.getByRole("button").filter({ hasText: /^A3/ }).click();
    await page.getByLabel(FORM_BUILDER_LABELS.toolbar.landscape).check();
    await expect.poll(async () => {
      const box = await canvas.boundingBox();
      return box ? box.width > box.height : false;
    }).toBe(true);

    const marginInputs = page.getByRole("tabpanel", { name: FORM_BUILDER_LABELS.toolbarTabs.page }).locator('input[type="text"]');
    await marginInputs.first().fill("30");
    await marginInputs.first().press("Enter");
    await expect(marginInputs.first()).toHaveValue("30");
  });

  test("giữ trường riêng trên từng trang", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    const firstPage = page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) });
    await firstPage.hover();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.page.insert }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
  });

  test("không hiển thị thao tác xóa khi chỉ còn một trang", async ({ page }) => {
    const onlyPage = page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) });
    await onlyPage.hover();
    await expect(page.getByRole("button", { name: FORM_BUILDER_LABELS.page.delete })).toHaveCount(0);
  });

  test("yêu cầu xác nhận trước khi xóa toàn bộ trang và hủy không làm mất nội dung", async ({ page }) => {
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await page.getByRole("tab", { name: FORM_BUILDER_LABELS.toolbarTabs.page }).click();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.toolbar.deleteAllPagesButton }).click();
    await expect(page.getByRole("alertdialog")).toBeVisible();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.toolbar.deletePagesDialog.cancel }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    await expect(page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) })).toBeVisible();
  });

  test("tắt nút xóa toàn bộ trang khi tài liệu trống, rồi xóa nội dung sau xác nhận", async ({ page }) => {
    await page.getByRole("tab", { name: FORM_BUILDER_LABELS.toolbarTabs.page }).click();
    const clearAll = page.getByRole("button", { name: FORM_BUILDER_LABELS.toolbar.deleteAllPagesButton });
    await expect(clearAll).toBeDisabled();
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await expect(clearAll).toBeEnabled();
    await clearAll.click();
    await page.getByRole("button", { name: FORM_BUILDER_LABELS.toolbar.deletePagesDialog.confirm }).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
    await expect(page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1) })).toBeVisible();
    await expect(clearAll).toBeDisabled();
  });

  test("cuộn được danh sách khi có nhiều trang", async ({ page }) => {
    for (let number = 1; number < 15; number += 1) {
      const active = page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(number), exact: true });
      await (await revealPageActions(page, active)).click();
      await expect(page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(number + 1), exact: true })).toBeVisible();
    }
    const lastPage = page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(15), exact: true });
    await expect(lastPage).toHaveClass(/font-bold/);
    await expect(lastPage).toBeInViewport();
    await expect(page.getByRole("button", { name: FORM_BUILDER_LABELS.page.title(1), exact: true })).not.toBeInViewport();
  });

  test("chuyển qua lại giữa các trang bằng nút trang", async ({ page }) => {
    const firstPage = page.getByRole("button", {
      name: FORM_BUILDER_LABELS.page.title(1),
      exact: true,
    });
    await firstPage.scrollIntoViewIfNeeded();
    // Selector cuộn trang active vào khung bằng scrollIntoView({ behavior: "smooth" }).
    await page.waitForTimeout(300);
    const firstPageBox = await firstPage.boundingBox();
    if (!firstPageBox) throw new Error("Không tìm thấy nút trang đầu tiên.");
    await page.mouse.move(firstPageBox.x - 12, firstPageBox.y + firstPageBox.height / 2);
    await page.mouse.move(
      firstPageBox.x + firstPageBox.width / 2,
      firstPageBox.y + firstPageBox.height / 2,
    );
    await firstPage.hover({ force: true });
    const insertPage = page.getByRole("button", {
      name: FORM_BUILDER_LABELS.page.insert,
      exact: true,
    });
    await expect(insertPage).toBeVisible();
    await insertPage.click();

    const secondPage = page.getByRole("button", {
      name: FORM_BUILDER_LABELS.page.title(2),
      exact: true,
    });
    await expect(secondPage).toHaveClass(/font-bold/);
    await firstPage.click();
    await expect(firstPage).toHaveClass(/font-bold/);
    await secondPage.click();
    await expect(secondPage).toHaveClass(/font-bold/);
  });

  test("tạo biểu mẫu mới làm sạch trường và tiêu đề hiện tại", async ({ page }) => {
    const title = page.locator("[data-form-title-input]");
    await title.fill("Biểu mẫu cần làm mới");
    await dragPaletteItemToCanvas(page, page.locator(`[title="${FORM_BUILDER_LABELS.palette.fields.label}"]`));
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    await page.getByTitle(FORM_BUILDER_LABELS.toolbar.newForm).click();
    await expect(page.locator("[data-field-id]")).toHaveCount(0);
    await expect(title).toHaveValue(FORM_BUILDER_LABELS.toolbar.eform.untitledForm);
  });
});

async function revealPageActions(page: Page, pageButton: Locator) {
  await pageButton.scrollIntoViewIfNeeded();
  // The selector scrolls active pages smoothly into view; wait for it to settle before hovering.
  await page.waitForTimeout(300);
  const box = await pageButton.boundingBox();
  if (!box) throw new Error("Không tìm thấy nút trang.");
  await page.mouse.move(box.x - 12, box.y + box.height / 2);
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await pageButton.hover({ force: true });
  const insert = page.getByRole("button", {
    name: FORM_BUILDER_LABELS.page.insert,
    exact: true,
  });
  await expect(insert).toBeVisible();
  return insert;
}
