import { expect, test } from "@playwright/test";
import { addCanvasTestSession } from "../helpers/auth";
import { dragPaletteItemToCanvas } from "../helpers/canvas";
import { FORM_BUILDER_LABELS as L } from "../../src/features/form-builder/constants/labels";

test.describe("Cấu hình các loại trường @form-builder", () => {
  test.beforeEach(async ({ context, baseURL, page }) => {
    if (!baseURL) throw new Error("Playwright baseURL is not configured.");
    await addCanvasTestSession(context, baseURL);
    await page.goto("/editor");
  });

  test("cấu hình nhãn, giá trị điền sẵn và placeholder của trường văn bản", async ({ page }) => {
    await addField(page, L.palette.fields.text);
    await page.getByTitle(L.fields.text.configure).click();
    await page.getByPlaceholder(L.fields.text.labelExample).fill("Tên người dùng");
    await page.getByPlaceholder(L.fields.text.valueExample).fill("Nguyễn An");
    await page.getByPlaceholder(L.fields.text.placeholderExample).fill("Nhập tên");
    const field = page.locator("[data-field-id]").first();
    await expect(field).toContainText("Tên người dùng");
    await expect(field).toContainText("Nguyễn An");
    await expect(page.getByRole("checkbox", { name: L.fields.common.showLabel })).toBeChecked();
    await expect(page.getByRole("checkbox", { name: L.fields.common.showDottedLine })).toBeChecked();
    await page.getByRole("button", { name: L.fields.common.clearValue }).click();
    await expect(field).not.toContainText("Nguyễn An");
  });

  test("ẩn nhãn và dòng chấm của trường văn bản", async ({ page }) => {
    await addField(page, L.palette.fields.text);
    const field = page.locator("[data-field-id]").first();
    await page.getByTitle(L.fields.text.configure).click();
    await page.getByPlaceholder(L.fields.text.placeholderExample).fill("Nhập thông tin");
    await page.getByRole("checkbox", { name: L.fields.common.showLabel }).uncheck();
    await page.getByRole("checkbox", { name: L.fields.common.showDottedLine }).uncheck();
    await expect(field.locator(".field-label")).toHaveCount(0);
    await expect(field).toContainText("[Nhập thông tin]");
  });

  test("cấu hình giới hạn và xóa giá trị trường số", async ({ page }) => {
    await addField(page, L.palette.fields.number);
    await page.getByTitle(L.fields.number.configure).click();
    await page.getByPlaceholder(L.fields.number.valueExample).fill("25");
    await page.getByPlaceholder(L.fields.common.noLimit).nth(0).fill("1");
    await page.getByPlaceholder(L.fields.common.noLimit).nth(1).fill("50");
    const field = page.locator("[data-field-id]").first();
    await expect(field).toContainText("25");
    await expect(page.getByPlaceholder(L.fields.common.noLimit).nth(0)).toHaveValue("1");
    await expect(page.getByPlaceholder(L.fields.common.noLimit).nth(1)).toHaveValue("50");
    await page.getByRole("button", { name: L.fields.common.clearValue }).click();
    await expect(field).not.toContainText("25");
  });

  test("thêm, chọn và xóa lựa chọn của trường danh sách", async ({ page }) => {
    await addField(page, L.palette.fields.select);
    await page.getByTitle(L.fields.select.configure).click();
    const optionInput = page.getByPlaceholder(L.fields.select.addOption);
    await optionInput.fill("Lựa chọn mới");
    await optionInput.press("Enter");
    const option = page.getByText("Lựa chọn mới", { exact: true });
    await option.click();
    await expect(page.locator("[data-field-id]").first()).toContainText("Lựa chọn mới");
    await page.getByTitle(L.fields.select.removeOption).last().click();
    await expect(page.getByText("Lựa chọn mới", { exact: true })).toHaveCount(0);
  });

  test("đổi trạng thái, nhãn và viền của hộp kiểm", async ({ page }) => {
    await addField(page, L.palette.fields.checkbox);
    const field = page.locator("[data-field-id]").first();
    await page.getByTitle(L.fields.checkbox.configure).click();
    await page.getByPlaceholder(L.fields.checkbox.example).fill("Tôi đồng ý");
    await page.getByRole("checkbox", { name: L.fields.checkbox.checked }).check();
    await expect(field).toContainText("Tôi đồng ý");
    await expect(field.locator(`[title="${L.fields.checkbox.selectedAction}"]`)).toBeVisible();
    await page.getByRole("checkbox", { name: L.fields.checkbox.border }).uncheck();
    await expect(field.locator(`[title="${L.fields.checkbox.selectedAction}"]`)).toHaveClass(/border-dashed/);
  });

  test("bật tắt viền và sửa nội dung đoạn văn", async ({ page }) => {
    await addField(page, L.palette.fields.textarea);
    const field = page.locator("[data-field-id]").first();
    await page.getByTitle(L.fields.textarea.borderToggle).click();
    await expect(page.getByRole("button", { name: L.fields.textarea.borderOff, exact: true })).toBeVisible();
    await field.dblclick();
    const editor = field.locator(".tiptap");
    await editor.fill("Nội dung đoạn văn mới");
    await expect(editor).toContainText("Nội dung đoạn văn mới");
    const canvas = page.locator('[data-droppable-id="canvas"]');
    const canvasBox = await canvas.boundingBox();
    if (!canvasBox) throw new Error("Không tìm thấy canvas.");
    await page.mouse.click(canvasBox.x + canvasBox.width - 20, canvasBox.y + canvasBox.height - 20);
    await expect(field.locator(".tiptap")).toHaveCSS("border-width", "0px");
  });

  test("cập nhật địa danh và ngày của trường ngày", async ({ page }) => {
    await addField(page, L.palette.fields.date);
    await page.getByTitle(L.fields.date.configure).click();
    await page.getByPlaceholder(L.fields.date.locationExample).fill("Đà Nẵng");
    await page.locator('input[type="date"]').fill("2026-11-03");
    const field = page.locator("[data-field-id]").first();
    await expect(field).toContainText("Đà Nẵng");
    await expect(field).toContainText("03");
    await expect(field).toContainText("11");
    await expect(field).toContainText("2026");
    await page.getByRole("checkbox", { name: L.fields.date.dateLabels }).uncheck();
    await expect(page.getByRole("button", { name: L.fields.date.resetSlots })).toBeVisible();
  });

  test("kéo ô địa danh nhưng không cho chồng lên ô ngày, rồi đặt lại vị trí", async ({ page }) => {
    await addField(page, L.palette.fields.date);
    await page.getByTitle(L.fields.date.configure).click();
    await page.getByRole("checkbox", { name: L.fields.date.dateLabels }).uncheck();
    await page.getByRole("button", { name: L.fields.date.resetSlots }).click();
    const location = page.locator(`[data-field-id] [data-date-slot="true"][title^="${L.fields.date.locationSlot}"]`);
    const day = page.locator(`[data-field-id] [data-date-slot="true"][title^="${L.fields.date.day}"]`);
    const locationBefore = await location.boundingBox();
    const dayBefore = await day.boundingBox();
    if (!locationBefore || !dayBefore) throw new Error("Không tìm thấy các ô ngày tháng.");
    await page.mouse.move(locationBefore.x + 20, locationBefore.y + locationBefore.height / 2);
    await page.mouse.down();
    await page.mouse.move(locationBefore.x + 250, locationBefore.y + locationBefore.height / 2, { steps: 8 });
    await page.mouse.up();
    const locationAfter = await location.boundingBox();
    const dayAfter = await day.boundingBox();
    if (!locationAfter || !dayAfter) throw new Error("Không đọc được vị trí ô ngày tháng sau khi kéo.");
    expect(locationAfter.x).toBeGreaterThan(locationBefore.x);
    expect(locationAfter.x + locationAfter.width).toBeLessThanOrEqual(dayAfter.x);

    await page.getByTitle(L.fields.date.configure).click();
    await page.getByRole("button", { name: L.fields.date.resetSlots }).click();
    await expect.poll(async () => (await location.boundingBox())?.x ?? -1).toBeCloseTo(locationBefore.x, 0);
  });

  test("cấu hình tiêu đề và tên người ký; ký, xóa nét và lưu chữ ký", async ({ page }) => {
    await addField(page, L.palette.fields.signature);
    const field = page.locator("[data-field-id]").first();
    await page.getByTitle(L.fields.signature.configure).click();
    await page.getByPlaceholder(L.fields.signature.titleExample).fill("Quản lý");
    await page.getByPlaceholder(L.fields.signature.subtitleExample).fill("Người phê duyệt");
    await page.getByPlaceholder(L.fields.signature.signerNameExample).fill("Nguyễn An");
    await page.getByRole("checkbox", { name: L.fields.signature.showSignerName }).uncheck();
    await expect(field).toContainText("Quản lý");
    await expect(field).not.toContainText("Nguyễn An");
    await page.getByRole("checkbox", { name: L.fields.signature.showSignerName }).check();
    await expect(field).toContainText("Nguyễn An");
    await field.getByText(L.fields.signature.sign, { exact: true }).click();
    const canvas = page.getByRole("dialog").locator("canvas");
    const box = await canvas.boundingBox();
    if (!box) throw new Error("Không tìm thấy vùng vẽ chữ ký.");
    await page.mouse.move(box.x + 30, box.y + 40);
    await page.mouse.down();
    await page.mouse.move(box.x + 180, box.y + 90, { steps: 8 });
    await page.mouse.up();
    await page.getByRole("button", { name: L.fields.signature.clear }).click();
    await expect(page.getByRole("button", { name: L.fields.signature.save })).toBeDisabled();
    await page.mouse.move(box.x + 40, box.y + 50);
    await page.mouse.down();
    await page.mouse.move(box.x + 160, box.y + 70, { steps: 8 });
    await page.mouse.up();
    await page.getByRole("button", { name: L.fields.signature.save }).click();
    await expect(field.locator("img[alt]")).toBeVisible();
    await expect(field.locator("img[alt]")).toBeVisible();
  });

  test("cập nhật nội dung QR bằng hộp thoại sửa", async ({ page }) => {
    await addField(page, L.palette.fields.qrcode);
    const field = page.locator("[data-field-id]").first();
    await field.dblclick();
    await page.getByPlaceholder(L.fields.qrcode.placeholder).fill("https://example.org/form");
    await page.keyboard.press("Control+d");
    await expect(page.locator("[data-field-id]")).toHaveCount(1);
    await page.getByRole("button", { name: L.fields.qrcode.save }).click();
    await expect(field.locator('svg[role="img"][viewBox="0 0 25 25"]')).toBeVisible();
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

});

async function addField(page: import("@playwright/test").Page, label: string) {
  await dragPaletteItemToCanvas(page, page.locator(`[title="${label}"]`));
  await expect(page.locator("[data-field-id]")).toHaveCount(1);
}
